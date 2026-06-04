import { Router } from 'express';
import { PixelController } from './pixel.controller';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';

const router = Router();
const controller = new PixelController();

router.get('/', controller.getPixels);
router.post('/', isAuthenticated, isAdmin, controller.createPixel);
router.put('/:id', isAuthenticated, isAdmin, controller.updatePixel);
router.delete('/:id', isAuthenticated, isAdmin, controller.deletePixel);

export default router;
