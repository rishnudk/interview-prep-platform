import { Router } from 'express';
import { container } from '../../container';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validate-request';
import {
  CreateProblemSchema,
  UpdateProblemSchema,
  ProblemFilterSchema,
  CreateTestCaseSchema,
  UpdateTestCaseSchema,
} from '@interviewprep/shared-types';

const adminRoutes = Router();

// Protect all admin endpoints with authentication and ADMIN role requirement
adminRoutes.use(authenticate);
adminRoutes.use(authorize('ADMIN'));

// GET /api/admin/stats
adminRoutes.get('/stats', (req, res, next) => {
  container.controllers.adminController.getStats(req, res, next);
});

// GET /api/admin/problems
adminRoutes.get('/problems', validateRequest(ProblemFilterSchema, 'query'), (req, res, next) => {
  container.controllers.adminController.listProblems(req, res, next);
});

// POST /api/admin/problems
adminRoutes.post('/problems', validateRequest(CreateProblemSchema), (req, res, next) => {
  container.controllers.adminController.createProblem(req, res, next);
});

// PUT /api/admin/problems/:id
adminRoutes.put('/problems/:id', validateRequest(UpdateProblemSchema), (req, res, next) => {
  container.controllers.adminController.updateProblem(req, res, next);
});

// DELETE /api/admin/problems/:id
adminRoutes.delete('/:id', (req, res, next) => {
  // Let it support both /api/admin/problems/:id or similar standard routes
  container.controllers.adminController.deleteProblem(req, res, next);
});
adminRoutes.delete('/problems/:id', (req, res, next) => {
  container.controllers.adminController.deleteProblem(req, res, next);
});

// GET /api/admin/problems/:problemId/test-cases
adminRoutes.get('/problems/:problemId/test-cases', (req, res, next) => {
  container.controllers.adminController.listTestCases(req, res, next);
});

// POST /api/admin/test-cases
adminRoutes.post('/test-cases', validateRequest(CreateTestCaseSchema), (req, res, next) => {
  container.controllers.adminController.createTestCase(req, res, next);
});

// PUT /api/admin/test-cases/:id
adminRoutes.put('/test-cases/:id', validateRequest(UpdateTestCaseSchema), (req, res, next) => {
  container.controllers.adminController.updateTestCase(req, res, next);
});

// DELETE /api/admin/test-cases/:id
adminRoutes.delete('/test-cases/:id', (req, res, next) => {
  container.controllers.adminController.deleteTestCase(req, res, next);
});

export { adminRoutes };
