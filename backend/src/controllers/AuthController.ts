import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await authService.register({ email, password, name });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await authService.login({ email, password });
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async me(req: AuthRequest, res: Response) {
    res.json({ user: req.user });
  }
}
