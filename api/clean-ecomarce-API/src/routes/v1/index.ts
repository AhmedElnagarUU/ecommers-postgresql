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
// import paymentRoutes from '../../modules/payment/infra/payment.routes';

const router = express.Router();

// Auth routes
// router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

// Product routes
router.use('/products', productRoutes);

// Order routes
router.use('/orders', orderRoutes);

// Category routes
router.use('/categories', categoryRoutes);

// Cleanup routes
router.use('/cleanup', cleanupRoutes);


// Customers routes
router.use('/customers', customerRoutes);


//cart routes
router.use('/cart', cartRoutes);

// Public storefront API
router.use('/store', storeRoutes);

// Individual variant endpoints
router.use('/variants', variantRoutes);

// Shipping management endpoints
router.use('/shipping', shippingRoutes);


// Payment routes
// router.use('/payments', paymentRoutes);

export default router; 