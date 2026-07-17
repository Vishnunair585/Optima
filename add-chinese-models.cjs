const fs = require('fs');
const path = require('path');

const CHINESE_MODELS = [
  { name: "Kimi", vendor: "Moonshot AI", category: "Chatbots", price: "Free/Paid", color: "oklch(0.6 0.2 20)" },
  { name: "DeepSeek", vendor: "DeepSeek", category: "Coding", price: "Free/Paid", color: "oklch(0.6 0.1 230)" },
  { name: "Qwen", vendor: "Alibaba Cloud", category: "Models", price: "Open Source", color: "oklch(0.65 0.15 40)" },
  { name: "Ernie Bot", vendor: "Baidu", category: "Chatbots", price: "Free/Paid", color: "oklch(0.6 0.15 260)" },
  { name: "Doubao", vendor: "ByteDance", category: "Chatbots", price: "Free", color: "oklch(0.65 0.18 290)" }
];

function generateTool(template, index) {
  const popularity = Math.floor(Math.random() * 30) + 60;
  const growth = Math.floor(Math.random() * 40) + 55;
  const review = Math.floor(Math.random() * 20) + 75;
  const reliability = Math.floor(Math.random() * 20) + 75;
  const overall = (review * 0.4 + growth * 0.3 + popularity * 0.2 + reliability * 0.1).toFixed(1);
  const trends = ["rising", "hot", "new"];
  
  return {
    id: (index + 40).toString(),
    name: template.name,
    vendor: template.vendor,
    category: template.category,
    price: template.price,
    has_free_tier: true,
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

const newToolsStr = CHINESE_MODELS.map((t, i) => JSON.stringify(generateTool(t, i), null, 4)).join(',\n    ');

content = content.replace(
  /color: "oklch\(0\.7 0\.2 240\)"\n    }\n  \],/,
  `color: "oklch(0.7 0.2 240)"\n    },\n    ${newToolsStr}\n  ],`
);

fs.writeFileSync(existingMockDBPath, content);
console.log("Added Chinese models to MOCK_DB");
