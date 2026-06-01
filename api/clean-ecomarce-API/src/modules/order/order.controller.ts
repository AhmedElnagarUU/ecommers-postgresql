import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { ApiResponse } from '../../utils/ApiResponse';
import logger from '../../config/logger';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body;
      const order = await this.orderService.createOrder(dto);
      res.status(201).json(new ApiResponse(201, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(new ApiResponse(200, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const orders = await this.orderService.getOrdersByUserId(userId);
      res.json(new ApiResponse(200, orders));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      logger.info('in controller file trying to get all orders');
      const orders = await this.orderService.getAllOrders();
      logger.info(`Orders fetched successfully: ${orders.length} orders`);
      res.json({
        success: true,
        data: orders,
        pagination: {
          total: orders.length,
          page: 1,
          pages: 1
        }
      });
    } catch (error: any) {
      logger.error('Error fetching orders:', error);
      res.status(500).json({ message: error.message || 'Error fetching orders' });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto = req.body;
      const order = await this.orderService.updateOrder(id, dto);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(new ApiResponse(200, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteOrder(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const success = await this.orderService.deleteOrder(id);
      if (!success) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrdersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const orders = await this.orderService.getOrdersByStatus(status as any);
      res.json(new ApiResponse(200, orders));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrdersByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        res.status(400).json({ message: 'Start date and end date are required' });
        return;
      }
      const orders = await this.orderService.getOrdersByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(new ApiResponse(200, orders));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(id, status);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updatePaymentStatus(id, status);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(new ApiResponse(200, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
