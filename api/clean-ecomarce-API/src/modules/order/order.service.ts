import { prisma } from '../../config/database';
import { ApiError } from '../../utils/ApiError';
import logger from '../../config/logger';
import { ProductService, PRODUCT_INCLUDE, toProductPlain } from '../product/product.service';
import { normalizeSelections } from '../product/product.variant.utils';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

const ORDER_INCLUDE = {
  customer: { select: { id: true, name: true, email: true } },
  shippingAddress: true,
  items: {
    include: {
      product: { select: { id: true, name: true, price: true } },
      variants: true,
    },
  },
  payments: true,
} as const;

function formatOrderItems(order: any): any {
  if (!order || !Array.isArray(order.items)) return order;
  return {
    ...order,
    items: order.items.map((item: any) => ({
      ...item,
      selectedVariants: item.variants?.length
        ? Object.fromEntries(item.variants.map((v: any) => [v.groupName, v.value]))
        : undefined,
    })),
  };
}

async function generateOrderNumber(): Promise<string> {
  const count = await prisma.order.count();
  return `ORD${String(count + 1).padStart(6, '0')}`;
}

export class OrderService {
  constructor(private readonly productService = new ProductService()) {}

  private async prepareOrderItems(items: any[]): Promise<any[]> {
    if (!Array.isArray(items) || !items.length) {
      throw new ApiError(400, 'Order must include at least one item');
    }

    const preparedItems = [];

    for (const item of items) {
      const productId = item.product ?? item.productId;
      if (!productId) throw new ApiError(400, 'Each order item must include a product');

      const dbProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: PRODUCT_INCLUDE,
      });
      if (!dbProduct) throw new ApiError(404, 'Product not found');

      const product = toProductPlain(dbProduct);
      const selectedVariants = normalizeSelections(item.selectedVariants);

      this.productService.validateVariantSelection(product, selectedVariants);

      const quantity = Number(item.quantity) || 1;
      const availableStock = this.productService.getAvailableStock(product, selectedVariants);
      if (availableStock < quantity) throw new ApiError(400, 'Insufficient stock for selected variant');

      const price = this.productService.resolveItemPrice(product, selectedVariants);

      preparedItems.push({
        productId,
        quantity,
        price,
        selectedVariants: Object.keys(selectedVariants).length ? selectedVariants : undefined,
      });

      await this.productService.decrementStock(productId, quantity, selectedVariants);
    }

    return preparedItems;
  }

  async createOrder(dto: any): Promise<any> {
    try {
      const items = await this.prepareOrderItems(dto.items);
      const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const order = await prisma.$transaction(async (tx) => {
        const orderNumber = await generateOrderNumber();
        return await tx.order.create({
          data: {
            orderNumber,
            customerId: dto.customer ?? dto.customerId,
            totalAmount,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                variants: item.selectedVariants
                  ? {
                      create: Object.entries(item.selectedVariants).map(([groupName, value]) => ({
                        groupName,
                        value: value as string,
                      })),
                    }
                  : undefined,
              })),
            },
            shippingAddress: dto.shippingAddress
              ? { create: dto.shippingAddress }
              : undefined,
          },
          include: ORDER_INCLUDE,
        });
      });

      return formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error) throw new ApiError(400, error.message);
      throw new ApiError(500, 'Error creating order');
    }
  }

  async getOrderById(id: string): Promise<any> {
    try {
      const order = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
      if (!order) throw new ApiError(404, 'Order not found');
      return formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching order');
    }
  }

  async getOrdersByUserId(userId: string): Promise<any[]> {
    try {
      const orders = await prisma.order.findMany({
        where: { customerId: userId },
        include: ORDER_INCLUDE,
      });
      return orders.map(formatOrderItems);
    } catch {
      throw new ApiError(500, 'Error fetching user orders');
    }
  }

  async getAllOrders(): Promise<any[]> {
    try {
      logger.info('Fetching all orders');
      const orders = await prisma.order.findMany({ include: ORDER_INCLUDE });
      logger.info(`Orders fetched successfully: ${orders.length} orders`);
      return orders.map(formatOrderItems);
    } catch (error) {
      logger.error('Error fetching orders:', error);
      throw new ApiError(500, 'Error fetching orders');
    }
  }

  async updateOrder(id: string, dto: any): Promise<any> {
    try {
      const order = await prisma.order.update({
        where: { id },
        data: {
          status: dto.status,
          paymentStatus: dto.paymentStatus,
          totalAmount: dto.totalAmount,
        },
        include: ORDER_INCLUDE,
      });
      return formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating order');
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      await prisma.order.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting order');
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<any> {
    try {
      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: ORDER_INCLUDE,
      });
      return formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating order status');
    }
  }

  async updatePaymentStatus(id: string, status: 'PENDING' | 'PAID' | 'FAILED'): Promise<any> {
    try {
      const order = await prisma.order.update({
        where: { id },
        data: { paymentStatus: status },
        include: ORDER_INCLUDE,
      });
      return formatOrderItems(order);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating payment status');
    }
  }

  async getOrdersByStatus(status: OrderStatus): Promise<any[]> {
    try {
      const orders = await prisma.order.findMany({ where: { status }, include: ORDER_INCLUDE });
      return orders.map(formatOrderItems);
    } catch {
      throw new ApiError(500, 'Error fetching orders by status');
    }
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        include: ORDER_INCLUDE,
      });
      return orders.map(formatOrderItems);
    } catch {
      throw new ApiError(500, 'Error fetching orders by date range');
    }
  }
}
