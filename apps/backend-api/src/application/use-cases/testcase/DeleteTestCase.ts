import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';
import { NotFoundError } from '../../../domain/errors';

export interface DeleteTestCaseInput {
  id: string;
}

export class DeleteTestCase implements IUseCase<DeleteTestCaseInput, void> {
  constructor(private readonly testCaseRepository: ITestCaseRepository) {}

  async execute({ id }: DeleteTestCaseInput): Promise<void> {
    const existing = await this.testCaseRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('TestCase', id);
    }

    return this.testCaseRepository.delete(id);
  }
}
