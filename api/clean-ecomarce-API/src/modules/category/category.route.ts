import { Router } from 'express';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { validateResource } from '../../middleware/validateResource';
import { isAuthenticated } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/auth.middleware';
// import { createCategorySchema, updateCategorySchema, updateCategoryStatusSchema } from './category.controller';

const router = Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.use(isAuthenticated);
router.use(isAdmin);

router.post('/', (req, res) => categoryController.createCategory(req, res));
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));
router.put('/:id', (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));
router.patch('/:id/status', (req, res) => categoryController.updateCategoryStatus(req, res));

export default router;
