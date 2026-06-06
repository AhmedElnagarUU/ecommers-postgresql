import { Request, Response } from 'express';
import { StoreService } from './store.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export class StoreController {
  constructor(private storeService = new StoreService()) {}

  register = async (req: Request, res: Response) => {
    try {
      const data = await this.storeService.register(req.body);
      res.status(201).json(new ApiResponse(201, data, 'Registered successfully'));
    } catch (e: any) {
      res.status(e.statusCode || 400).json({ message: e.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data = await this.storeService.login(req.body);
      res.json(new ApiResponse(200, data, 'Login successful'));
    } catch (e: any) {
      res.status(e.statusCode || 401).json({ message: e.message });
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      const customer = await this.storeService.getProfile(req.customer!.id);
      res.json(new ApiResponse(200, customer, 'Customer profile'));
    } catch (e: any) {
      res.status(e.statusCode || 404).json({ message: e.message });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const data = await this.storeService.updateProfile(req.customer!.id, req.body);
      res.json(new ApiResponse(200, data, 'Profile updated'));
    } catch (e: any) {
      res.status(e.statusCode || 400).json({ message: e.message });
    }
  };

  getAddresses = async (req: Request, res: Response) => {
    try {
      const addresses = await this.storeService.getAddresses(req.customer!.id);
      res.json(new ApiResponse(200, addresses));
    } catch (e: any) {
      res.status(e.statusCode || 500).json({ message: e.message });
    }
  };

  createAddress = async (req: Request, res: Response) => {
    try {
      const address = await this.storeService.createAddress(req.customer!.id, req.body);
      res.status(201).json(new ApiResponse(201, address, 'Address saved'));
    } catch (e: any) {
      res.status(e.statusCode || 400).json({ message: e.message });
    }
  };

  updateAddress = async (req: Request, res: Response) => {
    try {
      const address = await this.storeService.updateAddress(req.customer!.id, req.params.id, req.body);
      res.json(new ApiResponse(200, address, 'Address updated'));
    } catch (e: any) {
      res.status(e.statusCode || 400).json({ message: e.message });
    }
  };

  deleteAddress = async (req: Request, res: Response) => {
    try {
      await this.storeService.deleteAddress(req.customer!.id, req.params.id);
      res.json(new ApiResponse(200, null, 'Address deleted'));
    } catch (e: any) {
      res.status(e.statusCode || 400).json({ message: e.message });
    }
  };

  getCategories = async (_req: Request, res: Response) => {
    try {
      const categories = await this.storeService.getCategories();
      res.json(new ApiResponse(200, categories));
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  };

  getProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.storeService.getProducts(req.query as any);
      res.json(new ApiResponse(200, products));
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const product = await this.storeService.getProductById(req.params.id);
      res.json(new ApiResponse(200, product));
    } catch (e: any) {
      res.status(e.statusCode || 404).json({ message: e.message });
    }
  };

  getCart = async (req: Request, res: Response) => {
    try {
      const cart = await this.storeService.getCart(req.customer!.id);
      res.json(new ApiResponse(200, cart));
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  };

  updateCart = async (req: Request, res: Response) => {
    try {
      const cart = await this.storeService.updateCart(req.customer!.id, req.body.items || []);
      res.json(new ApiResponse(200, cart, 'Cart updated'));
    } catch (e: any) {
      res.status(e.statusCode || 400).json({ message: e.message });
    }
  };

  createOrder = async (req: Request, res: Response) => {
    try {
      const customerId = req.customer?.id || null;
      const order = await this.storeService.createOrder(customerId, req.body);
      res.status(201).json(new ApiResponse(201, order, 'Order placed'));
    } catch (e: any) {
      res.status(e.statusCode || 400).json({ message: e.message });
    }
  };

  getMyOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.storeService.getMyOrders(req.customer!.id);
      res.json(new ApiResponse(200, orders));
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  };

  trackOrder = async (req: Request, res: Response) => {
    try {
      const { email, orderNumber } = req.query;
      if (!email || !orderNumber) {
        throw new ApiError(400, 'Email and order number are required');
      }
      const order = await this.storeService.trackOrder(
        String(email),
        String(orderNumber)
      );
      res.json(new ApiResponse(200, order));
    } catch (e: any) {
      res.status(e.statusCode || 404).json({ message: e.message });
    }
  };
}
