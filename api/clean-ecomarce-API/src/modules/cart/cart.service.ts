import { prisma } from '../../config/database';
import logger from '../../config/logger';

const CART_INCLUDE = {
  items: {
    include: {
      product: true,
      variants: true,
    },
  },
} as const;

export class CartService {
  constructor() {}

  async createCart(data: any): Promise<any> {
    try {
      return await prisma.cart.create({
        data: {
          customerId: data.userId ?? data.customerId,
          totalPrice: data.totalPrice ?? 0,
        },
        include: CART_INCLUDE,
      });
    } catch (error) {
      logger.error('Error creating cart:', error);
      throw new Error('Error creating cart');
    }
  }

  async getCartById(id: string): Promise<any | null> {
    try {
      return await prisma.cart.findUnique({ where: { id }, include: CART_INCLUDE });
    } catch (error) {
      logger.error('Error fetching cart:', error);
      throw new Error('Error fetching cart');
    }
  }

  async updateCart(id: string, data: any): Promise<any | null> {
    try {
      const existing = await prisma.cart.findUnique({ where: { id } });
      if (!existing) throw new Error('Cart not found');

      return await prisma.cart.update({
        where: { id },
        data: { totalPrice: data.totalPrice ?? existing.totalPrice },
        include: CART_INCLUDE,
      });
    } catch (error) {
      logger.error('Error updating cart:', error);
      throw new Error('Error updating cart');
    }
  }

  async getAll(): Promise<any[]> {
    try {
      return await prisma.cart.findMany({ include: CART_INCLUDE });
    } catch (error) {
      logger.error('Error fetching carts:', error);
      throw new Error('Error fetching carts');
    }
  }

  async getByUserId(userId: string): Promise<any | null> {
    try {
      logger.info(`service userId: ${userId}`);
      const cart = await prisma.cart.findUnique({
        where: { customerId: userId },
        include: CART_INCLUDE,
      });
      logger.info(`service cart: ${JSON.stringify(cart)}`);
      return cart;
    } catch (error) {
      logger.error('Error fetching cart by userId:', error);
      throw new Error('Error fetching cart by userId');
    }
  }
}
