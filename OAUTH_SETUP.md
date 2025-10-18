# Configuración de OAuth para Neexa

Este documento explica cómo configurar la autenticación OAuth con Google y Microsoft para la aplicación Neexa.

## Estado Actual

Los botones de Google y Microsoft están configurados en modo **DEMO**. Esto significa que:

- Los botones funcionan y redirigen correctamente
- Se crean usuarios automáticamente en la base de datos
- El login funciona perfectamente
- Usa prompts simples en lugar de OAuth real

## Para Configurar OAuth Real

### 1. Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente OAuth 2.0"
5. Configura las URIs de redirección autorizadas:
   - `http://localhost:3000/oauth/callback`
   - `http://localhost:3001/oauth/callback`
   - `http://localhost:3002/oauth/callback`
   - `http://localhost:3003/oauth/callback`
6. Copia el Client ID
7. Edita `src/config/oauth.ts` y reemplaza `'your-google-client-id'` con tu Client ID

### 2. Microsoft OAuth

1. Ve a [Azure Portal](https://portal.azure.com/)
2. Ve a "Azure Active Directory" → "Registros de aplicaciones"
3. Haz clic en "Nuevo registro"
4. Configura:
   - Nombre: "Neexa App"
   - Tipos de cuenta: "Cuentas en cualquier directorio organizacional y cuentas personales de Microsoft"
   - URI de redirección: `http://localhost:3000` (y otros puertos si es necesario)
5. Copia el "Application (client) ID"
6. Edita `src/config/oauth.ts` y reemplaza `'your-microsoft-client-id'` con tu Client ID

### 3. Actualizar el Servicio OAuth

Una vez configuradas las credenciales, actualiza `src/services/oauthService.ts` para usar OAuth real en lugar del modo demo:

```typescript
// Cambiar de modo demo a OAuth real
async signInWithGoogle(): Promise<any> {
  // Implementar OAuth real de Google
  const googleAuthUrl = new URL('https://accounts.google.com/oauth/authorize');
  // ... configuración real de OAuth
}

async signInWithMicrosoft(): Promise<any> {
  // Implementar OAuth real de Microsoft usando MSAL
  const loginRequest = {
    scopes: ['user.read'],
    prompt: 'select_account',
  };
  return await this.msalInstance.loginPopup(loginRequest);
}
```

## Funcionalidad Actual (Modo Demo)

### Google OAuth Demo
- Al hacer clic en "Google", aparece un prompt para ingresar email
- Se crea un usuario automáticamente con el email proporcionado
- El usuario puede iniciar sesión inmediatamente

### Microsoft OAuth Demo
- Al hacer clic en "Microsoft", aparece un prompt para ingresar email
- Se crea un usuario automáticamente con el email proporcionado
- El usuario puede iniciar sesión inmediatamente

## Pruebas

Para probar la funcionalidad actual:

1. Asegúrate de que el backend esté ejecutándose en `http://localhost:5001`
2. Inicia el frontend con `npm run dev`
3. Ve a la página de login
4. Haz clic en "Google" o "Microsoft"
5. Ingresa un email en el prompt
6. El usuario se creará automáticamente y serás redirigido al dashboard

## Notas Importantes

- Los usuarios OAuth se crean con contraseñas temporales
- Los usuarios OAuth se marcan como verificados automáticamente
- El sistema maneja tanto login como registro automáticamente
- Los datos del usuario se extraen de la respuesta OAuth

## Solución de Problemas

### Error: "Popup blocked"
- Asegúrate de que el navegador permita popups para localhost
- Usa `window.open()` en lugar de `window.location.href`

### Error: "Invalid client ID"
- Verifica que las credenciales OAuth estén configuradas correctamente
- Asegúrate de que las URIs de redirección coincidan exactamente

### Error: "CORS policy"
- Configura CORS en el backend para permitir las URIs de OAuth
- Asegúrate de que las URIs de redirección estén en la lista de CORS_ORIGINS







