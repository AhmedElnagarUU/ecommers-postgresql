import { prisma } from '../../config/database';
import { ApiError } from '../../utils/ApiError';

function toLowerStatus(status: string): string {
  return status.toLowerCase();
}

export class DashboardService {
  async getStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    completedOrders: number;
    recentOrders: Array<{
      id: string;
      customerName: string;
      amount: number;
      status: string;
      date: string;
    }>;
    topProducts: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
  }> {
    try {
      const [
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueAgg,
        pendingOrders,
        completedOrders,
        recentOrdersRaw,
        topByQuantity,
      ] = await Promise.all([
        prisma.order.count(),
        prisma.customer.count(),
        prisma.product.count(),
        prisma.order.aggregate({ _sum: { totalAmount: true } }),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { status: 'COMPLETED' } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { customer: { select: { name: true } } },
        }),
        prisma.orderItem.groupBy({
          by: ['productId'],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
      ]);

      const productIds = topByQuantity.map((row) => row.productId);
      const products = productIds.length
        ? await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, price: true },
          })
        : [];

      const recentOrders = recentOrdersRaw.map((order) => ({
        id: order.id,
        customerName: order.customer?.name ?? 'Guest',
        amount: order.totalAmount,
        status: toLowerStatus(order.status),
        date: order.createdAt.toISOString(),
      }));

      const topProducts = topByQuantity.map((row) => {
        const product = products.find((p) => p.id === row.productId);
        const sales = row._sum.quantity ?? 0;
        const unitPrice = product?.price ?? 0;
        return {
          id: row.productId,
          name: product?.name ?? 'Unknown product',
          sales,
          revenue: sales * unitPrice,
        };
      });

      return {
        totalOrders,
        totalRevenue: revenueAgg._sum.totalAmount ?? 0,
        totalCustomers,
        totalProducts,
        pendingOrders,
        completedOrders,
        recentOrders,
        topProducts,
      };
    } catch (error) {
      throw new ApiError(500, 'Error fetching dashboard statistics');
    }
  }

  async getRecentOrders(): Promise<
    Array<{
      id: string;
      _id: string;
      orderNumber: string;
      customerName: string;
      total: number;
      status: string;
      createdAt: string;
    }>
  > {
    try {
      const orders = await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true } } },
      });

      return orders.map((order) => ({
        id: order.id,
        _id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer?.name ?? 'Guest',
        total: order.totalAmount,
        status: toLowerStatus(order.status),
        createdAt: order.createdAt.toISOString(),
      }));
    } catch {
      throw new ApiError(500, 'Error fetching recent orders');
    }
  }

  async getTopProducts(): Promise<
    Array<{ id: string; name: string; sales: number; revenue: number }>
  > {
    try {
      const stats = await this.getStats();
      return stats.topProducts;
    } catch {
      throw new ApiError(500, 'Error fetching top products');
    }
  }

  async getSalesAnalytics(startDate: string, endDate: string): Promise<
    Array<{ date: string; revenue: number; orders: number }>
  > {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 86400000);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: { gte: start, lte: end },
          status: { not: 'CANCELLED' },
        },
        select: { createdAt: true, totalAmount: true },
      });

      const byDay = new Map<string, { revenue: number; orders: number }>();

      for (const order of orders) {
        const key = order.createdAt.toISOString().slice(0, 10);
        const current = byDay.get(key) ?? { revenue: 0, orders: 0 };
        current.revenue += order.totalAmount;
        current.orders += 1;
        byDay.set(key, current);
      }

      return Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, values]) => ({ date, ...values }));
    } catch {
      throw new ApiError(500, 'Error fetching sales analytics');
    }
  }
}
