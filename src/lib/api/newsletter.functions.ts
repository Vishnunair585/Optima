import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { newsletterSubscribers, newsletterCampaigns } from "../db/schema";
import { eq, desc, and, like } from "drizzle-orm";
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

// ─── Public: Subscribe ─────────────────────────────────

export const subscribeNewsletterFn = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), preferences: z.record(z.boolean()).optional() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    try {
      await db.insert(newsletterSubscribers).values({
        id: generateId(),
        email: data.email,
        user_id: session?.user?.id || null,
        verified: false,
        active: true,
        preferences: JSON.stringify(data.preferences || {}),
        created_at: Date.now() as any,
      });
      return { success: true };
    } catch (err: any) {
      if (err.message?.includes("UNIQUE")) return { success: true };
      throw new Error("Subscription failed");
    }
  });

// ─── Public: Unsubscribe ─────────────────────────────────

export const unsubscribeNewsletterFn = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    await db.update(newsletterSubscribers).set({ active: false }).where(eq(newsletterSubscribers.email, data.email));
    return { success: true };
  });

// ─── Public: Get published campaigns (archive) ──────────

export const getNewsletterArchiveFn = createServerFn({ method: "GET" })
  .validator(z.object({ category: z.string().optional(), search: z.string().optional(), limit: z.number().optional() }).optional())
  .handler(async ({ data: args }) => {
    let conditions: any[] = [eq(newsletterCampaigns.status, "sent")];
    if (args?.category && args.category !== "all") conditions.push(eq(newsletterCampaigns.category, args.category));
    if (args?.search) conditions.push(like(newsletterCampaigns.title, `%${args.search}%`));
    return db.select().from(newsletterCampaigns).where(and(...conditions)).orderBy(desc(newsletterCampaigns.sent_at)).limit(args?.limit || 20);
  });

// ─── Admin: Get all campaigns ───────────────────────────

export const getNewsletterCampaignsFn = createServerFn({ method: "GET" })
  .validator(z.object({ status: z.string().optional(), limit: z.number().optional() }).optional())
  .handler(async ({ data: args }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    let conditions: any[] = [];
    if (args?.status && args.status !== "all") conditions.push(eq(newsletterCampaigns.status, args.status));
    let query = db.select().from(newsletterCampaigns);
    if (conditions.length > 0) query = query.where(and(...conditions)) as any;
    return query.orderBy(desc(newsletterCampaigns.created_at)).limit(args?.limit || 50);
  });

// ─── Admin: Create campaign ──────────────────────────────

export const createNewsletterCampaignFn = createServerFn({ method: "POST" })
  .validator(z.object({
    title: z.string().min(1), subject: z.string().min(1), summary: z.string().min(1),
    content: z.string().min(1), category: z.string(), tags: z.array(z.string()).optional(),
    status: z.string().optional(), cover_image: z.string().optional(), read_time: z.number().optional(),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    const id = generateId();
    const now = Date.now();
    await db.insert(newsletterCampaigns).values({
      id, title: data.title, subject: data.subject, summary: data.summary,
      content: data.content, category: data.category,
      tags: JSON.stringify(data.tags || []), status: data.status || "draft",
      author_id: session.user.id, cover_image: data.cover_image || null,
      read_time: data.read_time || 3, created_at: now as any, updated_at: now as any,
    });
    return { success: true, id };
  });

// ─── Admin: Get subscriber stats ─────────────────────────

export const getNewsletterStatsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    const subs = await db.select().from(newsletterSubscribers);
    const campaigns = await db.select().from(newsletterCampaigns);
    return {
      totalSubscribers: subs.length,
      activeSubscribers: subs.filter(s => s.active).length,
      totalCampaigns: campaigns.length,
      sentCampaigns: campaigns.filter(c => c.status === "sent").length,
    };
  });
