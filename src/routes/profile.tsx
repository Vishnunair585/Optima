import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Bookmark, LogOut, Sparkles, LogIn, ChevronRight, Layers, ExternalLink } from "lucide-react";
import { ProtectedRoute } from "../components/auth/route-guard";
import { getStacksFn } from "../lib/api/stack.functions";

import { PROMPTS } from "../lib/data/prompts";

type UserStack = Awaited<ReturnType<typeof getStacksFn>>[number];

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Optima" },
      { name: "description", content: "View your saved AI stacks, prompts, and profile settings." },
    ],
    links: [{ rel: "canonical", href: "/profile" }],
  }),
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

function ProfilePage() {
  const { user, logout, updateAvatar } = useAuth();
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [myStacks, setMyStacks] = useState<UserStack[]>([]);
  const [bookmarkedStacks, setBookmarkedStacks] = useState<UserStack[]>([]);
  const [loadingStacks, setLoadingStacks] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const { updateUsername } = useAuth();
  const navigate = useNavigate();

  const [savedPublicStacks, setSavedPublicStacks] = useState<any[]>([]);
  const [savedPerfectAiStacks, setSavedPerfectAiStacks] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("saved_prompts") ?? "[]");
        setSavedPrompts(stored);
        
        const storedStacks = JSON.parse(localStorage.getItem("saved_public_stacks") ?? "[]");
        setSavedPublicStacks(storedStacks);

        const storedPerfectStacks = JSON.parse(localStorage.getItem("saved_perfect_ai_stacks") ?? "[]");
        setSavedPerfectAiStacks(storedPerfectStacks);
      } catch {
        setSavedPrompts([]);
        setSavedPublicStacks([]);
        setSavedPerfectAiStacks([]);
      }
    }
  }, [user]);

  useEffect(() => {
    async function loadStacks() {
      if (!user?.id) {
        setLoadingStacks(false);
        return;
      }
      setLoadingStacks(true);
      try {
        const [created, bookmarked] = await Promise.all([
          getStacksFn({ userId: user.id, limit: 50 }),
          getStacksFn({ savedByUserId: user.id, limit: 50 }),
        ]);
        setMyStacks(created);
        setBookmarkedStacks(bookmarked);
      } catch {
        setMyStacks([]);
        setBookmarkedStacks([]);
      } finally {
        setLoadingStacks(false);
      }
    }
    loadStacks();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user?.name) {
      setIsEditingName(false);
      return;
    }
    await updateUsername(newName.trim());
    setIsEditingName(false);
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-3xl glass p-8 text-center space-y-6">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-card border border-border text-muted-foreground shadow-glow">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Sign in to view stats</h2>
            <p className="mt-2 text-sm text-muted-foreground">Log in to view your saved AI stacks and prompts.</p>
          </div>
          <Link to="/login" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-brand text-sm font-semibold text-brand-foreground shadow-glow">
            <LogIn className="h-4 w-4" /> Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const savedPromptDetails = savedPrompts
    .map((title) => PROMPTS.find((p) => p.title === title))
    .filter(Boolean) as typeof PROMPTS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-10 animate-fade-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-6">
          <div className="relative group shrink-0">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-brand text-3xl font-bold text-brand-foreground shadow-glow overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="opacity-80">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-3xl bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              <span className="text-xs font-semibold text-white">Edit</span>
            </label>
          </div>
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-10 rounded-md border border-border bg-card px-3 text-lg font-bold outline-none focus:border-brand"
                  autoFocus
                />
                <button onClick={handleUpdateName} className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90">Save</button>
                <button onClick={() => { setIsEditingName(false); setNewName(user.name); }} className="rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-accent">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                <button onClick={() => setIsEditingName(true)} className="text-xs text-brand hover:underline">Edit</button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-medium hover:bg-destructive/15 hover:text-destructive hover:border-destructive/30 transition-all self-start sm:self-center">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </header>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3 pb-4">
        <a href="#saved-prompts" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium hover:bg-accent/80 transition-colors">
          <Sparkles className="h-4 w-4 text-brand" /> Saved Prompts
        </a>
        <a href="#saved-public-stacks" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium hover:bg-accent/80 transition-colors">
          <Layers className="h-4 w-4 text-brand" /> Saved Stacks
        </a>
        <a href="#saved-perfect-ai-stacks" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium hover:bg-accent/80 transition-colors">
          <Bookmark className="h-4 w-4 text-brand" /> Saved Perfect AI Stacks
        </a>
      </div>

      {/* Saved Public Stacks */}
      <section id="saved-public-stacks" className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="h-5 w-5 text-brand" />
          Saved Public Stacks ({savedPublicStacks.length})
        </h2>

        {savedPublicStacks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedPublicStacks.map((stack) => (
              <Link
                key={stack.id}
                to={`/stacks/${stack.id}`}
                className="rounded-2xl glass p-5 flex flex-col gap-2 hover:bg-card/60 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm group-hover:text-brand transition-colors">{stack.title}</h3>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{stack.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                    {stack.category}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {stack.tools?.length ?? 0} tools
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No public stacks saved yet. Explore the <Link to="/stacks" className="text-brand hover:underline">Public Stacks Library</Link> to find useful workflows.
          </div>
        )}
      </section>

      {/* Bookmarked Stacks */}
      {bookmarkedStacks.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-brand" />
            Bookmarked Stacks ({bookmarkedStacks.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {bookmarkedStacks.map((stack) => (
              <Link
                key={stack.id}
                to={`/stacks/${stack.id}`}
                className="rounded-2xl glass p-5 flex items-center justify-between hover:bg-card/60 transition-all"
              >
                <div>
                  <h3 className="font-semibold text-sm">{stack.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    by {stack.creator_name || "User"} · {stack.toolCount ?? 0} tools
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Saved Prompts */}
      <section id="saved-prompts" className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand" />
          My Saved Prompts ({savedPrompts.length})
        </h2>

        {savedPromptDetails.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedPromptDetails.map((prompt) => (
              <div key={prompt.title} className="rounded-2xl glass p-5 flex flex-col gap-2 hover:bg-card/60 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{prompt.title}</h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                    {prompt.cat}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{prompt.body}</p>
                <Link to="/prompts" className="text-xs text-brand hover:underline mt-1 inline-flex items-center gap-1">
                  View in Prompt Library <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No prompts saved yet. Go to the <Link to="/prompts" className="text-brand hover:underline">Prompt Library</Link> to save some.
          </div>
        )}
      </section>

      {/* Saved Perfect AI Stacks */}
      <section id="saved-perfect-ai-stacks" className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-brand" />
          Saved Perfect AI Stacks ({savedPerfectAiStacks.length})
        </h2>

        {savedPerfectAiStacks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedPerfectAiStacks.map((stack, idx) => (
              <div key={idx} className="rounded-2xl glass p-5 flex flex-col gap-2 hover:bg-card/60 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{stack.answers.goal ?? "Custom Workflow"}</h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                    {new Date(stack.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {stack.tools.map((t: any) => (
                    <span key={t.name} className="text-xs bg-accent text-foreground px-2 py-0.5 rounded-md border border-border/50">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            There is no saved item. Go to the <Link to="/finder" className="text-brand hover:underline">AI Finder</Link> to save that.
          </div>
        )}
      </section>
    </div>
  );
}
