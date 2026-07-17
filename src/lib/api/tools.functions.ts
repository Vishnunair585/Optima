import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "../db";
import { aiTools } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionFn } from "./auth.functions";

export const getToolsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const tools = await db.select().from(aiTools).orderBy(desc(aiTools.overall_score));
    return tools;
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
