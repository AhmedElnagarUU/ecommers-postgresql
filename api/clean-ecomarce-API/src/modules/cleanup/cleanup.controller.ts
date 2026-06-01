import { Request, Response } from 'express';
import { CleanupService, CleanupType } from './cleanup.service';

export class CleanupController {
  private cleanupService: CleanupService;

  constructor() {
    this.cleanupService = new CleanupService();
  }

  async createCleanup(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body;
      const cleanup = await this.cleanupService.createCleanup(dto);
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error creating cleanup task', error });
    }
  }

  async getCleanupById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cleanup = await this.cleanupService.getCleanupById(id);
      if (!cleanup) {
        res.status(404).json({ message: 'Cleanup task not found' });
        return;
      }
      res.json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving cleanup task', error });
    }
  }

  async getCleanupsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const validTypes: CleanupType[] = ['expired_sessions', 'old_notifications', 'temporary_files', 'failed_payments', 'abandoned_carts'];
      if (!validTypes.includes(type as CleanupType)) {
        res.status(400).json({ message: 'Invalid cleanup type' });
        return;
      }
      const cleanups = await this.cleanupService.getCleanupsByType(type as CleanupType);
      res.json(cleanups);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving cleanup tasks', error });
    }
  }

  async updateCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto = req.body;
      const cleanup = await this.cleanupService.updateCleanup(id, dto);
      if (!cleanup) {
        res.status(404).json({ message: 'Cleanup task not found' });
        return;
      }
      res.json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error updating cleanup task', error });
    }
  }

  async scheduleExpiredSessionsCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupService.scheduleExpiredSessionsCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling expired sessions cleanup', error });
    }
  }

  async scheduleOldNotificationsCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupService.scheduleOldNotificationsCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling old notifications cleanup', error });
    }
  }

  async scheduleTemporaryFilesCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupService.scheduleTemporaryFilesCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling temporary files cleanup', error });
    }
  }

  async scheduleFailedPaymentsCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupService.scheduleFailedPaymentsCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling failed payments cleanup', error });
    }
  }

  async scheduleAbandonedCartsCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupService.scheduleAbandonedCartsCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling abandoned carts cleanup', error });
    }
  }
}
