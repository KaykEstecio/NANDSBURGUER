import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CategoryService } from '../services/CategoryService';

const categoryService = new CategoryService();

export class CategoryController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const categories = await categoryService.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const category = await categoryService.getById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const category = await categoryService.create({ name, description });
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      await categoryService.delete(req.params.id);
      res.json({ message: 'Category deleted' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
