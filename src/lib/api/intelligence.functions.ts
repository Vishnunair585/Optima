import { createServerFn } from '@tanstack/react-start';
import { getDb } from '../db/connection';
import { intelligenceApprovalQueue, contentArticles } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const getApprovalQueueFn = createServerFn({ method: 'GET' }).handler(async () => {
  const db = getDb();
  const queue = await db.select().from(intelligenceApprovalQueue).where(eq(intelligenceApprovalQueue.status, 'pending'));
  return queue;
});

export const approveQueueItemFn = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const db = getDb();
    const itemQuery = await db.select().from(intelligenceApprovalQueue).where(eq(intelligenceApprovalQueue.id, data.id)).limit(1);
    
    if (itemQuery.length === 0) throw new Error('Item not found');
    const item = itemQuery[0];
    
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(item.data);
    } catch (e) {}

    // Insert into contentArticles
    const articleId = uuidv4();
    await db.insert(contentArticles).values({
      id: articleId,
      type: 'news',
      title: item.title,
      slug: (item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + articleId.substring(0, 5)).replace(/^-+|-+$/g, ''),
      summary: parsedData.summary || '',
      content: parsedData.what_happened || '',
      category: parsedData.category || 'AI News',
      tags: JSON.stringify([parsedData.category || 'AI News']),
      status: 'published',
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });

    // Mark as approved
    await db.update(intelligenceApprovalQueue).set({ status: 'approved', updated_at: new Date() }).where(eq(intelligenceApprovalQueue.id, data.id));
    return { success: true };
  });

export const rejectQueueItemFn = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const db = getDb();
    await db.update(intelligenceApprovalQueue).set({ status: 'rejected', updated_at: new Date() }).where(eq(intelligenceApprovalQueue.id, data.id));
    return { success: true };
  });
