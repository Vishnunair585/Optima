import { intelligenceScheduler } from './intelligence/Scheduler';

export async function runMarketIntelligenceWorker() {
  console.log('[MarketIntelligenceWorker] Replacing old mock worker with real Intelligence Pipeline...');
  intelligenceScheduler.start(60000 * 5); // Run every 5 minutes
}
