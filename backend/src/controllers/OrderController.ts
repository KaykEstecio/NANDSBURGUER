import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { OrderService } from '../services/OrderService';

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: AuthRequest, res: Response) {
    try {
      const order = await orderService.createOrder({
        userId: req.user!.userId
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getOrders(req: AuthRequest, res: Response) {
    try {
      const orders = await orderService.getOrders(req.user!.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOrderById(req: AuthRequest, res: Response) {
    try {
      const order = await orderService.getOrderById(
        req.params.id,
        req.user!.userId
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllOrders(req: AuthRequest, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      const orders = await orderService.getAllOrders(skip, take);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const validStatuses = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Use: PENDING, PAID, FAILED, CANCELLED' });
      }

      const order = await orderService.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
