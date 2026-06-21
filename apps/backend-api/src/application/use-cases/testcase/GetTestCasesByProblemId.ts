import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';
import type { TestCase } from '@interviewprep/shared-types';

export class GetTestCasesByProblemId implements IUseCase<string, TestCase[]> {
  constructor(private readonly testCaseRepository: ITestCaseRepository) {}

  async execute(problemId: string): Promise<TestCase[]> {
    return this.testCaseRepository.findByProblemId(problemId);
  }
}
