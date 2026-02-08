import React, { useState, useEffect, useRef } from 'react';
import type { Snippet } from '../types';
import { useSnippets } from '../context/SnippetContext';
import '../styles/scrollbar.css';

interface SnippetEditorProps {
  snippet?: Snippet;
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  'React',
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'Python',
  'Go',
  'Rust',
  'JSON',
  'Markdown',
];

const SnippetEditor: React.FC<SnippetEditorProps> = ({ snippet, isOpen, onClose }) => {
  const { addSnippet, updateSnippet } = useSnippets();
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    language: 'JavaScript',
    code: '',
    tagsString: '',
    isFavorite: false,
    interviewAnswer: '',
    syntax: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (snippet) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        tagsString: snippet.tags.join(', '),
        isFavorite: snippet.isFavorite,
        interviewAnswer: snippet.interviewAnswer || '',
        syntax: snippet.syntax ? (typeof snippet.syntax === 'string' ? snippet.syntax : snippet.syntax.name) : '',
      });
    } else {
      setFormData({
        title: '',
        language: 'JavaScript',
        code: '',
        tagsString: '',
        isFavorite: false,
        interviewAnswer: '',
        syntax: '',
      });
    }
    setError(null);
  }, [snippet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.code.trim() || !formData.interviewAnswer.trim()) {
      setError('Title, Code and Interview Answer are required.');
      return;
    }

    const data = {
      title: formData.title.trim(),
      language: formData.language,
      code: formData.code.trim(),
      tags: formData.tagsString.split(',').map(t => t.trim()).filter(Boolean),
      isFavorite: formData.isFavorite,
      interviewAnswer: formData.interviewAnswer.trim(),
      syntax: formData.syntax.trim(),
    };

    try {
      if (snippet) {
         await updateSnippet(snippet.id, data);
      } else {
         await addSnippet(data);
      }
      onClose();
    } catch (err) {
      setError('Failed to save snippet');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" ref={modalRef}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-6xl h-full sm:h-[90vh] bg-[#020617] border border-white/10 rounded-none sm:rounded-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {snippet ? 'Edit Snippet' : 'Create Snippet'}
            </h2>
            <p className="text-sm text-gray-400">
              Save and organize your logic for future use.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white border border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-700 transition"
            >
              {snippet ? 'Update Snippet' : 'Save Snippet'}
            </button>
          </div>
        </header>

        {error && (
          <div className="px-6 py-2 text-sm text-red-400 border-b border-red-500/20">
            {error}
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-6 p-6 scroll-area">

          {/* Left */}
          <div className="flex flex-col flex-1 gap-6 overflow-hidden">

            {/* Syntax Input */}
            <div>
               <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Syntax</label>
               <input
                 value={formData.syntax}
                 onChange={e => setFormData({ ...formData, syntax: e.target.value })}
                 className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors placeholder-gray-600"
                 placeholder="Write the proper syntax here so others get the idea."
               />
            </div>

            {/* Code Editor */}
            <div className="flex flex-col flex-1 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 border-b border-white/10">
                Example Code
              </div>
              <textarea
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="flex-1 bg-transparent px-4 py-4 text-sm text-slate-200 resize-none focus:outline-none scroll-area"
                placeholder="// Paste your code here..."
                spellCheck={false}
              />
            </div>

            {/* Interview Answer */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 border-b border-white/10">
                Explanation
              </div>
              <textarea
                value={formData.interviewAnswer}
                onChange={e => setFormData({ ...formData, interviewAnswer: e.target.value })}
                className="w-full bg-transparent px-4 py-3 text-sm text-slate-300 resize-none focus:outline-none min-h-[90px] scroll-area"
                placeholder="Explain the logic clearly for interviews..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-5 overflow-y-auto scroll-area">

            <div className="border border-white/10 rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Snippet Title</label>
                <input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                  placeholder="Express JSON Body Parser"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Language</label>
                <select
                  title='Language selection'
                  value={formData.language}
                  onChange={e => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang} className="bg-[#020617]">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Tags</label>
                <input
                  value={formData.tagsString}
                  onChange={e => setFormData({ ...formData, tagsString: e.target.value })}
                  className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                  placeholder="backend, express"
                />
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-4 text-sm text-gray-400">
              <span className="text-violet-400 font-semibold">Pro Tip</span>
              <p className="mt-1">
                Always include a clear interview explanation. It helps you revise faster before interviews.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SnippetEditor;
