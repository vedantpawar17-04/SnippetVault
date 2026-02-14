import React from "react";
import type { Snippet } from "../types";
import { useSnippets } from "../context/SnippetContext";

interface Props {
  snippet: Snippet;
  onClose?: () => void;
}

const SnippetViewCard: React.FC<Props> = ({ snippet, onClose }) => {
  const { toggleFavorite } = useSnippets();

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(snippet.id);
  };

  return (
    <div className="bg-[#020617] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">

      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              {snippet.title}
            </h2>
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-colors ${
                snippet.isFavorite
                  ? 'text-pink-500 bg-pink-500/10'
                  : 'text-gray-500 hover:text-white bg-white/5'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill={snippet.isFavorite ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21l7-7z"></path>
              </svg>
            </button>
          </div>
          <p className="text-sm text-violet-400 mt-1">
            {snippet.language}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
          >
            Close
          </button>
        )}
      </div>

      {/* Tags */}
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {snippet.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-violet-600/20 text-violet-300 px-3 py-1 rounded-full border border-violet-600/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Syntax */}
      {(() => {
        const syntaxName = typeof snippet.syntax === 'object' && snippet.syntax !== null
          ? (snippet.syntax as any).name
          : snippet.syntax;
        
        if (!syntaxName || (typeof syntaxName === 'string' && syntaxName.trim() === "")) return null;

        return (
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Syntax</h3>
            <pre className="bg-[#0F172A] border border-white/10 rounded-lg p-4 text-sm text-slate-200 overflow-x-auto font-mono whitespace-pre-wrap">
              {syntaxName}
            </pre>
          </div>
        );
      })()}

      {/* Code */}
      <div>
        <h3 className="text-sm text-gray-400 mb-2">Example Code</h3>
        <pre className="bg-[#0F172A] border border-white/10 rounded-lg p-4 text-sm text-slate-200 overflow-x-auto font-mono">
          <code>{snippet.code}</code>
        </pre>
      </div>

      {/* Explanation */}
      {snippet.interviewAnswer && (
        <div>
          <h3 className="text-sm text-gray-400 mb-2">Explanation</h3>
          <div className="bg-[#0F172A] border border-white/10 rounded-lg p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {snippet.interviewAnswer}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetViewCard;