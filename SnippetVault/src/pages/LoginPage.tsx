import React, { useState } from 'react';
// Fixing react-router-dom named export errors by using the full module import and destructuring.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Link, useNavigate } = ReactRouterDOM;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#030712]">
      <div className="w-full max-w-md space-y-8 p-8 md:p-10 bg-[#0F172A] border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#38BDF8] to-[#8B5CF6]"></div>

        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="text-gray-400 font-medium">
            Log in to your secure snippet vault
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 px-1">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 focus:border-[#38BDF8]/50 transition-all placeholder-gray-700"
                placeholder="developer@example.com"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 px-1">
                Password
              </label>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 focus:border-[#38BDF8]/50 transition-all placeholder-gray-700"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={handleShowPassword}
                disabled={showPassword}
                className="absolute right-5 top-11 text-sm font-semibold text-[#38BDF8] hover:text-[#06B6D4] disabled:opacity-50"
              >
                Show
              </button>

              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-gray-400 hover:text-[#38BDF8] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] hover:from-[#38BDF8] hover:to-[#A78BFA] disabled:opacity-50 text-[#030712] font-bold py-4 rounded-2xl shadow-xl shadow-cyan-500/10 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Vault'}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-white/5">
          <p className="text-gray-500 text-sm font-medium">
            New to SnippetVault?{' '}
            <Link
              to="/signup"
              className="text-[#38BDF8] font-bold hover:text-[#06B6D4] transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
