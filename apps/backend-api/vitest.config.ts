import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Disable parallel execution of test files because integration tests share the same database
    fileParallelism: false,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
