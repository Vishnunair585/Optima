import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { getLegalDocVersions, saveLegalDocDraft, publishLegalDocVersion, LegalDocType, LegalDocumentVersion } from '../services/legal-docs';
import { useAuth } from '../hooks/use-auth';
import { FileText, Save, Send, History, AlertCircle, CheckCircle2, ChevronDown, PenTool } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Route = createFileRoute('/admin/legal-documents')({
  component: AdminLegalPage,
});

function AdminLegalPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<LegalDocType>('privacy-policy');
  const [versions, setVersions] = useState<LegalDocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState('');
  const [newVersionId, setNewVersionId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // In a real app, you would check if `profile?.role === 'Super Admin'` here.
  
  const loadVersions = async (type: LegalDocType) => {
    setLoading(true);
    const data = await getLegalDocVersions(type);
    setVersions(data);
    
    // Auto-populate editor with latest content
    if (data.length > 0) {
      setEditingContent(data[0].content);
      // bump patch version
      const v = data[0].versionId.replace(/[^0-9.]/g, '').split('.');
      if (v.length === 3) {
        setNewVersionId(`v${v[0]}.${v[1]}.${parseInt(v[2]) + 1}`);
      }
    } else {
      setNewVersionId('v1.0.0');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVersions(activeTab);
  }, [activeTab]);

  const handleSaveDraft = async () => {
    if (!user) return;
    try {
      setMessage(null);
      await saveLegalDocDraft(activeTab, newVersionId, editingContent, user.uid);
      setMessage({ type: 'success', text: `Draft ${newVersionId} saved successfully!` });
      loadVersions(activeTab);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save draft' });
    }
  };

  const handlePublish = async (versionId: string) => {
    if (!confirm(`Are you sure you want to publish ${versionId}? This will go live immediately.`)) return;
    
    try {
      setMessage(null);
      await publishLegalDocVersion(activeTab, versionId);
      setMessage({ type: 'success', text: `Version ${versionId} is now live!` });
      loadVersions(activeTab);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to publish version' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Legal Document Management (CMS)</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button 
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'privacy-policy' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
            onClick={() => setActiveTab('privacy-policy')}
          >
            Privacy Policy
          </button>
          <button 
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'terms-of-service' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
            onClick={() => setActiveTab('terms-of-service')}
          >
            Terms of Service
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2"><PenTool className="w-5 h-5" /> Editor</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Version:</span>
                  <input 
                    type="text" 
                    value={newVersionId}
                    onChange={(e) => setNewVersionId(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm w-24 focus:border-blue-500 outline-none" 
                  />
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${!previewMode ? 'bg-white/20 text-white' : 'bg-black/40 text-white/50'}`}
                >
                  Write Markdown
                </button>
                <button 
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${previewMode ? 'bg-white/20 text-white' : 'bg-black/40 text-white/50'}`}
                >
                  Preview
                </button>
              </div>

              {previewMode ? (
                <div className="h-[600px] overflow-y-auto bg-black/40 rounded-xl p-6 border border-white/10 prose prose-invert max-w-none">
                  <ReactMarkdown>{editingContent}</ReactMarkdown>
                </div>
              ) : (
                <textarea 
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full h-[600px] bg-black/40 rounded-xl p-6 border border-white/10 text-white/80 font-mono text-sm focus:outline-none focus:border-blue-500/50 resize-none leading-relaxed"
                  placeholder="Start writing markdown..."
                />
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={handleSaveDraft}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Draft
                </button>
                <button 
                  onClick={() => handlePublish(newVersionId)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" /> Publish Now
                </button>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-[calc(100vh-12rem)] overflow-y-auto">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-6"><History className="w-5 h-5" /> Version History</h2>
              
              {loading ? (
                <p className="text-white/40">Loading history...</p>
              ) : versions.length === 0 ? (
                <p className="text-white/40 italic">No versions found.</p>
              ) : (
                <div className="space-y-4">
                  {versions.map(v => (
                    <div key={v.versionId} className="p-4 bg-black/40 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-lg">{v.versionId}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            v.status === 'published' ? 'bg-green-500/20 text-green-400' : 
                            v.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/40'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                        {v.status !== 'published' && (
                          <button 
                            onClick={() => handlePublish(v.versionId)}
                            title="Publish this version"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-white/40 space-y-1">
                        <p>Created: {new Date(v.createdAt?.toDate?.() || Date.now()).toLocaleString()}</p>
                        {v.publishedAt && <p>Published: {new Date(v.publishedAt?.toDate?.()).toLocaleString()}</p>}
                      </div>
                      <button 
                        onClick={() => {
                          setEditingContent(v.content);
                          setNewVersionId(v.versionId + '-edit');
                        }}
                        className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                      >
                        Load into Editor
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
