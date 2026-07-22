import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "../db";
import { aiTools } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionFn } from "./auth.functions";

import { AI_TOOLS } from "../data/tools";

export const getToolsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const tools = await db.select().from(aiTools).orderBy(desc(aiTools.overall_score));
      if (!tools || tools.length === 0) throw new Error("Empty DB fallback");
      return tools;
    } catch (err) {
      // Fallback to mock data on Cloudflare where better-sqlite3 crashes
      return AI_TOOLS.map(t => ({
        id: t.name,
        name: t.name,
        vendor: t.vendor,
        category: t.category,
        price: t.price,
        overall_score: t.score,
        has_free_tier: t.price.toLowerCase().includes("free"),
        popularity_score: t.score,
        growth_score: t.score,
        review_score: t.score,
        reliability_score: t.score,
        trend_indicator: "stable",
        website_url: t.url || "",
        color: t.color || ""
      }));
    }
  });

export const addToolFn = createServerFn({ method: "POST" })
  .validator(z.object({
    name: z.string(),
    vendor: z.string(),
    category: z.string(),
    price: z.string(),
    has_free_tier: z.boolean(),
    popularity_score: z.number(),
    growth_score: z.number(),
    review_score: z.number(),
    reliability_score: z.number(),
    trend_indicator: z.string(),
    color: z.string(),
    website_url: z.string().optional(),
    last_verified_at: z.string()
  }))
  .handler(async ({ data }) => {
    const id = crypto.randomUUID();
    const overall = (
      (data.review_score * 0.40) +
      (data.growth_score * 0.30) +
      (data.popularity_score * 0.20) +
      (data.reliability_score * 0.10)
    );
    await db.insert(aiTools).values({
      id,
      ...data,
      overall_score: overall,
    });
    return { success: true, id };
  });

export const deleteToolFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await db.delete(aiTools).where(eq(aiTools.id, data.id));
    return { success: true };
  });
