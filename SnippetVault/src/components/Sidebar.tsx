import React from "react";
import { Link } from "react-router-dom";
import type { User } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: string;
  setActiveFilter: (filter: any) => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeFilter,
  setActiveFilter,
  user,
}) => {
  const menuItems = [
    { id: "all", label: "Unique Logic" },
    { id: "favorites", label: "Favorites" },
    { id: "similar", label: "Similar Snippets" },
    { id: "ui-blocks", label: "UI Blocks" },
  ];

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-70 border-r border-white/5 flex flex-col bg-[#030712] z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
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
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveFilter(item.id as any);
                onClose();
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
    </>
  );
};

export default Sidebar;
