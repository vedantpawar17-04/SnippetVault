import React, { useState } from 'react';
// Fixing react-router-dom named export errors by using the full module import and destructuring.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Link, useNavigate } = ReactRouterDOM;

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(true);

    setTimeout(() => {
      setShowPassword(false);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = await signup(name, email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('An account with this email already exists.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 md:p-10 bg-gray-900 border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-gray-400">Join the ReactVault developer community</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Full Name
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="dev@reactvault.io"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Password
              </label>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="Minimum 8 characters"
                minLength={8}
              />
              <button
                type="button"
                onClick={handleShowPassword}
                disabled={showPassword}
                className="absolute right-4 top-9 text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-50"
              >
                Show
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
          >
            {isSubmitting ? 'Creating Account...' : 'Get Started Free'}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
