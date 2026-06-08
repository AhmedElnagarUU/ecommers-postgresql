import { Router } from 'express';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';

const router = Router();

const cartService = new CartService();
const cartController = new CartController(cartService);

router.use(isAuthenticated, isAdmin);

router.post('/', cartController.createCart.bind(cartController));
router.get('/', cartController.getAllCarts.bind(cartController));
router.get('/:userId', cartController.getCartByUserId.bind(cartController));

export default router;
