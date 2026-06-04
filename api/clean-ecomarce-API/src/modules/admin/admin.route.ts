import express from 'express';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

const router = express.Router();

const adminService = new AdminService();
const adminController = new AdminController(adminService);

router.get('/', adminController.getAllAdmins.bind(adminController));
router.get('/super-admins', adminController.getSuperAdmins.bind(adminController));
router.get('/check-super-admin', (req, res) => adminController.checkSuperAdmin(req, res));
router.get('/:id', adminController.getAdminById.bind(adminController));

router.post('/register', adminController.registerAdmin.bind(adminController));
router.post('/login', adminController.loginAdmin.bind(adminController));

router.put('/:id', isAuthenticated, adminController.updateAdmin.bind(adminController));
router.put('/:id/status', isAuthenticated, adminController.changeAdminStatus.bind(adminController));

router.delete('/:id', isAuthenticated, adminController.deleteAdmin.bind(adminController));

export default router;
