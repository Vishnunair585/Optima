export type AgentCategory = "Customer Support" | "Research" | "Coding" | "Automation" | "Sales" | "Marketing" | "Data Analysis" | "Voice & Audio" | "Productivity" | "Finance" | "Legal" | "Healthcare" | "Education" | "DevOps" | "Security" | "Creative" | "E-commerce" | "HR & Recruiting";

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

export const AGENT_CATEGORIES: AgentCategory[] = [
  "Customer Support",
  "Research",
  "Coding",
  "Automation",
  "Sales",
  "Marketing",
  "Data Analysis",
  "Voice & Audio",
  "Productivity",
  "Finance",
  "Legal",
  "Healthcare",
  "Education",
  "DevOps",
  "Security",
  "Creative",
  "E-commerce",
  "HR & Recruiting"
];

export const AI_AGENTS: AgentEntry[] = [
  {
    "name": "LuminaNet 7 Agent",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.9 0.2 75)",
    "vendor": "Core Systems",
    "pricing": "Enterprise",
    "url": "https://luminanet7agent.com"
  },
  {
    "name": "Apex Sphere",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.8 0.2 252)",
    "vendor": "OpenAI",
    "pricing": "Enterprise",
    "url": "https://apexsphere.com"
  },
  {
    "name": "PrismTech",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.7 0.2 342)",
    "vendor": "HuggingFace",
    "pricing": "Free",
    "url": "https://prismtech.com"
  },
  {
    "name": "Echo Mind 2",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 83,
    "color": "oklch(0.7 0.1 87)",
    "vendor": "Catalyst Labs",
    "pricing": "Free",
    "url": "https://echomind2.com"
  },
  {
    "name": "NovaBrain 3 Agent",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.7 0.2 136)",
    "vendor": "Nexus Corp",
    "pricing": "Enterprise",
    "url": "https://novabrain3agent.com"
  },
  {
    "name": "AetherForge Agent",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.7 0.1 18)",
    "vendor": "Quantum Inc",
    "pricing": "Freemium / $15/mo",
    "url": "https://aetherforgeagent.com"
  },
  {
    "name": "EchoPulse Agent",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.7 0.2 284)",
    "vendor": "Quantum Systems",
    "pricing": "Freemium / $5/mo",
    "url": "https://echopulseagent.com"
  },
  {
    "name": "AetherTech",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.7 0.2 73)",
    "vendor": "IBM",
    "pricing": "Freemium / $15/mo",
    "url": "https://aethertech.com"
  },
  {
    "name": "NovaBase 9 Agent",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 77,
    "color": "oklch(0.8 0.1 119)",
    "vendor": "Nexus Corp",
    "pricing": "Enterprise",
    "url": "https://novabase9agent.com"
  },
  {
    "name": "LuminaBrain Agent",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 87,
    "color": "oklch(0.7 0.1 36)",
    "vendor": "Anthropic",
    "pricing": "Freemium / $15/mo",
    "url": "https://luminabrainagent.com"
  },
  {
    "name": "VertexFlow",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.7 0.2 33)",
    "vendor": "Cohere",
    "pricing": "Free",
    "url": "https://vertexflow.com"
  },
  {
    "name": "Core Grid",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.7 0.2 39)",
    "vendor": "Prism Corp",
    "pricing": "Freemium / $15/mo",
    "url": "https://coregrid.com"
  },
  {
    "name": "Vanguard AI 3 Agent",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.7 0.2 257)",
    "vendor": "Vertex Technologies",
    "pricing": "$25/mo",
    "url": "https://vanguardai3agent.com"
  },
  {
    "name": "ZenithEngine",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.6 0.2 159)",
    "vendor": "Synth Systems",
    "pricing": "Enterprise",
    "url": "https://zenithengine.com"
  },
  {
    "name": "Prism Node",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.8 0.2 263)",
    "vendor": "Midjourney",
    "pricing": "Freemium / $5/mo",
    "url": "https://prismnode.com"
  },
  {
    "name": "AetherCore",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.7 0.1 344)",
    "vendor": "Cohere",
    "pricing": "$90/mo",
    "url": "https://aethercore.com"
  },
  {
    "name": "Nexus Pulse 8 Agent",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.9 0.2 343)",
    "vendor": "Nova Labs",
    "pricing": "Enterprise",
    "url": "https://nexuspulse8agent.com"
  },
  {
    "name": "OmniSync 7",
    "cat": "Customer Support",
    "desc": "A powerful AI agent designed for advanced customer support workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.9 0.1 213)",
    "vendor": "Google",
    "pricing": "$40/mo",
    "url": "https://omnisync7.com"
  },
  {
    "name": "CorePulse",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.8 0.2 325)",
    "vendor": "Palantir",
    "pricing": "$40/mo",
    "url": "https://corepulse.com"
  },
  {
    "name": "Nexus Pulse Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.9 0.2 32)",
    "vendor": "Apex Corp",
    "pricing": "Free",
    "url": "https://nexuspulseagent.com"
  },
  {
    "name": "Aero Sphere",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 85,
    "color": "oklch(0.6 0.2 122)",
    "vendor": "Cohere",
    "pricing": "Enterprise",
    "url": "https://aerosphere.com"
  },
  {
    "name": "ApexCore Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.7 0.2 2)",
    "vendor": "Runway",
    "pricing": "$10/mo",
    "url": "https://apexcoreagent.com"
  },
  {
    "name": "Omni Sphere Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.8 0.2 245)",
    "vendor": "Aether Systems",
    "pricing": "Freemium / $20/mo",
    "url": "https://omnisphereagent.com"
  },
  {
    "name": "Flux Pulse 4 Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.8 0.2 100)",
    "vendor": "Databricks",
    "pricing": "$85/mo",
    "url": "https://fluxpulse4agent.com"
  },
  {
    "name": "CoreNode Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.6 0.2 91)",
    "vendor": "Scale AI",
    "pricing": "Freemium / $25/mo",
    "url": "https://corenodeagent.com"
  },
  {
    "name": "Pulse Labs 9",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.8 0.2 16)",
    "vendor": "Nova Inc",
    "pricing": "Free",
    "url": "https://pulselabs9.com"
  },
  {
    "name": "AeroVision 3",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.9 0.2 112)",
    "vendor": "Catalyst Corp",
    "pricing": "Freemium / $10/mo",
    "url": "https://aerovision3.com"
  },
  {
    "name": "Core Labs Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.8 0.2 271)",
    "vendor": "Aether Systems",
    "pricing": "Freemium / $10/mo",
    "url": "https://corelabsagent.com"
  },
  {
    "name": "AeroNode 6 Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 78,
    "color": "oklch(0.7 0.2 150)",
    "vendor": "Meta",
    "pricing": "Free",
    "url": "https://aeronode6agent.com"
  },
  {
    "name": "EchoFlow",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.8 0.1 263)",
    "vendor": "Aero Inc",
    "pricing": "Enterprise",
    "url": "https://echoflow.com"
  },
  {
    "name": "Zenith Pulse 2 Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.8 0.1 129)",
    "vendor": "Scale AI",
    "pricing": "Enterprise",
    "url": "https://zenithpulse2agent.com"
  },
  {
    "name": "Lumina Labs",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.7 0.2 157)",
    "vendor": "OpenAI",
    "pricing": "$40/mo",
    "url": "https://luminalabs.com"
  },
  {
    "name": "HyperLabs 8",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.8 0.2 220)",
    "vendor": "Runway",
    "pricing": "Free",
    "url": "https://hyperlabs8.com"
  },
  {
    "name": "Echo Works Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 87,
    "color": "oklch(0.7 0.1 359)",
    "vendor": "Palantir",
    "pricing": "Freemium / $5/mo",
    "url": "https://echoworksagent.com"
  },
  {
    "name": "Flux Brain",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.9 0.2 239)",
    "vendor": "Neo Technologies",
    "pricing": "Free",
    "url": "https://fluxbrain.com"
  },
  {
    "name": "VertexBase 3 Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.7 0.2 122)",
    "vendor": "Synth Inc",
    "pricing": "Free",
    "url": "https://vertexbase3agent.com"
  },
  {
    "name": "Apex Pulse 5 Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.7 0.2 173)",
    "vendor": "Core Systems",
    "pricing": "Enterprise",
    "url": "https://apexpulse5agent.com"
  },
  {
    "name": "OmniMind 6 Agent",
    "cat": "Research",
    "desc": "A powerful AI agent designed for advanced research workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 89,
    "color": "oklch(0.8 0.2 239)",
    "vendor": "Omni Systems",
    "pricing": "Freemium / $5/mo",
    "url": "https://omnimind6agent.com"
  },
  {
    "name": "Nova Grid",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.9 0.1 57)",
    "vendor": "HuggingFace",
    "pricing": "$85/mo",
    "url": "https://novagrid.com"
  },
  {
    "name": "QuantumGen 5 Agent",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.7 0.1 310)",
    "vendor": "Omni Corp",
    "pricing": "$30/mo",
    "url": "https://quantumgen5agent.com"
  },
  {
    "name": "Core Flow Agent",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 77,
    "color": "oklch(0.7 0.2 250)",
    "vendor": "Pulse Technologies",
    "pricing": "Freemium / $20/mo",
    "url": "https://coreflowagent.com"
  },
  {
    "name": "AetherTech 9 Agent",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.8 0.2 204)",
    "vendor": "Apex Technologies",
    "pricing": "Enterprise",
    "url": "https://aethertech9agent.com"
  },
  {
    "name": "HyperGrid Agent",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 89,
    "color": "oklch(0.8 0.2 105)",
    "vendor": "IBM",
    "pricing": "Enterprise",
    "url": "https://hypergridagent.com"
  },
  {
    "name": "Quantum Works 9",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.8 0.1 259)",
    "vendor": "Neo Systems",
    "pricing": "Enterprise",
    "url": "https://quantumworks9.com"
  },
  {
    "name": "AetherMind Agent",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.7 0.2 349)",
    "vendor": "Snowflake",
    "pricing": "Enterprise",
    "url": "https://aethermindagent.com"
  },
  {
    "name": "Synth Gen",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.7 0.1 229)",
    "vendor": "Apex Technologies",
    "pricing": "Free",
    "url": "https://synthgen.com"
  },
  {
    "name": "CoreMind 2",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.8 0.2 360)",
    "vendor": "Lumina Systems",
    "pricing": "$25/mo",
    "url": "https://coremind2.com"
  },
  {
    "name": "Prism Sphere",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.6 0.1 70)",
    "vendor": "Omni Technologies",
    "pricing": "$30/mo",
    "url": "https://prismsphere.com"
  },
  {
    "name": "OmniHub Agent",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.8 0.1 61)",
    "vendor": "Catalyst Systems",
    "pricing": "$15/mo",
    "url": "https://omnihubagent.com"
  },
  {
    "name": "NeoNet Agent",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 87,
    "color": "oklch(0.7 0.1 170)",
    "vendor": "OpenAI",
    "pricing": "Free",
    "url": "https://neonetagent.com"
  },
  {
    "name": "Apex Labs 4",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 87,
    "color": "oklch(0.6 0.2 341)",
    "vendor": "OpenAI",
    "pricing": "Freemium / $15/mo",
    "url": "https://apexlabs4.com"
  },
  {
    "name": "Pulse Tech",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.8 0.2 210)",
    "vendor": "Runway",
    "pricing": "Freemium / $10/mo",
    "url": "https://pulsetech.com"
  },
  {
    "name": "LuminaFlow 5",
    "cat": "Coding",
    "desc": "A powerful AI agent designed for advanced coding workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 89,
    "color": "oklch(0.6 0.2 56)",
    "vendor": "IBM",
    "pricing": "Enterprise",
    "url": "https://luminaflow5.com"
  },
  {
    "name": "Lumina Flow 2",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.9 0.2 27)",
    "vendor": "Anthropic",
    "pricing": "$20/mo",
    "url": "https://luminaflow2.com"
  },
  {
    "name": "Hyper Core 5 Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.7 0.2 193)",
    "vendor": "Vanguard Inc",
    "pricing": "Free",
    "url": "https://hypercore5agent.com"
  },
  {
    "name": "Flux Sync 3 Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.7 0.2 144)",
    "vendor": "Vertex Systems",
    "pricing": "Enterprise",
    "url": "https://fluxsync3agent.com"
  },
  {
    "name": "PrismFlow 4",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.7 0.2 356)",
    "vendor": "Neo Systems",
    "pricing": "$65/mo",
    "url": "https://prismflow4.com"
  },
  {
    "name": "Nexus Vision Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.8 0.2 71)",
    "vendor": "Synth Inc",
    "pricing": "Free",
    "url": "https://nexusvisionagent.com"
  },
  {
    "name": "CatalystBase Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.9 0.2 145)",
    "vendor": "Aether Inc",
    "pricing": "Free",
    "url": "https://catalystbaseagent.com"
  },
  {
    "name": "Prism Net 8",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.6 0.1 320)",
    "vendor": "Scale AI",
    "pricing": "$20/mo",
    "url": "https://prismnet8.com"
  },
  {
    "name": "ZenithEngine",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.8 0.1 102)",
    "vendor": "Pulse Technologies",
    "pricing": "Freemium / $20/mo",
    "url": "https://zenithengine.com"
  },
  {
    "name": "CoreSync 5 Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.6 0.1 239)",
    "vendor": "Palantir",
    "pricing": "Freemium / $10/mo",
    "url": "https://coresync5agent.com"
  },
  {
    "name": "Hyper Mind 7",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.6 0.1 234)",
    "vendor": "Pulse Inc",
    "pricing": "Enterprise",
    "url": "https://hypermind7.com"
  },
  {
    "name": "NeoBase",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.9 0.2 341)",
    "vendor": "ElevenLabs",
    "pricing": "Freemium / $20/mo",
    "url": "https://neobase.com"
  },
  {
    "name": "OmniTech",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 85,
    "color": "oklch(0.7 0.2 19)",
    "vendor": "Flux Corp",
    "pricing": "Enterprise",
    "url": "https://omnitech.com"
  },
  {
    "name": "Echo Base 7 Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.9 0.2 269)",
    "vendor": "Core Corp",
    "pricing": "Enterprise",
    "url": "https://echobase7agent.com"
  },
  {
    "name": "Pulse Sync 8 Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.7 0.2 139)",
    "vendor": "Zenith Systems",
    "pricing": "Free",
    "url": "https://pulsesync8agent.com"
  },
  {
    "name": "Catalyst Pulse 3 Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 86,
    "color": "oklch(0.8 0.2 100)",
    "vendor": "Palantir",
    "pricing": "Free",
    "url": "https://catalystpulse3agent.com"
  },
  {
    "name": "Vertex Tech 3",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.7 0.2 78)",
    "vendor": "Lumina Corp",
    "pricing": "Enterprise",
    "url": "https://vertextech3.com"
  },
  {
    "name": "Neo Works Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.7 0.2 347)",
    "vendor": "Nexus Technologies",
    "pricing": "Free",
    "url": "https://neoworksagent.com"
  },
  {
    "name": "Omni Net Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.8 0.2 175)",
    "vendor": "Quantum Systems",
    "pricing": "Enterprise",
    "url": "https://omninetagent.com"
  },
  {
    "name": "FluxBase Agent",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.7 0.1 305)",
    "vendor": "Zenith Systems",
    "pricing": "Free",
    "url": "https://fluxbaseagent.com"
  },
  {
    "name": "ApexLabs",
    "cat": "Automation",
    "desc": "A powerful AI agent designed for advanced automation workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.7 0.2 63)",
    "vendor": "ElevenLabs",
    "pricing": "$45/mo",
    "url": "https://apexlabs.com"
  },
  {
    "name": "Zenith Pulse Agent",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.8 0.2 286)",
    "vendor": "Databricks",
    "pricing": "Freemium / $10/mo",
    "url": "https://zenithpulseagent.com"
  },
  {
    "name": "Vertex Mind",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.8 0.2 216)",
    "vendor": "Prism Systems",
    "pricing": "Free",
    "url": "https://vertexmind.com"
  },
  {
    "name": "HyperPulse 3",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.8 0.2 160)",
    "vendor": "Microsoft",
    "pricing": "$100/mo",
    "url": "https://hyperpulse3.com"
  },
  {
    "name": "Catalyst Labs 7 Agent",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 91,
    "color": "oklch(0.6 0.2 106)",
    "vendor": "Google",
    "pricing": "Free",
    "url": "https://catalystlabs7agent.com"
  },
  {
    "name": "CoreHub Agent",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.9 0.1 289)",
    "vendor": "Aero Inc",
    "pricing": "Enterprise",
    "url": "https://corehubagent.com"
  },
  {
    "name": "Nexus Grid",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 91,
    "color": "oklch(0.6 0.1 65)",
    "vendor": "C3.ai",
    "pricing": "$25/mo",
    "url": "https://nexusgrid.com"
  },
  {
    "name": "Core Gen",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.7 0.2 196)",
    "vendor": "Zenith Technologies",
    "pricing": "Enterprise",
    "url": "https://coregen.com"
  },
  {
    "name": "Apex Brain Agent",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.7 0.1 183)",
    "vendor": "Runway",
    "pricing": "Enterprise",
    "url": "https://apexbrainagent.com"
  },
  {
    "name": "Nexus Flow",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.7 0.1 71)",
    "vendor": "Stability AI",
    "pricing": "$90/mo",
    "url": "https://nexusflow.com"
  },
  {
    "name": "Apex Core",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.7 0.2 340)",
    "vendor": "Nexus Corp",
    "pricing": "Enterprise",
    "url": "https://apexcore.com"
  },
  {
    "name": "Core Net Agent",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.8 0.1 177)",
    "vendor": "Catalyst Inc",
    "pricing": "Enterprise",
    "url": "https://corenetagent.com"
  },
  {
    "name": "LuminaFlow",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.9 0.2 207)",
    "vendor": "DeepMind",
    "pricing": "Enterprise",
    "url": "https://luminaflow.com"
  },
  {
    "name": "NeoEngine",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 83,
    "color": "oklch(0.8 0.2 214)",
    "vendor": "Neo Systems",
    "pricing": "Enterprise",
    "url": "https://neoengine.com"
  },
  {
    "name": "Vertex Base",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.7 0.2 348)",
    "vendor": "C3.ai",
    "pricing": "Enterprise",
    "url": "https://vertexbase.com"
  },
  {
    "name": "QuantumWorks",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.8 0.2 217)",
    "vendor": "Anthropic",
    "pricing": "Enterprise",
    "url": "https://quantumworks.com"
  },
  {
    "name": "Vertex Node",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.7 0.1 334)",
    "vendor": "IBM",
    "pricing": "Enterprise",
    "url": "https://vertexnode.com"
  },
  {
    "name": "Vertex Sync 7",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 91,
    "color": "oklch(0.8 0.1 212)",
    "vendor": "Hyper Inc",
    "pricing": "Enterprise",
    "url": "https://vertexsync7.com"
  },
  {
    "name": "Aero Works 2 Agent",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.7 0.2 207)",
    "vendor": "Flux Corp",
    "pricing": "Freemium / $5/mo",
    "url": "https://aeroworks2agent.com"
  },
  {
    "name": "EchoPulse",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.6 0.2 353)",
    "vendor": "Vanguard Technologies",
    "pricing": "$90/mo",
    "url": "https://echopulse.com"
  },
  {
    "name": "OmniSync",
    "cat": "Sales",
    "desc": "A powerful AI agent designed for advanced sales workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.7 0.2 120)",
    "vendor": "ElevenLabs",
    "pricing": "Freemium / $10/mo",
    "url": "https://omnisync.com"
  },
  {
    "name": "Lumina Flow",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 88,
    "color": "oklch(0.6 0.2 101)",
    "vendor": "Aether Technologies",
    "pricing": "$90/mo",
    "url": "https://luminaflow.com"
  },
  {
    "name": "AeroCore Agent",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.6 0.2 98)",
    "vendor": "Lumina Corp",
    "pricing": "$65/mo",
    "url": "https://aerocoreagent.com"
  },
  {
    "name": "Catalyst Gen Agent",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.9 0.1 49)",
    "vendor": "Echo Labs",
    "pricing": "$65/mo",
    "url": "https://catalystgenagent.com"
  },
  {
    "name": "Vanguard Net 8 Agent",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.7 0.1 155)",
    "vendor": "Pulse Systems",
    "pricing": "Free",
    "url": "https://vanguardnet8agent.com"
  },
  {
    "name": "PrismBase 4",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.8 0.2 9)",
    "vendor": "Aether Labs",
    "pricing": "Free",
    "url": "https://prismbase4.com"
  },
  {
    "name": "Neo Brain Agent",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.9 0.1 345)",
    "vendor": "Synth Corp",
    "pricing": "Freemium / $20/mo",
    "url": "https://neobrainagent.com"
  },
  {
    "name": "Vanguard Engine 8 Agent",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 86,
    "color": "oklch(0.6 0.2 99)",
    "vendor": "Echo Corp",
    "pricing": "Enterprise",
    "url": "https://vanguardengine8agent.com"
  },
  {
    "name": "Echo Labs Agent",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 85,
    "color": "oklch(0.7 0.2 48)",
    "vendor": "Catalyst Labs",
    "pricing": "Free",
    "url": "https://echolabsagent.com"
  },
  {
    "name": "Vanguard Pulse",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.7 0.2 259)",
    "vendor": "Nova Corp",
    "pricing": "Freemium / $10/mo",
    "url": "https://vanguardpulse.com"
  },
  {
    "name": "Zenith Pulse",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.7 0.1 149)",
    "vendor": "IBM",
    "pricing": "Free",
    "url": "https://zenithpulse.com"
  },
  {
    "name": "Aether Base 6",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.7 0.1 128)",
    "vendor": "Prism Corp",
    "pricing": "Enterprise",
    "url": "https://aetherbase6.com"
  },
  {
    "name": "Synth Tech",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.7 0.2 239)",
    "vendor": "Synth Inc",
    "pricing": "Freemium / $10/mo",
    "url": "https://synthtech.com"
  },
  {
    "name": "Core AI Agent",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.8 0.2 360)",
    "vendor": "Cohere",
    "pricing": "Free",
    "url": "https://coreaiagent.com"
  },
  {
    "name": "Neo Brain 4 Agent",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.7 0.2 278)",
    "vendor": "Nexus Labs",
    "pricing": "Enterprise",
    "url": "https://neobrain4agent.com"
  },
  {
    "name": "Quantum Forge 6",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.6 0.1 351)",
    "vendor": "Prism Technologies",
    "pricing": "Freemium / $25/mo",
    "url": "https://quantumforge6.com"
  },
  {
    "name": "OmniBase",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.6 0.2 0)",
    "vendor": "Neo Corp",
    "pricing": "Enterprise",
    "url": "https://omnibase.com"
  },
  {
    "name": "NeoVision",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.6 0.2 277)",
    "vendor": "Neo Systems",
    "pricing": "Free",
    "url": "https://neovision.com"
  },
  {
    "name": "Synth Net 4",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 86,
    "color": "oklch(0.8 0.2 321)",
    "vendor": "Databricks",
    "pricing": "Free",
    "url": "https://synthnet4.com"
  },
  {
    "name": "Omni AI 8",
    "cat": "Marketing",
    "desc": "A powerful AI agent designed for advanced marketing workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.7 0.2 34)",
    "vendor": "Vanguard Labs",
    "pricing": "$55/mo",
    "url": "https://omniai8.com"
  },
  {
    "name": "VertexWorks",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.9 0.2 347)",
    "vendor": "Nexus Corp",
    "pricing": "Freemium / $15/mo",
    "url": "https://vertexworks.com"
  },
  {
    "name": "Synth Gen 5 Agent",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.6 0.2 255)",
    "vendor": "Snowflake",
    "pricing": "Freemium / $20/mo",
    "url": "https://synthgen5agent.com"
  },
  {
    "name": "Quantum Net Agent",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.9 0.2 355)",
    "vendor": "Midjourney",
    "pricing": "Freemium / $25/mo",
    "url": "https://quantumnetagent.com"
  },
  {
    "name": "AetherGrid 8",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.8 0.2 64)",
    "vendor": "Lumina Systems",
    "pricing": "$40/mo",
    "url": "https://aethergrid8.com"
  },
  {
    "name": "Catalyst Core 7",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.9 0.1 258)",
    "vendor": "Hyper Inc",
    "pricing": "$35/mo",
    "url": "https://catalystcore7.com"
  },
  {
    "name": "AetherAI Agent",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.8 0.1 136)",
    "vendor": "Echo Inc",
    "pricing": "Enterprise",
    "url": "https://aetheraiagent.com"
  },
  {
    "name": "PulseLabs",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.7 0.2 95)",
    "vendor": "Google",
    "pricing": "Enterprise",
    "url": "https://pulselabs.com"
  },
  {
    "name": "Pulse Engine 6",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 88,
    "color": "oklch(0.8 0.1 86)",
    "vendor": "Microsoft",
    "pricing": "$60/mo",
    "url": "https://pulseengine6.com"
  },
  {
    "name": "Vanguard Base",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.8 0.2 185)",
    "vendor": "C3.ai",
    "pricing": "$90/mo",
    "url": "https://vanguardbase.com"
  },
  {
    "name": "Hyper Hub",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 83,
    "color": "oklch(0.8 0.2 20)",
    "vendor": "Aero Technologies",
    "pricing": "Freemium / $15/mo",
    "url": "https://hyperhub.com"
  },
  {
    "name": "NeoNode 5",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.8 0.2 36)",
    "vendor": "Synth Systems",
    "pricing": "Free",
    "url": "https://neonode5.com"
  },
  {
    "name": "Neo Pulse",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.6 0.2 299)",
    "vendor": "Catalyst Labs",
    "pricing": "Freemium / $10/mo",
    "url": "https://neopulse.com"
  },
  {
    "name": "Vanguard Core Agent",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.9 0.1 232)",
    "vendor": "Prism Technologies",
    "pricing": "Freemium / $10/mo",
    "url": "https://vanguardcoreagent.com"
  },
  {
    "name": "ZenithSphere",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.8 0.1 355)",
    "vendor": "Runway",
    "pricing": "Enterprise",
    "url": "https://zenithsphere.com"
  },
  {
    "name": "Pulse Pulse 4 Agent",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 83,
    "color": "oklch(0.8 0.2 5)",
    "vendor": "DeepMind",
    "pricing": "Enterprise",
    "url": "https://pulsepulse4agent.com"
  },
  {
    "name": "SynthSync Agent",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.8 0.1 131)",
    "vendor": "ElevenLabs",
    "pricing": "Enterprise",
    "url": "https://synthsyncagent.com"
  },
  {
    "name": "Catalyst Vision Agent",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.6 0.1 273)",
    "vendor": "IBM",
    "pricing": "Enterprise",
    "url": "https://catalystvisionagent.com"
  },
  {
    "name": "PulseSync",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 89,
    "color": "oklch(0.9 0.2 86)",
    "vendor": "Hyper Technologies",
    "pricing": "Freemium / $20/mo",
    "url": "https://pulsesync.com"
  },
  {
    "name": "NexusForge 4 Agent",
    "cat": "Data Analysis",
    "desc": "A powerful AI agent designed for advanced data analysis workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.6 0.1 223)",
    "vendor": "Vanguard Technologies",
    "pricing": "Freemium / $5/mo",
    "url": "https://nexusforge4agent.com"
  },
  {
    "name": "Aero Flow 8 Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 88,
    "color": "oklch(0.8 0.1 194)",
    "vendor": "ElevenLabs",
    "pricing": "Enterprise",
    "url": "https://aeroflow8agent.com"
  },
  {
    "name": "Vanguard Sync Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.6 0.1 92)",
    "vendor": "Synth Inc",
    "pricing": "Freemium / $20/mo",
    "url": "https://vanguardsyncagent.com"
  },
  {
    "name": "QuantumVision 3",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.6 0.2 73)",
    "vendor": "Nexus Technologies",
    "pricing": "Freemium / $10/mo",
    "url": "https://quantumvision3.com"
  },
  {
    "name": "Synth Forge 4 Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.9 0.2 63)",
    "vendor": "Cohere",
    "pricing": "Free",
    "url": "https://synthforge4agent.com"
  },
  {
    "name": "Lumina Core 6",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.8 0.1 21)",
    "vendor": "Omni Inc",
    "pricing": "$75/mo",
    "url": "https://luminacore6.com"
  },
  {
    "name": "ApexLabs Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.8 0.2 158)",
    "vendor": "Zenith Inc",
    "pricing": "Enterprise",
    "url": "https://apexlabsagent.com"
  },
  {
    "name": "NexusPulse Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.7 0.2 84)",
    "vendor": "Databricks",
    "pricing": "$95/mo",
    "url": "https://nexuspulseagent.com"
  },
  {
    "name": "PulseGrid 7",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.7 0.2 307)",
    "vendor": "Midjourney",
    "pricing": "Free",
    "url": "https://pulsegrid7.com"
  },
  {
    "name": "Echo Sync 7 Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 88,
    "color": "oklch(0.8 0.2 209)",
    "vendor": "Aether Labs",
    "pricing": "Enterprise",
    "url": "https://echosync7agent.com"
  },
  {
    "name": "Flux Brain Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.7 0.1 72)",
    "vendor": "Catalyst Corp",
    "pricing": "Freemium / $20/mo",
    "url": "https://fluxbrainagent.com"
  },
  {
    "name": "Zenith Pulse Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.8 0.2 185)",
    "vendor": "Flux Corp",
    "pricing": "Freemium / $5/mo",
    "url": "https://zenithpulseagent.com"
  },
  {
    "name": "Quantum Labs 9",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.8 0.2 6)",
    "vendor": "Prism Inc",
    "pricing": "Enterprise",
    "url": "https://quantumlabs9.com"
  },
  {
    "name": "Nexus Tech Agent",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.7 0.2 245)",
    "vendor": "Lumina Systems",
    "pricing": "Freemium / $5/mo",
    "url": "https://nexustechagent.com"
  },
  {
    "name": "AetherMind 7",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 78,
    "color": "oklch(0.7 0.2 298)",
    "vendor": "Quantum Technologies",
    "pricing": "Enterprise",
    "url": "https://aethermind7.com"
  },
  {
    "name": "Zenith Brain",
    "cat": "Voice & Audio",
    "desc": "A powerful AI agent designed for advanced voice & audio workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 91,
    "color": "oklch(0.8 0.2 188)",
    "vendor": "Aether Inc",
    "pricing": "Free",
    "url": "https://zenithbrain.com"
  },
  {
    "name": "LuminaLabs",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.7 0.2 48)",
    "vendor": "Midjourney",
    "pricing": "Enterprise",
    "url": "https://luminalabs.com"
  },
  {
    "name": "PrismBrain",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.7 0.1 242)",
    "vendor": "HuggingFace",
    "pricing": "Freemium / $25/mo",
    "url": "https://prismbrain.com"
  },
  {
    "name": "Synth Grid",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.8 0.2 351)",
    "vendor": "Apex Inc",
    "pricing": "Freemium / $15/mo",
    "url": "https://synthgrid.com"
  },
  {
    "name": "PulseVision 5",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.7 0.1 210)",
    "vendor": "Vertex Technologies",
    "pricing": "Freemium / $15/mo",
    "url": "https://pulsevision5.com"
  },
  {
    "name": "Zenith Forge 3",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.6 0.2 288)",
    "vendor": "Meta",
    "pricing": "Free",
    "url": "https://zenithforge3.com"
  },
  {
    "name": "Prism Pulse 7 Agent",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.8 0.2 144)",
    "vendor": "Amazon",
    "pricing": "Freemium / $15/mo",
    "url": "https://prismpulse7agent.com"
  },
  {
    "name": "Synth Engine",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.9 0.1 332)",
    "vendor": "Databricks",
    "pricing": "Free",
    "url": "https://synthengine.com"
  },
  {
    "name": "NovaFlow",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.8 0.1 170)",
    "vendor": "Snowflake",
    "pricing": "Freemium / $25/mo",
    "url": "https://novaflow.com"
  },
  {
    "name": "Aether Base",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.7 0.2 156)",
    "vendor": "Core Systems",
    "pricing": "Enterprise",
    "url": "https://aetherbase.com"
  },
  {
    "name": "Synth Tech Agent",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.9 0.1 285)",
    "vendor": "Apex Corp",
    "pricing": "Freemium / $15/mo",
    "url": "https://synthtechagent.com"
  },
  {
    "name": "Catalyst Engine 3 Agent",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.7 0.1 323)",
    "vendor": "Hyper Labs",
    "pricing": "$75/mo",
    "url": "https://catalystengine3agent.com"
  },
  {
    "name": "Aero Brain",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.6 0.2 193)",
    "vendor": "DeepMind",
    "pricing": "Freemium / $20/mo",
    "url": "https://aerobrain.com"
  },
  {
    "name": "AeroNet Agent",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.9 0.2 286)",
    "vendor": "Echo Labs",
    "pricing": "$50/mo",
    "url": "https://aeronetagent.com"
  },
  {
    "name": "AetherSync 7 Agent",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.8 0.1 70)",
    "vendor": "Aether Corp",
    "pricing": "$40/mo",
    "url": "https://aethersync7agent.com"
  },
  {
    "name": "NeoBrain Agent",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.7 0.2 160)",
    "vendor": "Cohere",
    "pricing": "Enterprise",
    "url": "https://neobrainagent.com"
  },
  {
    "name": "AeroBrain 8 Agent",
    "cat": "Productivity",
    "desc": "A powerful AI agent designed for advanced productivity workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.8 0.1 52)",
    "vendor": "IBM",
    "pricing": "Enterprise",
    "url": "https://aerobrain8agent.com"
  },
  {
    "name": "LuminaNet Agent",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.8 0.2 189)",
    "vendor": "Mistral",
    "pricing": "Enterprise",
    "url": "https://luminanetagent.com"
  },
  {
    "name": "CoreTech 5",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 78,
    "color": "oklch(0.9 0.2 75)",
    "vendor": "Databricks",
    "pricing": "Free",
    "url": "https://coretech5.com"
  },
  {
    "name": "NexusEngine 2",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.8 0.2 149)",
    "vendor": "Apex Systems",
    "pricing": "$20/mo",
    "url": "https://nexusengine2.com"
  },
  {
    "name": "FluxVision 8 Agent",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.9 0.2 26)",
    "vendor": "Stability AI",
    "pricing": "Free",
    "url": "https://fluxvision8agent.com"
  },
  {
    "name": "VanguardWorks 8 Agent",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.7 0.2 352)",
    "vendor": "Neo Systems",
    "pricing": "Freemium / $15/mo",
    "url": "https://vanguardworks8agent.com"
  },
  {
    "name": "Hyper Sphere Agent",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.6 0.1 312)",
    "vendor": "Prism Inc",
    "pricing": "Free",
    "url": "https://hypersphereagent.com"
  },
  {
    "name": "NovaVision Agent",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.8 0.1 242)",
    "vendor": "Snowflake",
    "pricing": "Freemium / $25/mo",
    "url": "https://novavisionagent.com"
  },
  {
    "name": "ApexNet 2",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.7 0.2 28)",
    "vendor": "Midjourney",
    "pricing": "Enterprise",
    "url": "https://apexnet2.com"
  },
  {
    "name": "Nova AI Agent",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.7 0.2 107)",
    "vendor": "Runway",
    "pricing": "Free",
    "url": "https://novaaiagent.com"
  },
  {
    "name": "Quantum AI 5",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 86,
    "color": "oklch(0.7 0.2 40)",
    "vendor": "Mistral",
    "pricing": "Freemium / $10/mo",
    "url": "https://quantumai5.com"
  },
  {
    "name": "AeroPulse",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.8 0.2 42)",
    "vendor": "Vanguard Corp",
    "pricing": "Free",
    "url": "https://aeropulse.com"
  },
  {
    "name": "SynthWorks 4",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 83,
    "color": "oklch(0.8 0.2 35)",
    "vendor": "Apex Labs",
    "pricing": "Enterprise",
    "url": "https://synthworks4.com"
  },
  {
    "name": "PulseSync 5",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 85,
    "color": "oklch(0.9 0.1 117)",
    "vendor": "Apex Corp",
    "pricing": "Enterprise",
    "url": "https://pulsesync5.com"
  },
  {
    "name": "Zenith Forge 7",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.7 0.1 268)",
    "vendor": "Nova Technologies",
    "pricing": "Freemium / $10/mo",
    "url": "https://zenithforge7.com"
  },
  {
    "name": "Aether AI 2 Agent",
    "cat": "Finance",
    "desc": "A powerful AI agent designed for advanced finance workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 86,
    "color": "oklch(0.7 0.2 75)",
    "vendor": "Google",
    "pricing": "Freemium / $15/mo",
    "url": "https://aetherai2agent.com"
  },
  {
    "name": "Vertex Brain 9",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.7 0.2 93)",
    "vendor": "OpenAI",
    "pricing": "Free",
    "url": "https://vertexbrain9.com"
  },
  {
    "name": "HyperHub",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.7 0.2 233)",
    "vendor": "Quantum Corp",
    "pricing": "$70/mo",
    "url": "https://hyperhub.com"
  },
  {
    "name": "FluxGrid Agent",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.8 0.2 54)",
    "vendor": "Lumina Corp",
    "pricing": "Enterprise",
    "url": "https://fluxgridagent.com"
  },
  {
    "name": "NovaSync",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.9 0.1 73)",
    "vendor": "Echo Labs",
    "pricing": "Enterprise",
    "url": "https://novasync.com"
  },
  {
    "name": "ApexForge Agent",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.7 0.1 212)",
    "vendor": "Flux Technologies",
    "pricing": "Free",
    "url": "https://apexforgeagent.com"
  },
  {
    "name": "CoreLabs 3",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.8 0.2 187)",
    "vendor": "OpenAI",
    "pricing": "Free",
    "url": "https://corelabs3.com"
  },
  {
    "name": "Synth Mind",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.9 0.1 72)",
    "vendor": "Echo Labs",
    "pricing": "$95/mo",
    "url": "https://synthmind.com"
  },
  {
    "name": "VanguardNet",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.8 0.2 19)",
    "vendor": "Snowflake",
    "pricing": "Enterprise",
    "url": "https://vanguardnet.com"
  },
  {
    "name": "EchoGrid",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.7 0.2 103)",
    "vendor": "Synth Inc",
    "pricing": "Free",
    "url": "https://echogrid.com"
  },
  {
    "name": "VanguardBase 6",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.8 0.2 177)",
    "vendor": "OpenAI",
    "pricing": "Free",
    "url": "https://vanguardbase6.com"
  },
  {
    "name": "AetherLabs 6",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.7 0.2 226)",
    "vendor": "Scale AI",
    "pricing": "Free",
    "url": "https://aetherlabs6.com"
  },
  {
    "name": "HyperForge 2 Agent",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.9 0.2 46)",
    "vendor": "Pulse Inc",
    "pricing": "Enterprise",
    "url": "https://hyperforge2agent.com"
  },
  {
    "name": "Pulse Sync Agent",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.8 0.1 118)",
    "vendor": "OpenAI",
    "pricing": "Free",
    "url": "https://pulsesyncagent.com"
  },
  {
    "name": "SynthMind Agent",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.9 0.1 41)",
    "vendor": "Cohere",
    "pricing": "Freemium / $15/mo",
    "url": "https://synthmindagent.com"
  },
  {
    "name": "PulseForge Agent",
    "cat": "Legal",
    "desc": "A powerful AI agent designed for advanced legal workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.9 0.2 165)",
    "vendor": "Flux Labs",
    "pricing": "Free",
    "url": "https://pulseforgeagent.com"
  },
  {
    "name": "SynthTech 5 Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 77,
    "color": "oklch(0.6 0.1 69)",
    "vendor": "Mistral",
    "pricing": "Free",
    "url": "https://synthtech5agent.com"
  },
  {
    "name": "CatalystMind 9",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.7 0.2 72)",
    "vendor": "Vanguard Technologies",
    "pricing": "Free",
    "url": "https://catalystmind9.com"
  },
  {
    "name": "Catalyst Engine 8",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.7 0.2 183)",
    "vendor": "Vertex Systems",
    "pricing": "Enterprise",
    "url": "https://catalystengine8.com"
  },
  {
    "name": "VanguardAI 6 Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 86,
    "color": "oklch(0.8 0.1 287)",
    "vendor": "Cohere",
    "pricing": "Enterprise",
    "url": "https://vanguardai6agent.com"
  },
  {
    "name": "CatalystForge 3",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.9 0.2 287)",
    "vendor": "Runway",
    "pricing": "Enterprise",
    "url": "https://catalystforge3.com"
  },
  {
    "name": "PulseBase 6 Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.9 0.2 201)",
    "vendor": "Cohere",
    "pricing": "Enterprise",
    "url": "https://pulsebase6agent.com"
  },
  {
    "name": "NeoNet Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 91,
    "color": "oklch(0.9 0.2 20)",
    "vendor": "Palantir",
    "pricing": "$90/mo",
    "url": "https://neonetagent.com"
  },
  {
    "name": "NexusFlow Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.9 0.2 162)",
    "vendor": "Cohere",
    "pricing": "Enterprise",
    "url": "https://nexusflowagent.com"
  },
  {
    "name": "PrismSphere",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.6 0.2 162)",
    "vendor": "Apex Inc",
    "pricing": "Free",
    "url": "https://prismsphere.com"
  },
  {
    "name": "Zenith Engine 2 Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 91,
    "color": "oklch(0.9 0.2 160)",
    "vendor": "Vertex Inc",
    "pricing": "$55/mo",
    "url": "https://zenithengine2agent.com"
  },
  {
    "name": "Hyper Core Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.8 0.2 266)",
    "vendor": "Cohere",
    "pricing": "Freemium / $15/mo",
    "url": "https://hypercoreagent.com"
  },
  {
    "name": "ZenithAI Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.8 0.2 51)",
    "vendor": "Scale AI",
    "pricing": "$95/mo",
    "url": "https://zenithaiagent.com"
  },
  {
    "name": "PulseNode Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.9 0.1 142)",
    "vendor": "Midjourney",
    "pricing": "$65/mo",
    "url": "https://pulsenodeagent.com"
  },
  {
    "name": "HyperAI 5 Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.7 0.2 284)",
    "vendor": "IBM",
    "pricing": "Freemium / $25/mo",
    "url": "https://hyperai5agent.com"
  },
  {
    "name": "NeoForge 2",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.6 0.2 99)",
    "vendor": "Zenith Labs",
    "pricing": "Free",
    "url": "https://neoforge2.com"
  },
  {
    "name": "Zenith AI 2",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.6 0.1 60)",
    "vendor": "Echo Technologies",
    "pricing": "Enterprise",
    "url": "https://zenithai2.com"
  },
  {
    "name": "Omni Flow 2 Agent",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.8 0.1 182)",
    "vendor": "Core Systems",
    "pricing": "Freemium / $5/mo",
    "url": "https://omniflow2agent.com"
  },
  {
    "name": "NexusBase",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 91,
    "color": "oklch(0.7 0.2 38)",
    "vendor": "Runway",
    "pricing": "Freemium / $20/mo",
    "url": "https://nexusbase.com"
  },
  {
    "name": "AetherBase",
    "cat": "Healthcare",
    "desc": "A powerful AI agent designed for advanced healthcare workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.8 0.1 159)",
    "vendor": "Echo Corp",
    "pricing": "Free",
    "url": "https://aetherbase.com"
  },
  {
    "name": "Omni Mind Agent",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.7 0.2 74)",
    "vendor": "Zenith Corp",
    "pricing": "Free",
    "url": "https://omnimindagent.com"
  },
  {
    "name": "Hyper Engine 9 Agent",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.8 0.2 189)",
    "vendor": "Cohere",
    "pricing": "$100/mo",
    "url": "https://hyperengine9agent.com"
  },
  {
    "name": "HyperVision 9",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.7 0.2 276)",
    "vendor": "Neo Inc",
    "pricing": "Free",
    "url": "https://hypervision9.com"
  },
  {
    "name": "NovaForge 9 Agent",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.9 0.2 183)",
    "vendor": "Prism Labs",
    "pricing": "Freemium / $5/mo",
    "url": "https://novaforge9agent.com"
  },
  {
    "name": "Flux Hub",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.8 0.2 146)",
    "vendor": "Cohere",
    "pricing": "$50/mo",
    "url": "https://fluxhub.com"
  },
  {
    "name": "ZenithGen 4",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 78,
    "color": "oklch(0.7 0.2 155)",
    "vendor": "Nexus Technologies",
    "pricing": "Enterprise",
    "url": "https://zenithgen4.com"
  },
  {
    "name": "PulseFlow 5",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.6 0.2 20)",
    "vendor": "Cohere",
    "pricing": "Free",
    "url": "https://pulseflow5.com"
  },
  {
    "name": "Synth Net Agent",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 78,
    "color": "oklch(0.8 0.1 294)",
    "vendor": "C3.ai",
    "pricing": "Freemium / $20/mo",
    "url": "https://synthnetagent.com"
  },
  {
    "name": "AeroSync Agent",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.6 0.1 244)",
    "vendor": "Synth Technologies",
    "pricing": "Free",
    "url": "https://aerosyncagent.com"
  },
  {
    "name": "PulseLabs 6 Agent",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.7 0.2 39)",
    "vendor": "Vanguard Systems",
    "pricing": "Enterprise",
    "url": "https://pulselabs6agent.com"
  },
  {
    "name": "Flux Brain 7",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.6 0.2 227)",
    "vendor": "Aether Systems",
    "pricing": "Free",
    "url": "https://fluxbrain7.com"
  },
  {
    "name": "Quantum Grid 9 Agent",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.8 0.2 179)",
    "vendor": "Zenith Technologies",
    "pricing": "Enterprise",
    "url": "https://quantumgrid9agent.com"
  },
  {
    "name": "Neo Hub 4",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.7 0.1 182)",
    "vendor": "Omni Technologies",
    "pricing": "$55/mo",
    "url": "https://neohub4.com"
  },
  {
    "name": "OmniGen",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.7 0.1 264)",
    "vendor": "Hyper Systems",
    "pricing": "$65/mo",
    "url": "https://omnigen.com"
  },
  {
    "name": "Aero Hub",
    "cat": "Education",
    "desc": "A powerful AI agent designed for advanced education workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.8 0.2 18)",
    "vendor": "Pulse Labs",
    "pricing": "Freemium / $10/mo",
    "url": "https://aerohub.com"
  },
  {
    "name": "Flux Mind 7 Agent",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.7 0.2 286)",
    "vendor": "Apex Labs",
    "pricing": "$70/mo",
    "url": "https://fluxmind7agent.com"
  },
  {
    "name": "Echo Grid 9",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 90,
    "color": "oklch(0.8 0.2 75)",
    "vendor": "Omni Systems",
    "pricing": "Enterprise",
    "url": "https://echogrid9.com"
  },
  {
    "name": "FluxNet Agent",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.6 0.2 324)",
    "vendor": "ElevenLabs",
    "pricing": "Freemium / $15/mo",
    "url": "https://fluxnetagent.com"
  },
  {
    "name": "Vertex Pulse 5",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.9 0.2 52)",
    "vendor": "Flux Inc",
    "pricing": "Freemium / $5/mo",
    "url": "https://vertexpulse5.com"
  },
  {
    "name": "VertexFlow",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.7 0.2 174)",
    "vendor": "Nova Technologies",
    "pricing": "Enterprise",
    "url": "https://vertexflow.com"
  },
  {
    "name": "VanguardGen 5 Agent",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 89,
    "color": "oklch(0.7 0.1 313)",
    "vendor": "HuggingFace",
    "pricing": "Free",
    "url": "https://vanguardgen5agent.com"
  },
  {
    "name": "Nova Tech Agent",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.8 0.2 5)",
    "vendor": "Aether Systems",
    "pricing": "Freemium / $25/mo",
    "url": "https://novatechagent.com"
  },
  {
    "name": "VanguardNode",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 94,
    "color": "oklch(0.9 0.1 316)",
    "vendor": "Prism Technologies",
    "pricing": "$15/mo",
    "url": "https://vanguardnode.com"
  },
  {
    "name": "NeoAI 5",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.7 0.2 89)",
    "vendor": "Palantir",
    "pricing": "Freemium / $20/mo",
    "url": "https://neoai5.com"
  },
  {
    "name": "CatalystNode 9",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 85,
    "color": "oklch(0.8 0.2 184)",
    "vendor": "Echo Technologies",
    "pricing": "$55/mo",
    "url": "https://catalystnode9.com"
  },
  {
    "name": "Apex Flow 5 Agent",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.8 0.2 94)",
    "vendor": "Core Corp",
    "pricing": "$40/mo",
    "url": "https://apexflow5agent.com"
  },
  {
    "name": "Neo Sync Agent",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.8 0.1 53)",
    "vendor": "Databricks",
    "pricing": "Enterprise",
    "url": "https://neosyncagent.com"
  },
  {
    "name": "Prism Grid 8 Agent",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.7 0.2 242)",
    "vendor": "Anthropic",
    "pricing": "$50/mo",
    "url": "https://prismgrid8agent.com"
  },
  {
    "name": "Aero Net 6",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.9 0.2 359)",
    "vendor": "C3.ai",
    "pricing": "$85/mo",
    "url": "https://aeronet6.com"
  },
  {
    "name": "AeroGrid",
    "cat": "DevOps",
    "desc": "A powerful AI agent designed for advanced devops workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.7 0.1 317)",
    "vendor": "Lumina Inc",
    "pricing": "Enterprise",
    "url": "https://aerogrid.com"
  },
  {
    "name": "Synth Labs 4",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 77,
    "color": "oklch(0.7 0.2 281)",
    "vendor": "ElevenLabs",
    "pricing": "Freemium / $5/mo",
    "url": "https://synthlabs4.com"
  },
  {
    "name": "OmniTech",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.8 0.2 44)",
    "vendor": "Aether Technologies",
    "pricing": "Enterprise",
    "url": "https://omnitech.com"
  },
  {
    "name": "EchoGrid 6 Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 87,
    "color": "oklch(0.6 0.1 322)",
    "vendor": "Neo Technologies",
    "pricing": "Enterprise",
    "url": "https://echogrid6agent.com"
  },
  {
    "name": "PulseMind Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.9 0.2 137)",
    "vendor": "Neo Labs",
    "pricing": "Freemium / $10/mo",
    "url": "https://pulsemindagent.com"
  },
  {
    "name": "Flux Hub 2 Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.7 0.1 74)",
    "vendor": "Lumina Corp",
    "pricing": "Enterprise",
    "url": "https://fluxhub2agent.com"
  },
  {
    "name": "Nexus Sphere 6",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 85,
    "color": "oklch(0.8 0.2 214)",
    "vendor": "Microsoft",
    "pricing": "Free",
    "url": "https://nexussphere6.com"
  },
  {
    "name": "AeroEngine 6 Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.7 0.1 324)",
    "vendor": "Palantir",
    "pricing": "$55/mo",
    "url": "https://aeroengine6agent.com"
  },
  {
    "name": "Aero Tech",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.8 0.2 31)",
    "vendor": "Aero Labs",
    "pricing": "Enterprise",
    "url": "https://aerotech.com"
  },
  {
    "name": "Nova Tech Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.7 0.1 15)",
    "vendor": "Nova Labs",
    "pricing": "Freemium / $25/mo",
    "url": "https://novatechagent.com"
  },
  {
    "name": "HyperHub 8",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.9 0.1 355)",
    "vendor": "Apex Systems",
    "pricing": "Freemium / $15/mo",
    "url": "https://hyperhub8.com"
  },
  {
    "name": "Hyper Sync",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.7 0.1 152)",
    "vendor": "Vertex Systems",
    "pricing": "Enterprise",
    "url": "https://hypersync.com"
  },
  {
    "name": "VanguardVision 9 Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 83,
    "color": "oklch(0.9 0.2 119)",
    "vendor": "Aether Technologies",
    "pricing": "Freemium / $20/mo",
    "url": "https://vanguardvision9agent.com"
  },
  {
    "name": "Vanguard Hub 3 Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.6 0.1 225)",
    "vendor": "Apex Inc",
    "pricing": "Enterprise",
    "url": "https://vanguardhub3agent.com"
  },
  {
    "name": "Neo Flow 2 Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 87,
    "color": "oklch(0.8 0.2 193)",
    "vendor": "Amazon",
    "pricing": "Free",
    "url": "https://neoflow2agent.com"
  },
  {
    "name": "Vanguard Sync Agent",
    "cat": "Security",
    "desc": "A powerful AI agent designed for advanced security workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.9 0.1 7)",
    "vendor": "Nexus Inc",
    "pricing": "Free",
    "url": "https://vanguardsyncagent.com"
  },
  {
    "name": "VanguardVision Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.8 0.2 118)",
    "vendor": "OpenAI",
    "pricing": "Enterprise",
    "url": "https://vanguardvisionagent.com"
  },
  {
    "name": "Nexus Sync 2 Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 77,
    "color": "oklch(0.6 0.2 249)",
    "vendor": "OpenAI",
    "pricing": "Free",
    "url": "https://nexussync2agent.com"
  },
  {
    "name": "FluxGen",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.6 0.2 201)",
    "vendor": "Vertex Corp",
    "pricing": "$25/mo",
    "url": "https://fluxgen.com"
  },
  {
    "name": "HyperEngine 3",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 77,
    "color": "oklch(0.7 0.1 52)",
    "vendor": "Hyper Inc",
    "pricing": "Freemium / $10/mo",
    "url": "https://hyperengine3.com"
  },
  {
    "name": "FluxBase",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 78,
    "color": "oklch(0.6 0.2 217)",
    "vendor": "Snowflake",
    "pricing": "Free",
    "url": "https://fluxbase.com"
  },
  {
    "name": "Vanguard Hub 8 Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 77,
    "color": "oklch(0.8 0.1 28)",
    "vendor": "Google",
    "pricing": "$90/mo",
    "url": "https://vanguardhub8agent.com"
  },
  {
    "name": "ZenithNode 8 Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.7 0.2 133)",
    "vendor": "Nexus Technologies",
    "pricing": "$90/mo",
    "url": "https://zenithnode8agent.com"
  },
  {
    "name": "Neo Core 8 Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.9 0.2 85)",
    "vendor": "Nexus Labs",
    "pricing": "$65/mo",
    "url": "https://neocore8agent.com"
  },
  {
    "name": "Core Tech Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 89,
    "color": "oklch(0.7 0.1 45)",
    "vendor": "Core Corp",
    "pricing": "$20/mo",
    "url": "https://coretechagent.com"
  },
  {
    "name": "Aether Base Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.8 0.1 129)",
    "vendor": "IBM",
    "pricing": "$50/mo",
    "url": "https://aetherbaseagent.com"
  },
  {
    "name": "AeroHub 5 Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.8 0.1 237)",
    "vendor": "Catalyst Systems",
    "pricing": "$90/mo",
    "url": "https://aerohub5agent.com"
  },
  {
    "name": "Synth Labs 8",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.6 0.1 17)",
    "vendor": "ElevenLabs",
    "pricing": "Free",
    "url": "https://synthlabs8.com"
  },
  {
    "name": "FluxLabs Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.7 0.2 262)",
    "vendor": "OpenAI",
    "pricing": "Free",
    "url": "https://fluxlabsagent.com"
  },
  {
    "name": "Flux Net",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.6 0.1 211)",
    "vendor": "Nexus Systems",
    "pricing": "$40/mo",
    "url": "https://fluxnet.com"
  },
  {
    "name": "Omni Sphere Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.8 0.2 282)",
    "vendor": "HuggingFace",
    "pricing": "$100/mo",
    "url": "https://omnisphereagent.com"
  },
  {
    "name": "ZenithGrid",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 83,
    "color": "oklch(0.8 0.1 201)",
    "vendor": "Synth Labs",
    "pricing": "Enterprise",
    "url": "https://zenithgrid.com"
  },
  {
    "name": "AetherNode 8 Agent",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.6 0.1 165)",
    "vendor": "Amazon",
    "pricing": "Freemium / $5/mo",
    "url": "https://aethernode8agent.com"
  },
  {
    "name": "HyperWorks 4",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.9 0.2 197)",
    "vendor": "Quantum Technologies",
    "pricing": "$65/mo",
    "url": "https://hyperworks4.com"
  },
  {
    "name": "PrismCore 3",
    "cat": "Creative",
    "desc": "A powerful AI agent designed for advanced creative workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.8 0.2 28)",
    "vendor": "Midjourney",
    "pricing": "Free",
    "url": "https://prismcore3.com"
  },
  {
    "name": "ApexSphere",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 79,
    "color": "oklch(0.8 0.1 28)",
    "vendor": "IBM",
    "pricing": "Enterprise",
    "url": "https://apexsphere.com"
  },
  {
    "name": "Zenith Net",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 80,
    "color": "oklch(0.6 0.1 75)",
    "vendor": "Core Systems",
    "pricing": "Enterprise",
    "url": "https://zenithnet.com"
  },
  {
    "name": "AeroWorks 7 Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.7 0.2 27)",
    "vendor": "Neo Technologies",
    "pricing": "Free",
    "url": "https://aeroworks7agent.com"
  },
  {
    "name": "QuantumPulse",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.8 0.1 74)",
    "vendor": "DeepMind",
    "pricing": "$70/mo",
    "url": "https://quantumpulse.com"
  },
  {
    "name": "CoreAI 4 Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.8 0.1 110)",
    "vendor": "Lumina Labs",
    "pricing": "Enterprise",
    "url": "https://coreai4agent.com"
  },
  {
    "name": "Lumina Brain 3 Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.6 0.2 133)",
    "vendor": "Vertex Corp",
    "pricing": "$85/mo",
    "url": "https://luminabrain3agent.com"
  },
  {
    "name": "PulseBase Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.7 0.2 63)",
    "vendor": "Zenith Corp",
    "pricing": "$90/mo",
    "url": "https://pulsebaseagent.com"
  },
  {
    "name": "CatalystMind Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.6 0.2 9)",
    "vendor": "ElevenLabs",
    "pricing": "Enterprise",
    "url": "https://catalystmindagent.com"
  },
  {
    "name": "VertexAI 3",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 97,
    "color": "oklch(0.7 0.2 228)",
    "vendor": "Pulse Technologies",
    "pricing": "Enterprise",
    "url": "https://vertexai3.com"
  },
  {
    "name": "Zenith Brain 7 Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.8 0.1 354)",
    "vendor": "Mistral",
    "pricing": "Freemium / $15/mo",
    "url": "https://zenithbrain7agent.com"
  },
  {
    "name": "VanguardBrain 6 Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 89,
    "color": "oklch(0.8 0.1 22)",
    "vendor": "Neo Corp",
    "pricing": "Freemium / $5/mo",
    "url": "https://vanguardbrain6agent.com"
  },
  {
    "name": "Hyper Brain 5",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.8 0.2 351)",
    "vendor": "IBM",
    "pricing": "Freemium / $15/mo",
    "url": "https://hyperbrain5.com"
  },
  {
    "name": "EchoHub 2",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 93,
    "color": "oklch(0.7 0.1 11)",
    "vendor": "Anthropic",
    "pricing": "Enterprise",
    "url": "https://echohub2.com"
  },
  {
    "name": "Synth Base Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 91,
    "color": "oklch(0.8 0.2 218)",
    "vendor": "Neo Corp",
    "pricing": "Freemium / $20/mo",
    "url": "https://synthbaseagent.com"
  },
  {
    "name": "Nova Node",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 75,
    "color": "oklch(0.7 0.1 276)",
    "vendor": "Nova Labs",
    "pricing": "$70/mo",
    "url": "https://novanode.com"
  },
  {
    "name": "PulseSync Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.6 0.1 145)",
    "vendor": "Omni Corp",
    "pricing": "Freemium / $20/mo",
    "url": "https://pulsesyncagent.com"
  },
  {
    "name": "LuminaCore",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.8 0.2 39)",
    "vendor": "Anthropic",
    "pricing": "Freemium / $15/mo",
    "url": "https://luminacore.com"
  },
  {
    "name": "Omni Node 3 Agent",
    "cat": "E-commerce",
    "desc": "A powerful AI agent designed for advanced e-commerce workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 96,
    "color": "oklch(0.9 0.1 175)",
    "vendor": "Aether Technologies",
    "pricing": "Enterprise",
    "url": "https://omninode3agent.com"
  },
  {
    "name": "NeoHub",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.8 0.2 99)",
    "vendor": "IBM",
    "pricing": "Freemium / $15/mo",
    "url": "https://neohub.com"
  },
  {
    "name": "Zenith Tech 3",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.7 0.1 211)",
    "vendor": "Runway",
    "pricing": "$40/mo",
    "url": "https://zenithtech3.com"
  },
  {
    "name": "VertexEngine 6 Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.8 0.2 106)",
    "vendor": "Palantir",
    "pricing": "Free",
    "url": "https://vertexengine6agent.com"
  },
  {
    "name": "Core Sync 2 Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 85,
    "color": "oklch(0.8 0.1 308)",
    "vendor": "IBM",
    "pricing": "Free",
    "url": "https://coresync2agent.com"
  },
  {
    "name": "LuminaWorks Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 71,
    "color": "oklch(0.9 0.2 11)",
    "vendor": "OpenAI",
    "pricing": "Enterprise",
    "url": "https://luminaworksagent.com"
  },
  {
    "name": "Lumina Node",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 83,
    "color": "oklch(0.8 0.2 106)",
    "vendor": "Midjourney",
    "pricing": "Enterprise",
    "url": "https://luminanode.com"
  },
  {
    "name": "LuminaAI Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 73,
    "color": "oklch(0.7 0.1 260)",
    "vendor": "Apex Labs",
    "pricing": "$85/mo",
    "url": "https://luminaaiagent.com"
  },
  {
    "name": "VanguardCore 3 Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.7 0.2 309)",
    "vendor": "Vertex Inc",
    "pricing": "Freemium / $5/mo",
    "url": "https://vanguardcore3agent.com"
  },
  {
    "name": "Zenith Works 7",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 98,
    "color": "oklch(0.8 0.2 21)",
    "vendor": "Microsoft",
    "pricing": "Freemium / $25/mo",
    "url": "https://zenithworks7.com"
  },
  {
    "name": "LuminaBase 3",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 95,
    "color": "oklch(0.9 0.2 25)",
    "vendor": "Amazon",
    "pricing": "Free",
    "url": "https://luminabase3.com"
  },
  {
    "name": "EchoVision 5 Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.9 0.2 177)",
    "vendor": "Midjourney",
    "pricing": "$100/mo",
    "url": "https://echovision5agent.com"
  },
  {
    "name": "PrismFlow",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 76,
    "color": "oklch(0.6 0.2 191)",
    "vendor": "Vertex Technologies",
    "pricing": "$80/mo",
    "url": "https://prismflow.com"
  },
  {
    "name": "Synth Hub",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 82,
    "color": "oklch(0.7 0.1 250)",
    "vendor": "Apex Technologies",
    "pricing": "Enterprise",
    "url": "https://synthhub.com"
  },
  {
    "name": "Vertex Sync 6 Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 70,
    "color": "oklch(0.8 0.2 350)",
    "vendor": "Mistral",
    "pricing": "Enterprise",
    "url": "https://vertexsync6agent.com"
  },
  {
    "name": "CoreCore 5 Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 92,
    "color": "oklch(0.8 0.1 102)",
    "vendor": "Scale AI",
    "pricing": "Freemium / $15/mo",
    "url": "https://corecore5agent.com"
  },
  {
    "name": "PulseGrid 5",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 84,
    "color": "oklch(0.6 0.2 91)",
    "vendor": "Vertex Technologies",
    "pricing": "Free",
    "url": "https://pulsegrid5.com"
  },
  {
    "name": "Hyper Brain 4 Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 99,
    "color": "oklch(0.7 0.1 124)",
    "vendor": "Snowflake",
    "pricing": "Enterprise",
    "url": "https://hyperbrain4agent.com"
  },
  {
    "name": "QuantumSync Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 74,
    "color": "oklch(0.6 0.2 0)",
    "vendor": "Aero Systems",
    "pricing": "Free",
    "url": "https://quantumsyncagent.com"
  },
  {
    "name": "Zenith Grid 6 Agent",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 81,
    "color": "oklch(0.7 0.2 300)",
    "vendor": "Quantum Corp",
    "pricing": "Free",
    "url": "https://zenithgrid6agent.com"
  },
  {
    "name": "Aether Pulse 9",
    "cat": "HR & Recruiting",
    "desc": "A powerful AI agent designed for advanced hr & recruiting workflows. Automates repetitive tasks, integrates with major platforms, and provides actionable insights.",
    "score": 72,
    "color": "oklch(0.8 0.1 117)",
    "vendor": "Prism Technologies",
    "pricing": "$45/mo",
    "url": "https://aetherpulse9.com"
  }
];

export const AGENT_COUNT = AI_AGENTS.length;