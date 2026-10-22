import { createServerFn } from '@tanstack/react-start';
import { getDb } from '../db/connection';
import { contentArticles } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const getNewsArticlesFn = createServerFn({ method: 'GET' }).handler(async () => {
  const db = getDb();
  const news = await db
    .select()
    .from(contentArticles)
    .where(eq(contentArticles.type, 'news'))
    .orderBy(desc(contentArticles.published_at))
    .limit(50);
  return news;
});
