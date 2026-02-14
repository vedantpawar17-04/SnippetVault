import React, { useState, useMemo, useEffect } from "react";
import { useSnippets } from "../context/SnippetContext";
import { useAuth } from "../context/AuthContext";
import SnippetCard from "../components/SnippetCard";
import SnippetEditor from "../components/SnippetEditor";
import SnippetViewCard from "../components/SnippetViewCard";
import UIBlocks from "../components/UIBlocks";
import type { Snippet } from "../types";
import { Link } from "react-router-dom";
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
    "all" | "favorites" | "ui-blocks"
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
          (activeFilter === "favorites" && s.isFavorite);

        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [snippets, searchQuery, activeFilter]);

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
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-70 border-r border-white/5 flex flex-col bg-[#030712] z-50 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-8 pb-10 flex items-center justify-between shrink-0">
          <Link
            className="text-xl font-black text-white tracking-tighter"
            to="/"
          >
            SnippetVault
          </Link>
          <button
            className="lg:hidden text-gray-500 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
          {[
            { id: "all", label: "All Snippets" },
            { id: "favorites", label: "Favorites" },
            { id: "ui-blocks", label: "UI Blocks" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveFilter(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm transition ${
                activeFilter === item.id
                  ? "bg-white/5 text-white"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-5 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm text-white truncate">{user?.name}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-72 p-6 sm:p-8 lg:p-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-black text-white">
              {activeFilter === "ui-blocks"
                ? "UI Blocks Library"
                : "SnippetVault Dashboard"}
            </h1>
            <p className="text-gray-500">
              {activeFilter === "ui-blocks"
                ? "Rapid design patterns for React + Tailwind."
                : "Your personal library of reusable logic."}
            </p>
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
              {filteredSnippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              ))}

              {filteredSnippets.length === 0 && (
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
