import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CartService } from '../services/CartService';

const cartService = new CartService();

export class CartController {
  async getCart(req: AuthRequest, res: Response) {
    try {
      const cart = await cartService.getCart(req.user!.userId);
      const total = await cartService.getCartTotal(req.user!.userId);

      res.json({
        items: cart,
        total
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async addItem(req: AuthRequest, res: Response) {
    try {
      const { productId, quantity } = req.body;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      const item = await cartService.addItem({
        userId: req.user!.userId,
        productId,
        quantity
      });

      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateItem(req: AuthRequest, res: Response) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
      }

      const item = await cartService.updateItem(
        req.user!.userId,
        productId,
        { quantity }
      );

      res.json(item);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async removeItem(req: AuthRequest, res: Response) {
    try {
      const { productId } = req.params;

      await cartService.removeItem(req.user!.userId, productId);
      res.json({ message: 'Item removed' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async clearCart(req: AuthRequest, res: Response) {
    try {
      await cartService.clearCart(req.user!.userId);
      res.json({ message: 'Cart cleared' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
