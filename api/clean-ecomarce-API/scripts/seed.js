/**
 * Database seeder — categories, customers, and products for store testing.
 * Product images are uploaded to S3 (same keys as real admin uploads).
 *
 * Usage:
 *   npm run seed          # add seed data (skips existing slugs/emails)
 *   npm run seed:reset    # clear seed data then seed again
 *
 * Requires in .env: DATABASE_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 *                   AWS_REGION, AWS_BUCKET_NAME
 *
 * Test login: sarah@store.test / password123
 * Guest (no password): guest@store.test
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const slugify = require('slugify');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { PrismaClient } = require('../src/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const RESET = process.argv.includes('--reset');

// ─── Validate config ─────────────────────────────────────────────────────────

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing in .env');
  process.exit(1);
}

function assertAwsConfig() {
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_BUCKET_NAME'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error('❌ Seeder uploads images to S3. Missing in .env:');
    missing.forEach((key) => console.error(`   - ${key}`));
    process.exit(1);
  }
}
assertAwsConfig();

// ─── Prisma client ───────────────────────────────────────────────────────────

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── Seed data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Electronics', description: 'Phones, audio, and gadgets' },
  { name: 'Clothing',    description: 'Everyday wear and accessories' },
  { name: 'Home',        description: 'Furniture and decor' },
  { name: 'Sports',      description: 'Fitness and outdoor gear' },
];

const CUSTOMERS = [
  { name: 'Sarah Johnson', email: 'sarah@store.test', phone: '+1 555 0101', password: 'password123' },
  { name: 'John Miller',   email: 'john@store.test',  phone: '+1 555 0102', password: 'password123' },
  { name: 'Amira Hassan',  email: 'amira@store.test', phone: '+20 100 555 0103', password: 'password123' },
  { name: 'Guest Shopper', email: 'guest@store.test', phone: '+1 555 0199' },
  { name: 'Omar Ali',      email: 'omar@store.test',  phone: '+966 50 555 0104', password: 'password123' },
];

function buildCombinations(groups, useStock) {
  let combos = [{}];
  for (const group of groups) {
    const next = [];
    for (const combo of combos) {
      for (const option of group.options) {
        next.push({ ...combo, [group.name]: option });
      }
    }
    combos = next;
  }
  return combos.map((selections) => ({
    selections,
    stock: useStock ? Math.floor(Math.random() * 30) + 5 : undefined,
  }));
}

function productImageUrl(slug, index = 0) {
  return `https://picsum.photos/seed/${slug}-${index}/800/800`;
}

function buildProducts(categoryMap) {
  const simple = [
    { name: 'Wireless Headphones', category: 'Electronics', price: 79.99,  stock: 50,  desc: 'Noise-cancelling over-ear headphones with 30h battery.' },
    { name: 'Smart Watch',         category: 'Electronics', price: 149.5,  stock: 35,  desc: 'Fitness tracking, heart rate, and notifications.' },
    { name: 'USB-C Hub',           category: 'Electronics', price: 34.99,  stock: 80,  desc: '7-in-1 adapter for laptops and tablets.' },
    { name: 'Classic Cotton T-Shirt', category: 'Clothing', price: 24.99, stock: 100, desc: 'Soft unisex tee available in multiple colors.' },
    { name: 'Denim Jacket',        category: 'Clothing',    price: 89.0,   stock: 40,  desc: 'Medium-wash denim with modern fit.' },
    { name: 'Ceramic Mug Set',     category: 'Home',        price: 29.99,  stock: 60,  desc: 'Set of 4 mugs, dishwasher safe.' },
    { name: 'Desk Lamp',           category: 'Home',        price: 45.0,   stock: 25,  desc: 'LED lamp with adjustable brightness.' },
    { name: 'Yoga Mat',            category: 'Sports',      price: 32.5,   stock: 70,  desc: 'Non-slip mat with carrying strap.' },
    { name: 'Running Shoes',       category: 'Sports',      price: 110.0,  stock: 45,  desc: 'Lightweight shoes for road and track.' },
  ];

  const variantProduct = {
    name: 'Premium Hoodie',
    category: 'Clothing',
    price: 59.99,
    stock: 0,
    desc: 'Warm fleece hoodie — pick your color and size.',
    hasVariants: true,
    variantGroups: [
      { name: 'Color', options: ['Black', 'Gray', 'Navy'] },
      { name: 'Size',  options: ['S', 'M', 'L'] },
    ],
    useVariantStock: true,
    useVariantPricing: false,
  };

  return [...simple, variantProduct].map((p) => {
    const slug = slugify(p.name, { lower: true });
    return {
      ...p,
      slug,
      categoryId: categoryMap[p.category],
      images: [productImageUrl(slug, 0), productImageUrl(slug, 1)],
    };
  });
}

// ─── S3 upload ───────────────────────────────────────────────────────────────

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

async function uploadPlaceholderToS3(imageUrl) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${imageUrl}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const key = `products/seed-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: res.headers.get('content-type') || 'image/jpeg',
  }));

  return key;
}

async function uploadProductImages(imageUrls) {
  const keys = [];
  for (const url of imageUrls) {
    keys.push(await uploadPlaceholderToS3(url));
    process.stdout.write('.');
  }
  console.log('');
  return keys;
}

// ─── Seed helpers ─────────────────────────────────────────────────────────────

async function clearData() {
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.customer.deleteMany({
    where: { email: { in: CUSTOMERS.map((c) => c.email) } },
  });
  console.log('🗑  Cleared products, categories, and seed customers');
}

async function seedCategories() {
  const map = {};
  for (const cat of CATEGORIES) {
    const slug = slugify(cat.name, { lower: true });
    let doc = await prisma.category.findUnique({ where: { slug } });
    if (!doc) {
      doc = await prisma.category.create({
        data: { name: cat.name, description: cat.description, slug, isActive: true },
      });
      console.log(`   + category: ${cat.name}`);
    } else {
      console.log(`   · category exists: ${cat.name}`);
    }
    map[cat.name] = doc.id;
  }
  return map;
}

async function seedCustomers() {
  for (const c of CUSTOMERS) {
    const exists = await prisma.customer.findUnique({ where: { email: c.email } });
    if (exists) {
      console.log(`   · customer exists: ${c.email}`);
      continue;
    }
    const data = { name: c.name, email: c.email, phone: c.phone };
    if (c.password) {
      data.password = await bcrypt.hash(c.password, 10);
    }
    await prisma.customer.create({ data });
    console.log(`   + customer: ${c.email}${c.password ? ' (password123)' : ' (guest)'}`);
  }
}

async function seedProducts(categoryMap) {
  const products = buildProducts(categoryMap);
  let created = 0;

  for (const raw of products) {
    const exists = await prisma.product.findUnique({ where: { slug: raw.slug } });
    if (exists) {
      console.log(`   · product exists: ${raw.name}`);
      continue;
    }

    process.stdout.write(`   ↑ uploading images for ${raw.name}`);
    const imageKeys = await uploadProductImages(raw.images);

    const variantGroups = raw.variantGroups || [];
    const combinations = raw.hasVariants
      ? buildCombinations(variantGroups, raw.useVariantStock)
      : [];

    await prisma.product.create({
      data: {
        name: raw.name,
        description: raw.desc,
        slug: raw.slug,
        price: raw.price,
        stock: raw.stock ?? 20,
        categoryId: raw.categoryId,
        images: imageKeys,
        status: 'ACTIVE',
        hasVariants: !!raw.hasVariants,
        useVariantStock: !!raw.useVariantStock,
        useVariantPricing: !!raw.useVariantPricing,
        variantGroups: {
          create: variantGroups.map((g) => ({
            name: g.name,
            options: { create: g.options.map((value) => ({ value })) },
          })),
        },
        variantCombinations: {
          create: combinations.map((combo) => ({
            stock: combo.stock ?? null,
            price: null,
            selections: {
              create: Object.entries(combo.selections).map(([groupName, value]) => ({
                groupName,
                value,
              })),
            },
          })),
        },
      },
    });

    created++;
    console.log(`   + product: ${raw.name} (${imageKeys.length} S3 keys)`);
  }

  return created;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🌱 Starting database seed...\n');

  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL\n');

    if (RESET) await clearData();

    console.log('📁 Categories');
    const categoryMap = await seedCategories();

    console.log('\n👤 Customers');
    await seedCustomers();

    console.log('\n📦 Products (images → S3)');
    const count = await seedProducts(categoryMap);

    console.log('\n✨ Done!');
    console.log(`   Products created: ${count}`);
    console.log('   Store login: sarah@store.test / password123');
    console.log('   Guest email: guest@store.test (no password)\n');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
