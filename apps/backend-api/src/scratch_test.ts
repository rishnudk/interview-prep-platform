import { container } from './container';
import { prisma } from './config/database';
import { redis } from './config/redis';

async function test() {
  try {
    console.log('Running test...');
    const result = await container.useCases.getProblems.execute({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    console.log('Result:', result);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
    redis.disconnect();
  }
}

test();
