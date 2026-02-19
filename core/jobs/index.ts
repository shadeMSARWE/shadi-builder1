/**
 * FERDOUS AI OS - Job Queue Core
 * Async job processing for heavy operations
 */
type JobHandler = (payload: unknown) => Promise<unknown>;

const queue: Array<{ id: string; handler: JobHandler; payload: unknown }> = [];
let processing = false;

export async function enqueue<T>(handler: JobHandler, payload: T): Promise<string> {
  const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  queue.push({ id, handler, payload });
  processQueue();
  return id;
}

async function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;
  const job = queue.shift();
  if (job) {
    try {
      await job.handler(job.payload);
    } catch (err) {
      console.error("[JobQueue] Error:", err);
    }
  }
  processing = false;
  if (queue.length > 0) processQueue();
}

export function getQueueLength(): number {
  return queue.length;
}
