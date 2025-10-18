import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { OAUTH_CONFIG } from '../config/oauth';

interface OAuthSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OAuthSetupModal({ isOpen, onClose }: OAuthSetupModalProps) {
  const [copiedGoogle, setCopiedGoogle] = useState(false);
  const [copiedMicrosoft, setCopiedMicrosoft] = useState(false);

  const copyToClipboard = (text: string, type: 'google' | 'microsoft') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'google') {
        setCopiedGoogle(true);
        setTimeout(() => setCopiedGoogle(false), 2000);
      } else {
        setCopiedMicrosoft(true);
        setTimeout(() => setCopiedMicrosoft(false), 2000);
      }
    });
  };

  const isGoogleConfigured = OAUTH_CONFIG.google.clientId !== 'your-google-client-id';
  const isMicrosoftConfigured = OAUTH_CONFIG.microsoft.clientId !== 'your-microsoft-client-id';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Configuración OAuth</DialogTitle>
          <p className="text-center text-gray-600">
            Configura la autenticación con Google y Microsoft para habilitar el login social
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Google OAuth Setup */}
          <Card className={isGoogleConfigured ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google OAuth</span>
                {isGoogleConfigured && <span className="text-green-600 text-sm">✓ Configurado</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Client ID actual:</Label>
                <div className="flex space-x-2">
                  <Input
                    value={OAUTH_CONFIG.google.clientId}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(OAUTH_CONFIG.google.clientId, 'google')}
                  >
                    {copiedGoogle ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>URI de redirección:</Label>
                <div className="flex space-x-2">
                  <Input
                    value={OAUTH_CONFIG.google.redirectUri}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(OAUTH_CONFIG.google.redirectUri, 'google')}
                  >
                    {copiedGoogle ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Cloud Console
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                  className="flex-1"
                >
                  Crear Credenciales
                </Button>
              </div>

              {!isGoogleConfigured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Paso siguiente:</strong> Ve a Google Cloud Console, crea un Client ID OAuth 2.0, 
                    y reemplaza 'your-google-client-id' en el archivo oauth.ts con tu Client ID real.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Microsoft OAuth Setup */}
          <Card className={isMicrosoftConfigured ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                <span>Microsoft OAuth</span>
                {isMicrosoftConfigured && <span className="text-green-600 text-sm">✓ Configurado</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Application ID actual:</Label>
                <div className="flex space-x-2">
                  <Input
                    value={OAUTH_CONFIG.microsoft.clientId}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(OAUTH_CONFIG.microsoft.clientId, 'microsoft')}
                  >
                    {copiedMicrosoft ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>URI de redirección:</Label>
                <div className="flex space-x-2">
                  <Input
                    value={OAUTH_CONFIG.microsoft.redirectUri}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(OAUTH_CONFIG.microsoft.redirectUri, 'microsoft')}
                  >
                    {copiedMicrosoft ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://portal.azure.com/', '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Azure Portal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade', '_blank')}
                  className="flex-1"
                >
                  Registrar App
                </Button>
              </div>

              {!isMicrosoftConfigured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Paso siguiente:</strong> Ve a Azure Portal, registra una nueva aplicación, 
                    y reemplaza 'your-microsoft-client-id' en el archivo oauth.ts con tu Application ID real.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instrucciones de Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Para Google:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Ve a Google Cloud Console</li>
                  <li>Crea un nuevo proyecto o selecciona uno existente</li>
                  <li>Habilita la API de Google+</li>
                  <li>Crea un ID de cliente OAuth 2.0</li>
                  <li>Configura la URI de redirección: <code className="bg-gray-100 px-1 rounded">{OAUTH_CONFIG.google.redirectUri}</code></li>
                  <li>Copia el Client ID y pégalo en oauth.ts</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Para Microsoft:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Ve a Azure Portal</li>
                  <li>Registra una nueva aplicación en Azure Active Directory</li>
                  <li>Configura la URI de redirección: <code className="bg-gray-100 px-1 rounded">{OAUTH_CONFIG.microsoft.redirectUri}</code></li>
                  <li>Configura los permisos: openid, profile, email</li>
                  <li>Copia el Application ID y pégalo en oauth.ts</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Después de actualizar las credenciales, necesitarás reiniciar 
                  el servidor de desarrollo para que los cambios surtan efecto.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button 
              onClick={() => window.open('/OAUTH_SETUP_GUIDE.md', '_blank')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Ver Guía Completa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
