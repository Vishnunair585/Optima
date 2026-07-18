import { db } from "./src/lib/db";
import { helpArticles } from "./src/lib/db/schema";
import { randomUUID } from "crypto";

async function main() {
  const articles = [
    {
      id: randomUUID(),
      title: "How to export your data from Optima",
      slug: "how-to-export-data",
      summary: "Learn how to instantly download a complete JSON archive of your account data.",
      content: "You can easily export your data by navigating to Settings > Data & Privacy > Export Data. This provides you with a downloadable JSON file containing your usage, preferences, and saved stacks.",
      category: "account",
      status: "published",
    },
    {
      id: randomUUID(),
      title: "Understanding Optima AI Rankings",
      slug: "understanding-ai-rankings",
      summary: "A deep dive into how our proprietary algorithm ranks AI tools.",
      content: "Optima's AI rankings are determined by a combination of performance benchmarks, real user reviews, pricing comparisons, and feature completeness. The engine updates daily.",
      category: "rankings",
      status: "published",
    },
    {
      id: randomUUID(),
      title: "How to use the AI Finder effectively",
      slug: "how-to-use-ai-finder",
      summary: "Tips for getting the best tool recommendations from the AI Finder.",
      content: "The AI Finder takes your role, goal, budget, and experience level to curate a personalized stack. Be as specific as possible with your budget for optimal results.",
      category: "search",
      status: "published",
    }
  ];

  for (const article of articles) {
    await db.insert(helpArticles).values(article).onConflictDoNothing();
  }

  console.log("Successfully seeded help articles!");
  process.exit(0);
}

main().catch(console.error);
