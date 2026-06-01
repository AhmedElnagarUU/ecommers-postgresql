import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

const router = Router();

const customerService = new CustomerService();
const customerController = new CustomerController(customerService);

router.post('/', customerController.createCustomer.bind(customerController));
router.get('/', customerController.getAllCustomers.bind(customerController));
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
