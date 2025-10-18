import { useState } from 'react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { User, CreditCard, Moon, Sun, Copy, Check, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserDropdownProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export function UserDropdown({ isDarkMode, onToggleDarkMode, onLogout }: UserDropdownProps) {
  const { user } = useAuth();
  const [showCVUModal, setShowCVUModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const cvuData = {
    cbu: '0000003100088032908419',
    alias: 'NEEXA.USUARIO.WALLET',
    titular: 'Neexa Usuario',
    cuit: '20-12345678-9',
    banco: 'Banco Neexa Digital'
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
            <User className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.first_name ? `${user.first_name} ${user.last_name}` : 'Neexa Usuario'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'usuario@neexa.com'}</p>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowCVUModal(true)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Ver CVU/ALIAS
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={onToggleDarkMode}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              {isDarkMode ? (
                <Sun className="w-4 h-4 mr-2" />
              ) : (
                <Moon className="w-4 h-4 mr-2" />
              )}
              Modo Oscuro
            </div>
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={onToggleDarkMode}
              className="ml-2" 
            />
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={onLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* CVU/ALIAS Modal */}
      <Dialog open={showCVUModal} onOpenChange={setShowCVUModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <span>Mis datos bancarios</span>
            </DialogTitle>
            <DialogDescription>
              Utiliza estos datos para recibir transferencias en tu cuenta Neexa
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Utiliza estos datos para recibir transferencias en tu cuenta Neexa
            </p>
            
            {/* CBU */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">CBU</label>
                <Badge variant="secondary" className="text-xs">Transferencias</Badge>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <code className="flex-1 text-sm font-mono">{cvuData.cbu}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(cvuData.cbu, 'cbu')}
                  className="h-8 w-8 p-0"
                >
                  {copiedField === 'cbu' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Alias */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Alias</label>
                <Badge variant="secondary" className="text-xs">Fácil de recordar</Badge>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <code className="flex-1 text-sm font-mono">{cvuData.alias}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(cvuData.alias, 'alias')}
                  className="h-8 w-8 p-0"
                >
                  {copiedField === 'alias' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-3">Información adicional</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Titular:</span>
                  <span className="font-medium">{cvuData.titular}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CUIT:</span>
                  <span className="font-medium">{cvuData.cuit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Banco:</span>
                  <span className="font-medium">{cvuData.banco}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Instrucciones</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Comparte tu CBU para transferencias desde otros bancos</li>
                <li>• Usa tu ALIAS para transferencias más fáciles</li>
                <li>• Las transferencias se acreditan instantáneamente</li>
              </ul>
            </div>

            <Button onClick={() => setShowCVUModal(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}