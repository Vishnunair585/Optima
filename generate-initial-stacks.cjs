const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  "Content Creation", "Coding", "Web Development", "Mobile Development", "Game Development",
  "Marketing", "SEO", "Social Media", "Sales", "Customer Support", "Research", "Education",
  "Prompt Engineering", "Automation", "Data Analysis", "Finance", "Legal", "HR", "Graphic Design",
  "Video Editing", "Startup Validation", "AI Agents", "Productivity", "Building a Complete App", "Setting up OAuth", "Database Design", "Deployment Pipeline", "Landing Page Copywriting", "User Authentication", "API Integration"
];

const TOOLS = [
  "ChatGPT", "Claude", "Cursor", "Midjourney", "Lovable", "v0", "Notion AI", "GitHub Copilot",
  "Perplexity", "ElevenLabs", "Runway", "Zapier", "Make", "n8n", "Supabase", "Vercel"
];

const CREATORS = ["alex_m", "sara_j", "lucas_k", "elena_r", "dev_alice", "growth_hacker", "content_designer"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStacks(count) {
  const stacks = [];
  for (let i = 1; i <= count; i++) {
    const category = randomChoice(CATEGORIES);
    const numTools = Math.floor(Math.random() * 4) + 1; // 1 to 4 tools
    const toolsUsed = [];
    for (let j = 0; j < numTools; j++) {
      let t = randomChoice(TOOLS);
      if (!toolsUsed.includes(t)) toolsUsed.push(t);
    }
    
    stacks.push({
      id: `stack_${i}`,
      title: `${category} Master Workflow ${i}`,
      creator: randomChoice(CREATORS),
      category: category,
      description: `A highly optimized workflow for ${category.toLowerCase()} that saves time and produces high-quality results.`,
      problem_solved: `Automates tedious ${category.toLowerCase()} tasks.`,
      estimated_time_saved: `${Math.floor(Math.random() * 15) + 2} hours/week`,
      difficulty: randomChoice(DIFFICULTIES),
      cost_estimate: `$${Math.floor(Math.random() * 50)}/month`,
      tools: toolsUsed,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
      views: Math.floor(Math.random() * 10000),
      saves: Math.floor(Math.random() * 1000),
      forks: Math.floor(Math.random() * 500),
      confidence_score: Math.floor(Math.random() * 20) + 80, // 80 to 100
      status: "published",
      updated_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
    });
  }
  return stacks;
}

console.log("Generating 500 public AI stacks...");
const stacks = generateStacks(500);

const outputPath = path.join(__dirname, 'src', 'lib', 'data', 'public_stacks.json');
fs.writeFileSync(outputPath, JSON.stringify(stacks, null, 2));

console.log(`Successfully generated 500 stacks at ${outputPath}`);
