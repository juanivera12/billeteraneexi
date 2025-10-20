// OAuth Configuration
// Replace these with your actual OAuth credentials

export const OAUTH_CONFIG = {
  google: {
    clientId: 'your-google-client-id', // Get this from Google Cloud Console
    redirectUri: `${window.location.origin}/oauth/callback`,
  },
  microsoft: {
    clientId: 'your-microsoft-client-id', // Get this from Azure Portal
    tenant: 'common', // or your specific tenant ID
    redirectUri: window.location.origin,
  },
};

// Instructions for setting up OAuth:
export const OAUTH_SETUP_INSTRUCTIONS = {
  google: {
    title: 'Configuración de Google OAuth',
    steps: [
      '1. Ve a Google Cloud Console (https://console.cloud.google.com/)',
      '2. Crea un nuevo proyecto o selecciona uno existente',
      '3. Habilita la API de Google+',
      '4. Ve a "Credenciales" y crea un "ID de cliente OAuth 2.0"',
      '5. Configura las URIs de redirección autorizadas',
      '6. Copia el Client ID y pégalo en oauth.ts',
    ],
  },
  microsoft: {
    title: 'Configuración de Microsoft OAuth',
    steps: [
      '1. Ve a Azure Portal (https://portal.azure.com/)',
      '2. Registra una nueva aplicación en Azure Active Directory',
      '3. Configura las URIs de redirección',
      '4. Genera un secreto de cliente',
      '5. Copia el Application (client) ID y pégalo en oauth.ts',
    ],
  },
};









