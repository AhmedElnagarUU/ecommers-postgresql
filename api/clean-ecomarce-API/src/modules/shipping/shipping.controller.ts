import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { ShippingService } from './shipping.service';

export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  getZones = asyncHandler(async (_req: Request, res: Response) => {
    const zones = await this.shippingService.getZones();
    return res.status(200).json(new ApiResponse(200, zones, 'Shipping zones retrieved successfully'));
  });

  getZoneById = asyncHandler(async (req: Request, res: Response) => {
    const zone = await this.shippingService.getZoneById(req.params.id);
    return res.status(200).json(new ApiResponse(200, zone, 'Shipping zone retrieved successfully'));
  });

  createZone = asyncHandler(async (req: Request, res: Response) => {
    const zone = await this.shippingService.createZone(req.body);
    return res.status(201).json(new ApiResponse(201, zone, 'Shipping zone created successfully'));
  });

  updateZone = asyncHandler(async (req: Request, res: Response) => {
    const zone = await this.shippingService.updateZone(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, zone, 'Shipping zone updated successfully'));
  });

  deleteZone = asyncHandler(async (req: Request, res: Response) => {
    await this.shippingService.deleteZone(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, 'Shipping zone deleted successfully'));
  });

  quoteZone = asyncHandler(async (req: Request, res: Response) => {
    const quote = await this.shippingService.quoteByLocation(
      req.query.country as string,
      req.query.city as string
    );
    return res.status(200).json(new ApiResponse(200, quote, 'Shipping quote retrieved successfully'));
  });

  getMethods = asyncHandler(async (_req: Request, res: Response) => {
    const methods = await this.shippingService.getMethods();
    return res
      .status(200)
      .json(new ApiResponse(200, methods, 'Shipping methods retrieved successfully'));
  });

  getMethodById = asyncHandler(async (req: Request, res: Response) => {
    const method = await this.shippingService.getMethodById(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, method, 'Shipping method retrieved successfully'));
  });

  createMethod = asyncHandler(async (req: Request, res: Response) => {
    const method = await this.shippingService.createMethod(req.body);
    return res.status(201).json(new ApiResponse(201, method, 'Shipping method created successfully'));
  });

  updateMethod = asyncHandler(async (req: Request, res: Response) => {
    const method = await this.shippingService.updateMethod(req.params.id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, method, 'Shipping method updated successfully'));
  });

  deleteMethod = asyncHandler(async (req: Request, res: Response) => {
    await this.shippingService.deleteMethod(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Shipping method deleted successfully'));
  });

  getShipments = asyncHandler(async (_req: Request, res: Response) => {
    const shipments = await this.shippingService.getShipments();
    return res.status(200).json(new ApiResponse(200, shipments, 'Shipments retrieved successfully'));
  });

  getShipmentById = asyncHandler(async (req: Request, res: Response) => {
    const shipment = await this.shippingService.getShipmentById(req.params.id);
    return res.status(200).json(new ApiResponse(200, shipment, 'Shipment retrieved successfully'));
  });

  createShipment = asyncHandler(async (req: Request, res: Response) => {
    const shipment = await this.shippingService.createShipment(req.body);
    return res.status(201).json(new ApiResponse(201, shipment, 'Shipment created successfully'));
  });

  updateShipment = asyncHandler(async (req: Request, res: Response) => {
    const shipment = await this.shippingService.updateShipment(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, shipment, 'Shipment updated successfully'));
  });

  deleteShipment = asyncHandler(async (req: Request, res: Response) => {
    await this.shippingService.deleteShipment(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, 'Shipment deleted successfully'));
  });
}
