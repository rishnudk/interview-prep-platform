import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import { NotFoundError } from '../../../domain/errors';

export interface DeleteProblemInput {
  id: string;
}

export class DeleteProblem implements IUseCase<DeleteProblemInput, void> {
  constructor(private readonly problemRepository: IProblemRepository) {}

  async execute({ id }: DeleteProblemInput): Promise<void> {
    const existing = await this.problemRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Problem', id);
    }

    return this.problemRepository.delete(id);
  }
}
