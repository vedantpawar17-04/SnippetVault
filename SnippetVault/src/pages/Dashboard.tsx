
import React, { useState, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useSnippets } from '../context/SnippetContext';
import { useAuth } from '../context/AuthContext';
import SnippetCard from '../components/SnippetCard';
import SnippetEditor from '../components/SnippetEditor';
import UIBlocks from '../components/UIBlocks';
import type{ Snippet } from '../types';
import { Link } from 'react-router-dom';

const { useNavigate } = ReactRouterDOM;

const Dashboard: React.FC = () => {
  const { snippets } = useSnippets();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'ui-blocks'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredSnippets = useMemo(() => {
    return snippets
      .filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             s.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = activeFilter === 'all' || (activeFilter === 'favorites' && s.isFavorite);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [snippets, searchQuery, activeFilter]);

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingSnippet(undefined);
    setIsEditorOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#030712] relative overflow-x-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* FIXED Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-70 border-r border-white/5 flex flex-col bg-[#030712] z-50 
        transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="p-8 pb-10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <Link 
            className="text-xl font-black text-white tracking-tighter"
            to="/">SnippetVault</Link>
          </div>
          <button 
           title='Side Open Bar'
           className="lg:hidden text-gray-500 hover:text-white transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-grow px-4 space-y-2 overflow-y-auto scrollbar-hide">
          {[
            { id: 'all', label: 'All Snippets', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> },
            { id: 'favorites', label: 'Favorites', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21l7-7z"></path></svg> },
            { id: 'ui-blocks', label: 'UI Blocks', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setActiveFilter(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeFilter === item.id ? 'bg-white/5 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className={activeFilter === item.id ? 'text-[#6366f1]' : ''}>{item.icon}</span>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer - Perfectly neat and clean User Card with Sign Out */}
        <div className="p-5 shrink-0 border-t border-white/5 bg-[#030712] mt-auto">
          <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/10 rounded-[1.5rem] shadow-2xl transition-all hover:bg-white/[0.05]">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm shadow-inner">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate leading-none mb-1">{user?.name}</span>
                <span className="text-[10px] text-gray-500 truncate font-black uppercase tracking-[0.1em] leading-none">Active Session</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
              title="Sign Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-72 p-6 sm:p-8 lg:p-12 min-w-0 min-h-screen flex flex-col">
        <header className="flex flex-col md:flex-row items-start justify-between mb-8 lg:mb-16 gap-6 shrink-0">
          <div className="space-y-2 flex-grow">
            <div className="flex items-center space-x-4">
              <button 
                title='Set Open Side Bar'
                className="lg:hidden p-2.5 bg-[#0F172A] border border-white/5 rounded-xl text-gray-400 active:scale-95 transition-all shadow-lg"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <h1 className="text-xl sm:text-xl md:text-sm lg:text-xl font-black text-white tracking-tight">
                {activeFilter === 'ui-blocks' ? 'UI Blocks Library' : 'SnippetVault Dashboard'}
              </h1>
            </div>
            <p className="text-gray-500 font-medium text-base lg:text-lg">
              {activeFilter === 'ui-blocks' ? 'Rapid design patterns for React + Tailwind.' : 'Your personal library of reusable logic.'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Header Profile Block removed on mobile/tablet to clean up layout. Action moved to sidebar. */}

            {activeFilter !== 'ui-blocks' && (
              <>
                <div className="relative group flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search vault..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 lg:w-50 bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-all shadow-xl focus:border-indigo-500/30"
                  />
                </div>
                <button 
                  onClick={handleCreate}
                  className="flex items-center lg:w-44 justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-2xl font-black text-sm shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  <span>New Snippet</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-grow">
          {activeFilter === 'ui-blocks' ? (
            <UIBlocks />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-12">
              {filteredSnippets.map(snippet => (
                <SnippetCard key={snippet.id} snippet={snippet} onEdit={handleEdit} />
              ))}
              {filteredSnippets.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                   </div>
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No matches found in your vault</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Overlays */}
      <SnippetEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        snippet={editingSnippet} 
      />
    </div>
  );
};

export default Dashboard;
