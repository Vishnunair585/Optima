import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  BarChart2, ShieldCheck, Users, Zap, Search, Layers, 
  TrendingUp, Globe, Lock, Code, Building, GraduationCap, 
  PenTool, CheckCircle2, SearchCode
} from "lucide-react";
import { MOCK_DB } from "../lib/data/mock-intelligence";
import STACKS_DATA from "../lib/data/public_stacks.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Optima — The AI Discovery & Decision Platform" },
      { name: "description", content: "Optima is helping individuals and businesses discover, compare, and build with the right AI tools using structured data, not hype." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Optima",
    "description": "Optima is an AI discovery and decision platform that helps users find, compare, rank, and build workflows using the best AI tools based on structured data instead of hype.",
    "publisher": {
      "@type": "Organization",
      "name": "Optima",
      "url": "https://optima.com"
    }
  };

  const stats = {
    tools: MOCK_DB.tools.length,
    stacks: STACKS_DATA.length,
    categories: Array.from(new Set(MOCK_DB.tools.map(t => t.category))).length
  };

  return (
    <div className="animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-brand/20 opacity-30 blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
            Helping people discover the right AI tools <span className="text-transparent bg-clip-text bg-gradient-brand">with confidence.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Optima is an AI discovery and decision platform that helps users find, compare, rank, and build workflows using the best AI tools based on structured data instead of hype.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/finder" className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-8 text-base font-semibold text-brand-foreground shadow-glow hover:bg-brand/90 transition-all">
              Explore AI Tools
            </Link>
            <Link to="/rankings" className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-8 text-base font-semibold text-foreground hover:bg-accent transition-all">
              View Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand">Our Mission</h2>
            <h3 className="text-3xl font-bold">Cutting through the noise.</h3>
            <p className="text-muted-foreground leading-relaxed">
              Today's AI ecosystem is overwhelmed by too many tools, fake reviews, sponsored rankings, and scattered information. Finding what actually works is a massive challenge.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to solve this by providing a unified, data-driven platform where individuals and businesses can discover the right tools without falling for empty marketing promises.
            </p>
          </div>
          <div className="space-y-6 bg-card/30 p-8 rounded-3xl border border-border/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Our Vision</h2>
            <h3 className="text-3xl font-bold">The definitive AI source.</h3>
            <p className="text-muted-foreground leading-relaxed">
              We are building the world's most trusted AI discovery platform—a hybrid of IMDb, GitHub, and Product Hunt designed specifically for artificial intelligence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We envision a future where everyone from solo developers to enterprise executives can choose their AI stack confidently and transparently.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Makes Optima Different</h2>
          <p className="text-muted-foreground">We aren't a generic directory. We are a dynamic intelligence engine built for transparency.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BarChart2, title: "Data-Driven Rankings", desc: "No manual sorting. Our intelligence engine continuously computes scores based on measurable signals." },
            { icon: ShieldCheck, title: "No Pay-to-Rank", desc: "We strictly prohibit sponsored rankings. Positioning is earned through quality, never bought." },
            { icon: Users, title: "Real Community Reviews", desc: "Verified feedback from professionals actively using the tools in production environments." },
            { icon: Layers, title: "AI Workflow Stacks", desc: "Discover over 500+ real-world AI workflows and automation stacks curated by the community." },
            { icon: Search, title: "Deep Comparison Engine", desc: "Compare tools side-by-side on pricing, models, enterprise readiness, and feature completeness." },
            { icon: TrendingUp, title: "Continuous Updates", desc: "Our background crawlers detect pricing changes, new features, and deprecations automatically." }
          ].map((feature, i) => (
            <div key={i} className="bg-card/40 border border-border p-6 rounded-2xl hover:bg-card transition-colors">
              <feature.icon className="h-8 w-8 text-brand mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How Rankings Work */}
      <section className="bg-muted/20 border-y border-border/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">How Rankings Work</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our dynamic ranking engine evaluates tools continuously. While no system is perfect, our methodology is entirely transparent and algorithmically driven.
              </p>
              <ul className="space-y-4">
                {[
                  "Performance & Reliability (Uptime, speed)",
                  "Community Feedback & Sentiment",
                  "Growth & Popularity Velocity",
                  "Feature Completeness & Innovation",
                  "Pricing Value & Accessibility"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <h3 className="font-mono text-sm uppercase text-brand mb-4">Algorithm Weights</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm font-medium"><span>User Reviews</span> <span>40%</span></div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-brand w-[40%]"></div></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm font-medium"><span>Growth Velocity</span> <span>30%</span></div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-brand w-[30%]"></div></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm font-medium"><span>Market Popularity</span> <span>20%</span></div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-brand w-[20%]"></div></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm font-medium"><span>Reliability</span> <span>10%</span></div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-brand w-[10%]"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values & Who It's For */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">Our Core Values</h2>
            <div className="space-y-6">
              {[
                { title: "Transparency", desc: "No hidden algorithms or secret scoring systems." },
                { title: "Accuracy", desc: "We rely on structured, verified data over marketing hype." },
                { title: "Community", desc: "Built for the people who actually use AI in production." },
                { title: "Security & Privacy", desc: "Enterprise-grade standards for data protection." }
              ].map((v, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-lg">{v.title}</h4>
                    <p className="text-muted-foreground">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-8">Who Optima Is For</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Code, label: "Developers" },
                { icon: Building, label: "Startups" },
                { icon: PenTool, label: "Designers" },
                { icon: SearchCode, label: "Researchers" },
                { icon: Globe, label: "Marketers" },
                { icon: GraduationCap, label: "Students" },
                { icon: Users, label: "Agencies" },
                { icon: Briefcase, label: "Businesses" }
              ].map((Audience, i) => (
                <div key={i} className="flex items-center gap-3 bg-card/50 border border-border p-4 rounded-xl">
                  <Audience.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{Audience.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="bg-brand text-brand-foreground py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Platform at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold mb-2">{stats.tools}+</div>
              <div className="text-brand-foreground/80 font-medium uppercase tracking-wider text-sm">AI Tools Indexed</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold mb-2">{stats.categories}</div>
              <div className="text-brand-foreground/80 font-medium uppercase tracking-wider text-sm">Categories</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold mb-2">{stats.stacks}+</div>
              <div className="text-brand-foreground/80 font-medium uppercase tracking-wider text-sm">Public Stacks</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold mb-2">24/7</div>
              <div className="text-brand-foreground/80 font-medium uppercase tracking-wider text-sm">Continuous Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment & FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
          <p className="text-xl text-muted-foreground">User-first decisions. Always.</p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">How are rankings calculated?</h3>
            <p className="text-muted-foreground text-sm">Rankings are computed dynamically using a weighted algorithm analyzing user reviews, growth velocity, and technical reliability. We publish our methodology publicly.</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">Can companies pay for rankings?</h3>
            <p className="text-muted-foreground text-sm">Absolutely not. We maintain a strict zero pay-to-rank policy to ensure absolute integrity in our discovery engine.</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">How often is Optima updated?</h3>
            <p className="text-muted-foreground text-sm">Our market intelligence background workers run continuously to capture new releases, pricing updates, and feature rollouts.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center pb-32">
        <h2 className="text-3xl font-bold mb-8">Ready to build the future?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/finder" className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-8 text-base font-semibold text-brand-foreground shadow-glow hover:bg-brand/90 transition-all">
            Find Your Tool
          </Link>

        </div>
      </section>
    </div>
  );
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}
