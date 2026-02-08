import React, { useState } from 'react';
import type { Snippet } from '../types';
import { useSnippets } from '../context/SnippetContext';

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, onEdit }) => {
  const { toggleFavorite, deleteSnippet } = useSnippets();
  const [isCopied, setIsCopied] = useState(false);

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(snippet.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSnippet(snippet.id);
  };

  const getLangIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="16" height="16" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2.5" 
    strokeLinecap="round" strokeLinejoin="round" 
    className="text-[#38BDF8]">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );

  const formatDate = (date: string | number) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpdated =
    snippet.updatedAt &&
    snippet.createdAt &&
    Math.abs(
      new Date(snippet.updatedAt).getTime() -
        new Date(snippet.createdAt).getTime()
    ) > 60000;


  return (
    <div
      onClick={() => onEdit(snippet)}
      className="group 
      relative 
      bg-[#0F172A] 
      border border-white/5 
      rounded-2xl 
      overflow-hidden 
      hover:border-white/10 
      transition-all 
      shadow-xl 
      cursor-pointer 
      flex flex-col h-full"
    >
      <div className="p-6 space-y-5 flex-grow">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#1E293B] p-2 rounded-lg">
            {getLangIcon()}
          </div>
          <h3 className="font-bold text-white text-base leading-tight line-clamp-1">
            {snippet.title}
          </h3>
        </div>

        {/* Code Preview */}
        <div className="bg-[#030712] rounded-xl p-5 border border-white/5 min-h-[120px] max-h-[160px] overflow-hidden relative">
          <pre className="code-font text-xs text-gray-400 whitespace-pre leading-relaxed">
            {snippet.code}
          </pre>
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60"></div>
        </div>

        {/* User + Actions */}
        <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
          {snippet.user &&
            typeof snippet.user === 'object' &&
            (snippet.user as any).name && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-gray-300">
                  @{(snippet.user as any).name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    title="Favorite"
                    onClick={handleFavorite}
                    className={`p-1 transition-colors ${
                      snippet.isFavorite
                        ? 'text-pink-500'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill={snippet.isFavorite ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round">
                      <path d="
                      M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21l7-7z"></path>
                    </svg>
                  </button>

                  <button
                    title="Copy Code"
                    onClick={copyCode}
                    className="p-1 text-gray-500 hover:text-white transition-colors"
                  >
                    {isCopied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#4ade80" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
            <span>{formatDate(snippet.createdAt)}</span>
            {isUpdated && snippet.updatedAt && (
              <span className="italic text-gray-600">
                Edited {formatDate(snippet.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex items-center justify-between mt-auto">
        <span className="px-2 py-1 rounded bg-[#1E293B] text-[10px] font-black text-[#38BDF8] uppercase tracking-widest border border-white/5">
          {snippet.language}
        </span>


        <button
          title="Delete"
          onClick={handleDelete}
          className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2-2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
export default SnippetCard;
