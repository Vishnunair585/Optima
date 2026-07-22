import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Calculator, DollarSign, Search, Plus, Trash2, ShieldCheck, X, Zap, Box, BrainCircuit, Users } from "lucide-react";
import { ProtectedRoute } from "../components/auth/route-guard";
import { AI_TOOLS } from "../lib/data/tools";
import { AI_AGENTS } from "../lib/data/agents";
import { Bot } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Advanced AI Cost Calculator — Optima" },
      { name: "description", content: "Estimate precise monthly AI spend across APIs, Agents, and SaaS platforms." },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <CalcPage />
    </ProtectedRoute>
  ),
});

// Comprehensive API Models Pricing (per 1M tokens)
const API_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", inputPrice: 5.0, outputPrice: 15.0, type: "API" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", inputPrice: 0.15, outputPrice: 0.60, type: "API" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", inputPrice: 10.0, outputPrice: 30.0, type: "API" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", inputPrice: 3.0, outputPrice: 15.0, type: "API" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", inputPrice: 15.0, outputPrice: 75.0, type: "API" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", inputPrice: 0.25, outputPrice: 1.25, type: "API" },
  { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", provider: "Google", inputPrice: 3.50, outputPrice: 10.50, type: "API" },
  { id: "gemini-1-5-flash", name: "Gemini 1.5 Flash", provider: "Google", inputPrice: 0.35, outputPrice: 1.05, type: "API" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", inputPrice: 0.50, outputPrice: 0.50, type: "API" },
  { id: "llama-3-8b", name: "Llama 3 8B", provider: "Meta", inputPrice: 0.05, outputPrice: 0.05, type: "API" },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral", inputPrice: 4.0, outputPrice: 12.0, type: "API" },
  { id: "command-r-plus", name: "Command R+", provider: "Cohere", inputPrice: 3.0, outputPrice: 15.0, type: "API" },
];

// AI_AGENTS will be loaded directly from data

const USAGE_TIERS = {
  low: { label: "Low (Solo / Hobby)", inputMillions: 1, outputMillions: 0.2 },
  medium: { label: "Medium (Startup / Small Team)", inputMillions: 5, outputMillions: 1 },
  high: { label: "High (Enterprise / Scaling)", inputMillions: 20, outputMillions: 5 },
  custom: { label: "Custom Volumes", inputMillions: 0, outputMillions: 0 },
};

function parseSaaSPrice(priceStr: string): number | "Custom" {
  if (!priceStr) return "Custom";
  if (/enterprise/i.test(priceStr) || /contact/i.test(priceStr)) return "Custom";
  const match = priceStr.match(/\$(\d+(\.\d+)?)/);
  if (match) return parseFloat(match[1]);
  if (/free/i.test(priceStr)) return 0;
  return "Custom";
}

function CalcPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"api" | "saas" | "agents">("api");
  const [usageTier, setUsageTier] = useState<keyof typeof USAGE_TIERS>("medium");
  const [customInput, setCustomInput] = useState(5);
  const [customOutput, setCustomOutput] = useState(1);
  
  // Selected items arrays
  const [selectedApis, setSelectedApis] = useState<typeof API_MODELS>([]);
  const [selectedSaas, setSelectedSaas] = useState<typeof AI_TOOLS>([]);
  const [selectedAgents, setSelectedAgents] = useState<typeof AI_AGENTS>([]);

  const currentInputM = usageTier === "custom" ? customInput : USAGE_TIERS[usageTier].inputMillions;
  const currentOutputM = usageTier === "custom" ? customOutput : USAGE_TIERS[usageTier].outputMillions;

  // Search Results
  const saasResults = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return AI_TOOLS.filter((t) => t.name.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)).slice(0, 10);
  }, [search]);

  const apiResults = useMemo(() => {
    if (!search.trim()) return API_MODELS;
    const query = search.toLowerCase();
    return API_MODELS.filter(m => m.name.toLowerCase().includes(query) || m.provider.toLowerCase().includes(query));
  }, [search]);

  const agentResults = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return AI_AGENTS.filter(m => m.name.toLowerCase().includes(query) || (m.vendor?.toLowerCase().includes(query) ?? false)).slice(0, 10);
  }, [search]);

  // Calculations
  const totalApiCost = selectedApis.reduce((acc, api) => {
    return acc + (api.inputPrice * currentInputM) + (api.outputPrice * currentOutputM);
  }, 0);

  const totalSaasCost = selectedSaas.reduce((acc, t) => {
    const p = parseSaaSPrice(t.price);
    return typeof p === 'number' ? acc + p : acc;
  }, 0);

  const totalAgentCost = selectedAgents.reduce((acc, a) => {
    let p = parseSaaSPrice(a.pricing);
    if (p === "Custom") p = 20; // Default estimate for Agents if Custom/Freemium
    return typeof p === 'number' ? acc + p : acc;
  }, 0);

  const grandTotal = totalApiCost + totalSaasCost + totalAgentCost;
  const hasCustomSaas = selectedSaas.some(t => parseSaaSPrice(t.price) === "Custom");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Usage-Based Pricing</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Advanced Cost Calculator</h1>
        <p className="mt-3 text-muted-foreground">Estimate exact monthly AI spend based on your specific usage, selected API models, autonomous agents, and SaaS tools.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        
        {/* LEFT: Configuration */}
        <div className="space-y-6">
          
          {/* Usage Configuration */}
          <div className="rounded-2xl glass p-6 border-brand/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand" />
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand" /> Step 1: Define API Usage Volume
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {(Object.keys(USAGE_TIERS) as Array<keyof typeof USAGE_TIERS>).map(tier => (
                <button
                  key={tier}
                  onClick={() => setUsageTier(tier)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all text-center ${
                    usageTier === tier ? 'border-brand bg-brand/10 text-brand' : 'border-border bg-card hover:border-brand/50'
                  }`}
                >
                  {USAGE_TIERS[tier].label.split('(')[0]}
                </button>
              ))}
            </div>

            {usageTier === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl border border-border mt-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Input Tokens (Millions/mo)</label>
                  <Input type="number" value={customInput} onChange={e => setCustomInput(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Output Tokens (Millions/mo)</label>
                  <Input type="number" value={customOutput} onChange={e => setCustomOutput(Number(e.target.value))} />
                </div>
              </div>
            )}
            {usageTier !== "custom" && (
              <p className="text-sm text-muted-foreground bg-black/20 p-4 rounded-xl border border-border">
                Estimating based on <strong>{USAGE_TIERS[usageTier].inputMillions}M</strong> input tokens and <strong>{USAGE_TIERS[usageTier].outputMillions}M</strong> output tokens per month.
              </p>
            )}
          </div>

          {/* Tool Selection */}
          <div className="rounded-2xl glass p-6">
             <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Box className="h-5 w-5 text-brand" /> Step 2: Build Your Stack
            </h3>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border pb-4 overflow-x-auto">
              <button 
                onClick={() => setActiveTab("api")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'api' ? 'bg-brand text-brand-foreground shadow-glow' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                <BrainCircuit className="h-4 w-4" /> API Models
              </button>
              <button 
                onClick={() => setActiveTab("agents")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'agents' ? 'bg-brand text-brand-foreground shadow-glow' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                <Bot className="h-4 w-4" /> AI Agents
              </button>
              <button 
                onClick={() => setActiveTab("saas")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'saas' ? 'bg-brand text-brand-foreground shadow-glow' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                <Users className="h-4 w-4" /> SaaS Apps (1300+)
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`Search ${activeTab === 'api' ? 'LLM API models (e.g. GPT-4o, Claude)' : activeTab === 'agents' ? 'Autonomous Agents' : 'SaaS tools (e.g. Midjourney, Cursor)'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Search Results Rendering */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
              {activeTab === 'api' && apiResults.map(model => (
                <button
                  key={model.id}
                  onClick={() => !selectedApis.find(m => m.id === model.id) && setSelectedApis([...selectedApis, model])}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-brand hover:bg-brand/5 transition-colors text-left"
                >
                  <div>
                    <div className="font-medium">{model.name} <span className="text-xs font-normal text-muted-foreground ml-2">by {model.provider}</span></div>
                    <div className="text-xs text-muted-foreground mt-1">${model.inputPrice}/M input, ${model.outputPrice}/M output</div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}

              {activeTab === 'agents' && agentResults.map(agent => (
                <button
                  key={agent.name}
                  onClick={() => !selectedAgents.find(a => a.name === agent.name) && setSelectedAgents([...selectedAgents, agent])}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-brand hover:bg-brand/5 transition-colors text-left"
                >
                  <div>
                    <div className="font-medium">{agent.name} <span className="text-xs font-normal text-muted-foreground ml-2">by {agent.vendor}</span></div>
                    <div className="text-xs text-muted-foreground mt-1">{agent.pricing}</div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
              
              {activeTab === 'agents' && search.trim() === '' && (
                <div className="text-center p-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                  Search through our database of 400+ Autonomous Agents to add them to your stack.
                </div>
              )}

              {activeTab === 'saas' && saasResults.map(tool => (
                <button
                  key={tool.name}
                  onClick={() => !selectedSaas.find(t => t.name === tool.name) && setSelectedSaas([...selectedSaas, tool])}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-brand hover:bg-brand/5 transition-colors text-left"
                >
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{tool.price}</div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
              
              {activeTab === 'saas' && search.trim() === '' && (
                <div className="text-center p-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                  Search through our database of 1,300+ AI SaaS applications to add them to your stack.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Stack & Total Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl glass p-8 bg-gradient-to-br from-brand/10 to-transparent border-brand/30 shadow-elegant sticky top-24">
            <h3 className="font-display text-lg font-semibold mb-2 text-foreground">Estimated Monthly Spend</h3>
            
            <div className="text-5xl font-mono font-bold flex items-center mt-4 text-white">
              <DollarSign className="h-10 w-10 text-brand" />
              {grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              {hasCustomSaas && <span className="text-xl text-muted-foreground ml-2">+ Custom</span>}
            </div>
            
            <div className="mt-8 space-y-4 pt-6 border-t border-border/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">API Token Costs ({selectedApis.length})</span>
                <span className="font-mono font-medium">${totalApiCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">AI Agents ({selectedAgents.length})</span>
                <span className="font-mono font-medium">${totalAgentCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">SaaS Apps ({selectedSaas.length})</span>
                <span className="font-mono font-medium">${totalSaasCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 space-y-3 max-h-[300px] overflow-y-auto pr-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Your Active Stack</h4>
              
              {selectedApis.length === 0 && selectedAgents.length === 0 && selectedSaas.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No tools added yet.</p>
              )}

              {selectedApis.map(api => (
                <div key={api.id} className="flex items-center justify-between group">
                  <div className="text-sm truncate pr-2"><span className="text-[10px] bg-brand/20 text-brand px-1.5 py-0.5 rounded mr-2">API</span>{api.name}</div>
                  <button onClick={() => setSelectedApis(prev => prev.filter(a => a.id !== api.id))} className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}

              {selectedAgents.map(agent => (
                <div key={agent.name} className="flex items-center justify-between group">
                  <div className="text-sm truncate pr-2"><span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded mr-2">AGENT</span>{agent.name}</div>
                  <button onClick={() => setSelectedAgents(prev => prev.filter(a => a.name !== agent.name))} className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}

              {selectedSaas.map(saas => (
                <div key={saas.name} className="flex items-center justify-between group">
                  <div className="text-sm truncate pr-2"><span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded mr-2">SAAS</span>{saas.name}</div>
                  <button onClick={() => setSelectedSaas(prev => prev.filter(s => s.name !== saas.name))} className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>

            {hasCustomSaas && (
              <p className="text-[10px] text-muted-foreground mt-6 flex items-start gap-1.5 bg-black/20 p-2 rounded-lg">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
                Some tools in your stack require Enterprise sales contact. Their pricing is not included in the total.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
