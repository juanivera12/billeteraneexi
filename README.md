# Neexa - Mi Billetera Inteligente

Hola! Esta es mi aplicación de finanzas personales que estoy desarrollando. La idea surgió porque necesitaba una herramienta simple pero completa para manejar mis ahorros y entender mejor mis gastos.

## ¿Qué hace esta app?

Básicamente, es como tener un asistente financiero personal que te ayuda a:

- **Ver tu dinero de un vistazo** - Dashboard simple con todo lo importante
- **Ahorrar de forma inteligente** - Metas y retos que realmente funcionan
- **Organizar tu presupuesto** - Sin complicaciones, solo lo esencial
- **Convertir monedas** - Porque a veces necesitas saber cuánto vale algo en otra moneda
- **Mantener tus datos seguros** - Login con validación real de contraseñas
- **Iniciar sesión con Google/Microsoft** - Autenticación OAuth real
- **Recuperar contraseña por email** - Sistema completo de recuperación

## Lo que más me gusta de este proyecto

- **Es completamente funcional** - No es solo un demo, realmente funciona
- **Seguridad real** - Las contraseñas tienen validación estricta (símbolos, números, mayúsculas)
- **OAuth real** - Login con Google y Microsoft usando APIs oficiales
- **Recuperación de contraseña** - Sistema completo con emails y tokens seguros
- **Base de datos real** - Los usuarios se guardan y persisten
- **Se ve bien** - Tanto en modo claro como oscuro
- **Responsive** - Funciona en móvil y desktop

## Cómo empezar

```bash
# Instalo las dependencias
npm install

# Arranco el frontend
npm run dev
```

El frontend va a correr en http://localhost:3000

Para el backend:
```bash
cd neexa-backend
python simple_server.py
```

El backend va a correr en http://localhost:5000

## Credenciales de prueba

- **Email**: test@example.com
- **Contraseña**: Test123!

O puedes crear tu propia cuenta - el sistema valida que la contraseña tenga al menos:
- 8 caracteres
- Una mayúscula
- Un número  
- Un símbolo especial

## Estructura que armé

```
src/
├── components/          # Componentes principales
│   ├── ui/             # Componentes base (botones, inputs, etc)
│   ├── LoginPage.tsx   # Página de login/registro
│   ├── Header.tsx      # Header con navegación
│   ├── Dashboard.tsx   # Panel principal
│   └── ...
├── contexts/           # Estados globales (autenticación)
├── services/           # APIs y servicios
└── assets/            # Imágenes y recursos
```

## Lo que aprendí haciendo esto

- **React Context** para manejar el estado de autenticación
- **Flask + SQLite** para el backend (simple pero efectivo)
- **Validación de contraseñas** con regex y indicadores visuales
- **OAuth 2.0** con Google y Microsoft (APIs reales)
- **Recuperación de contraseña** con tokens seguros y emails
- **CORS** para conectar frontend y backend
- **React Router** para manejo de rutas
- **Tailwind CSS** para estilos rápidos y consistentes

## Funcionalidades implementadas

- **Autenticación completa**
  - Registro e inicio de sesión
  - Validación de contraseñas con indicadores visuales
  - Recuperación de contraseña por email
  - OAuth con Google y Microsoft

- **Gestión de usuarios**
  - Base de datos SQLite
  - Hashing seguro de contraseñas
  - Tokens de recuperación con expiración

- **Interfaz de usuario**
  - Dashboard principal
  - Gestión de presupuestos
  - Calculadora de conversión de monedas
  - Diseño responsive

## Próximos pasos

- [ ] Agregar gráficos de gastos
- [ ] Notificaciones push
- [ ] Exportar datos a Excel
- [ ] Modo offline
- [ ] Más opciones de monedas
- [ ] Integración con APIs bancarias

## Notas técnicas

El proyecto usa:
- **Frontend**: React + TypeScript + Vite + Tailwind + React Router
- **Backend**: Flask + SQLite + CORS
- **Autenticación**: JWT tokens + OAuth 2.0 (Google/Microsoft)
- **Base de datos**: SQLite (fácil de usar y mantener)
- **Email**: Simulado para desarrollo (configurable para producción)

## Configuración OAuth

Para habilitar el login con Google y Microsoft:

1. **Google**: Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **Microsoft**: Ve a [Azure Portal](https://portal.azure.com/)
3. Configura las credenciales en `src/config/oauth.ts`
4. Ver la guía completa en `OAUTH_SETUP_GUIDE.md`

---

*Desarrollado para hacer las finanzas personales más accesibles*