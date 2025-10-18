import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { oauthService } from '../services/oauthService';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { OAuthSetupModal } from './OAuthSetupModal';
import logoImage from '../assets/logo_billeteraactual.png';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { login, register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOAuthSetup, setShowOAuthSetup] = useState(false);

  // Password validation functions
  const passwordValidation = useMemo(() => {
    const defaultChecks = {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSymbol: false,
    };
    
    if (!password) return { score: 0, checks: defaultChecks };
    
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    return { score, checks };
  }, [password]);

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return 'Débil';
    if (score <= 3) return 'Regular';
    if (score <= 4) return 'Buena';
    return 'Fuerte';
  };

  const handleLogin = async () => {
    try {
      setError('');
      await login({ email, password });
      onLogin();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      setSuccessMessage('');
      
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (!firstName.trim() || !lastName.trim()) {
        setError('El nombre y apellido son requeridos');
        return;
      }

      // Password strength validation
      if (passwordValidation.score < 4) {
        setError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos');
        return;
      }

      await register({
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      });
      
      // Mostrar mensaje de éxito
      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo...');
      
      // Esperar un poco para que el usuario vea el mensaje
      setTimeout(() => {
        setIsRegistering(false);
        onLogin();
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al registrarse');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const user = await oauthService.signInWithGoogle();
      
      // Simular registro/login con datos de Google
      const googleUser = {
        email: user.email,
        password: 'oauth_google_' + user.id, // Password temporal para OAuth
        confirm_password: 'oauth_google_' + user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        provider: 'google'
      };

      // Intentar login primero, si falla, registrar
      try {
        await login({ email: googleUser.email, password: googleUser.password });
      } catch (loginError) {
        // Si el login falla, registrar el usuario
        await register(googleUser);
      }
      
      onLogin();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión con Google');
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setError('');
      const response = await oauthService.signInWithMicrosoft();
      
      // Extraer información del usuario de Microsoft
      const microsoftUser = {
        email: response.account?.username || response.account?.email || 'user@microsoft.com',
        password: 'oauth_microsoft_' + response.account?.localAccountId,
        confirm_password: 'oauth_microsoft_' + response.account?.localAccountId,
        first_name: response.account?.name?.split(' ')[0] || 'Microsoft',
        last_name: response.account?.name?.split(' ').slice(1).join(' ') || 'User',
        provider: 'microsoft'
      };

      // Intentar login primero, si falla, registrar
      try {
        await login({ email: microsoftUser.email, password: microsoftUser.password });
      } catch (loginError) {
        // Si el login falla, registrar el usuario
        await register(microsoftUser);
      }
      
      onLogin();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión con Microsoft');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Background decoration */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={logoImage} 
              alt="Neexa Logo" 
              className="w-16 h-16 object-contain"
            />
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

            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Tu apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </>
            )}
            
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
              
              {/* Password Strength Indicator - Only show during registration */}
              {isRegistering && password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fortaleza de la contraseña:</span>
                    <span className={`text-sm font-medium ${
                      passwordValidation.score <= 2 ? 'text-red-600' :
                      passwordValidation.score <= 3 ? 'text-yellow-600' :
                      passwordValidation.score <= 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText(passwordValidation.score)}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordValidation.score)} ${
                        passwordValidation.score >= 1 ? 'w-1/5' : ''
                      } ${passwordValidation.score >= 2 ? 'w-2/5' : ''} ${
                        passwordValidation.score >= 3 ? 'w-3/5' : ''
                      } ${passwordValidation.score >= 4 ? 'w-4/5' : ''} ${
                        passwordValidation.score >= 5 ? 'w-full' : ''
                      }`}
                    ></div>
                  </div>
                  
                  {/* Password requirements checklist */}
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.checks.minLength ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.checks.minLength ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Al menos 8 caracteres</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.checks.hasUppercase ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.checks.hasUppercase ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Una letra mayúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.checks.hasLowercase ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.checks.hasLowercase ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Una letra minúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.checks.hasNumber ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.checks.hasNumber ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Un número</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.checks.hasSymbol ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.checks.hasSymbol ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Un símbolo (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}
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
          
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {successMessage}
            </div>
          )}
          
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 h-12"
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={isLoading || !email || !password || (isRegistering && (!confirmPassword || passwordValidation.score < 4))}
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

          {/* OAuth Sign-in Buttons */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O continúa con</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50"
                onClick={handleMicrosoftSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Microsoft
              </Button>
            </div>
            
            <div className="text-center">
              <Button
                variant="link"
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setShowOAuthSetup(true)}
              >
                ¿No funcionan los botones de Google/Microsoft? Configurar OAuth
              </Button>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            {!isRegistering && (
              <Button 
                variant="link" 
                className="text-purple-600 hover:text-purple-700 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => setShowForgotPassword(true)}
              >
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
                  setError('');
                  setSuccessMessage('');
                }}
              >
                {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
      
      {/* OAuth Setup Modal */}
      <OAuthSetupModal 
        isOpen={showOAuthSetup}
        onClose={() => setShowOAuthSetup(false)}
      />
    </div>
  );
}