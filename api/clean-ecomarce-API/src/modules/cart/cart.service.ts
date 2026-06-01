import { CartModel } from './cart.model';
import logger from '../../config/logger';

export class CartService {
  constructor() {}

  async createCart(data: any): Promise<any> {
    try {
      const cart = await CartModel.create(data);
      return cart;
    } catch (error) {
      logger.error('Error creating cart:', error);
      throw new Error('Error creating cart');
    }
  }

  async getCartById(id: string): Promise<any | null> {
    try {
      return await CartModel.findById(id).populate('items.productId');
    } catch (error) {
      logger.error('Error fetching cart:', error);
      throw new Error('Error fetching cart');
    }
  }

  async updateCart(id: string, data: any): Promise<any | null> {
    try {
      const existingCart = await CartModel.findById(id);
      if (!existingCart) {
        throw new Error('Cart not found');
      }
      return await CartModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error('Error updating cart:', error);
      throw new Error('Error updating cart');
    }
  }

  async getAll(): Promise<any[]> {
    try {
      return await CartModel.find().populate('items.productId');
    } catch (error) {
      logger.error('Error fetching carts:', error);
      throw new Error('Error fetching carts');
    }
  }

  async getByUserId(userId: string): Promise<any | null> {
    try {
      logger.info(`service userId: ${userId}`);
      const cart = await CartModel.findOne({ userId }).populate('items.productId');
      logger.info(`service cart: ${cart}`);
      return cart;
    } catch (error) {
      logger.error('Error fetching cart by userId:', error);
      throw new Error('Error fetching cart by userId');
    }
  }
}
