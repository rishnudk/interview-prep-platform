import { Queue } from 'bullmq';
import { redis } from '../../config/redis';

// ============================================================
// BullMQ Queue Configuration
// Configured to reuse the main connection to Redis
// ============================================================

export const submissionQueue = new Queue('submission-queue', {
  connection: redis as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true, // Automatically delete completed jobs to keep memory footprint low
    removeOnFail: false, // Retain failed jobs for debugging purposes
  },
});
