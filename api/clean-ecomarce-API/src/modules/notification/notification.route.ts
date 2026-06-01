import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { eventBus } from '../../eventBus/eventbus';

const router = Router();
const notificationService = new NotificationService(eventBus);
const notificationController = new NotificationController(notificationService, eventBus);

router.post('/', notificationController.createNotification.bind(notificationController));
router.get('/:id', notificationController.getNotificationById.bind(notificationController));
router.get('/user/:userId', notificationController.getNotificationsByUserId.bind(notificationController));
router.get('/type/:type', notificationController.getNotificationsByType.bind(notificationController));
router.get('/status/:status', notificationController.getNotificationsByStatus.bind(notificationController));
router.put('/:id', notificationController.updateNotification.bind(notificationController));
router.patch('/:id/read', notificationController.markAsRead.bind(notificationController));
router.patch('/user/:userId/read-all', notificationController.markAllAsRead.bind(notificationController));
router.delete('/:id', notificationController.deleteNotification.bind(notificationController));
router.delete('/user/:userId', notificationController.deleteAllNotificationsByUserId.bind(notificationController));

export default router;
