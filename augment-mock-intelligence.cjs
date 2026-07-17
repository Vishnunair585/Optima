const fs = require('fs');
const path = require('path');

const NEW_TOOLS = [
  { name: "Perplexity", vendor: "Perplexity AI", category: "Search", price: "$20/mo", color: "oklch(0.65 0.15 250)" },
  { name: "GitHub Copilot", vendor: "GitHub", category: "Coding", price: "$10/mo", color: "oklch(0.5 0.1 270)" },
  { name: "Notion AI", vendor: "Notion", category: "Productivity", price: "$10/mo", color: "oklch(0.8 0.05 100)" },
  { name: "Runway Gen-2", vendor: "RunwayML", category: "Video Generation", price: "$15/mo", color: "oklch(0.7 0.18 300)" },
  { name: "ElevenLabs", vendor: "ElevenLabs", category: "Voice Generation", price: "$5/mo", color: "oklch(0.75 0.12 40)" },
  { name: "Gemini Advanced", vendor: "Google", category: "Chatbots", price: "$20/mo", color: "oklch(0.65 0.2 240)" },
  { name: "Suno", vendor: "Suno AI", category: "Music Generation", price: "$10/mo", color: "oklch(0.8 0.15 80)" },
  { name: "Mistral", vendor: "Mistral AI", category: "Chatbots", price: "Free/API", color: "oklch(0.7 0.15 35)" },
  { name: "Canva Magic Studio", vendor: "Canva", category: "Graphic Design", price: "$15/mo", color: "oklch(0.6 0.18 280)" },
  { name: "v0", vendor: "Vercel", category: "App Builders", price: "$20/mo", color: "oklch(0.5 0.1 270)" },
  { name: "Poe", vendor: "Quora", category: "Chatbots", price: "$20/mo", color: "oklch(0.7 0.15 290)" },
  { name: "Synthesia", vendor: "Synthesia", category: "Video Generation", price: "$30/mo", color: "oklch(0.65 0.18 310)" },
  { name: "Gamma", vendor: "Gamma App", category: "Presentations", price: "$16/mo", color: "oklch(0.7 0.18 330)" },
  { name: "Glean", vendor: "Glean", category: "Enterprise Search", price: "Custom", color: "oklch(0.65 0.15 250)" },
  { name: "Codeium", vendor: "Codeium", category: "Coding", price: "Free/$15/mo", color: "oklch(0.6 0.2 160)" },
  { name: "Tabnine", vendor: "Tabnine", category: "Coding", price: "$12/mo", color: "oklch(0.65 0.18 210)" },
  { name: "Framer AI", vendor: "Framer", category: "App Builders", price: "$15/mo", color: "oklch(0.75 0.1 270)" },
  { name: "Copy.ai", vendor: "Copy.ai", category: "Writing", price: "$49/mo", color: "oklch(0.8 0.15 40)" },
  { name: "Jasper", vendor: "Jasper", category: "Writing", price: "$39/mo", color: "oklch(0.6 0.18 290)" },
  { name: "Leonardo AI", vendor: "Leonardo.ai", category: "Image Generation", price: "$12/mo", color: "oklch(0.7 0.15 320)" },
  { name: "HeyGen", vendor: "HeyGen", category: "Video Generation", price: "$29/mo", color: "oklch(0.65 0.18 260)" },
  { name: "Fireflies.ai", vendor: "Fireflies", category: "Meeting Assistants", price: "$18/mo", color: "oklch(0.75 0.15 30)" },
  { name: "Otter.ai", vendor: "Otter", category: "Meeting Assistants", price: "$16.99/mo", color: "oklch(0.7 0.1 250)" },
  { name: "Phind", vendor: "Phind", category: "Search", price: "Free/$20/mo", color: "oklch(0.65 0.1 240)" },
  { name: "Replika", vendor: "Luka", category: "Companions", price: "$19.99/mo", color: "oklch(0.8 0.12 340)" },
  { name: "Character.ai", vendor: "Character.ai", category: "Companions", price: "$9.99/mo", color: "oklch(0.7 0.1 280)" },
  { name: "You.com", vendor: "SuSea", category: "Search", price: "$15/mo", color: "oklch(0.7 0.15 220)" },
  { name: "Descript", vendor: "Descript", category: "Video Editing", price: "$15/mo", color: "oklch(0.6 0.1 270)" },
  { name: "Murf AI", vendor: "Murf", category: "Voice Generation", price: "$29/mo", color: "oklch(0.65 0.18 310)" },
  { name: "Llama 3", vendor: "Meta", category: "Models", price: "Open Source", color: "oklch(0.7 0.2 240)" }
];

function generateTool(template, index) {
  const popularity = Math.floor(Math.random() * 30) + 65;
  const growth = Math.floor(Math.random() * 40) + 50;
  const review = Math.floor(Math.random() * 20) + 75;
  const reliability = Math.floor(Math.random() * 20) + 75;
  const overall = (review * 0.4 + growth * 0.3 + popularity * 0.2 + reliability * 0.1).toFixed(1);
  const trends = ["rising", "declining", "new", "hot", "stable"];
  
  return {
    id: (index + 6).toString(),
    name: template.name,
    vendor: template.vendor,
    category: template.category,
    price: template.price,
    has_free_tier: Math.random() > 0.3,
    popularity_score: popularity,
    growth_score: growth,
    review_score: review,
    reliability_score: reliability,
    overall_score: parseFloat(overall),
    trend_indicator: trends[Math.floor(Math.random() * trends.length)],
    last_verified_at: new Date().toISOString(),
    color: template.color
  };
}

const existingMockDBPath = path.join(__dirname, 'src', 'lib', 'data', 'mock-intelligence.ts');
let content = fs.readFileSync(existingMockDBPath, 'utf8');

const newToolsStr = NEW_TOOLS.map((t, i) => JSON.stringify(generateTool(t, i), null, 4)).join(',\n    ');

// We'll replace the end of the tools array
content = content.replace(
  /color: "oklch\(0\.78 0\.18 340\)"\n    }\n  \],/,
  `color: "oklch(0.78 0.18 340)"\n    },\n    ${newToolsStr}\n  ],`
);

fs.writeFileSync(existingMockDBPath, content);
console.log("Added 30 new tools to MOCK_DB");
