import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Check, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api-real';
import logoImage from '../assets/logo_billeteraactual.png';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Password validation
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const passwordScore = Object.values(passwordValidation).filter(Boolean).length;

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

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Token de restablecimiento no válido');
        setIsValidatingToken(false);
        return;
      }

      try {
        const response = await apiService.verifyResetToken(token);
        setTokenValid(response.valid);
        if (!response.valid) {
          setError(response.message || 'Token inválido o expirado');
        }
      } catch (error) {
        setError('Error al verificar el token');
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Token de restablecimiento no válido');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordScore < 4) {
      setError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await apiService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al restablecer contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verificando token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-600">Token Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-green-600">¡Contraseña Restablecida!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Tu contraseña ha sido restablecida exitosamente. 
              Serás redirigido al inicio de sesión en unos segundos.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Ir al Inicio de Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <img 
              src={logoImage} 
              alt="Neexa Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-3xl text-gray-900 mb-2">Neexa</CardTitle>
            <p className="text-gray-600">Restablecer Contraseña</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu nueva contraseña"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fortaleza de la contraseña:</span>
                    <span className={`text-sm font-medium ${
                      passwordScore <= 2 ? 'text-red-600' :
                      passwordScore <= 3 ? 'text-yellow-600' :
                      passwordScore <= 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText(passwordScore)}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordScore)} ${
                        passwordScore >= 1 ? 'w-1/5' : ''
                      } ${passwordScore >= 2 ? 'w-2/5' : ''} ${
                        passwordScore >= 3 ? 'w-3/5' : ''
                      } ${passwordScore >= 4 ? 'w-4/5' : ''} ${
                        passwordScore >= 5 ? 'w-full' : ''
                      }`}
                    ></div>
                  </div>
                  
                  {/* Password requirements checklist */}
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.minLength ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Al menos 8 caracteres</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.hasUppercase ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Una letra mayúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.hasLowercase ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Una letra minúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.hasNumber ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>Un número</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {passwordValidation.hasSymbol ? (
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirma tu nueva contraseña"
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
            
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <Button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 h-12"
              disabled={isLoading || passwordScore < 4 || !confirmPassword}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Restableciendo...</span>
                </div>
              ) : (
                'Restablecer Contraseña'
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <Button 
              variant="link" 
              className="text-purple-600 hover:text-purple-700"
              onClick={() => navigate('/')}
            >
              Volver al Inicio de Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
