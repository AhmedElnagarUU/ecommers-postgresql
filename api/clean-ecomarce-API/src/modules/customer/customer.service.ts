import { CustomerModel } from './customer.model';
import { ApiError } from '../../utils/ApiError';
import { eventBus } from '../../eventBus/eventbus';

export class CustomerService {
  constructor() {}

  async getAllCustomers(): Promise<any[]> {
    try {
      return await CustomerModel.find();
    } catch (error) {
      throw new ApiError(500, 'Error fetching customers');
    }
  }

  async getCustomerById(id: string): Promise<any> {
    try {
      const customer = await CustomerModel.findById(id);
      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }
      return customer;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching customer by ID');
    }
  }

  async getCustomerByEmail(email: string): Promise<any> {
    try {
      const customer = await CustomerModel.findOne({ email });
      return customer;
    } catch (error) {
      throw new ApiError(500, 'Error fetching customer by email');
    }
  }

  async createCustomer(dto: any): Promise<any> {
    try {
      const existingCustomer = await CustomerModel.findOne({ email: dto.email });
      if (existingCustomer) {
        throw new ApiError(400, 'Customer with this email already exists');
      }
      const customer = await CustomerModel.create(dto);
      eventBus.emit('customer.created', customer);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error creating customer');
    }
  }

  async updateCustomer(id: string, dto: any): Promise<any> {
    try {
      const existingCustomer = await CustomerModel.findById(id);
      if (!existingCustomer) {
        throw new ApiError(404, 'Customer not found to update');
      }

      if (dto.email && dto.email !== existingCustomer.email) {
        const customerWithNewEmail = await CustomerModel.findOne({ email: dto.email });
        if (customerWithNewEmail) {
          throw new ApiError(400, 'Another customer with this email already exists');
        }
      }

      const updatedCustomer = await CustomerModel.findByIdAndUpdate(
        id,
        { $set: dto },
        { new: true, runValidators: true }
      );
      return updatedCustomer;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating customer');
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const existingCustomer = await CustomerModel.findById(id);
      if (!existingCustomer) {
        throw new ApiError(404, 'Customer not found to delete');
      }
      await CustomerModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting customer');
    }
  }
}
