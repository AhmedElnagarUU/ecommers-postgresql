import { Router } from 'express';
import { CleanupController } from './cleanup.controller';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';

const router = Router();
const cleanupController = new CleanupController();

router.use(isAuthenticated, isAdmin);

router.post('/', cleanupController.createCleanup.bind(cleanupController));
router.get('/:id', cleanupController.getCleanupById.bind(cleanupController));
router.get('/type/:type', cleanupController.getCleanupsByType.bind(cleanupController));
router.patch('/:id', cleanupController.updateCleanup.bind(cleanupController));

router.post('/schedule/expired-sessions', cleanupController.scheduleExpiredSessionsCleanup.bind(cleanupController));
router.post('/schedule/old-notifications', cleanupController.scheduleOldNotificationsCleanup.bind(cleanupController));
router.post('/schedule/temporary-files', cleanupController.scheduleTemporaryFilesCleanup.bind(cleanupController));
router.post('/schedule/failed-payments', cleanupController.scheduleFailedPaymentsCleanup.bind(cleanupController));
router.post('/schedule/abandoned-carts', cleanupController.scheduleAbandonedCartsCleanup.bind(cleanupController));

export default router;
