import { DataCollector } from './DataCollector';

export class Scheduler {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;

  start(intervalMs: number = 60000) { // Default every minute
    console.log(`[Scheduler] Starting Intelligence Scheduler with interval ${intervalMs}ms`);
    
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = setInterval(async () => {
      if (this.isRunning) {
        console.log('[Scheduler] Skip run, previous job is still executing.');
        return;
      }
      
      try {
        this.isRunning = true;
        await DataCollector.processDueJobs();
      } catch (err) {
        console.error('[Scheduler] Error in run loop:', err);
      } finally {
        this.isRunning = false;
      }
    }, intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log('[Scheduler] Stopped.');
  }
}

// Export a singleton instance
export const intelligenceScheduler = new Scheduler();
