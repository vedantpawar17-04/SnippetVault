import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

const { Link } = ReactRouterDOM;

/* ---------------- ANIMATION VARIANTS ---------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ---------------- COMPONENT ---------------- */

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#030712] selection:bg-cyan-500/30 overflow-x-hidden">

      {/* Background Glows */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="relative pt-20 md:pt-32 pb-32 px-4 sm:px-6 flex flex-col items-center text-center"
      >

        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="mb-8 md:mb-12 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400/90 text-[11px] sm:text-[13px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.1)]"
        >
          <span>The developer&apos;s code companion</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-10"
        >
          <span className="text-white block mb-2 sm:inline-block sm:mr-4">
            Your Code Snippets,
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] via-[#38BDF8] to-[#8B5CF6]">
            Organized & Secured
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-400/80 leading-relaxed mb-12 font-medium"
        >
          Save, organize, and access your code snippets from anywhere.
          Built for developers who value speed and precision.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24 w-full sm:w-auto"
        >
          <Link
            to="/signup"
            className="px-12 py-5 bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-[#030712] rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all hover:-translate-y-1"
          >
            Get Started Free
          </Link>

          <button className="px-12 py-5 border-2 border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/5 transition-all">
            View Demo
          </button>
        </motion.div>

        {/* Code Preview */}
        <motion.div
          variants={fadeScale}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          whileHover={{ y: -8, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="w-full max-w-5xl relative"
        >
          <div className="relative bg-[#0B0F1A] rounded-[2.5rem] border border-white/10 shadow-3xl p-8 sm:p-12 text-left">
            <pre className="text-sm sm:text-base md:text-lg text-purple-400 leading-relaxed overflow-x-auto">
{`const useSnippetVault = () => {
  // Organize your professional development
  const [items, setItems] = useState([])

  return { vault, secure, sync }
}`}
            </pre>
          </div>
        </motion.div>

      </motion.section>
    </div>
  );
};

export default LandingPage;
