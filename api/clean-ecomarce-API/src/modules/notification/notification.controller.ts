import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import logger from '../../config/logger';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService, private readonly event: any) {
    event.on('customer.created', (customer: any) => {
      logger.info(`NotificationController received customer.created event for customer: ${customer.email}`);
    });
  }

  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body;
      const notification = await this.notificationService.createNotification(dto);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await this.notificationService.getNotificationById(id);
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNotificationsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const notifications = await this.notificationService.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNotificationsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const notifications = await this.notificationService.getNotificationsByType(type);
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNotificationsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const notifications = await this.notificationService.getNotificationsByStatus(status);
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto = req.body;
      const notification = await this.notificationService.updateNotification(id, dto);
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await this.notificationService.markAsRead(id);
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const success = await this.notificationService.markAllAsRead(userId);
      if (!success) {
        res.status(400).json({ message: 'Failed to mark notifications as read' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.notificationService.deleteNotification(id);
      if (!success) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteAllNotificationsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const success = await this.notificationService.deleteAllNotificationsByUserId(userId);
      if (!success) {
        res.status(400).json({ message: 'Failed to delete notifications' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
