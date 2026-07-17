import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { BrainCircuit, Database, Activity, GitCommit, Settings, CheckCircle, XCircle } from 'lucide-react'

export const Route = createFileRoute('/admin/intelligence')({
  component: IntelligenceAdminPage,
})

function IntelligenceAdminPage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'sources' | 'analytics'>('queue')

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0f0f11] p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 text-purple-400">
          <BrainCircuit className="w-8 h-8" />
          <span className="text-xl font-bold font-display tracking-tight text-white">Optima Intel</span>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <NavItem 
            icon={<CheckCircle className="w-5 h-5" />} 
            label="Approval Queue" 
            isActive={activeTab === 'queue'} 
            onClick={() => setActiveTab('queue')}
          />
          <NavItem 
            icon={<Database className="w-5 h-5" />} 
            label="Sources" 
            isActive={activeTab === 'sources'} 
            onClick={() => setActiveTab('sources')}
          />
          <NavItem 
            icon={<Activity className="w-5 h-5" />} 
            label="Analytics" 
            isActive={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <div className="w-96 h-96 bg-purple-600 rounded-full blur-[120px]" />
        </div>

        <header className="mb-10 relative z-10">
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Market Intelligence</h1>
          <p className="text-white/60 text-lg">Manage the automated data ingestion and classification pipeline.</p>
        </header>

        <div className="relative z-10">
          {activeTab === 'queue' && <ApprovalQueueView />}
          {activeTab === 'sources' && <SourcesView />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        isActive ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'text-white/60 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function ApprovalQueueView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display">Pending Approvals</h2>
        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30">
          3 Items Pending
        </span>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-6 hover:border-white/20 transition-colors group">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/10 text-white/80 px-2 py-0.5 rounded text-xs font-semibold tracking-wider">AI TOOL</span>
                <span className="text-white/40 text-sm">Source: ycombinator.com/rss</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">Project Omega {i}</h3>
              <p className="text-white/60 mb-4 line-clamp-2">A new foundational model focusing on multi-modal reasoning and autonomous agent capabilities. Generated summary suggests high impact on existing tool stacks.</p>
              <div className="flex items-center gap-4">
                <span className="text-green-400 text-sm font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Confidence: 92%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">Approve</button>
              <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white/70 font-medium rounded-lg transition-colors">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SourcesView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display">Data Sources</h2>
        <button className="px-5 py-2 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">
          Add Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Hugging Face API', 'Y Combinator RSS', 'GitHub Trending', 'Product Hunt API'].map((source, idx) => (
          <div key={idx} className="bg-[#121214] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                {idx % 2 === 0 ? <GitCommit className="w-6 h-6 text-purple-400" /> : <Activity className="w-6 h-6 text-blue-400" />}
              </div>
              <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <h3 className="text-xl font-bold mb-1">{source}</h3>
            <p className="text-white/50 text-sm mb-4">Polls every 60 minutes</p>
            
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm">
              <span className="text-white/40">Last run: 12m ago</span>
              <span className="text-white/40">0 errors</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display mb-6">Pipeline Analytics</h2>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Tools Ingested (24h)', value: '142', trend: '+12%' },
          { label: 'News Articles Processed', value: '89', trend: '+5%' },
          { label: 'Failed Extractions', value: '3', trend: '-2%' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-white/60 text-sm font-medium mb-2">{stat.label}</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-display font-bold text-white">{stat.value}</span>
              <span className="text-sm font-medium text-green-400 mb-1">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-64 flex items-center justify-center">
        <p className="text-white/40 font-medium">Analytics charts placeholder (Chart.js / Recharts)</p>
      </div>
    </div>
  )
}
