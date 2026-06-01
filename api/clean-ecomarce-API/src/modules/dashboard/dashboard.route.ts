import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';

const router = Router();
const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService);

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/stats', dashboardController.getStats);
router.get('/recent-orders', dashboardController.getRecentOrders);
router.get('/top-products', dashboardController.getTopProducts);
router.get('/sales-analytics', dashboardController.getSalesAnalytics);

export default router;
