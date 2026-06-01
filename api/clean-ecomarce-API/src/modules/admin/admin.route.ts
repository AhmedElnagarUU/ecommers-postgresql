import express from 'express';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminModel } from './admin.model';

const router = express.Router();

const adminService = new AdminService();
const adminController = new AdminController(adminService);

router.get('/', adminController.getAllAdmins.bind(adminController));
router.get('/super-admins', adminController.getSuperAdmins.bind(adminController));
router.get('/check-super-admin', (req, res) => adminController.checkSuperAdmin(req, res));
router.get('/:id', adminController.getAdminById.bind(adminController));

router.post('/register', adminController.registerAdmin.bind(adminController));
router.post('/login', adminController.loginAdmin.bind(adminController));

router.put('/:id', adminController.updateAdmin.bind(adminController));
router.put('/:id/status', adminController.changeAdminStatus.bind(adminController));

router.delete('/:id', adminController.deleteAdmin.bind(adminController));

router.get('/listIndex', async (req, res) => {
  try {
    const indexes = await AdminModel.listIndexes();
    res.json({ success: true, indexes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
