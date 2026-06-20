import { Router } from 'express';
import { container } from '../../container';
import { validateRequest } from '../middleware/validate-request';
import { RegisterSchema, LoginSchema } from '@interviewprep/shared-types';

// ============================================================
// Auth Routes
// Registers handlers for auth endpoints with input validations
// ============================================================

const authRoutes = Router();

authRoutes.post(
  '/register',
  validateRequest(RegisterSchema),
  (req, res, next) => {
    container.controllers.authController.register(req, res, next);
  }
);

authRoutes.post(
  '/login',
  validateRequest(LoginSchema),
  (req, res, next) => {
    container.controllers.authController.login(req, res, next);
  }
);

export { authRoutes };
