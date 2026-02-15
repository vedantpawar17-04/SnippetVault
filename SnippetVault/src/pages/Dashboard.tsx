import React, { useState, useMemo, useEffect } from "react";
import { useSnippets } from "../context/SnippetContext";
import { useAuth } from "../context/AuthContext";
import SnippetCard from "../components/SnippetCard";
import SnippetEditor from "../components/SnippetEditor";
import SnippetViewCard from "../components/SnippetViewCard";
import UIBlocks from "../components/UIBlocks";
import Sidebar from "../components/Sidebar";
import type { Snippet } from "../types";
import "../index.css";

const Dashboard: React.FC = () => {
  useEffect(() => {
    // Allow scrolling on Dashboard
    document.body.style.overflow = "auto";

    return () => {
      // Restore original global rule when leaving Dashboard
      document.body.style.overflow = "hidden";
    };
  }, []);

  const { snippets } = useSnippets();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "favorites" | "ui-blocks" | "similar"
  >("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>(
    undefined,
  );
  const [viewingSnippet, setViewingSnippet] = useState<Snippet | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredSnippets = useMemo(() => {
    return snippets
      .filter((s) => {
        const matchesSearch =
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          );

        const matchesFilter =
          activeFilter === "all" ||
          activeFilter === "similar" ||
          (activeFilter === "favorites" && s.isFavorite);

        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [snippets, searchQuery, activeFilter]);

  // Enhancement: Filter for unique snippets in "All Snippets" view
  // and non-unique ones in "Similar Logic" view
  const displaySnippets = useMemo(() => {
    // 1. First, sort all snippets so my own come first (for deduplication priority)
    const sorted = [...filteredSnippets].sort((a, b) => {
      const isAOwner = (typeof a.user === 'object' ? (a.user as any)?._id || (a.user as any)?.id : a.user) === user?.id;
      const isBOwner = (typeof b.user === 'object' ? (b.user as any)?._id || (b.user as any)?.id : b.user) === user?.id;
      
      if (isAOwner && !isBOwner) return -1;
      if (!isAOwner && isBOwner) return 1;
      
      // Secondary sort by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const seen = new Set<string>();
    const unique: Snippet[] = [];
    const duplicates: Snippet[] = [];

    sorted.forEach((s) => {
      // Normalize code to check for uniqueness (remove whitespace)
      const normalized = s.code.replace(/\s+/g, "").toLowerCase();
      if (seen.has(normalized)) {
        duplicates.push(s);
      } else {
        seen.add(normalized);
        unique.push(s);
      }
    });

    if (activeFilter === "all") return unique;
    if (activeFilter === "similar") return duplicates;
    return filteredSnippets; // Fallback for favorites/ui-blocks
  }, [filteredSnippets, activeFilter, user]);

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingSnippet(undefined);
    setIsEditorOpen(true);
  };

  const handleView = (snippet: Snippet) => {
    setViewingSnippet(snippet);
  };

  return (
    <div className="flex min-h-screen bg-[#030712] relative overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        user={user}
      />

      {/* Main Content */}
      <main className="flex-grow lg:ml-72 p-6 sm:p-8 lg:p-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-white text-wrap">
                {activeFilter === "ui-blocks"
                  ? "UI Blocks Library"
                  : activeFilter === "similar"
                  ? "Structurally Similar Snippets"
                  : "SnippetVault Dashboard"}
              </h1>
              <p className="text-gray-500">
                {activeFilter === "ui-blocks"
                  ? "Rapid design patterns for React + Tailwind."
                  : activeFilter === "similar"
                  ? "Logic patterns with shared structural elements."
                  : "Your personal library of unique logic."}
              </p>
            </div>
          </div>

          {activeFilter !== "ui-blocks" && (
            <div className="flex gap-4 flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Search vault..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0F172A] border border-white/5 rounded-xl px-5 py-3 text-white"
              />
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold"
              >
                New Snippet
              </button>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-grow">
          {activeFilter === "ui-blocks" ? (
            <UIBlocks />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displaySnippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              ))}

              {displaySnippets.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500">
                  No matches found in your vault
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      <SnippetEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        snippet={editingSnippet}
      />

      {/* View Modal */}
      {viewingSnippet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <SnippetViewCard
              snippet={viewingSnippet}
              onClose={() => setViewingSnippet(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;