import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { getPublishedLegalDoc, LegalDocumentVersion } from '../services/legal-docs';
import { defaultTermsOfService } from '../data/legal/default-terms';
import ReactMarkdown from 'react-markdown';
import { Search, FileText, Clock, Info } from 'lucide-react';

export const Route = createFileRoute('/legal/terms')({
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  const [docData, setDocData] = useState<LegalDocumentVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('');
  
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const published = await getPublishedLegalDoc('terms-of-service');
        setDocData(published);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, []);

  const content = docData?.content || defaultTermsOfService;
  const version = docData?.versionId || '1.0.0 (Default)';
  const date = docData?.publishedAt 
    ? new Date(docData.publishedAt.toDate()).toLocaleDateString()
    : 'October 1, 2026';

  // Extract headings for TOC
  const headings = content
    .split('\n')
    .filter(line => line.startsWith('## '))
    .map(line => {
      const text = line.replace('## ', '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { id, text };
    });

  // Filter content based on search query
  const filteredContent = searchQuery 
    ? content.split('\n').filter(line => line.toLowerCase().includes(searchQuery.toLowerCase())).join('\n...\n')
    : content;

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      let currentActive = headings[0]?.id;
      for (const el of headingElements) {
        if (el && el.getBoundingClientRect().top <= 150) {
          currentActive = el.id;
        }
      }
      setActiveSection(currentActive || '');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const components = {
    h2: ({ node, ...props }: any) => {
      const id = props.children[0]?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h2 id={id} className="text-2xl font-bold mt-10 mb-4 text-white scroll-mt-24" {...props} />;
    },
    h3: ({ node, ...props }: any) => <h3 className="text-xl font-semibold mt-8 mb-3 text-white/90" {...props} />,
    p: ({ node, ...props }: any) => <p className="text-white/70 mb-4 leading-relaxed" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-4 text-white/70 space-y-2" {...props} />,
    li: ({ node, ...props }: any) => <li className="leading-relaxed" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="text-white font-semibold" {...props} />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/90 pt-24 pb-20 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">Terms of Service</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Effective Date: {date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Version: {version}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-3/4">
            
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search terms of service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                {searchQuery && filteredContent.length === 0 ? (
                  <p className="text-white/50 italic">No results found for "{searchQuery}"</p>
                ) : (
                  <ReactMarkdown components={components}>
                    {searchQuery ? filteredContent : content}
                  </ReactMarkdown>
                )}
              </div>
            )}
          </div>

          {/* Table of Contents (Sticky) */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Table of Contents</h4>
              <nav className="space-y-1 relative before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-white/10">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block pl-4 py-2 text-sm transition-colors relative before:absolute before:inset-y-0 before:left-0 before:w-px ${
                      activeSection === heading.id
                        ? 'text-indigo-400 font-medium before:bg-indigo-400'
                        : 'text-white/50 hover:text-white before:bg-transparent hover:before:bg-white/30'
                    }`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
