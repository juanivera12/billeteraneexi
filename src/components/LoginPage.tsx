import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PiggyBank, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simular login process
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    setIsLoading(true);
    // Simular registro process
    setTimeout(() => {
      setIsLoading(false);
      setIsRegistering(false);
      // Automatically login after successful registration
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Background decoration */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <PiggyBank className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl text-gray-900 mb-2">Neexa</CardTitle>
            <p className="text-gray-600">Tu asistente financiero inteligente</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border-gray-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{isRegistering ? 'Contraseña' : 'Contraseña'}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border-gray-200 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-50 border-gray-200 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 h-12"
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={isLoading || !email || !password || (isRegistering && !confirmPassword)}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{isRegistering ? 'Registrando...' : 'Iniciando sesión...'}</span>
              </div>
            ) : (
              isRegistering ? 'Registrarse' : 'Iniciar Sesión'
            )}
          </Button>
          
          <div className="text-center space-y-2">
            {!isRegistering && (
              <Button variant="link" className="text-purple-600 hover:text-purple-700">
                ¿Olvidaste tu contraseña?
              </Button>
            )}
            <div className="text-sm text-gray-500">
              {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
              <Button 
                variant="link" 
                className="text-purple-600 hover:text-purple-700 p-0"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
              >
                {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}