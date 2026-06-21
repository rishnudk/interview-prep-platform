import { Request, Response, NextFunction } from 'express';
import type { GetAdminStats } from '../../application/use-cases/admin/GetAdminStats';
import type { GetAdminProblems } from '../../application/use-cases/admin/GetAdminProblems';
import type { CreateProblem } from '../../application/use-cases/problem/CreateProblem';
import type { UpdateProblem } from '../../application/use-cases/problem/UpdateProblem';
import type { DeleteProblem } from '../../application/use-cases/problem/DeleteProblem';
import type { CreateTestCase } from '../../application/use-cases/testcase/CreateTestCase';
import type { UpdateTestCase } from '../../application/use-cases/testcase/UpdateTestCase';
import type { DeleteTestCase } from '../../application/use-cases/testcase/DeleteTestCase';
import type { GetTestCasesByProblemId } from '../../application/use-cases/testcase/GetTestCasesByProblemId';

// ============================================================
// AdminController
// Coordinates backend administration features for Problems/TestCases
// ============================================================

export class AdminController {
  constructor(
    private readonly getAdminStats: GetAdminStats,
    private readonly getAdminProblems: GetAdminProblems,
    private readonly createProblemUseCase: CreateProblem,
    private readonly updateProblemUseCase: UpdateProblem,
    private readonly deleteProblemUseCase: DeleteProblem,
    private readonly createTestCaseUseCase: CreateTestCase,
    private readonly updateTestCaseUseCase: UpdateTestCase,
    private readonly deleteTestCaseUseCase: DeleteTestCase,
    private readonly getTestCasesByProblemId: GetTestCasesByProblemId,
  ) {}

  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.getAdminStats.execute();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };

  listProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as any;
      const result = await this.getAdminProblems.execute(filters);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  createProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const problem = await this.createProblemUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: problem,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const problem = await this.updateProblemUseCase.execute({ id, data: req.body });
      res.status(200).json({
        success: true,
        data: problem,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.deleteProblemUseCase.execute({ id });
      res.status(200).json({
        success: true,
        message: 'Problem deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  listTestCases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const problemId = req.params.problemId as string;
      const testCases = await this.getTestCasesByProblemId.execute(problemId);
      res.status(200).json({
        success: true,
        data: testCases,
      });
    } catch (error) {
      next(error);
    }
  };

  createTestCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const testCase = await this.createTestCaseUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: testCase,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTestCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const testCase = await this.updateTestCaseUseCase.execute({ id, data: req.body });
      res.status(200).json({
        success: true,
        data: testCase,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTestCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.deleteTestCaseUseCase.execute({ id });
      res.status(200).json({
        success: true,
        message: 'Test case deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
