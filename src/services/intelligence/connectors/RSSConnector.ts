import Parser from 'rss-parser';

export class RSSConnector {
  static async fetch(url: string): Promise<any[]> {
    console.log(`[RSSConnector] Fetching feed from ${url}`);
    
    try {
      const parser = new Parser();
      const feed = await parser.parseURL(url);
      
      return feed.items.map(item => ({
        title: item.title || 'Untitled',
        description: item.contentSnippet || item.content || item.summary || '',
        url: item.link || url,
        published_date: item.pubDate ? new Date(item.pubDate) : new Date(),
        author: item.creator || item.author || ''
      }));
    } catch (error) {
      console.error(`[RSSConnector] Error fetching feed from ${url}:`, error);
      return [];
    }
  }
}

