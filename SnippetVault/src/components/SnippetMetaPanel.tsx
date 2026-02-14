import React from "react";
import { LANGUAGES } from "../constants/languages";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
}

const SnippetMetaPanel: React.FC<Props> = ({
  formData,
  setFormData,
  errors,
}) => {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      
      {/* Title */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Title
        </label>
        <input
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
          className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-2">
            {errors.title}
          </p>
        )}
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Language
        </label>
        <select
          value={formData.language}
          onChange={(e) =>
            setFormData({
              ...formData,
              language: e.target.value,
            })
          }
          className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Tags (comma separated)
        </label>
        <input
          value={formData.tagsString}
          onChange={(e) =>
            setFormData({
              ...formData,
              tagsString: e.target.value,
            })
          }
          className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
          placeholder="react, hooks, state"
        />

        {/* Pro Tip */}
        <div className="mt-4 p-4 rounded-lg bg-violet-600/10 border border-violet-600/30">
          <p className="text-sm text-violet-300 font-semibold mb-2">
            💡 Pro Tip
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Write clean syntax, meaningful example code, and a clear
            explanation. A well-structured snippet helps other developers
            quickly understand what it does and when to use it.
          </p>
        </div>
      </div>

    </aside>
  );
};

export default SnippetMetaPanel;