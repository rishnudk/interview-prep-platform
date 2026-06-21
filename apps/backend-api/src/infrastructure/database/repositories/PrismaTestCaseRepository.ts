import { prisma } from '../../../config/database';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';
import type { TestCase } from '@interviewprep/shared-types';

export class PrismaTestCaseRepository implements ITestCaseRepository {
  private mapPrismaTestCase(prismaTestCase: any): TestCase {
    return {
      id: prismaTestCase.id,
      problemId: prismaTestCase.problemId,
      input: prismaTestCase.input,
      expectedOutput: prismaTestCase.expectedOutput,
      isHidden: prismaTestCase.isHidden,
      order: prismaTestCase.order,
      createdAt: prismaTestCase.createdAt,
    };
  }

  async create(data: {
    problemId: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    order?: number;
  }): Promise<TestCase> {
    const prismaTestCase = await prisma.testCase.create({
      data: {
        problemId: data.problemId,
        input: data.input,
        expectedOutput: data.expectedOutput,
        isHidden: data.isHidden,
        order: data.order ?? 0,
      },
    });

    return this.mapPrismaTestCase(prismaTestCase);
  }

  async findById(id: string): Promise<TestCase | null> {
    const prismaTestCase = await prisma.testCase.findUnique({
      where: { id },
    });

    if (!prismaTestCase) return null;
    return this.mapPrismaTestCase(prismaTestCase);
  }

  async findByProblemId(problemId: string): Promise<TestCase[]> {
    const testCases = await prisma.testCase.findMany({
      where: { problemId },
      orderBy: { order: 'asc' },
    });

    return testCases.map((tc) => this.mapPrismaTestCase(tc));
  }

  async findVisibleByProblemId(problemId: string): Promise<TestCase[]> {
    const testCases = await prisma.testCase.findMany({
      where: { problemId, isHidden: false },
      orderBy: { order: 'asc' },
    });

    return testCases.map((tc) => this.mapPrismaTestCase(tc));
  }

  async findHiddenByProblemId(problemId: string): Promise<TestCase[]> {
    const testCases = await prisma.testCase.findMany({
      where: { problemId, isHidden: true },
      orderBy: { order: 'asc' },
    });

    return testCases.map((tc) => this.mapPrismaTestCase(tc));
  }

  async update(id: string, data: Partial<TestCase>): Promise<TestCase> {
    const prismaTestCase = await prisma.testCase.update({
      where: { id },
      data: {
        input: data.input,
        expectedOutput: data.expectedOutput,
        isHidden: data.isHidden,
        order: data.order,
      },
    });

    return this.mapPrismaTestCase(prismaTestCase);
  }

  async delete(id: string): Promise<void> {
    await prisma.testCase.delete({
      where: { id },
    });
  }

  async deleteByProblemId(problemId: string): Promise<void> {
    await prisma.testCase.deleteMany({
      where: { problemId },
    });
  }
}
