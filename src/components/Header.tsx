import React from 'react';
import { Button } from './ui/button';
import { UserDropdown } from './UserDropdown';
import { Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/logo_billeteraactual.png';

interface HeaderProps {
  activeSection: 'dashboard' | 'savings' | 'converter';
  setActiveSection: (section: 'dashboard' | 'savings' | 'converter') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export function Header({ activeSection, setActiveSection, isDarkMode, onToggleDarkMode, onLogout }: HeaderProps) {
  const { user } = useAuth();
  
  // Obtengo el nombre del usuario para el saludo
  const userName = user?.first_name || 'Usuario';
  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="Logo Billetera" 
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeSection === 'dashboard'
                  ? 'text-purple-600 bg-purple-50 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mi billetera
            </button>
            <button
              onClick={() => setActiveSection('savings')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeSection === 'savings'
                  ? 'text-purple-600 bg-purple-50 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mis ahorros
            </button>
            <button
              onClick={() => setActiveSection('converter')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeSection === 'converter'
                  ? 'text-purple-600 bg-purple-50 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Conversor/Calculadora
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-3 border-l border-border pl-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">¡Hola, {userName}!</span>
              <UserDropdown 
                isDarkMode={isDarkMode}
                onToggleDarkMode={onToggleDarkMode}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}