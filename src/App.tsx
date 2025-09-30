import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SavingsSection } from './components/SavingsSection';
import { ConverterCalculator } from './components/ConverterCalculator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    setIsLoggedIn(true);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'savings' && <SavingsSection />}
        {activeSection === 'converter' && <ConverterCalculator />}
      </main>
    </div>
  );
}