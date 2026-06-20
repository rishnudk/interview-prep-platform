import { Queue } from 'bullmq';
import type { IQueueService, SubmissionJob } from '../../domain/ports/services/IQueueService';

// ============================================================
// BullMQQueueService — Concrete implementation of IQueueService
// Wires the Application Layer Queue port to BullMQ Infrastructure
// ============================================================

export class BullMQQueueService implements IQueueService {
  constructor(private readonly queue: Queue) {}

  async enqueueSubmission(job: SubmissionJob): Promise<string> {
    // Add the execution job to the queue
    const bullJob = await this.queue.add('evaluate-submission', job);

    if (!bullJob.id) {
      throw new Error('Failed to enqueue submission: Job ID is undefined');
    }

    return bullJob.id;
  }

  async getJobStatus(jobId: string): Promise<string | null> {
    const job = await this.queue.getJob(jobId);
    if (!job) {
      return null;
    }
    return job.getState();
  }
}
