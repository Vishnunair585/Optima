import { getDb } from '../../lib/db/connection';
import { crawlerJobs, intelligenceSources } from '../../lib/db/schema';
import { eq, and, lt } from 'drizzle-orm';
import { SourceManager, IntelligenceSource } from './SourceManager';
import { RSSConnector } from './connectors/RSSConnector';
import { GitHubConnector } from './connectors/GitHubConnector';
import { Pipeline } from './Pipeline';

export class DataCollector {
  
  static async processDueJobs() {
    console.log('[DataCollector] Checking for due crawler jobs...');
    
    // Find pending jobs that are due
    const now = new Date();
    const jobs = await getDb().select().from(crawlerJobs)
      .where(and(eq(crawlerJobs.status, 'pending'), lt(crawlerJobs.next_run_at, now)))
      .limit(5); // Process in batches

    if (jobs.length === 0) {
      return;
    }

    console.log(`[DataCollector] Found ${jobs.length} due jobs.`);

    for (const job of jobs) {
      try {
        // Mark as running
        await getDb().update(crawlerJobs).set({ status: 'running', updated_at: new Date() }).where(eq(crawlerJobs.id, job.id));

        // Fetch source info
        const sourceData = await getDb().select().from(intelligenceSources).where(eq(intelligenceSources.id, job.source_id)).limit(1);
        if (sourceData.length === 0) continue;
        const source = sourceData[0];

        let rawData: any[] = [];

        // Connectors
        if (source.type === 'rss') {
          rawData = await RSSConnector.fetch(source.url);
        } else if (source.type === 'github') {
          rawData = await GitHubConnector.fetch(source.url);
        }

        // Pass to pipeline
        if (rawData.length > 0) {
           await Pipeline.processBatch(rawData, source.url);
        }

        // Mark as completed and schedule next run
        const nextRun = new Date(Date.now() + source.frequency_minutes * 60000);
        await getDb().update(crawlerJobs).set({ 
          status: 'pending', 
          next_run_at: nextRun,
          updated_at: new Date() 
        }).where(eq(crawlerJobs.id, job.id));
        
        await getDb().update(intelligenceSources).set({ last_run_at: new Date() }).where(eq(intelligenceSources.id, source.id));

      } catch (error) {
        console.error(`[DataCollector] Job ${job.id} failed:`, error);
        
        // Handle failure
        await getDb().update(crawlerJobs).set({ 
          status: 'failed', 
          retry_count: job.retry_count + 1,
          logs: String(error),
          updated_at: new Date()
        }).where(eq(crawlerJobs.id, job.id));

        await SourceManager.logSourceError(job.source_id);
      }
    }
  }
}
