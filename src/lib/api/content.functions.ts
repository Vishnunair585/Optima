import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { contentArticles, contentComments } from "../db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import { z } from "zod";

const generateId = () => crypto.randomUUID();

async function getSession() {
  const { getCurrentSession } = await import("../../server/auth/session.server");
  return getCurrentSession();
}

async function checkAdmin(userId: string): Promise<boolean> {
  const { isAdmin } = await import("../security/authz");
  return isAdmin(userId);
}

// ─── Public: Get Articles ────────────────────────────────

export const getContentArticlesFn = createServerFn({ method: "GET" })
  .validator(z.object({
    type: z.enum(["blog", "doc", "tutorial"]).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    limit: z.number().optional(),
  }).optional())
  .handler(async ({ data: args }) => {
    let conditions: any[] = [eq(contentArticles.status, "published")];
    if (args?.type) conditions.push(eq(contentArticles.type, args.type));
    if (args?.category && args.category !== "all") conditions.push(eq(contentArticles.category, args.category));
    if (args?.search) {
      conditions.push(or(
        like(contentArticles.title, `%${args.search}%`),
        like(contentArticles.summary, `%${args.search}%`)
      ));
    }
    return db.select().from(contentArticles)
      .where(and(...conditions))
      .orderBy(desc(contentArticles.published_at))
      .limit(args?.limit || 50);
  });

// ─── Public: Get Article by Slug ─────────────────────────

export const getContentArticleBySlugFn = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string(), type: z.string().optional() }))
  .handler(async ({ data }) => {
    let conditions: any[] = [eq(contentArticles.slug, data.slug)];
    if (data.type) conditions.push(eq(contentArticles.type, data.type));
    const article = await db.select().from(contentArticles).where(and(...conditions)).get();
    
    if (!article || article.status !== "published") throw new Error("Article not found");
    
    // Increment views
    await db.update(contentArticles).set({ views_count: article.views_count + 1 }).where(eq(contentArticles.id, article.id));
    return article;
  });

// ─── Public: Get Categories ──────────────────────────────

export const getContentCategoriesFn = createServerFn({ method: "GET" })
  .validator(z.object({ type: z.string().optional() }).optional())
  .handler(async ({ data: args }) => {
    let conditions: any[] = [eq(contentArticles.status, "published")];
    if (args?.type) conditions.push(eq(contentArticles.type, args.type));
    
    const articles = await db.select().from(contentArticles).where(and(...conditions));
    const categoryMap: Record<string, number> = {};
    articles.forEach(a => { categoryMap[a.category] = (categoryMap[a.category] || 0) + 1; });
    
    return Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

// ─── Admin: Get all articles (including drafts) ──────────

export const getAdminContentArticlesFn = createServerFn({ method: "GET" })
  .validator(z.object({ type: z.string().optional() }).optional())
  .handler(async ({ data: args }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    
    let conditions: any[] = [];
    if (args?.type && args.type !== "all") conditions.push(eq(contentArticles.type, args.type));
    
    let query = db.select().from(contentArticles);
    if (conditions.length > 0) query = query.where(and(...conditions)) as any;
    
    return query.orderBy(desc(contentArticles.updated_at)).limit(100);
  });

// ─── Admin: Create Article ───────────────────────────────

export const createContentArticleFn = createServerFn({ method: "POST" })
  .validator(z.object({
    type: z.enum(["blog", "doc", "tutorial"]),
    title: z.string().min(1),
    slug: z.string().min(1),
    summary: z.string().min(1),
    content: z.string().min(1),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    cover_image: z.string().optional(),
    read_time: z.number().optional(),
    difficulty: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    
    const id = generateId();
    const now = Date.now();
    
    await db.insert(contentArticles).values({
      id,
      type: data.type,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      category: data.category,
      tags: JSON.stringify(data.tags || []),
      status: data.status || "draft",
      author_id: session.user.id,
      cover_image: data.cover_image || null,
      read_time: data.read_time || 5,
      difficulty: data.difficulty || null,
      published_at: data.status === "published" ? (now as any) : null,
      created_at: now as any,
      updated_at: now as any,
    });
    
    return { success: true, id };
  });

// ─── Admin: Update Article ───────────────────────────────

export const updateContentArticleFn = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    title: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    tags: z.array(z.string()).optional(),
    cover_image: z.string().optional(),
    read_time: z.number().optional(),
    difficulty: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    
    const article = await db.select().from(contentArticles).where(eq(contentArticles.id, data.id)).get();
    if (!article) throw new Error("Article not found");
    
    const updateData: any = { updated_at: Date.now() };
    if (data.title) updateData.title = data.title;
    if (data.summary) updateData.summary = data.summary;
    if (data.content) updateData.content = data.content;
    if (data.category) updateData.category = data.category;
    if (data.status) {
      updateData.status = data.status;
      if (data.status === "published" && article.status !== "published") {
        updateData.published_at = Date.now();
      }
    }
    if (data.tags) updateData.tags = JSON.stringify(data.tags);
    if (data.cover_image !== undefined) updateData.cover_image = data.cover_image;
    if (data.read_time) updateData.read_time = data.read_time;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    
    await db.update(contentArticles).set(updateData).where(eq(contentArticles.id, data.id));
    return { success: true };
  });

// ─── Admin: Delete Article ───────────────────────────────

export const deleteContentArticleFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    
    await db.delete(contentArticles).where(eq(contentArticles.id, data.id));
    return { success: true };
  });
