import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAdminStats } from './GetAdminStats';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';

describe('GetAdminStats Use Case', () => {
  let userRepository: IUserRepository;
  let submissionRepository: ISubmissionRepository;
  let problemRepository: IProblemRepository;
  let useCase: GetAdminStats;

  beforeEach(() => {
    userRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    } as unknown as IUserRepository;

    submissionRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByProblemId: vi.fn(),
      update: vi.fn(),
      countAll: vi.fn(),
      countAllAccepted: vi.fn(),
    } as unknown as ISubmissionRepository;

    problemRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      incrementSolvedCount: vi.fn(),
      incrementAttemptCount: vi.fn(),
      countByDifficulty: vi.fn(),
      countByCategory: vi.fn(),
      countAll: vi.fn(),
    } as unknown as IProblemRepository;

    useCase = new GetAdminStats(userRepository, submissionRepository, problemRepository);
  });

  it('should compile and return correct statistics', async () => {
    vi.mocked(userRepository.count).mockResolvedValue(100);
    vi.mocked(submissionRepository.countAll).mockResolvedValue(500);
    vi.mocked(problemRepository.countAll).mockResolvedValue(50);
    vi.mocked(submissionRepository.countAllAccepted).mockResolvedValue(250);
    vi.mocked(problemRepository.countByDifficulty).mockResolvedValue({
      EASY: 20,
      MEDIUM: 20,
      HARD: 10,
    });

    const result = await useCase.execute();

    expect(userRepository.count).toHaveBeenCalled();
    expect(submissionRepository.countAll).toHaveBeenCalled();
    expect(problemRepository.countAll).toHaveBeenCalled();
    expect(submissionRepository.countAllAccepted).toHaveBeenCalled();
    expect(problemRepository.countByDifficulty).toHaveBeenCalled();

    expect(result).toEqual({
      totalUsers: 100,
      totalSubmissions: 500,
      totalProblems: 50,
      acceptanceRate: 50, // 250 / 500 * 100
      problemsByDifficulty: {
        EASY: 20,
        MEDIUM: 20,
        HARD: 10,
      },
    });
  });

  it('should handle zero submissions gracefully', async () => {
    vi.mocked(userRepository.count).mockResolvedValue(10);
    vi.mocked(submissionRepository.countAll).mockResolvedValue(0);
    vi.mocked(problemRepository.countAll).mockResolvedValue(5);
    vi.mocked(submissionRepository.countAllAccepted).mockResolvedValue(0);
    vi.mocked(problemRepository.countByDifficulty).mockResolvedValue({
      EASY: 5,
      MEDIUM: 0,
      HARD: 0,
    });

    const result = await useCase.execute();

    expect(result.acceptanceRate).toBe(0);
  });
});
