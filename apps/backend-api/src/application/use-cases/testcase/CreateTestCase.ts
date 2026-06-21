import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { TestCase } from '@interviewprep/shared-types';
import { NotFoundError } from '../../../domain/errors';

export interface CreateTestCaseInput {
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order?: number;
}

export class CreateTestCase implements IUseCase<CreateTestCaseInput, TestCase> {
  constructor(
    private readonly testCaseRepository: ITestCaseRepository,
    private readonly problemRepository: IProblemRepository,
  ) {}

  async execute(input: CreateTestCaseInput): Promise<TestCase> {
    const problem = await this.problemRepository.findById(input.problemId);
    if (!problem) {
      throw new NotFoundError('Problem', input.problemId);
    }

    return this.testCaseRepository.create(input);
  }
}
