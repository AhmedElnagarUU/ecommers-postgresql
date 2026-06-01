import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Product } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { CategoryModel } from '../category/category.model';
import { CustomerModel } from '../customer/customer.model';
import { CartModel } from '../cart/cart.model';
import { OrderModel } from '../order/order.model';
import { ApiError } from '../../utils/ApiError';
import { normalizeSelections } from '../product/product.variant.utils';
import type { LoginDto, RegisterDto, StoreCart, StoreCartItem } from './store.types';

export class StoreService {
  private productService = new ProductService();

  private signToken(customer: { _id: any; email: string; name: string }) {
    const secret = process.env.CUSTOMER_JWT_SECRET || process.env.SESSION_SECRET || 'store-secret';
    return jwt.sign(
      { id: String(customer._id), email: customer.email, name: customer.name },
      secret,
      { expiresIn: '7d' }
    );
  }

  async register(dto: RegisterDto) {
    const existing = await CustomerModel.findOne({ email: dto.email });
    if (existing?.password) {
      throw new ApiError(400, 'Email already registered. Please login.');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const customer = existing
      ? await CustomerModel.findByIdAndUpdate(
          existing._id,
          { $set: { name: dto.name, phone: dto.phone, password: hashed } },
          { new: true }
        )
      : await CustomerModel.create({
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          password: hashed,
        });

    const token = this.signToken(customer!);
    return { token, customer: { id: customer!._id, name: customer!.name, email: customer!.email, phone: customer!.phone } };
  }

  async login(dto: LoginDto) {
    const customer = await CustomerModel.findOne({ email: dto.email }).select('+password');
    if (!customer?.password) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, customer.password);
    if (!valid) throw new ApiError(401, 'Invalid email or password');

    const token = this.signToken(customer);
    return { token, customer: { id: customer._id, name: customer.name, email: customer.email, phone: customer.phone } };
  }

  async getCategories() {
    return CategoryModel.find({ isActive: true }).select('name slug description');
  }

  async getProducts(query: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }) {
    const filter: Record<string, unknown> = { status: 'active' };

    if (query.q) {
      const regex = new RegExp(query.q, 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) (filter.price as any).$gte = Number(query.minPrice);
      if (query.maxPrice) (filter.price as any).$lte = Number(query.maxPrice);
    }

    let products = await Product.find(filter).populate('category', 'name');

    if (query.category) {
      products = products.filter((p: any) => {
        const cat = p.category;
        const name = typeof cat === 'object' ? cat?.name : cat;
        return name?.toLowerCase() === query.category?.toLowerCase();
      });
    }

    return this.productService.formatProductsForStore(products);
  }

  async getProductById(id: string) {
    const product = await Product.findOne({ _id: id, status: 'active' }).populate('category', 'name');
    if (!product) throw new ApiError(404, 'Product not found');
    return this.productService.formatProductForStore(product);
  }

  private async findOrCreateGuestCustomer(data: {
    name: string;
    email: string;
    phone?: string;
  }) {
    let customer = await CustomerModel.findOne({ email: data.email });
    if (customer?.password) {
      throw new ApiError(400, 'Email has an account. Please login to checkout.');
    }
    if (!customer) {
      customer = await CustomerModel.create(data);
    } else {
      customer.name = data.name;
      if (data.phone) customer.phone = data.phone;
      await customer.save();
    }
    return customer;
  }

  async getCart(customerId: string) {
    let cart = await CartModel.findOne({ userId: customerId }).populate('items.productId');
    if (!cart) {
      cart = await CartModel.create({ userId: customerId, items: [], totalPrice: 0 });
    }
    return this.formatCart(cart);
  }

  async updateCart(customerId: string, items: any[]) {
    const prepared = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== 'active') {
        throw new ApiError(400, 'Product not available');
      }
      const plain = product.toObject();
      const selectedVariants = normalizeSelections(item.selectedVariants);
      this.productService.validateVariantSelection(plain, selectedVariants);
      const price = this.productService.resolveItemPrice(plain, selectedVariants);
      const qty = Number(item.quantity) || 1;
      totalPrice += price * qty;
      prepared.push({
        productId: product._id,
        quantity: qty,
        selectedVariants: Object.keys(selectedVariants).length ? selectedVariants : undefined,
        unitPrice: price,
      });
    }

    const cart = await CartModel.findOneAndUpdate(
      { userId: customerId },
      { items: prepared.map(({ productId, quantity, selectedVariants }) => ({
        productId,
        quantity,
        selectedVariants,
      })), totalPrice },
      { new: true, upsert: true }
    ).populate('items.productId');

    return this.formatCart(cart, prepared);
  }

  private async formatCart(
    cart: { toObject: () => { _id: unknown; items?: unknown[]; totalPrice: number } },
    enrichedItems?: Array<{ unitPrice: number }>
  ): Promise<StoreCart> {
    const plain = cart.toObject();
    const items: StoreCartItem[] = await Promise.all(
      (plain.items || []).map(async (item: any, index: number) => {
        const product = item.productId;
        const productId = product?._id || item.productId;
        const populated = product?.name
          ? await this.productService.formatProductForStore(product)
          : null;
        const unitPrice = enrichedItems?.[index]?.unitPrice ?? product?.price ?? 0;
        return {
          productId: String(productId),
          name: populated?.name ?? product?.name,
          price: unitPrice,
          quantity: item.quantity,
          selectedVariants: normalizeSelections(item.selectedVariants),
          imageUrls: populated?.imageUrls ?? [],
        };
      })
    );
    return { _id: String(plain._id), items, totalPrice: plain.totalPrice };
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
      ? await CustomerModel.findById(customerId)
      : await this.findOrCreateGuestCustomer(dto.guest!);

    if (!customer) throw new ApiError(400, 'Customer information required');

    const preparedItems = [];
    for (const item of dto.items) {
      const productId = item.productId || item.product;
      const product = await Product.findById(productId);
      if (!product) throw new ApiError(404, 'Product not found');
      const plain = product.toObject();
      const selectedVariants = normalizeSelections(item.selectedVariants);
      this.productService.validateVariantSelection(plain, selectedVariants);
      const quantity = Number(item.quantity) || 1;
      if (this.productService.getAvailableStock(plain, selectedVariants) < quantity) {
        throw new ApiError(400, 'Insufficient stock');
      }
      const price = this.productService.resolveItemPrice(plain, selectedVariants);
      preparedItems.push({
        product: product._id,
        quantity,
        price,
        selectedVariants: Object.keys(selectedVariants).length ? selectedVariants : undefined,
      });
      await this.productService.decrementStock(String(product._id), quantity, selectedVariants);
    }

    const totalAmount = preparedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await OrderModel.create({
      customer: customer._id,
      items: preparedItems,
      totalAmount,
      status: 'pending',
      paymentStatus: dto.paymentMethod === 'cod' ? 'pending' : 'pending',
      shippingAddress: dto.shippingAddress,
    });

    if (customerId) {
      await CartModel.findOneAndUpdate({ userId: customerId }, { items: [], totalPrice: 0 });
    }

    return order;
  }

  async getMyOrders(customerId: string) {
    return OrderModel.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name');
  }

  async trackOrder(email: string, orderNumber: string) {
    const customer = await CustomerModel.findOne({ email });
    if (!customer) throw new ApiError(404, 'Order not found');

    const order = await OrderModel.findOne({ orderNumber, customer: customer._id }).populate(
      'items.product',
      'name'
    );
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
  }
}
