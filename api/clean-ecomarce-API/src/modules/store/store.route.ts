import { Router } from 'express';
import { StoreController } from './store.controller';
import { isCustomerAuth, optionalCustomerAuth } from '../../middleware/customer-auth.middleware';
import pixelRoutes from '../pixel/pixel.route';


const router = Router();
const controller = new StoreController();

// Catalog (public)
router.get('/categories', controller.getCategories);
router.get('/products', controller.getProducts);
router.get('/products/:id', controller.getProductById);
router.get('/orders/track', controller.trackOrder);

// Auth
router.post('/auth/register', controller.register);
router.post('/auth/login', controller.login);
router.get('/auth/me', isCustomerAuth, controller.me);
router.patch('/auth/me', isCustomerAuth, controller.updateProfile);
router.get('/addresses', isCustomerAuth, controller.getAddresses);
router.post('/addresses', isCustomerAuth, controller.createAddress);
router.put('/addresses/:id', isCustomerAuth, controller.updateAddress);
router.delete('/addresses/:id', isCustomerAuth, controller.deleteAddress);

// Cart (logged-in customers)
router.get('/cart', isCustomerAuth, controller.getCart);
router.put('/cart', isCustomerAuth, controller.updateCart);

// Orders — guest or logged-in
router.post('/orders', optionalCustomerAuth, controller.createOrder);
router.get('/orders', isCustomerAuth, controller.getMyOrders);

// Tracking pixels (public GET; admin CRUD on mutating routes)
router.use('/pixels', pixelRoutes);

export default router;
