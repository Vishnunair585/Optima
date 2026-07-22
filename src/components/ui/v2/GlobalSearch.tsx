import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { Search, Calculator, GitCompare, Trophy, Compass, Layers, Bot, BookOpen, Newspaper } from "lucide-react";
import { AI_TOOLS } from "../../../lib/data/tools";

export function GlobalSearch({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in-0"
          onClick={() => onOpenChange(false)}
        />
      )}
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-card border border-border shadow-2xl sm:rounded-xl overflow-hidden transition-all duration-200 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <Command 
          className="flex flex-col w-full h-full max-h-[85vh] sm:max-h-[500px]"
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-border px-4 py-3 gap-3">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <Command.Input 
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground h-8"
              placeholder="Search tools, models, pages, categories..."
            />
            <button 
              onClick={() => onOpenChange(false)}
              className="text-xs bg-accent text-muted-foreground px-2 py-1 rounded font-mono"
            >
              ESC
            </button>
          </div>

          <Command.List className="overflow-y-auto p-2 scroll-smooth">
            <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Pages" className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-heading]]:mb-1.5 [&_[cmdk-group-heading]]:text-muted-foreground/70">
              <Command.Item 
                onSelect={() => { onOpenChange(false); navigate({ to: "/finder" }); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-brand/10 aria-selected:text-brand transition-colors"
              >
                <Compass className="h-4 w-4" /> AI Finder
              </Command.Item>
              <Command.Item 
                onSelect={() => { onOpenChange(false); navigate({ to: "/compare" }); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-brand/10 aria-selected:text-brand transition-colors"
              >
                <GitCompare className="h-4 w-4" /> Compare
              </Command.Item>
              <Command.Item 
                onSelect={() => { onOpenChange(false); navigate({ to: "/calculator" }); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-brand/10 aria-selected:text-brand transition-colors"
              >
                <Calculator className="h-4 w-4" /> Cost Calculator
              </Command.Item>
              <Command.Item 
                onSelect={() => { onOpenChange(false); navigate({ to: "/rankings" }); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-brand/10 aria-selected:text-brand transition-colors"
              >
                <Trophy className="h-4 w-4" /> Rankings
              </Command.Item>
              <Command.Item 
                onSelect={() => { onOpenChange(false); navigate({ to: "/stacks" }); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-brand/10 aria-selected:text-brand transition-colors"
              >
                <Layers className="h-4 w-4" /> Public Stacks
              </Command.Item>
              <Command.Item 
                onSelect={() => { onOpenChange(false); navigate({ to: "/agents" }); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-brand/10 aria-selected:text-brand transition-colors"
              >
                <Bot className="h-4 w-4" /> Agents
              </Command.Item>
              <Command.Item 
                onSelect={() => { onOpenChange(false); navigate({ to: "/prompts" }); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-brand/10 aria-selected:text-brand transition-colors"
              >
                <BookOpen className="h-4 w-4" /> Prompt Library
              </Command.Item>
            </Command.Group>

            <Command.Group heading="AI Tools" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mt-2 [&_[cmdk-group-heading]]:mb-1.5 [&_[cmdk-group-heading]]:text-muted-foreground/70">
              {AI_TOOLS.map(tool => (
                <Command.Item
                  key={tool.name}
                  value={`${tool.name} ${tool.category} ${tool.vendor}`}
                  onSelect={() => { onOpenChange(false); navigate({ to: "/compare" }); }}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tool.color }} />
                    <span className="font-medium">{tool.name}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">({tool.vendor})</span>
                  </div>
                  <span className="text-xs bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                    {tool.category}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </>
  );
}
