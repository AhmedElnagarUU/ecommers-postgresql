import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { getVariant, updateVariant, deleteVariant } from './variant.controller';

const router = Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/:variantId', getVariant);
router.put('/:variantId', updateVariant);
router.delete('/:variantId', deleteVariant);

export default router;
