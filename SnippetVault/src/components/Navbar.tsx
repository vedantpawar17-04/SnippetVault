
import React from 'react';
// Fixing react-router-dom named export errors by using the full module import and destructuring.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Link, useNavigate, useLocation } = ReactRouterDOM;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0EA5E9] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] group-hover:scale-105 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        </div>
        <span className="text-lg sm:text-2xl font-black tracking-tighter text-[#38BDF8]">
          SnippetVault
        </span>
      </Link>

      <div className="flex items-center space-x-3 sm:space-x-6">
        {!user ? (
          <>
            <Link to="/login" className="text-xs sm:text-sm font-bold text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-[#030712] px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-black shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all active:scale-95"
            >
              Get Started
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link 
              to="/dashboard" 
              className={`text-xs sm:text-sm font-bold transition-colors ${location.pathname === '/dashboard' ? 'text-[#38BDF8]' : 'text-gray-400 hover:text-white'}`}
            >
              Vault
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-sm text-gray-400 font-medium max-w-[100px] truncate">Hi, {user.name}</span>
              {/* Logout button hidden on mobile/tablet to move action to dashboard sidebar */}
              <button 
                onClick={handleLogout}
                className="hidden lg:block bg-white/5 hover:bg-white/10 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border border-white/10 transition-all active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
