import { prisma } from '../../config/database';
import { ApiError } from '../../utils/ApiError';
import { eventBus } from '../../eventBus/eventbus';

export class CustomerService {
  constructor() {}

  async getAllCustomers(): Promise<any[]> {
    try {
      return await prisma.customer.findMany();
    } catch (error) {
      throw new ApiError(500, 'Error fetching customers');
    }
  }

  async getCustomerById(id: string): Promise<any> {
    try {
      const customer = await prisma.customer.findUnique({ where: { id } });
      if (!customer) throw new ApiError(404, 'Customer not found');
      return customer;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching customer by ID');
    }
  }

  async getCustomerByEmail(email: string): Promise<any> {
    try {
      return await prisma.customer.findUnique({ where: { email } });
    } catch (error) {
      throw new ApiError(500, 'Error fetching customer by email');
    }
  }

  async createCustomer(dto: any): Promise<any> {
    try {
      const existing = await prisma.customer.findUnique({ where: { email: dto.email } });
      if (existing) throw new ApiError(400, 'Customer with this email already exists');

      const customer = await prisma.customer.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          password: dto.password,
        },
      });
      eventBus.emit('customer.created', customer);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error creating customer');
    }
  }

  async updateCustomer(id: string, dto: any): Promise<any> {
    try {
      const existing = await prisma.customer.findUnique({ where: { id } });
      if (!existing) throw new ApiError(404, 'Customer not found to update');

      if (dto.email && dto.email !== existing.email) {
        const conflict = await prisma.customer.findUnique({ where: { email: dto.email } });
        if (conflict) throw new ApiError(400, 'Another customer with this email already exists');
      }

      return await prisma.customer.update({ where: { id }, data: dto });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating customer');
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const existing = await prisma.customer.findUnique({ where: { id } });
      if (!existing) throw new ApiError(404, 'Customer not found to delete');
      await prisma.customer.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting customer');
    }
  }
}
