import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { ProductService, PRODUCT_INCLUDE, toProductPlain } from '../product/product.service';
import { ApiError } from '../../utils/ApiError';
import { normalizeSelections } from '../product/product.variant.utils';
import type { LoginDto, RegisterDto, StoreCart, StoreCartItem } from './store.types';

const CART_INCLUDE = {
  items: {
    include: {
      product: { include: PRODUCT_INCLUDE },
      variants: true,
    },
  },
} as const;

export class StoreService {
  private productService = new ProductService();

  private signToken(customer: { id: string; email: string; name: string }) {
    const secret = process.env.CUSTOMER_JWT_SECRET || process.env.SESSION_SECRET || 'store-secret';
    return jwt.sign(
      { id: customer.id, email: customer.email, name: customer.name },
      secret,
      { expiresIn: '7d' }
    );
  }

  async register(dto: RegisterDto) {
    const existing = await prisma.customer.findUnique({ where: { email: dto.email } });
    if (existing?.password) {
      throw new ApiError(400, 'Email already registered. Please login.');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const customer = existing
      ? await prisma.customer.update({
          where: { id: existing.id },
          data: { name: dto.name, phone: dto.phone, password: hashed },
        })
      : await prisma.customer.create({
          data: { name: dto.name, email: dto.email, phone: dto.phone, password: hashed },
        });

    const token = this.signToken(customer);
    return { token, customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } };
  }

  async login(dto: LoginDto) {
    const customer = await prisma.customer.findUnique({ where: { email: dto.email } });
    if (!customer?.password) throw new ApiError(401, 'Invalid email or password');

    const valid = await bcrypt.compare(dto.password, customer.password);
    if (!valid) throw new ApiError(401, 'Invalid email or password');

    const token = this.signToken(customer);
    return { token, customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } };
  }

  async getCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, description: true },
    });
  }

  async getProducts(query: { q?: string; category?: string; minPrice?: string; maxPrice?: string }) {
    const where: any = { status: 'ACTIVE' };

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }
    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = Number(query.minPrice);
      if (query.maxPrice) where.price.lte = Number(query.maxPrice);
    }
    if (query.category) {
      where.category = { name: { equals: query.category, mode: 'insensitive' } };
    }

    const products = await prisma.product.findMany({ where, include: PRODUCT_INCLUDE });
    return this.productService.formatProductsForStore(products);
  }

  async getProductById(id: string) {
    const product = await prisma.product.findFirst({
      where: { id, status: 'ACTIVE' },
      include: PRODUCT_INCLUDE,
    });
    if (!product) throw new ApiError(404, 'Product not found');
    return this.productService.formatProductForStore(product);
  }

  private async findOrCreateGuestCustomer(data: { name: string; email: string; phone?: string }) {
    let customer = await prisma.customer.findUnique({ where: { email: data.email } });
    if (customer?.password) {
      throw new ApiError(400, 'Email has an account. Please login to checkout.');
    }
    if (!customer) {
      customer = await prisma.customer.create({ data });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { name: data.name, phone: data.phone },
      });
    }
    return customer;
  }

  async getCart(customerId: string): Promise<StoreCart> {
    let cart = await prisma.cart.findUnique({
      where: { customerId },
      include: CART_INCLUDE,
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId, totalPrice: 0 },
        include: CART_INCLUDE,
      });
    }
    return this.formatCart(cart);
  }

  async updateCart(customerId: string, items: any[]): Promise<StoreCart> {
    const prepared: Array<{
      productId: string;
      quantity: number;
      selectedVariants?: Record<string, string>;
      unitPrice: number;
    }> = [];
    let totalPrice = 0;

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: PRODUCT_INCLUDE,
      });
      if (!dbProduct || dbProduct.status !== 'ACTIVE') {
        throw new ApiError(400, 'Product not available');
      }
      const product = toProductPlain(dbProduct);
      const selectedVariants = normalizeSelections(item.selectedVariants);
      this.productService.validateVariantSelection(product, selectedVariants);
      const price = this.productService.resolveItemPrice(product, selectedVariants);
      const qty = Number(item.quantity) || 1;
      totalPrice += price * qty;
      prepared.push({
        productId: dbProduct.id,
        quantity: qty,
        selectedVariants: Object.keys(selectedVariants).length ? selectedVariants : undefined,
        unitPrice: price,
      });
    }

    // Upsert cart, then replace all items
    const existingCart = await prisma.cart.findUnique({ where: { customerId } });

    if (existingCart) {
      // Delete existing items (cascade deletes CartItemVariant rows)
      await prisma.cartItem.deleteMany({ where: { cartId: existingCart.id } });

      const cart = await prisma.cart.update({
        where: { customerId },
        data: {
          totalPrice,
          items: {
            create: prepared.map((p) => ({
              productId: p.productId,
              quantity: p.quantity,
              variants: p.selectedVariants
                ? {
                    create: Object.entries(p.selectedVariants).map(([groupName, value]) => ({
                      groupName,
                      value,
                    })),
                  }
                : undefined,
            })),
          },
        },
        include: CART_INCLUDE,
      });

      return this.formatCart(cart, prepared);
    } else {
      const cart = await prisma.cart.create({
        data: {
          customerId,
          totalPrice,
          items: {
            create: prepared.map((p) => ({
              productId: p.productId,
              quantity: p.quantity,
              variants: p.selectedVariants
                ? {
                    create: Object.entries(p.selectedVariants).map(([groupName, value]) => ({
                      groupName,
                      value,
                    })),
                  }
                : undefined,
            })),
          },
        },
        include: CART_INCLUDE,
      });

      return this.formatCart(cart, prepared);
    }
  }

  private async formatCart(
    cart: any,
    enrichedItems?: Array<{ unitPrice: number }>
  ): Promise<StoreCart> {
    const items: StoreCartItem[] = await Promise.all(
      (cart.items || []).map(async (item: any, index: number) => {
        const productData = item.product;
        const populated = productData
          ? await this.productService.formatProductForStore(productData)
          : null;
        const unitPrice = enrichedItems?.[index]?.unitPrice ?? productData?.price ?? 0;
        const selectedVariants = item.variants?.length
          ? Object.fromEntries(item.variants.map((v: any) => [v.groupName, v.value]))
          : undefined;

        return {
          productId: item.productId,
          name: populated?.name ?? productData?.name,
          price: unitPrice,
          quantity: item.quantity,
          selectedVariants,
          imageUrls: populated?.imageUrls ?? [],
        };
      })
    );
    return { id: cart.id, items, totalPrice: cart.totalPrice };
  }

  async createOrder(
    customerId: string | null,
    dto: {
      items: any[];
      shippingAddress: any;
      guest?: { name: string; email: string; phone?: string };
      paymentMethod?: string;
    }
  ) {
    const customer = customerId
      ? await prisma.customer.findUnique({ where: { id: customerId } })
      : await this.findOrCreateGuestCustomer(dto.guest!);

    if (!customer) throw new ApiError(400, 'Customer information required');

    const preparedItems: Array<{
      productId: string;
      quantity: number;
      price: number;
      selectedVariants?: Record<string, string>;
    }> = [];

    for (const item of dto.items) {
      const productId = item.productId ?? item.product;
      const dbProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: PRODUCT_INCLUDE,
      });
      if (!dbProduct) throw new ApiError(404, 'Product not found');

      const product = toProductPlain(dbProduct);
      const selectedVariants = normalizeSelections(item.selectedVariants);
      this.productService.validateVariantSelection(product, selectedVariants);

      const quantity = Number(item.quantity) || 1;
      if (this.productService.getAvailableStock(product, selectedVariants) < quantity) {
        throw new ApiError(400, 'Insufficient stock');
      }

      const price = this.productService.resolveItemPrice(product, selectedVariants);
      preparedItems.push({
        productId: dbProduct.id,
        quantity,
        price,
        selectedVariants: Object.keys(selectedVariants).length ? selectedVariants : undefined,
      });
      await this.productService.decrementStock(dbProduct.id, quantity, selectedVariants);
    }

    const totalAmount = preparedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      const count = await tx.order.count();
      const orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
      return await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          totalAmount,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          items: {
            create: preparedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              variants: item.selectedVariants
                ? {
                    create: Object.entries(item.selectedVariants).map(([groupName, value]) => ({
                      groupName,
                      value,
                    })),
                  }
                : undefined,
            })),
          },
          shippingAddress: dto.shippingAddress
            ? { create: dto.shippingAddress }
            : undefined,
        },
      });
    });

    if (customerId) {
      await prisma.cartItem.deleteMany({
        where: { cart: { customerId } },
      });
      await prisma.cart.updateMany({
        where: { customerId },
        data: { totalPrice: 0 },
      });
    }

    return order;
  }

  async getMyOrders(customerId: string) {
    return prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: { select: { id: true, name: true } }, variants: true },
        },
        shippingAddress: true,
      },
    });
  }

  async trackOrder(email: string, orderNumber: string) {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) throw new ApiError(404, 'Order not found');

    const order = await prisma.order.findFirst({
      where: { orderNumber, customerId: customer.id },
      include: {
        items: {
          include: { product: { select: { id: true, name: true } }, variants: true },
        },
        shippingAddress: true,
      },
    });
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
  }
}
