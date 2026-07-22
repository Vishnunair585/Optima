import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { AI_TOOLS } from "../../../lib/data/tools";
import { useState } from "react";

export function V3Landing() {
  // Sort tools to mix them up like a feed
  const feedTools = [...AI_TOOLS].sort(() => Math.random() - 0.5);
  
  return (
    <div className="w-full max-w-[470px] mx-auto pb-10">
      
      {/* Stories Section */}
      <div className="py-6 border-b border-border/20 md:border-none mb-2 md:mb-6 mt-4">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-0">
          {/* Your Story */}
          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
            <div className="h-16 w-16 rounded-full border border-border/50 bg-accent grid place-items-center relative">
              <span className="text-2xl">+</span>
              <div className="absolute bottom-0 right-0 h-5 w-5 bg-brand rounded-full border-2 border-background grid place-items-center">
                <span className="text-white text-[10px] font-bold">+</span>
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground truncate w-16 text-center">Your story</span>
          </div>

          {/* Other Stories */}
          {AI_TOOLS.slice(0, 8).map((tool) => (
            <div key={tool.name} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
              <div className="h-16 w-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500">
                <div className="h-full w-full rounded-full border-2 border-background bg-card grid place-items-center overflow-hidden" style={{ backgroundColor: `${tool.color}20` }}>
                  <span className="font-bold text-lg" style={{ color: tool.color }}>{tool.name.charAt(0)}</span>
                </div>
              </div>
              <span className="text-[11px] text-foreground truncate w-16 text-center">{tool.name.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="flex flex-col gap-8 md:gap-10 pb-10">
        {feedTools.map((tool) => (
          <Post key={tool.name} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function Post({ tool }: { tool: any }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likesCount = Math.floor(tool.score * 10.4) + (liked ? 1 : 0);

  return (
    <article className="border-b border-border/20 md:border-none pb-6 md:pb-0">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 md:px-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full grid place-items-center bg-accent" style={{ backgroundColor: `${tool.color}20`, color: tool.color }}>
            <span className="font-bold text-xs">{tool.name.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold hover:text-muted-foreground cursor-pointer">{tool.name.toLowerCase().replace(/\s+/g, '_')}</span>
              <span className="text-muted-foreground text-xs">• {Math.floor(Math.random() * 23) + 1}h</span>
            </div>
            <span className="text-xs text-muted-foreground">{tool.vendor}</span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Media (Placeholder block for tool visualization) */}
      <div className="w-full aspect-[4/5] sm:aspect-square bg-card border border-border/50 sm:rounded-sm relative overflow-hidden flex flex-col items-center justify-center p-8 group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br opacity-10" style={{ backgroundImage: `linear-gradient(to bottom right, ${tool.color}, transparent)` }} />
        
        <h2 className="text-4xl font-bold mb-4 relative z-10" style={{ color: tool.color }}>{tool.name}</h2>
        <div className="flex flex-wrap gap-2 justify-center relative z-10">
          <span className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-semibold border border-border/50">
            {tool.category}
          </span>
          <span className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-semibold border border-border/50">
            {tool.price}
          </span>
          <span className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-semibold border border-border/50 flex items-center gap-1">
            <Heart className="h-3 w-3 fill-current" /> {tool.score}
          </span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between px-4 md:px-0 mt-3 mb-2">
        <div className="flex items-center gap-4">
          <button onClick={() => setLiked(!liked)} className="transition-transform active:scale-90">
            <Heart className={`h-6 w-6 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground hover:text-muted-foreground'}`} />
          </button>
          <button className="transition-transform active:scale-90 text-foreground hover:text-muted-foreground">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button className="transition-transform active:scale-90 text-foreground hover:text-muted-foreground">
            <Send className="h-6 w-6" />
          </button>
        </div>
        <button onClick={() => setSaved(!saved)} className="transition-transform active:scale-90">
          <Bookmark className={`h-6 w-6 ${saved ? 'fill-foreground text-foreground' : 'text-foreground hover:text-muted-foreground'}`} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 md:px-0">
        <p className="text-sm font-semibold mb-1">{likesCount.toLocaleString()} likes</p>
        <p className="text-sm">
          <span className="font-semibold mr-2">{tool.name.toLowerCase().replace(/\s+/g, '_')}</span>
          Discover the top-rated tool for {tool.category.toLowerCase()}. Used by thousands of developers and creators worldwide. Start building faster today! 🚀✨
        </p>
        <p className="text-sm text-muted-foreground mt-1 cursor-pointer">View all {Math.floor(tool.score * 3)} comments</p>
        
        {/* Add comment */}
        <div className="flex items-center justify-between mt-2">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="text-sm bg-transparent border-none outline-none flex-1 placeholder:text-muted-foreground" 
          />
          <button className="text-sm font-semibold text-brand hover:text-foreground hidden">Post</button>
        </div>
      </div>
    </article>
  );
}
