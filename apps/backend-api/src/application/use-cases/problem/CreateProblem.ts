import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { Problem } from '@interviewprep/shared-types';

export interface CreateProblemInput {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  category: string;
  starterCode: string;
  solutionCode?: string;
  tags?: string[];
  isPublished?: boolean;
}

export class CreateProblem implements IUseCase<CreateProblemInput, Problem> {
  constructor(private readonly problemRepository: IProblemRepository) {}

  async execute(input: CreateProblemInput): Promise<Problem> {
    return this.problemRepository.create(input);
  }
}
