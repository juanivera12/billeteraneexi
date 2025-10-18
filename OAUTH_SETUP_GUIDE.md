# Guía de Configuración OAuth - Neexa

Esta guía te ayudará a configurar la autenticación OAuth con Google y Microsoft para tu aplicación Neexa.

## Configuración de Google OAuth

### Paso 1: Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra tu proyecto (ej: "Neexa App")

### Paso 2: Habilitar la API de Google+

1. En el menú lateral, ve a "APIs y servicios" > "Biblioteca"
2. Busca "Google+ API" o "Google People API"
3. Haz clic en "Habilitar"

### Paso 3: Crear credenciales OAuth 2.0

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "ID de cliente OAuth 2.0"
3. Selecciona "Aplicación web"
4. Configura las URIs de redirección autorizadas:
   - `http://localhost:3000/oauth/callback` (para desarrollo)
   - `https://tu-dominio.com/oauth/callback` (para producción)

### Paso 4: Obtener el Client ID

1. Copia el "ID de cliente" generado
2. Abre `src/config/oauth.ts`
3. Reemplaza `'your-google-client-id'` con tu Client ID real

## Configuración de Microsoft OAuth

### Paso 1: Registrar una aplicación en Azure Portal

1. Ve a [Azure Portal](https://portal.azure.com/)
2. Busca "Azure Active Directory" en el menú
3. Ve a "Registros de aplicaciones" > "Nuevo registro"
4. Nombra tu aplicación (ej: "Neexa App")
5. Selecciona "Cuentas en cualquier directorio organizacional y cuentas Microsoft personales"
6. En "URI de redirección", selecciona "Web" y agrega:
   - `http://localhost:3000` (para desarrollo)
   - `https://tu-dominio.com` (para producción)

### Paso 2: Obtener el Application ID

1. En la página de "Información general" de tu aplicación
2. Copia el "Id. de aplicación (cliente)"
3. Abre `src/config/oauth.ts`
4. Reemplaza `'your-microsoft-client-id'` con tu Application ID

### Paso 3: Configurar permisos

1. Ve a "Permisos de API" > "Agregar un permiso"
2. Selecciona "Microsoft Graph"
3. Selecciona "Permisos delegados"
4. Marca: `openid`, `profile`, `email`
5. Haz clic en "Agregar permisos"

## 📝 Configuración Final

Una vez que tengas tus credenciales, actualiza el archivo `src/config/oauth.ts`:

```typescript
export const OAUTH_CONFIG = {
  google: {
    clientId: 'tu-google-client-id-aqui',
    redirectUri: `${window.location.origin}/oauth/callback`,
  },
  microsoft: {
    clientId: 'tu-microsoft-client-id-aqui',
    tenant: 'common',
    redirectUri: window.location.origin,
  },
};
```

## Probar la Configuración

1. Reinicia tu servidor de desarrollo: `npm run dev`
2. Ve a `http://localhost:3000`
3. Haz clic en "Iniciar sesión con Google" o "Iniciar sesión con Microsoft"
4. Deberías ver la ventana de autenticación real

## Notas Importantes

- **Desarrollo**: Usa `http://localhost:3000` en las URIs de redirección
- **Producción**: Cambia a tu dominio real
- **Seguridad**: Nunca subas tus credenciales a repositorios públicos
- **Variables de entorno**: Considera usar variables de entorno para las credenciales en producción

## 🔍 Solución de Problemas

### Error: "Google OAuth no está configurado"
- Verifica que hayas reemplazado `'your-google-client-id'` con tu Client ID real

### Error: "MSAL no está inicializado"
- Verifica que hayas reemplazado `'your-microsoft-client-id'` con tu Application ID real

### Error: "No se pudo abrir la ventana de autenticación"
- Verifica que los popups estén habilitados en tu navegador
- Asegúrate de que las URIs de redirección estén configuradas correctamente

### Error: "Invalid redirect_uri"
- Verifica que la URI de redirección en tu configuración OAuth coincida exactamente con la configurada en Google/Microsoft

## 📚 Recursos Adicionales

- [Documentación de Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Documentación de Microsoft MSAL](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Guía de OAuth 2.0](https://oauth.net/2/)
