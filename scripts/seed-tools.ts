import { db } from "../src/lib/db";
import { aiTools } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const CATEGORIES = [
  "Chatbots", "Image Generation", "Coding", "App Builders", "Search", 
  "Productivity", "Video Generation", "Voice Generation", "Music Generation", 
  "Graphic Design", "Presentations", "Enterprise Search", "Models", 
  "Companions", "Meeting Assistants", "Video Editing"
];

const COLORS = [
  "oklch(0.72 0.2 295)", "oklch(0.78 0.16 60)", "oklch(0.65 0.2 250)", 
  "oklch(0.85 0.15 80)", "oklch(0.78 0.18 340)", "oklch(0.5 0.1 270)", 
  "oklch(0.8 0.05 100)", "oklch(0.7 0.18 300)", "oklch(0.75 0.12 40)", 
  "oklch(0.65 0.2 240)", "oklch(0.7 0.15 35)", "oklch(0.6 0.18 280)"
];

const TRENDS = ["hot", "rising", "stable", "declining", "new"];

const toolsData = [
  { name: "Claude 3.5 Fable", vendor: "Anthropic", category: "Models", price: "Paid API" },
  { name: "Claude 3.5 Sonnet", vendor: "Anthropic", category: "Models", price: "Paid API" },
  { name: "Claude 3.5 Opus", vendor: "Anthropic", category: "Models", price: "Paid API" },
  { name: "GPT-4o", vendor: "OpenAI", category: "Models", price: "Paid API" },
  { name: "Llama 3 70B", vendor: "Meta", category: "Models", price: "Open Source" },
  { name: "ChatGLM 4", vendor: "Zhipu AI", category: "Models", price: "Open Source" },
  { name: "Kimi", vendor: "Moonshot AI", category: "Models", price: "Free/Paid" },
  { name: "Mythos", vendor: "Nous Research", category: "Models", price: "Open Source" },
  { name: "Qwen 2.5", vendor: "Alibaba", category: "Models", price: "Open Source" },
  { name: "Yi-Large", vendor: "01.AI", category: "Models", price: "Paid API" },
  { name: "Mistral Large 2", vendor: "Mistral", category: "Models", price: "Paid API" },
  { name: "Command R+", vendor: "Cohere", category: "Models", price: "Paid API" },
  
  { name: "ChatGPT", vendor: "OpenAI", category: "Chatbots", price: "$20/mo" },
  { name: "Claude Chat", vendor: "Anthropic", category: "Chatbots", price: "$20/mo" },
  { name: "Gemini Advanced", vendor: "Google", category: "Chatbots", price: "$20/mo" },
  { name: "Perplexity", vendor: "Perplexity AI", category: "Chatbots", price: "$20/mo" },
  { name: "Kimi Chat", vendor: "Moonshot AI", category: "Chatbots", price: "Free" },
  { name: "Poe", vendor: "Quora", category: "Chatbots", price: "$20/mo" },
  { name: "HuggingChat", vendor: "Hugging Face", category: "Chatbots", price: "Free" },
  { name: "Pi", vendor: "Inflection", category: "Chatbots", price: "Free" },
  { name: "Copilot", vendor: "Microsoft", category: "Chatbots", price: "Free/$20/mo" },
  { name: "YouChat", vendor: "You.com", category: "Chatbots", price: "$15/mo" },
  { name: "ChatGLM", vendor: "Zhipu AI", category: "Chatbots", price: "Free" },

  { name: "Cursor", vendor: "Anysphere", category: "Coding", price: "$20/mo" },
  { name: "GitHub Copilot", vendor: "GitHub", category: "Coding", price: "$10/mo" },
  { name: "Codeium", vendor: "Codeium", category: "Coding", price: "Free/$15/mo" },
  { name: "Tabnine", vendor: "Tabnine", category: "Coding", price: "$12/mo" },
  { name: "Devin", vendor: "Cognition", category: "Coding", price: "Custom" },
  { name: "CodeWhisperer", vendor: "Amazon", category: "Coding", price: "Free/Paid" },
  { name: "Cody", vendor: "Sourcegraph", category: "Coding", price: "$9/mo" },
  { name: "Aider", vendor: "Aider", category: "Coding", price: "Free (API costs)" },
  { name: "Replit Ghostwriter", vendor: "Replit", category: "Coding", price: "$10/mo" },
  { name: "Mutable AI", vendor: "Mutable", category: "Coding", price: "Custom" },

  { name: "Perplexity AI", vendor: "Perplexity", category: "Search", price: "$20/mo" },
  { name: "Glean", vendor: "Glean", category: "Enterprise Search", price: "Custom" },
  { name: "SearchGPT", vendor: "OpenAI", category: "Search", price: "Free" },
  { name: "Bing Copilot", vendor: "Microsoft", category: "Search", price: "Free" },
  { name: "You.com", vendor: "SuSea", category: "Search", price: "$15/mo" },
  { name: "Phind", vendor: "Phind", category: "Search", price: "Free/$20/mo" },
  { name: "Andi Search", vendor: "Andi", category: "Search", price: "Free" },
  { name: "Komo", vendor: "Komo", category: "Search", price: "Free" },
  { name: "Exa", vendor: "Exa", category: "Search", price: "Paid API" },
  { name: "Tavily", vendor: "Tavily", category: "Search", price: "Paid API" },

  { name: "Midjourney", vendor: "Midjourney", category: "Image Generation", price: "$10/mo" },
  { name: "DALL-E 3", vendor: "OpenAI", category: "Image Generation", price: "$20/mo" },
  { name: "Stable Diffusion 3", vendor: "Stability AI", category: "Image Generation", price: "Free/API" },
  { name: "Leonardo AI", vendor: "Leonardo", category: "Image Generation", price: "$12/mo" },
  { name: "Flux", vendor: "Black Forest Labs", category: "Image Generation", price: "Free/API" },
  { name: "Ideogram", vendor: "Ideogram", category: "Image Generation", price: "$8/mo" },
  { name: "Adobe Firefly", vendor: "Adobe", category: "Image Generation", price: "$5/mo" },
  { name: "Krea AI", vendor: "Krea", category: "Image Generation", price: "$10/mo" },
  { name: "Magnific AI", vendor: "Magnific", category: "Image Generation", price: "$39/mo" },
  { name: "Playground AI", vendor: "Playground", category: "Image Generation", price: "$15/mo" },

  { name: "Runway Gen-3", vendor: "RunwayML", category: "Video Generation", price: "$15/mo" },
  { name: "Sora", vendor: "OpenAI", category: "Video Generation", price: "Custom" },
  { name: "Luma Dream Machine", vendor: "Luma AI", category: "Video Generation", price: "$10/mo" },
  { name: "Kling AI", vendor: "Kuaishou", category: "Video Generation", price: "Custom" },
  { name: "Haiper", vendor: "Haiper", category: "Video Generation", price: "Free/Paid" },
  { name: "Synthesia", vendor: "Synthesia", category: "Video Generation", price: "$30/mo" },
  { name: "HeyGen", vendor: "HeyGen", category: "Video Generation", price: "$29/mo" },
  { name: "Pika Labs", vendor: "Pika", category: "Video Generation", price: "$10/mo" },
  { name: "Mochi 1", vendor: "Mochi", category: "Video Generation", price: "Free" },
  { name: "Veed AI", vendor: "Veed", category: "Video Generation", price: "$18/mo" },

  { name: "Notion AI", vendor: "Notion", category: "Productivity", price: "$10/mo" },
  { name: "Taskade", vendor: "Taskade", category: "Productivity", price: "$19/mo" },
  { name: "Motion", vendor: "Motion", category: "Productivity", price: "$19/mo" },
  { name: "Mem", vendor: "Mem", category: "Productivity", price: "$8/mo" },
  { name: "Superhuman", vendor: "Superhuman", category: "Productivity", price: "$30/mo" },
  { name: "Sana", vendor: "Sana", category: "Productivity", price: "Custom" },
  { name: "Raycast AI", vendor: "Raycast", category: "Productivity", price: "$8/mo" },
  { name: "Limitless", vendor: "Limitless", category: "Productivity", price: "$20/mo" },
  { name: "Reclaim", vendor: "Reclaim", category: "Productivity", price: "$8/mo" },
  { name: "Clockwise", vendor: "Clockwise", category: "Productivity", price: "Custom" },

  { name: "ElevenLabs", vendor: "ElevenLabs", category: "Voice Generation", price: "$5/mo" },
  { name: "Murf AI", vendor: "Murf", category: "Voice Generation", price: "$29/mo" },
  { name: "PlayHT", vendor: "PlayHT", category: "Voice Generation", price: "$39/mo" },
  { name: "Resemble AI", vendor: "Resemble", category: "Voice Generation", price: "$29/mo" },
  { name: "WellSaid", vendor: "WellSaid Labs", category: "Voice Generation", price: "$49/mo" },
  { name: "Descript Overdub", vendor: "Descript", category: "Voice Generation", price: "$15/mo" },
  { name: "Lovo", vendor: "Lovo", category: "Voice Generation", price: "$25/mo" },
  { name: "Coqui", vendor: "Coqui", category: "Voice Generation", price: "Free" },
  { name: "Voice AI", vendor: "Voice AI", category: "Voice Generation", price: "Free" },
  { name: "Suno Bark", vendor: "Suno", category: "Voice Generation", price: "Free" }
];

const prefixes = ["Auto", "Smart", "Neuro", "Synapse", "Quantum", "Hyper", "Meta", "Omni", "Core", "Nexus"];
const suffixes = ["Flow", "Gen", "Mind", "Net", "Spark", "Forge", "Grid", "Pulse", "Wave", "Sphere"];

async function runSeeder() {
  console.log("Starting AI Tools Seeder...");
  await db.delete(aiTools);
  console.log("Cleared existing tools.");
  
  const allTools = [...toolsData];
  for (const cat of CATEGORIES) {
    const existing = allTools.filter(t => t.category === cat).length;
    if (existing < 10) {
      for (let i = 0; i < (10 - existing); i++) {
        const name = prefixes[Math.floor(Math.random() * prefixes.length)] + suffixes[Math.floor(Math.random() * suffixes.length)] + " " + Math.floor(Math.random() * 10);
        allTools.push({
          name,
          vendor: prefixes[Math.floor(Math.random() * prefixes.length)] + " Inc",
          category: cat,
          price: Math.random() > 0.5 ? "Free" : "\$" + Math.floor(Math.random() * 30 + 5) + "/mo"
        });
      }
    }
  }

  for (const tool of allTools) {
    const rScore = 60 + Math.floor(Math.random() * 40);
    const pScore = 50 + Math.floor(Math.random() * 50);
    const gScore = 40 + Math.floor(Math.random() * 60);
    const relScore = 70 + Math.floor(Math.random() * 30);
    const overall = (rScore * 0.40) + (gScore * 0.30) + (pScore * 0.20) + (relScore * 0.10);

    await db.insert(aiTools).values({
      id: crypto.randomUUID(),
      name: tool.name,
      vendor: tool.vendor,
      category: tool.category,
      price: tool.price,
      has_free_tier: Math.random() > 0.3,
      review_score: rScore,
      popularity_score: pScore,
      growth_score: gScore,
      reliability_score: relScore,
      overall_score: overall,
      trend_indicator: TRENDS[Math.floor(Math.random() * TRENDS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      last_verified_at: new Date().toISOString()
    });
  }
  console.log("Successfully seeded " + allTools.length + " tools!");
}
runSeeder().catch(console.error);
