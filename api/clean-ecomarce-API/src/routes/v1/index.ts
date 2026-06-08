import express from 'express';
import adminRoutes from '../../modules/admin/admin.route';
import dashboardRoutes from '../../modules/dashboard/dashboard.route';
import productRoutes from '../../modules/product/product.route';
import orderRoutes from '../../modules/order/order.route';
import categoryRoutes from '../../modules/category/category.route';
import cleanupRoutes from '../../modules/cleanup/cleanup.route';
import cartRoutes from '../../modules/cart/cart.route';
import customerRoutes from '../../modules/customer/customer.route';
import storeRoutes from '../../modules/store/store.route';
import variantRoutes from '../../modules/variant/variant.route';
import shippingRoutes from '../../modules/shipping/shipping.route';
import notificationRoutes from '../../modules/notification/notification.route';
import emailRoutes from '../../modules/email/email.route';

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/cleanup', cleanupRoutes);
router.use('/customers', customerRoutes);
router.use('/cart', cartRoutes);
router.use('/store', storeRoutes);
router.use('/variants', variantRoutes);
router.use('/shipping', shippingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/email', emailRoutes);

export default router;
