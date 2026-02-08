
import React, { useState } from 'react';
import type { UIBlock } from './UIBlocks';

interface UIBlockModalProps {
  block: UIBlock;
  onClose: () => void;
}

const UIBlockModal: React.FC<UIBlockModalProps> = ({ block, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>(block.type === 'setup' ? 'code' : 'preview');
  const [isCopied, setIsCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(block.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#030712] w-full max-w-[1000px] h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">{block.title}</h2>
            <p className="text-gray-500 text-sm font-medium">{block.description}</p>
          </div>
          <button 
            title='Close Modal'
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#030712] px-8 py-4 border-b border-white/5 gap-6 shrink-0">
           {block.type !== 'setup' && (
             <button 
              onClick={() => setActiveTab('preview')}
              className={`text-sm font-black uppercase tracking-widest transition-all relative py-2 ${activeTab === 'preview' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
             >
               Live Preview
               {activeTab === 'preview' && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-full"></span>}
             </button>
           )}
           <button 
            onClick={() => setActiveTab('code')}
            className={`text-sm font-black uppercase tracking-widest transition-all relative py-2 ${activeTab === 'code' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
           >
             {block.type === 'setup' ? 'Setup Details' : 'Code Export'}
             {activeTab === 'code' && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-full"></span>}
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 scrollbar-custom">
          {activeTab === 'preview' ? (
            <div className="h-full min-h-[400px] w-full bg-[#030712] border border-white/5 rounded-[2rem] overflow-hidden relative shadow-inner">
               {block.previewComponent}
               {!block.previewComponent && (
                 <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-bold italic uppercase tracking-widest">
                   No Interactive Preview Available
                 </div>
               )}
            </div>
          ) : (
            <div className="space-y-10">
              {block.type === 'setup' && block.instructions && (
                <div className="space-y-6">
                   <h3 className="text-lg font-black text-white flex items-center gap-3">
                     <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                     Configuration Steps
                   </h3>
                   <div className="grid grid-cols-1 gap-4">
                     {block.instructions.map((step, idx) => (
                       <div key={idx} className="flex items-start gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl">
                         <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-black text-xs text-white shrink-0">
                           {idx + 1}
                         </span>
                         <p className="text-gray-300 text-sm font-medium leading-relaxed">{step}</p>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                    Source Implementation
                  </h3>
                  <button 
                    onClick={copyCode}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                  >
                    {isCopied ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2rem] shadow-inner relative group">
                  <pre className="code-font text-sm text-indigo-200/80 leading-relaxed whitespace-pre overflow-x-auto pb-4">
                    {block.code}
                  </pre>
                  <div className="absolute top-4 right-4 opacity-10 font-black text-6xl pointer-events-none select-none uppercase italic tracking-tighter">
                    {block.type}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UIBlockModal;
