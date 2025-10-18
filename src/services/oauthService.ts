// OAuth Service for Google and Microsoft authentication
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { OAUTH_CONFIG } from '../config/oauth';

// Microsoft OAuth Configuration
const msalConfig = {
  auth: {
    clientId: OAUTH_CONFIG.microsoft.clientId,
    authority: `https://login.microsoftonline.com/${OAUTH_CONFIG.microsoft.tenant}`,
    redirectUri: OAUTH_CONFIG.microsoft.redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = OAUTH_CONFIG.google.clientId;
const GOOGLE_REDIRECT_URI = OAUTH_CONFIG.google.redirectUri;
const GOOGLE_SCOPE = 'openid email profile';

class OAuthService {
  private msalInstance: PublicClientApplication | null = null;

  constructor() {
    try {
      this.msalInstance = new PublicClientApplication(msalConfig);
    } catch (error) {
      console.error('Error initializing MSAL:', error);
    }
  }

  // Microsoft OAuth (Real implementation)
  async signInWithMicrosoft(): Promise<any> {
    if (!this.msalInstance) {
      throw new Error('MSAL no está inicializado');
    }

    try {
      const loginRequest = {
        scopes: ['openid', 'profile', 'email'],
        prompt: 'select_account',
      };

      const response = await this.msalInstance.loginPopup(loginRequest);
      
      if (response.account) {
        return {
          account: {
            localAccountId: response.account.localAccountId,
            username: response.account.username,
            email: response.account.username,
            name: response.account.name,
          }
        };
      } else {
        throw new Error('No se pudo obtener la información de la cuenta');
      }
    } catch (error) {
      console.error('Error en Microsoft OAuth:', error);
      throw new Error('Error al autenticar con Microsoft');
    }
  }

  // Google OAuth (Real implementation)
  async signInWithGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if Google OAuth is properly configured
      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your-google-client-id') {
        reject(new Error('Google OAuth no está configurado. Por favor, configura tu Client ID en oauth.ts'));
        return;
      }

      // Create Google OAuth URL
      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
      googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
      googleAuthUrl.searchParams.set('response_type', 'code');
      googleAuthUrl.searchParams.set('scope', GOOGLE_SCOPE);
      googleAuthUrl.searchParams.set('access_type', 'offline');
      googleAuthUrl.searchParams.set('prompt', 'select_account');

      // Open popup window for Google OAuth
      const popup = window.open(
        googleAuthUrl.toString(),
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('No se pudo abrir la ventana de autenticación. Verifica que los popups estén habilitados.'));
        return;
      }

      // Listen for the popup to close or receive message
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('Autenticación cancelada por el usuario'));
        }
      }, 1000);

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve(event.data.user);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          reject(new Error(event.data.error || 'Error en la autenticación de Google'));
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  // Handle OAuth callback (for Google)
  async handleOAuthCallback(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: error,
      }, window.location.origin);
      return;
    }

    if (code) {
      try {
        // Exchange code for tokens
        const tokenResponse = await this.exchangeCodeForTokens(code);
        
        // Get user info from Google
        const userInfo = await this.getGoogleUserInfo(tokenResponse.access_token);
        
        const user = {
          id: userInfo.id,
          email: userInfo.email,
          first_name: userInfo.given_name,
          last_name: userInfo.family_name,
          provider: 'google',
        };

        window.opener?.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          user: user,
        }, window.location.origin);
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        window.opener?.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: 'Error al procesar la autenticación',
        }, window.location.origin);
      }
    }
  }

  // Exchange authorization code for access token
  private async exchangeCodeForTokens(code: string): Promise<any> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al intercambiar código por tokens');
    }

    return response.json();
  }

  // Get user information from Google
  private async getGoogleUserInfo(accessToken: string): Promise<any> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener información del usuario');
    }

    return response.json();
  }
}

export const oauthService = new OAuthService();
export default OAuthService;
