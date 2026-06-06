import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';

const router = Router();
const shippingService = new ShippingService();
const shippingController = new ShippingController(shippingService);

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/zones/quote', shippingController.quoteZone);

router
  .route('/zones')
  .get(shippingController.getZones)
  .post(shippingController.createZone);

router
  .route('/zones/:id')
  .get(shippingController.getZoneById)
  .put(shippingController.updateZone)
  .delete(shippingController.deleteZone);

router
  .route('/methods')
  .get(shippingController.getMethods)
  .post(shippingController.createMethod);

router
  .route('/methods/:id')
  .get(shippingController.getMethodById)
  .put(shippingController.updateMethod)
  .delete(shippingController.deleteMethod);

router
  .route('/shipments')
  .get(shippingController.getShipments)
  .post(shippingController.createShipment);

router
  .route('/shipments/:id')
  .get(shippingController.getShipmentById)
  .put(shippingController.updateShipment)
  .delete(shippingController.deleteShipment);

export default router;
