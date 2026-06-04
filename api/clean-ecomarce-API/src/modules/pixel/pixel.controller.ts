import { Request, Response } from 'express';
import { PixelService } from './pixel.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class PixelController {
  constructor(private readonly pixelService = new PixelService()) {}

  getPixels = async (req: Request, res: Response): Promise<void> => {
    try {
      const includeSecrets = typeof req.isAuthenticated === 'function' && req.isAuthenticated();
      const pixels = await this.pixelService.listPixels(includeSecrets);
      res.json(new ApiResponse(200, pixels));
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  createPixel = async (req: Request, res: Response): Promise<void> => {
    try {
      const pixel = await this.pixelService.createPixel(req.body);
      res.status(201).json(new ApiResponse(201, pixel, 'Pixel created'));
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  updatePixel = async (req: Request, res: Response): Promise<void> => {
    try {
      const pixel = await this.pixelService.updatePixel(req.params.id, req.body);
      res.json(new ApiResponse(200, pixel, 'Pixel updated'));
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  deletePixel = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.pixelService.deletePixel(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}
