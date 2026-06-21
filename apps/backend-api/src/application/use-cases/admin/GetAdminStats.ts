import type { IUseCase } from '../../interfaces/IUseCase';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';

export interface AdminStatsOutput {
  totalUsers: number;
  totalSubmissions: number;
  totalProblems: number;
  acceptanceRate: number;
  problemsByDifficulty: Record<string, number>;
}

export class GetAdminStats implements IUseCase<any, AdminStatsOutput> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly submissionRepository: ISubmissionRepository,
    private readonly problemRepository: IProblemRepository,
  ) {}

  async execute(): Promise<AdminStatsOutput> {
    const [totalUsers, totalSubmissions, totalProblems, totalAccepted, problemsByDifficulty] =
      await Promise.all([
        this.userRepository.count(),
        this.submissionRepository.countAll(),
        this.problemRepository.countAll(),
        this.submissionRepository.countAllAccepted(),
        this.problemRepository.countByDifficulty(),
      ]);

    const acceptanceRate =
      totalSubmissions > 0 ? Math.round((totalAccepted / totalSubmissions) * 100) : 0;

    return {
      totalUsers,
      totalSubmissions,
      totalProblems,
      acceptanceRate,
      problemsByDifficulty,
    };
  }
}
