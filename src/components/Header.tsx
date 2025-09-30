import { Button } from './ui/button';
import { UserDropdown } from './UserDropdown';
import { Bell } from 'lucide-react';

interface HeaderProps {
  activeSection: 'dashboard' | 'savings' | 'converter';
  setActiveSection: (section: 'dashboard' | 'savings' | 'converter') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ activeSection, setActiveSection, isDarkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-semibold text-foreground">Neexa</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeSection === 'dashboard'
                  ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mi billetera
            </button>
            <button
              onClick={() => setActiveSection('savings')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeSection === 'savings'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mis ahorros
            </button>
            <button
              onClick={() => setActiveSection('converter')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeSection === 'converter'
                  ? 'text-purple-600 bg-purple-50'
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
              <span className="text-sm text-muted-foreground hidden sm:inline">¡Hola, Usuario! 👋</span>
              <UserDropdown 
                isDarkMode={isDarkMode}
                onToggleDarkMode={onToggleDarkMode}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}