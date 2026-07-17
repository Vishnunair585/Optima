const fs = require('fs');
const path = require('path');

const srcDataDir = path.join(__dirname, '../src/lib/data');

// Helpers
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
const randBool = () => Math.random() > 0.5;
const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const oklch = () => `oklch(${randFloat(0.6, 0.9)} ${randFloat(0.1, 0.25)} ${randInt(0, 360)})`;

const categories = [
  "Mobile Development", "SEO", "User Authentication", "Content Creation", "Research",
  "Sales", "Deployment Pipeline", "Video Editing", "Startup Validation", "Marketing",
  "HR", "Game Development", "Data Analysis", "Coding"
];

let publicStacks = [];
categories.forEach(cat => {
  const numStacks = randInt(15, 20);
  for(let i=0; i<numStacks; i++) {
    const numTools = randInt(2, 6);
    const tools = [];
    for(let j=0; j<numTools; j++) {
      tools.push({
        name: `Tool ${j+1}`,
        vendor: "Vendor",
        category: "Software",
        price: "$0/mo"
      });
    }

    publicStacks.push({
      id: `stack_${cat.replace(/\s+/g, "_").toLowerCase()}_${i}`,
      title: `${cat} Master Workflow ${i + 1}`,
      description: `A highly optimized workflow for ${cat.toLowerCase()} that saves time and produces high quality results.`,
      category: cat,
      creator_id: `user_${randInt(1, 100)}`,
      creator_name: randItem(["lucas_k", "growth_hacker", "elena_r", "dev_master", "seo_guru", "marketing_pro"]),
      tools: tools,
      likes: randInt(10, 1000),
      saves: randInt(5, 500),
      created_at: new Date(Date.now() - randInt(0, 30)*86400000).toISOString(),
      updated_at: new Date().toISOString()
    });
  }
});

fs.writeFileSync(path.join(srcDataDir, 'public_stacks.json'), JSON.stringify(publicStacks, null, 2));

console.log("Successfully generated public_stacks.json!");
