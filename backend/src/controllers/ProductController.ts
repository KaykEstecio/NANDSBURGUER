import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ProductService } from '../services/ProductService';

const productService = new ProductService();

export class ProductController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const products = await productService.getAll(skip, take);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, description, price, stock, categoryId } = req.body;

      if (!name || price === undefined || stock === undefined || !categoryId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const product = await productService.create(
        { name, description, price, stock, categoryId },
        req.user!.userId
      );
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      await productService.delete(req.params.id);
      res.json({ message: 'Product deleted' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getStock(req: AuthRequest, res: Response) {
    try {
      const stock = await productService.getStock(req.params.id);
      res.json({ stock });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
