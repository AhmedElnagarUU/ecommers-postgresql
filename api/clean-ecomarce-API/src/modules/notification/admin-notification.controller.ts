import { Request, Response } from 'express';
import { AdminNotificationService } from './admin-notification.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class AdminNotificationController {
  constructor(private readonly service = new AdminNotificationService()) {}

  list = async (_req: Request, res: Response) => {
    try {
      const notifications = await this.service.list();
      res.json(new ApiResponse(200, notifications));
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  unreadCount = async (_req: Request, res: Response) => {
    try {
      const count = await this.service.getUnreadCount();
      res.json(new ApiResponse(200, { count }));
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  markAsRead = async (req: Request, res: Response) => {
    try {
      const notification = await this.service.markAsRead(req.params.id);
      res.json(new ApiResponse(200, notification));
    } catch (error: any) {
      res.status(404).json({ success: false, message: 'Notification not found' });
    }
  };

  markAllAsRead = async (_req: Request, res: Response) => {
    try {
      const count = await this.service.markAllAsRead();
      res.json(new ApiResponse(200, { updated: count }));
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
