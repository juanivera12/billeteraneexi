import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SavingsSection } from './components/SavingsSection';
import { ConverterCalculator } from './components/ConverterCalculator';
import { OAuthCallback } from './components/OAuthCallback';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'savings' | 'converter'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    // Login is handled by AuthContext
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* OAuth Callback Route */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        
        {/* Reset Password Route */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/*" 
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <div className="min-h-screen bg-background transition-colors duration-200">
                <Header 
                  activeSection={activeSection} 
                  setActiveSection={setActiveSection}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={handleToggleDarkMode}
                  onLogout={handleLogout}
                />
                
                <main className="max-w-7xl mx-auto px-4 py-6">
                  {activeSection === 'dashboard' && <Dashboard />}
                  {activeSection === 'savings' && <SavingsSection />}
                  {activeSection === 'converter' && <ConverterCalculator />}
                </main>
              </div>
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}