import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { Problem, ProblemFilterDTO } from '@interviewprep/shared-types';

interface GetAdminProblemsOutput {
  data: Problem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetAdminProblems implements IUseCase<
  ProblemFilterDTO & { isPublished?: boolean },
  GetAdminProblemsOutput
> {
  constructor(private readonly problemRepository: IProblemRepository) {}

  async execute(
    filters: ProblemFilterDTO & { isPublished?: boolean },
  ): Promise<GetAdminProblemsOutput> {
    const { data, total } = await this.problemRepository.findAll(filters);

    return {
      data,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }
}
