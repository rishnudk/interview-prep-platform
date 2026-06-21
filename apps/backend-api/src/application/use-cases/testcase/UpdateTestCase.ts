import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';
import type { TestCase } from '@interviewprep/shared-types';
import { NotFoundError } from '../../../domain/errors';

export interface UpdateTestCaseInput {
  id: string;
  data: Partial<TestCase>;
}

export class UpdateTestCase implements IUseCase<UpdateTestCaseInput, TestCase> {
  constructor(private readonly testCaseRepository: ITestCaseRepository) {}

  async execute({ id, data }: UpdateTestCaseInput): Promise<TestCase> {
    const existing = await this.testCaseRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('TestCase', id);
    }

    return this.testCaseRepository.update(id, data);
  }
}
