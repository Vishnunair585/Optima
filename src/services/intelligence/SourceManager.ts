import { getDb } from '../../lib/db/connection';
import { intelligenceSources } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export interface IntelligenceSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'api' | 'github' | 'html';
  isActive: boolean;
  frequencyMinutes: number;
}

export class SourceManager {
  static async getActiveSources(): Promise<IntelligenceSource[]> {
    const sources = await getDb().select().from(intelligenceSources).where(eq(intelligenceSources.is_active, true));
    return sources.map(s => ({
      id: s.id,
      name: s.name,
      url: s.url,
      type: s.type as any,
      isActive: s.is_active,
      frequencyMinutes: s.frequency_minutes
    }));
  }

  static async logSourceError(sourceId: string) {
    // Increment error count
    console.error(`[SourceManager] Error logged for source ${sourceId}`);
  }
}
