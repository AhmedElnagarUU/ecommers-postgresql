import { Router } from 'express';
import { ProductController } from './product.controller';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { upload, handleProductImageUpload } from '../../middleware/upload.middleware';
import { ProductService } from './product.service';
import {
  setOptionTypes,
  getVariantsByProduct,
  bulkUpdateVariants,
} from '../variant/variant.controller';

const router = Router();

const productService = new ProductService();
const productController = new ProductController(productService);

router.use(isAuthenticated);
router.use(isAdmin);

router
  .route('/')
  .get(productController.getAllProducts.bind(productController))
  .post(
    upload.array('images', 5),
    handleProductImageUpload,
    productController.createProduct.bind(productController)
  );

router
  .route('/:id')
  .get(productController.getProductById.bind(productController))
  .put(
    upload.array('images', 5),
    handleProductImageUpload,
    productController.updateProduct.bind(productController)
  )
  .delete(productController.deleteProduct.bind(productController));

// ── Variant sub-resources ────────────────────────────────────────────────────
router.put('/:id/options', setOptionTypes);
router.get('/:id/variants', getVariantsByProduct);
router.put('/:id/variants/bulk', bulkUpdateVariants);

export default router;
