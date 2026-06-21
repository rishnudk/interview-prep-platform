import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { Problem } from '@interviewprep/shared-types';
import { NotFoundError } from '../../../domain/errors';

export interface UpdateProblemInput {
  id: string;
  data: Partial<Problem>;
}

export class UpdateProblem implements IUseCase<UpdateProblemInput, Problem> {
  constructor(private readonly problemRepository: IProblemRepository) {}

  async execute({ id, data }: UpdateProblemInput): Promise<Problem> {
    const existing = await this.problemRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Problem', id);
    }

    return this.problemRepository.update(id, data);
  }
}
