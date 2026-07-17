const fs = require('fs');
const path = require('path');

const srcDataDir = path.join(__dirname, '../src/lib/data');

// Helpers
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
const randBool = () => Math.random() > 0.5;
const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const oklch = () => `oklch(${randFloat(0.6, 0.9)} ${randFloat(0.1, 0.25)} ${randInt(0, 360)})`;

const prefixes = ["Neo", "Quantum", "Hyper", "Synth", "Aero", "Nexus", "Vertex", "Omni", "Core", "Pulse", "Nova", "Lumina", "Apex", "Zenith", "Aether", "Echo", "Flux", "Prism", "Vanguard", "Catalyst"];
const suffixes = ["AI", "Gen", "Flow", "Mind", "Net", "Sphere", "Grid", "Labs", "Tech", "Works", "Base", "Forge", "Engine", "Pulse", "Sync", "Hub", "Node", "Core", "Vision", "Brain"];
const vendors = ["Google", "Microsoft", "OpenAI", "Anthropic", "Meta", "Amazon", "IBM", "DeepMind", "Mistral", "Cohere", "HuggingFace", "Stability AI", "Runway", "Midjourney", "ElevenLabs", "Scale AI", "C3.ai", "Databricks", "Snowflake", "Palantir"];
const generateName = () => randItem(prefixes) + (randBool() ? "" : " ") + randItem(suffixes) + (randBool() ? ` ${randInt(2, 9)}` : "");
const generateUrl = (name) => "https://" + name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
const generateVendor = () => randBool() ? randItem(vendors) : randItem(prefixes) + " " + randItem(["Corp", "Inc", "Labs", "Technologies", "Systems"]);
const generatePrice = () => {
    const type = randInt(0, 3);
    if (type === 0) return "Free";
    if (type === 1) return `Freemium / $${randInt(1, 5) * 5}/mo`;
    if (type === 2) return `$${randInt(2, 20) * 5}/mo`;
    return "Enterprise";
};

// 1. mock-intelligence.ts
const miCategories = [
  "Chatbots & Companions", "Coding & Development", "Enterprise Search", "Productivity & Workflows",
  "Video Generation", "Image Generation", "Music & Audio", "Meeting Assistants", "Graphic Design",
  "Voice Generation", "App & Website Builders", "Legal Tech", "Healthcare", "Finance & Accounting",
  "HR & Recruiting", "Sales & CRM", "Content Marketing"
];

let miTools = [];
let toolIdCounter = 1;
miCategories.forEach(cat => {
  const numTools = randInt(15, 20);
  for(let i=0; i<numTools; i++) {
    const name = generateName();
    miTools.push({
      id: String(toolIdCounter++),
      name: name,
      vendor: generateVendor(),
      category: cat,
      price: generatePrice(),
      has_free_tier: randBool(),
      popularity_score: randInt(60, 99),
      growth_score: randInt(50, 99),
      review_score: randInt(60, 99),
      reliability_score: randInt(70, 99),
      overall_score: parseFloat(randFloat(60, 99)),
      trend_indicator: randItem(["hot", "rising", "stable", "declining", "new"]),
      last_verified_at: new Date(Date.now() - randInt(0, 30)*86400000).toISOString(),
      color: oklch(),
      url: generateUrl(name)
    });
  }
});

const mockIntFile = `export const MOCK_DB = {
  tools: ${JSON.stringify(miTools, null, 2)}
};`;
fs.writeFileSync(path.join(srcDataDir, 'mock-intelligence.ts'), mockIntFile);

// 2. tools.ts
const toolsFile = `export const CATEGORIES = ${JSON.stringify(miCategories, null, 2)};
  
export const COMPARE_METRICS = [
  "Price",
  "Coding",
  "Reasoning",
  "Research",
  "Speed",
  "Context",
  "Ease of Use",
  "Integration",
  "Accuracy",
  "Support"
];

export const AI_TOOLS = ${JSON.stringify(miTools.map(t => ({
  name: t.name,
  category: t.category,
  score: t.overall_score,
  price: t.price,
  vendor: t.vendor,
  color: t.color,
  url: t.url
})), null, 2)};`;
fs.writeFileSync(path.join(srcDataDir, 'tools.ts'), toolsFile);

// 3. agents.ts
const agentCategories = [
  "Customer Support", "Research", "Coding", "Automation", "Sales", "Marketing",
  "Data Analysis", "Voice & Audio", "Productivity", "Finance", "Legal",
  "Healthcare", "Education", "DevOps", "Security", "Creative", "E-commerce", "HR & Recruiting"
];
let agentsList = [];
agentCategories.forEach(cat => {
  const numTools = randInt(15, 20);
  for(let i=0; i<numTools; i++) {
    const name = generateName() + (randBool() ? " Agent" : "");
    agentsList.push({
      name: name,
      cat: cat,
      desc: `A powerful AI agent designed for advanced ${cat.toLowerCase()} workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.`,
      score: randInt(70, 99),
      color: oklch(),
      vendor: generateVendor(),
      pricing: generatePrice(),
      url: generateUrl(name)
    });
  }
});

const agentsFile = `export type AgentCategory = ${agentCategories.map(c => `"${c}"`).join(" | ")};

export interface AgentEntry {
  name: string;
  cat: AgentCategory;
  desc: string;
  score: number;
  color: string;
  vendor?: string;
  pricing?: string;
  url?: string;
}

export const AGENT_CATEGORIES: AgentCategory[] = ${JSON.stringify(agentCategories, null, 2)};

export const AI_AGENTS: AgentEntry[] = ${JSON.stringify(agentsList, null, 2)};`;
fs.writeFileSync(path.join(srcDataDir, 'agents.ts'), agentsFile);

// 4. prompts.ts
const promptCategories = [
  "Coding", "Debugging", "Code Review", "Testing", "Documentation", "Architecture",
  "Research", "Academic Writing", "Literature Review", "Data Analysis", "Marketing",
  "Copywriting", "SEO", "Social Media", "Email Marketing", "Content Strategy",
  "Creative Writing", "Editing", "Business Strategy", "Sales", "Customer Support",
  "Product Management", "Project Management", "Productivity", "Brainstorming", "Personal Growth"
];
let promptsList = [];
promptCategories.forEach(cat => {
  const numTools = randInt(15, 20);
  for(let i=0; i<numTools; i++) {
    const title = `${randItem(["Advanced", "Expert", "Ultimate", "Quick", "Comprehensive", "Master", "Essential", "Pro"])} ${cat} ${randItem(["Prompt", "Template", "Workflow", "Guide", "Framework", "Blueprint", "Strategy", "Protocol"])} ${randInt(1, 99)}`;
    promptsList.push({
      title,
      cat,
      tags: [cat.toLowerCase(), randItem(["productivity", "efficiency", "optimization", "analysis", "strategy"])],
      body: `You are an expert in ${cat}. Your task is to analyze the provided information and deliver a comprehensive output that addresses the core requirements. Make sure to structure your response clearly with actionable insights. Here is the context: {context}`,
      likes: randInt(100, 5000),
      uses: randInt(500, 20000),
      author: generateVendor().toLowerCase().replace(" ", "_")
    });
  }
});
const promptsFile = `export type PromptCategory = ${promptCategories.map(c => `"${c}"`).join(" | ")};

export interface PromptEntry {
  title: string;
  cat: PromptCategory;
  tags: string[];
  body: string;
  likes: number;
  uses: number;
  author: string;
}

export const PROMPT_CATEGORIES: PromptCategory[] = ${JSON.stringify(promptCategories, null, 2)};

export const PROMPTS: PromptEntry[] = ${JSON.stringify(promptsList, null, 2)};`;
fs.writeFileSync(path.join(srcDataDir, 'prompts.ts'), promptsFile);

console.log("Successfully generated massive mock data!");
