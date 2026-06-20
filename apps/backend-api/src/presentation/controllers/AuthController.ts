import { Request, Response, NextFunction } from 'express';
import type { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import type { LoginUser } from '../../application/use-cases/auth/LoginUser';

// ============================================================
// AuthController
// Presentation adapter mapping registration/login endpoints to use cases
// ============================================================

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUser.execute(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUser.execute(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
