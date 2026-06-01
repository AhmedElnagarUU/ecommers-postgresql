import { OrderModel } from './order.model';
import { ApiError } from '../../utils/ApiError';
import logger from '../../config/logger';
import { Product } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { normalizeSelections } from '../product/product.variant.utils';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export class OrderService {
  constructor(private readonly productService = new ProductService()) {}

  private formatOrderItems(order: any): any {
    const plain = order.toObject ? order.toObject() : order;
    if (!Array.isArray(plain.items)) return plain;

    plain.items = plain.items.map((item: any) => ({
      ...item,
      selectedVariants: item.selectedVariants
        ? normalizeSelections(item.selectedVariants)
        : undefined,
    }));

    return plain;
  }

  private async prepareOrderItems(items: any[]): Promise<any[]> {
    if (!Array.isArray(items) || !items.length) {
      throw new ApiError(400, 'Order must include at least one item');
    }

    const preparedItems = [];

    for (const item of items) {
      const productId = item.product || item.productId;
      if (!productId) {
        throw new ApiError(400, 'Each order item must include a product');
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      const productPlain = product.toObject();
      const selectedVariants = normalizeSelections(item.selectedVariants);

      this.productService.validateVariantSelection(productPlain, selectedVariants);

      const quantity = Number(item.quantity) || 1;
      const availableStock = this.productService.getAvailableStock(
        productPlain,
        selectedVariants
      );

      if (availableStock < quantity) {
        throw new ApiError(400, 'Insufficient stock for selected variant');
      }

      const price = this.productService.resolveItemPrice(productPlain, selectedVariants);

      preparedItems.push({
        product: product._id,
        quantity,
        price,
        selectedVariants: Object.keys(selectedVariants).length
          ? selectedVariants
          : undefined,
      });

      await this.productService.decrementStock(productId, quantity, selectedVariants);
    }

    return preparedItems;
  }

  async createOrder(dto: any): Promise<any> {
    try {
      const items = await this.prepareOrderItems(dto.items);
      const orderData = {
        ...dto,
        items,
        status: 'pending',
        totalAmount: this.calculateTotalAmount(items),
        shippingCost: this.calculateShippingCost(dto.shippingMethod),
        tax: this.calculateTax(items),
      };
      const order = await OrderModel.create(orderData);
      return this.formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error) {
        throw new ApiError(400, error.message);
      }
      throw new ApiError(500, 'Error creating order');
    }
  }

  async getOrderById(id: string): Promise<any> {
    try {
      const order = await OrderModel.findById(id)
        .populate('customer', 'name email')
        .populate('items.product', 'name price');
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }
      return this.formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching order');
    }
  }

  async getOrdersByUserId(userId: string): Promise<any[]> {
    try {
      const orders = await OrderModel.find({ customer: userId })
        .populate('customer', 'name email')
        .populate('items.product', 'name price');
      return orders.map((order) => this.formatOrderItems(order));
    } catch (error) {
      throw new ApiError(500, 'Error fetching user orders');
    }
  }

  async getAllOrders(): Promise<any[]> {
    try {
      logger.info('Fetching all orders');
      const orders = await OrderModel.find()
        .populate('customer', 'name email')
        .populate('items.product', 'name price');
      logger.info(`Orders fetched successfully: ${orders.length} orders`);
      return orders.map((order) => this.formatOrderItems(order));
    } catch (error) {
      logger.error('Error fetching orders:', error);
      throw new ApiError(500, 'Error fetching orders');
    }
  }

  async updateOrder(id: string, dto: any): Promise<any> {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        { $set: dto },
        { new: true, runValidators: true }
      ).populate('customer', 'name email')
       .populate('items.product', 'name price');
      if (!updatedOrder) {
        throw new ApiError(404, 'Order not found');
      }
      return this.formatOrderItems(updatedOrder);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating order');
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const result = await OrderModel.findByIdAndDelete(id);
      if (!result) {
        throw new ApiError(404, 'Order not found');
      }
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting order');
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<any> {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('customer', 'name email')
       .populate('items.product', 'name price');
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }
      return this.formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating order status');
    }
  }

  async updatePaymentStatus(id: string, status: 'pending' | 'paid' | 'failed'): Promise<any> {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        id,
        { paymentStatus: status },
        { new: true }
      ).populate('customer', 'name email')
       .populate('items.product', 'name price');
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }
      return this.formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating payment status');
    }
  }

  async getOrdersByStatus(status: OrderStatus): Promise<any[]> {
    try {
      const orders = await OrderModel.find({ status })
        .populate('customer', 'name email')
        .populate('items.product', 'name price');
      return orders.map((order) => this.formatOrderItems(order));
    } catch (error) {
      throw new ApiError(500, 'Error fetching orders by status');
    }
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const orders = await OrderModel.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).populate('customer', 'name email')
        .populate('items.product', 'name price');
      return orders.map((order) => this.formatOrderItems(order));
    } catch (error) {
      throw new ApiError(500, 'Error fetching orders by date range');
    }
  }

  private calculateTotalAmount(items: any[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private calculateShippingCost(method: string): number {
    const shippingRates: any = {
      standard: 5.99,
      express: 12.99,
      overnight: 24.99,
    };
    return shippingRates[method] || 5.99;
  }

  private calculateTax(items: any[]): number {
    const subtotal = this.calculateTotalAmount(items);
    const taxRate = 0.08;
    return subtotal * taxRate;
  }
}
