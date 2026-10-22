import { getDb } from '../../lib/db/connection';
import { intelligenceApprovalQueue, contentArticles } from '../../lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq, or } from 'drizzle-orm';

export class Pipeline {
  
  static async processBatch(rawData: any[], sourceUrl: string) {
    console.log(`[Pipeline] Processing ${rawData.length} items from ${sourceUrl}`);
    
    for (const item of rawData) {
      // 1. Deduplication
      const isDuplicate = await this.checkDeduplication(item);
      if (isDuplicate) continue;

      // 2. Classification & Metadata
      const categorized = await this.classifyData(item);
      
      // 3. Summarization
      const summarized = await this.summarizeData(categorized);

      // 4. Send to Moderation Queue
      await getDb().insert(intelligenceApprovalQueue).values({
        id: uuidv4(),
        type: 'news',
        title: summarized.title || 'Untitled',
        data: JSON.stringify(summarized),
        source_url: summarized.url || sourceUrl,
        status: 'pending',
        confidence_score: summarized.confidence || 80,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
  }

  private static async checkDeduplication(item: any): Promise<boolean> {
    const db = getDb();
    
    // Check approval queue
    if (item.url) {
      const inQueue = await db.select().from(intelligenceApprovalQueue)
        .where(eq(intelligenceApprovalQueue.source_url, item.url)).limit(1);
      if (inQueue.length > 0) return true;
    }

    // Check published articles
    if (item.url) {
       // Since contentArticles doesn't have source_url, we might need to check the title instead, or metadata if we added it
       // For now, check title as a fallback
       const existingTitle = await db.select().from(contentArticles)
        .where(eq(contentArticles.title, item.title)).limit(1);
       if (existingTitle.length > 0) return true;
    }

    return false;
  }

  private static async classifyData(item: any): Promise<any> {
    let category = 'AI News';
    const text = (item.title + ' ' + item.description).toLowerCase();
    
    if (text.includes('model') || text.includes('gpt') || text.includes('claude') || text.includes('gemini')) {
      category = 'AI Models';
    } else if (text.includes('tool') || text.includes('platform') || text.includes('app')) {
      category = 'AI Tools';
    } else if (text.includes('agent')) {
      category = 'AI Agents';
    } else if (text.includes('research') || text.includes('paper')) {
      category = 'AI Research';
    }

    return { ...item, category, relevance_score: 85, importance_score: 70 };
  }

  private static async summarizeData(item: any): Promise<any> {
    // In a real scenario, call an LLM API here. For now, format cleanly.
    return { 
      ...item, 
      summary: item.description || 'Auto-generated summary.',
      what_happened: item.description || '',
      why_it_matters: 'This represents a recent development in the AI ecosystem.',
      confidence: 85
    };
  }
}

