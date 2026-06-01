import { Request, Response } from 'express';
import { CustomerService } from './customer.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';
import { eventBus } from '../../eventBus/eventbus';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
    const customers = await this.customerService.getAllCustomers();
    res.status(200).json(new ApiResponse(200, customers, 'Customers retrieved successfully'));
  });

  async getCustomerById(req: Request, res: Response) {
    const { id } = req.params;
    const customer = await this.customerService.getCustomerById(id);
    res.status(200).json(new ApiResponse(200, customer, 'Customer retrieved successfully'));
  }

  async createCustomer(req: Request, res: Response) {
    const dto = req.body;
    const newCustomer = await this.customerService.createCustomer(dto);
    eventBus.emit('customer.created', newCustomer);
    res.status(201).json(new ApiResponse(201, newCustomer, 'Customer created successfully'));
  }

  updateCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = req.body;
    const updatedCustomer = await this.customerService.updateCustomer(id, dto);
    res.status(200).json(new ApiResponse(200, updatedCustomer, 'Customer updated successfully'));
  });

  deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.customerService.deleteCustomer(id);
    res.status(200).json(new ApiResponse(200, null, 'Customer deleted successfully'));
  });
}
