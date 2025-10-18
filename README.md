# Billetera Neexi

Una aplicación completa de finanzas personales desarrollada con React, TypeScript y Python Flask.

## Características Principales

### 💰 Gestión de Presupuestos
- Presupuestos optimizados automáticamente según mejores prácticas financieras
- Categorías personalizables con porcentajes recomendados
- Ajuste dinámico basado en ingresos mensuales

### 🎯 Sistema de Ahorros
- Creación y seguimiento de metas de ahorro
- Progreso visual con barras de avance
- Contribuciones periódicas y tracking de progreso

### 💱 Conversor de Monedas
- Conversión en tiempo real entre múltiples monedas
- API integrada para tipos de cambio actualizados
- Interfaz intuitiva para cálculos rápidos

### 🔐 Autenticación Segura
- Sistema de registro e inicio de sesión
- Integración OAuth con Google y Microsoft
- Recuperación de contraseñas
- Tokens JWT para seguridad

### 🎨 Interfaz Moderna
- Diseño responsive para todos los dispositivos
- Modo oscuro optimizado
- Interfaz limpia sin emojis
- Componentes reutilizables

## Tecnologías Utilizadas

### Frontend
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación
- **Context API** - Gestión de estado

### Backend
- **Python Flask** - Framework web
- **SQLite** - Base de datos
- **Werkzeug** - Seguridad de contraseñas
- **Flask-CORS** - Manejo de CORS
- **JWT** - Autenticación

## Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- Python (v3.8 o superior)
- npm o yarn

### Configuración del Frontend

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración del Backend

```bash
# Navegar al directorio del backend
cd neexa-backend

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos
python init_db.py

# Iniciar servidor
python simple_server.py
```

## Estructura del Proyecto

```
billetera-neexi/
├── src/                    # Código fuente del frontend
│   ├── components/         # Componentes React
│   ├── contexts/          # Contextos de React
│   ├── services/          # Servicios y APIs
│   ├── config/            # Configuración
│   └── assets/            # Imágenes y recursos
├── neexa-backend/         # Código fuente del backend
│   ├── app/               # Aplicación Flask
│   ├── database/          # Esquemas de base de datos
│   ├── tests/             # Tests unitarios
│   └── migrations/        # Migraciones de BD
└── docs/                  # Documentación
```

## Funcionalidades Detalladas

### Dashboard Principal
- Resumen financiero personalizado
- Gráficos de gastos por categoría
- Alertas y notificaciones
- Acceso rápido a todas las funciones

### Gestión de Presupuestos
- Creación de presupuestos mensuales
- Distribución automática por categorías
- Seguimiento de gastos vs presupuesto
- Alertas de exceso de gasto

### Sistema de Metas
- Metas de ahorro personalizadas
- Plazos flexibles
- Contribuciones regulares o únicas
- Celebración de logros

### Autenticación
- Registro con validación de email
- Inicio de sesión seguro
- Integración OAuth (Google/Microsoft)
- Recuperación de contraseñas

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Resetear contraseña

### Usuarios
- `GET /api/users/profile` - Perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil
- `GET /api/users/stats` - Estadísticas del usuario

### Presupuestos
- `GET /api/budgets` - Obtener presupuestos
- `POST /api/budgets` - Crear presupuesto
- `PUT /api/budgets/:id` - Actualizar presupuesto
- `DELETE /api/budgets/:id` - Eliminar presupuesto

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

**Juan Ivera** - [@juanivera12](https://github.com/juanivera12)

Proyecto Link: [https://github.com/juanivera12/billeteraneexi](https://github.com/juanivera12/billeteraneexi)

## Agradecimientos

- React Team por el excelente framework
- Tailwind CSS por el sistema de diseño
- Flask por la simplicidad del backend
- Comunidad open source por las librerías utilizadas