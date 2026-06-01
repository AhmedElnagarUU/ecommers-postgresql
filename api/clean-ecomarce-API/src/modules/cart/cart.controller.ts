import logger from '../../config/logger';
import { CartService } from './cart.service';

export class CartController {
  constructor(private readonly cartService: CartService) {
    logger.info('CartController initialized');
  }

  async createCart(req: any, res: any) {
    try {
      const { userId, items } = req.body;
      const cart = await this.cartService.createCart({ userId, items, totalPrice: 0 });
      return res.status(201).json(cart);
    } catch (error) {
      logger.error('Error creating cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllCarts(req: any, res: any) {
    try {
      const carts = await this.cartService.getAll();
      return res.status(200).json(carts);
    } catch (error) {
      logger.error('Error fetching carts:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCartByUserId(req: any, res: any) {
    try {
      const { userId } = req.params;
      logger.info(`controller userId: ${userId}`);
      const cart = await this.cartService.getByUserId(userId);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      return res.status(200).json(cart);
    } catch (error) {
      logger.error('Error fetching cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
