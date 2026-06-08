import { Router } from 'express';
import { AdminNotificationController } from './admin-notification.controller';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AdminNotificationController();

router.use(isAuthenticated, isAdmin);

router.get('/unread/count', controller.unreadCount);
router.put('/read-all', controller.markAllAsRead);
router.get('/', controller.list);
router.put('/:id/read', controller.markAsRead);

export default router;
