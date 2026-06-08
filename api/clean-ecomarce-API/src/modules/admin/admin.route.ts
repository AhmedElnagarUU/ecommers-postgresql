import express from 'express';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { isAuthenticated, isAdmin, isSuperAdmin } from '../../middleware/auth.middleware';
import { allowAdminRegistration } from '../../middleware/admin-registration.middleware';

const router = express.Router();

const adminService = new AdminService();
const adminController = new AdminController(adminService);

router.get('/check-super-admin', (req, res) => adminController.checkSuperAdmin(req, res));
router.post('/login', adminController.loginAdmin.bind(adminController));
router.post('/logout', adminController.logoutAdmin.bind(adminController));
router.post('/register', allowAdminRegistration, adminController.registerAdmin.bind(adminController));

router.get('/profile', isAuthenticated, adminController.getProfile.bind(adminController));

router.use(isAuthenticated, isAdmin);

router.get('/', adminController.getAllAdmins.bind(adminController));
router.get('/super-admins', isSuperAdmin, adminController.getSuperAdmins.bind(adminController));
router.get('/:id', adminController.getAdminById.bind(adminController));
router.put('/:id', adminController.updateAdmin.bind(adminController));
router.put('/:id/status', isSuperAdmin, adminController.changeAdminStatus.bind(adminController));
router.delete('/:id', isSuperAdmin, adminController.deleteAdmin.bind(adminController));

export default router;
