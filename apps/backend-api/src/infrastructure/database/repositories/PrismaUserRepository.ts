import { prisma } from '../../../config/database';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { User } from '@interviewprep/shared-types';
import { UserRole } from '@interviewprep/shared-types';

// ============================================================
// PrismaUserRepository
// Concrete repository implementing User database operations
// ============================================================

export class PrismaUserRepository implements IUserRepository {
  private mapPrismaUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      role: prismaUser.role as UserRole,
      image: prismaUser.image,
      streak: prismaUser.streak,
      lastActiveAt: prismaUser.lastActiveAt,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    const prismaUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as any,
      },
    });

    return this.mapPrismaUser(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) return null;
    return this.mapPrismaUser(prismaUser);
  }

  async findByEmail(email: string): Promise<(User & { password: string | null }) | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) return null;

    return {
      ...this.mapPrismaUser(prismaUser),
      password: prismaUser.password,
    };
  }

  async findByGithubId(githubId: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { githubId },
    });

    if (!prismaUser) return null;
    return this.mapPrismaUser(prismaUser);
  }

  async updateStreak(userId: string, streak: number, lastActiveAt: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        streak,
        lastActiveAt,
      },
    });
  }
}
