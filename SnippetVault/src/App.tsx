
import React from 'react';
// Fixing react-router-dom named export errors by using the full module import and destructuring.
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SnippetProvider } from './context/SnippetContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

const { HashRouter, Routes, Route, Navigate, useLocation } = ReactRouterDOM;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppLayout = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <SnippetProvider>
          <AppLayout />
        </SnippetProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
