import { Router } from 'express';
import { EmailController } from './email.controller';

const router = Router();
const emailController = new EmailController();

router.post('/', emailController.createEmail.bind(emailController));
router.post('/order-confirmation', emailController.createOrderConfirmationEmail.bind(emailController));
router.post('/shipping-update', emailController.createShippingUpdateEmail.bind(emailController));
router.post('/password-reset', emailController.createPasswordResetEmail.bind(emailController));

export default router;
