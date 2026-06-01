import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripePayment } from './payment.stripe';

const router = Router();
const gateway = new StripePayment();
const paymentService = new PaymentService(gateway);
const paymentController = new PaymentController(paymentService);

router.post('/', paymentController.createPayment.bind(paymentController));
router.post('/create-payment-session', paymentController.createPaymentIntent.bind(paymentController));
router.get('/:id', paymentController.getPaymentById.bind(paymentController));
router.get('/order/:orderId', paymentController.getPaymentByOrderId.bind(paymentController));
router.get('/user/:userId', paymentController.getPaymentsByUserId.bind(paymentController));
router.put('/:id', paymentController.updatePayment.bind(paymentController));
router.post('/:id/process', paymentController.processPayment.bind(paymentController));
router.post('/:id/refund', paymentController.refundPayment.bind(paymentController));
router.delete('/:id', paymentController.deletePayment.bind(paymentController));

export default router;
