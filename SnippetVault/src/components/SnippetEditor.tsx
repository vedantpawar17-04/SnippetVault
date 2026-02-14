import React, { useEffect } from "react";
import type { Snippet } from "../types";
import { useSnippets } from "../context/SnippetContext";
import { useSnippetForm } from "../hooks/useSnippetForm";
import SnippetMetaPanel from "./SnippetMetaPanel";
import "../index.css";

interface Props {
  snippet?: Snippet;
  isOpen: boolean;
  onClose: () => void;
}

const SnippetEditor: React.FC<Props> = ({
  snippet,
  isOpen,
  onClose,
}) => {
  const { addSnippet, updateSnippet } = useSnippets();

  const {
    formData,
    setFormData,
    errors,
    validate,
    getFormattedData,
  } = useSnippetForm(snippet, isOpen);

  const handleSubmit = async () => {
    if (!validate()) return;

    const data = getFormattedData();

    try {
      if (snippet) {
        await updateSnippet(snippet.id, data);
      } else {
        await addSnippet(data);
      }

      onClose();
    } catch (error) {
      console.error("Error saving snippet:", error);
    }
  };

  /* ✅ Scroll Lock Fix */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /* Keyboard Shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit();
      }

      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handler);
    }

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#020617] overflow-y-auto">
      <div className="min-h-screen max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#020617] border-b border-white/10 pb-4 mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">
            {snippet ? "Edit Snippet" : "Create Snippet"}
          </h2>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold text-white"
            >
              Save
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT SIDE */}
          <div className="flex-1 space-y-8">

            {/* Syntax */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Syntax
              </label>
              <textarea
                value={formData.syntax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    syntax: e.target.value,
                  })
                }
                className="w-full min-h-[120px] bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Describe syntax or short usage example..."
              />
              {errors.syntax && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.syntax}
                </p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Example Code
              </label>
              <textarea
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value,
                  })
                }
                className="w-full min-h-[400px] bg-[#0F172A] border border-white/10 rounded-lg px-4 py-4 text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="// Write your code here..."
              />
              {errors.code && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.code}
                </p>
              )}
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Explanation
              </label>
              <textarea
                value={formData.interviewAnswer}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interviewAnswer: e.target.value,
                  })
                }
                className="w-full min-h-[200px] bg-[#0F172A] border border-white/10 rounded-lg px-4 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Explain how this snippet works..."
              />
              {errors.interviewAnswer && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.interviewAnswer}
                </p>
              )}
            </div>

          </div>

          {/* RIGHT SIDE */}
          <SnippetMetaPanel
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

        </div>
      </div>
    </div>
  );
};

export default SnippetEditor;
