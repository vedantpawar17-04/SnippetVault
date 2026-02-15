
import React, { useState, useMemo } from 'react';
import UIBlockModal from './UIBlockModal';
import { useSnippets } from '../context/SnippetContext';
import SnippetCard from './SnippetCard';

export interface UIBlock {
  id: string;
  type: 'setup' | 'component' | 'template';
  title: string;
  description: string;
  code: string;
  instructions?: string[];
  previewComponent?: React.ReactNode;
}

const BLOCKS_DATA: UIBlock[] = [
  {
    id: 'setup-vite',
    type: 'setup',
    title: 'Vite + Tailwind CSS Setup',
    description: 'Official step-by-step guide to integrate Tailwind CSS v4 with Vite.',
    code: `// 1. Create project\nnpm create vite@latest my-project\ncd my-project\n\n// 2. Install dependencies\nnpm install tailwindcss @tailwindcss/vite\n\n// 3. vite.config.ts\nimport { defineConfig } from 'vite'\nimport tailwindcss from '@tailwindcss/vite'\n\nexport default defineConfig({\n  plugins: [\n    tailwindcss(),\n  ],\n})\n\n// 4. src/index.css\n@import "tailwindcss";`,
    instructions: [
      '01 Create your project: Start by creating a new Vite project. Run: npm create vite@latest my-project && cd my-project',
      '02 Install Tailwind CSS: Install the core package and the Vite plugin: npm install tailwindcss @tailwindcss/vite',
      '03 Configure the Vite plugin: Import tailwindcss from "@tailwindcss/vite" and add it to the plugins array in your vite.config.ts.',
      '04 Import Tailwind CSS: Add @import "tailwindcss"; to your main CSS file (e.g., src/index.css).',
      '05 Start build process: Run your build process with npm run dev to start the local development server.',
      '06 Start using Tailwind: Start using utility classes in your HTML or JSX: <h1 class="text-3xl font-bold underline">Hello world!</h1>'
    ]
  },
  {
    id: 'comp-navbar',
    type: 'component',
    title: 'Frosted Navbar Component',
    description: 'A reusable React functional component with Tailwind sticky glass effects.',
    code: `import React from 'react';\n\nconst Navbar = () => {\n  return (\n    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">\n      <div className="font-black text-xl text-white tracking-tighter">BRAND</div>\n      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">\n        <a href="#" className="hover:text-white transition-colors">Products</a>\n        <a href="#" className="hover:text-white transition-colors">Solutions</a>\n        <a href="#" className="hover:text-white transition-colors">Company</a>\n      </div>\n      <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">\n        Get Started\n      </button>\n    </nav>\n  );\n};\n\nexport default Navbar;`,
    previewComponent: (
      <div className="w-full h-full bg-[#030712] rounded-xl overflow-hidden p-0 relative border border-white/5">
        <nav className="bg-black/60 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between">
          <div className="font-black text-white tracking-tighter text-xs">BRAND</div>
          <div className="flex space-x-3 text-[8px] font-bold text-gray-500 uppercase">
             <span>Home</span><span>Docs</span><span>Blog</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-indigo-600/20 flex items-center justify-center text-[8px] text-indigo-400 font-bold border border-indigo-500/30">JS</div>
        </nav>
        <div className="p-8 space-y-2 text-center">
          <div className="h-3 w-3/4 bg-white/5 rounded mx-auto"></div>
          <div className="h-3 w-1/2 bg-white/5 rounded mx-auto"></div>
        </div>
      </div>
    )
  },
  {
    id: 'comp-buttons',
    type: 'component',
    title: 'Button UI Kit',
    description: 'Modular button components with hover states and active animations.',
    code: `import React from 'react';\n\nexport const Button = ({ children, variant = 'primary' }) => {\n  const base = "px-6 py-3 rounded-xl font-bold transition-all active:scale-95 text-sm";\n  const styles = {\n    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",\n    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",\n    ghost: "text-gray-400 hover:text-white hover:bg-white/5"\n  };\n\n  return (\n    <button className={\`\${base} \${styles[variant]}\`}>\n      {children}\n    </button>\n  );\n};`,
    previewComponent: (
      <div className="flex flex-col gap-3 items-center justify-center h-full bg-[#030712] rounded-xl border border-white/5">
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold text-[10px] shadow-lg shadow-indigo-500/20">Primary Button</button>
        <button className="bg-white/5 border border-white/10 text-white px-5 py-2 rounded-lg font-bold text-[10px]">Secondary Button</button>
        <button className="text-gray-500 font-bold text-[10px]">Ghost Button</button>
      </div>
    )
  },
  {
    id: 'template-login',
    type: 'template',
    title: 'Modern Login Template',
    description: 'Clean login layout with dark mode aesthetics and social auth integration.',
    code: `import React from 'react';\n\nexport const LoginPage = () => {\n  return (\n    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">\n      <div className="w-full max-w-md bg-[#0F172A] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">\n        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>\n        <div className="mb-10">\n          <h2 className="text-3xl font-black text-white mb-2">Login</h2>\n          <p className="text-gray-500">Welcome back! Please enter your details.</p>\n        </div>\n        <form className="space-y-4">\n          <input placeholder="Email" className="w-full bg-[#030712] border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-1 focus:ring-indigo-500 outline-none" />\n          <input placeholder="Password" type="password" className="w-full bg-[#030712] border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-1 focus:ring-indigo-500 outline-none" />\n          <button className="w-full bg-indigo-600 py-4 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/20">Sign In</button>\n        </form>\n      </div>\n    </div>\n  );\n};`,
    previewComponent: (
      <div className="w-full h-full relative group">
        <img 
          src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=800&q=80" 
          alt="Login Preview" 
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-indigo-900/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-white font-black uppercase tracking-widest text-xs">View Layout</span>
        </div>
      </div>
    )
  },
  {
    id: 'template-signup',
    type: 'template',
    title: 'Creative Signup Template',
    description: 'Interactive registration form with multi-step support and visual feedback.',
    code: `import React from 'react';\n\nexport const SignupPage = () => {\n  return (\n    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">\n      <div className="w-full max-w-md bg-[#0F172A] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">\n        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>\n        <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>\n        <p className="text-gray-500 mb-8">Start your developer journey today.</p>\n        <div className="space-y-4">\n           <input placeholder="Username" className="w-full bg-[#030712] border border-white/10 rounded-xl px-5 py-4 text-white outline-none" />\n           <input placeholder="Email Address" type="email" className="w-full bg-[#030712] border border-white/10 rounded-xl px-5 py-4 text-white outline-none" />\n           <input placeholder="Create Password" type="password" className="w-full bg-[#030712] border border-white/10 rounded-xl px-5 py-4 text-white outline-none" />\n           <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-4 rounded-xl text-white font-bold mt-4 shadow-xl shadow-purple-500/20">Sign Up</button>\n        </div>\n      </div>\n    </div>\n  );\n};`,
    previewComponent: (
      <div className="w-full h-full relative group">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80" 
          alt="Signup Preview" 
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-purple-900/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-white font-black uppercase tracking-widest text-xs">View Layout</span>
        </div>
      </div>
    )
  },
  {
    id: 'template-forgot',
    type: 'template',
    title: 'Recovery Template',
    description: 'Security-focused password reset workflow with verification UI.',
    code: `import React from 'react';\n\nexport const ForgotPassword = () => {\n  return (\n    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">\n      <div className="w-full max-w-sm bg-[#0F172A] border border-white/5 rounded-[2.5rem] p-10 text-center shadow-2xl">\n        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto mb-6">\n           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>\n        </div>\n        <h2 className="text-2xl font-black text-white mb-2">Reset Password</h2>\n        <p className="text-gray-500 text-sm mb-8">No worries! It happens. Enter your email below.</p>\n        <input type="email" placeholder="email@example.com" className="w-full bg-[#030712] border border-white/5 rounded-xl px-5 py-4 text-white mb-6 focus:outline-none text-center" />\n        <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">Send Recovery Link</button>\n      </div>\n    </div>\n  );\n};`,
    previewComponent: (
      <div className="w-full h-full relative group">
        <img 
          src="https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80" 
          alt="Recovery Preview" 
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-slate-900/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-white font-black uppercase tracking-widest text-xs">View Layout</span>
        </div>
      </div>
    )
  }
];

const UIBlocks: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<UIBlock | null>(null);
  const { snippets } = useSnippets();

  // Find snippets in vault that look like UI components
  const similarVaultSnippets = useMemo(() => {
    return snippets.filter(s => {
      const isReact = s.language.toLowerCase().includes('react') || 
                     s.language.toLowerCase().includes('typescript') ||
                     s.language.toLowerCase().includes('javascript');
      
      const hasUIStructure = (s.codeStructure?.hooks?.length ?? 0) > 0 || 
                            s.codeStructure?.imports?.some(i => i.toLowerCase().includes('react'));
      
      const hasUITags = s.tags.some(t => 
        ['ui', 'component', 'button', 'navbar', 'modal', 'layout', 'tailwind'].includes(t.toLowerCase())
      );

      return isReact && (hasUIStructure || hasUITags);
    }).slice(0, 3);
  }, [snippets]);

  const renderSection = (title: string, type: UIBlock['type']) => {
    const blocks = BLOCKS_DATA.filter(b => b.type === type);
    return (
      <div className="space-y-8 mb-16">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {blocks.map(block => (
            <div 
              key={block.id}
              onClick={() => setSelectedBlock(block)}
              className="group bg-[#0F172A] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 hover:bg-[#11192e] transition-all cursor-pointer shadow-xl flex flex-col"
            >
              {block.previewComponent ? (
                <div className="h-48 bg-[#030712] border-b border-white/5 flex items-center justify-center overflow-hidden">
                  {block.previewComponent}
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 flex items-center justify-center border-b border-white/5">
                  <svg className="text-indigo-500/20" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                </div>
              )}
              <div className="p-6 space-y-2 flex-grow">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{block.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{block.description}</p>
              </div>
              <div className="px-6 pb-6 mt-auto">
                <div className="flex items-center text-xs font-black uppercase tracking-widest text-indigo-500 group-hover:gap-2 transition-all">
                  <span>View Details</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderSection('Setup Blocks', 'setup')}
      {renderSection('Component Blocks', 'component')}
      {renderSection('Templates', 'template')}

      {/* Enhancement: Similar Snippets from Vault */}
      {similarVaultSnippets.length > 0 && (
        <div className="pt-8 mb-16 border-t border-white/5">
          <h2 className="text-2xl font-black text-violet-400 flex items-center gap-3 mb-8">
            <span className="w-2 h-8 bg-violet-600 rounded-full"></span>
            Similar Snippets from Your Vault
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {similarVaultSnippets.map(snippet => (
              <SnippetCard 
                key={snippet.id} 
                snippet={snippet} 
                onEdit={() => {}} 
                onView={() => {}} 
              />
            ))}
          </div>
        </div>
      )}

      {selectedBlock && (
        <UIBlockModal 
          block={selectedBlock} 
          onClose={() => setSelectedBlock(null)} 
        />
      )}
    </div>
  );
};

export default UIBlocks;
