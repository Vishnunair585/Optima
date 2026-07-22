import { db } from "../src/lib/db/connection";
import { aiTools } from "../src/lib/db/schema";
import { AI_TOOLS } from "../src/lib/data/tools";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding AI Tools to database...");
  for (const t of AI_TOOLS) {
    const existing = await db.select().from(aiTools).where(eq(aiTools.name, t.name));
    if (existing.length === 0) {
      await db.insert(aiTools).values({
        id: crypto.randomUUID(),
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
        website_url: t.website_url || "",
        color: t.color || ""
      });
    }
  }
  console.log("Done seeding AI tools!");
}

seed().catch(console.error);
