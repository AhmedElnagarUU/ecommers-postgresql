/**
 * Database seeder — fake categories, customers, and products for store testing.
 * Product images are uploaded to S3 (same keys as real admin uploads).
 *
 * Usage:
 *   npm run seed          # add seed data (skips existing emails/slugs)
 *   npm run seed:reset    # clear seed data then seed again
 *
 * Requires in .env: MONGODB_URI, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 *                   AWS_REGION, AWS_BUCKET_NAME
 *
 * Test login: sarah@store.test / password123
 * Guest (no password): guest@store.test
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const slugify = require('slugify');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const MONGODB_URI = process.env.MONGODB_URI;
const RESET = process.argv.includes('--reset');

function assertAwsConfig() {
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_BUCKET_NAME'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error('❌ Seeder uploads images to S3 (same as the dashboard). Missing in .env:');
    missing.forEach((key) => console.error(`   - ${key}`));
    process.exit(1);
  }
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env');
  process.exit(1);
}

assertAwsConfig();

// ─── Schemas (match app models) ─────────────────────────────────────────────

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: { type: String, select: false },
  },
  { timestamps: true }
);

const variantGroupSchema = new mongoose.Schema(
  { name: String, options: [String] },
  { _id: false }
);

const variantCombinationSchema = new mongoose.Schema(
  {
    selections: { type: Map, of: String },
    stock: Number,
    price: Number,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    slug: { type: String, unique: true },
    price: Number,
    stock: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [String],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    hasVariants: Boolean,
    variantGroups: [variantGroupSchema],
    useVariantStock: Boolean,
    useVariantPricing: Boolean,
    variantCombinations: [variantCombinationSchema],
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name || '', { lower: true });
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ─── Seed data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Electronics', description: 'Phones, audio, and gadgets' },
  { name: 'Clothing', description: 'Everyday wear and accessories' },
  { name: 'Home', description: 'Furniture and decor' },
  { name: 'Sports', description: 'Fitness and outdoor gear' },
];

const CUSTOMERS = [
  { name: 'Sarah Johnson', email: 'sarah@store.test', phone: '+1 555 0101', password: 'password123' },
  { name: 'John Miller', email: 'john@store.test', phone: '+1 555 0102', password: 'password123' },
  { name: 'Amira Hassan', email: 'amira@store.test', phone: '+20 100 555 0103', password: 'password123' },
  { name: 'Guest Shopper', email: 'guest@store.test', phone: '+1 555 0199' },
  { name: 'Omar Ali', email: 'omar@store.test', phone: '+966 50 555 0104', password: 'password123' },
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
    { name: 'Wireless Headphones', category: 'Electronics', price: 79.99, stock: 50, desc: 'Noise-cancelling over-ear headphones with 30h battery.' },
    { name: 'Smart Watch', category: 'Electronics', price: 149.5, stock: 35, desc: 'Fitness tracking, heart rate, and notifications.' },
    { name: 'USB-C Hub', category: 'Electronics', price: 34.99, stock: 80, desc: '7-in-1 adapter for laptops and tablets.' },
    { name: 'Classic Cotton T-Shirt', category: 'Clothing', price: 24.99, stock: 100, desc: 'Soft unisex tee available in multiple colors.' },
    { name: 'Denim Jacket', category: 'Clothing', price: 89.0, stock: 40, desc: 'Medium-wash denim with modern fit.' },
    { name: 'Ceramic Mug Set', category: 'Home', price: 29.99, stock: 60, desc: 'Set of 4 mugs, dishwasher safe.' },
    { name: 'Desk Lamp', category: 'Home', price: 45.0, stock: 25, desc: 'LED lamp with adjustable brightness.' },
    { name: 'Yoga Mat', category: 'Sports', price: 32.5, stock: 70, desc: 'Non-slip mat with carrying strap.' },
    { name: 'Running Shoes', category: 'Sports', price: 110.0, stock: 45, desc: 'Lightweight shoes for road and track.' },
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
      { name: 'Size', options: ['S', 'M', 'L'] },
    ],
    useVariantStock: true,
    useVariantPricing: false,
  };

  const list = [...simple, variantProduct];

  return list.map((p) => {
    const slug = slugify(p.name, { lower: true });
    const images = [productImageUrl(slug, 0), productImageUrl(slug, 1)];
    const base = {
      name: p.name,
      description: p.desc,
      slug,
      price: p.price,
      stock: p.stock ?? 20,
      category: categoryMap[p.category],
      images,
      status: 'active',
      hasVariants: !!p.hasVariants,
    };

    if (p.hasVariants) {
      base.variantGroups = p.variantGroups;
      base.useVariantStock = p.useVariantStock;
      base.useVariantPricing = p.useVariantPricing || false;
      base.variantCombinations = buildCombinations(p.variantGroups, p.useVariantStock).map((c) => ({
        selections: new Map(Object.entries(c.selections)),
        stock: c.stock,
      }));
    }

    return base;
  });
}

// ─── S3 upload (same storage as dashboard product images) ───────────────────

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
  endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
});

const bucketName = process.env.AWS_BUCKET_NAME;

async function uploadPlaceholderToS3(imageUrl, folder = 'products') {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${imageUrl}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const key = `${folder}/seed-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: res.headers.get('content-type') || 'image/jpeg',
    })
  );

  return key;
}

/** Download placeholder images and store S3 keys only (never full URLs in DB). */
async function uploadProductImages(imageUrls) {
  const keys = [];
  for (const url of imageUrls) {
    keys.push(await uploadPlaceholderToS3(url));
    process.stdout.write('.');
  }
  console.log('');
  return keys;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function clearCollections() {
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Customer.deleteMany({
    email: { $in: CUSTOMERS.map((c) => c.email) },
  });
  console.log('🗑  Cleared products, categories, and seed customers');
}

async function seedCategories() {
  const map = {};
  for (const cat of CATEGORIES) {
    const slug = slugify(cat.name, { lower: true });
    let doc = await Category.findOne({ slug });
    if (!doc) {
      doc = await Category.create({ ...cat, slug, isActive: true });
      console.log(`   + category: ${cat.name}`);
    } else {
      console.log(`   · category exists: ${cat.name}`);
    }
    map[cat.name] = doc._id;
  }
  return map;
}

async function seedCustomers() {
  for (const c of CUSTOMERS) {
    const exists = await Customer.findOne({ email: c.email });
    if (exists) {
      console.log(`   · customer exists: ${c.email}`);
      continue;
    }
    const data = { name: c.name, email: c.email, phone: c.phone };
    if (c.password) {
      data.password = await bcrypt.hash(c.password, 10);
    }
    await Customer.create(data);
    console.log(`   + customer: ${c.email}${c.password ? ' (password123)' : ' (guest)'}`);
  }
}

async function seedProducts(categoryMap) {
  const products = buildProducts(categoryMap);
  let created = 0;

  for (const raw of products) {
    const exists = await Product.findOne({ slug: raw.slug });
    if (exists) {
      console.log(`   · product exists: ${raw.name}`);
      continue;
    }

    process.stdout.write(`   ↑ uploading images for ${raw.name}`);
    raw.images = await uploadProductImages(raw.images);
    await Product.create(raw);
    created++;
    console.log(`   + product: ${raw.name} (${raw.images.length} S3 keys)`);
  }

  return created;
}

async function run() {
  console.log('\n🌱 Starting database seed...\n');
  if (RESET) await clearCollections();

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  console.log('📁 Categories');
  const categoryMap = await seedCategories();

  console.log('\n👤 Customers');
  await seedCustomers();

  console.log('\n📦 Products (images → S3, signed URLs in API like real uploads)');
  const count = await seedProducts(categoryMap);

  console.log('\n✨ Done!');
  console.log(`   Products created: ${count}`);
  console.log('   Store login: sarah@store.test / password123');
  console.log('   Guest email: guest@store.test (no password)\n');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
