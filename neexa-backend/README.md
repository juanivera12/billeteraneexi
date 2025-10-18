# Neexa Backend API

Backend API para la aplicación financiera Neexa, desarrollado con Python Flask y MySQL.

## Características

- Autenticación segura con JWT
- Validación robusta de contraseñas
- Sistema de bloqueo por intentos fallidos
- API RESTful completa
- Validación de datos con Marshmallow
- Migraciones de base de datos
- Tests unitarios
- Configuración para desarrollo y producción
- CORS configurado
- Logging estructurado

## Requisitos del Sistema

- Python 3.8+
- MySQL 8.0+
- pip (gestor de paquetes de Python)

## Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd neexa-backend
```

### 2. Crear entorno virtual
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar base de datos MySQL

#### Opción A: Usar el script SQL incluido
```bash
mysql -u root -p < database/init.sql
```

#### Opción B: Configurar manualmente
```sql
CREATE DATABASE neexa_dev;
CREATE USER 'neexa_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON neexa_dev.* TO 'neexa_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus credenciales
DATABASE_URL=mysql+pymysql://neexa_user:your_password@localhost/neexa_dev
SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
```

### 6. Inicializar base de datos
```bash
python scripts/setup_db.py
```

## Uso

### Desarrollo
```bash
# Activar entorno virtual
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Ejecutar aplicación
python app.py
```

La API estará disponible en: `http://localhost:5000`

### Producción
```bash
# Usar un servidor WSGI como Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/register` | Registrar nuevo usuario |
| POST | `/login` | Iniciar sesión |
| POST | `/logout` | Cerrar sesión |
| POST | `/refresh` | Renovar token |
| GET | `/me` | Obtener usuario actual |
| POST | `/verify-token` | Verificar token |

### Usuario (`/api/user`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/profile` | Obtener perfil |
| PUT | `/profile` | Actualizar perfil |
| POST | `/change-password` | Cambiar contraseña |
| POST | `/deactivate` | Desactivar cuenta |

### Sistema

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado de la API |
| GET | `/api` | Información de la API |

## Ejemplos de Uso

### Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPass123!",
    "confirm_password": "MiPass123!",
    "first_name": "Juan",
    "last_name": "Pérez"
  }'
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPass123!"
  }'
```

### Acceder a Endpoint Protegido
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Requisitos de Contraseña

Las contraseñas deben cumplir los siguientes requisitos:
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un dígito
- Al menos un carácter especial (!@#$%^&*(),.?":{}|<>)

## Seguridad

### Características Implementadas:
- Hash de contraseñas con bcrypt
- Tokens JWT con expiración
- Bloqueo de cuenta por intentos fallidos
- Validación de entrada de datos
- CORS configurado
- Headers de seguridad

### Bloqueo de Cuenta:
- 5 intentos fallidos bloquean la cuenta por 30 minutos
- El bloqueo se resetea al iniciar sesión exitosamente

## Testing

```bash
# Ejecutar todos los tests
python -m pytest tests/

# Ejecutar tests específicos
python -m pytest tests/test_auth.py -v
```

## Estructura del Proyecto

```
neexa-backend/
├── app/
│   ├── __init__.py          # Factory de la aplicación
│   ├── models/              # Modelos de base de datos
│   │   ├── __init__.py
│   │   └── user.py
│   ├── routes/              # Rutas de la API
│   │   ├── __init__.py
│   │   ├── auth_routes.py
│   │   └── user_routes.py
│   ├── services/            # Lógica de negocio
│   │   ├── __init__.py
│   │   └── user_service.py
│   ├── schemas/             # Validación de datos
│   │   ├── __init__.py
│   │   └── user_schema.py
│   ├── middleware/          # Middleware personalizado
│   │   ├── __init__.py
│   │   └── auth.py
│   └── utils/               # Utilidades
├── config/
│   └── config.py            # Configuraciones
├── database/
│   └── init.sql             # Script de inicialización
├── migrations/              # Migraciones de DB
├── scripts/                 # Scripts de utilidad
│   └── setup_db.py
├── tests/                   # Tests unitarios
│   ├── __init__.py
│   └── test_auth.py
├── app.py                   # Punto de entrada
├── requirements.txt         # Dependencias
├── env.example             # Variables de entorno de ejemplo
└── README.md               # Este archivo
```

## Configuración de Producción

### Variables de Entorno Importantes:
```bash
FLASK_ENV=production
DATABASE_URL=mysql+pymysql://user:pass@host:port/db
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-production-jwt-secret
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Recomendaciones:
- Usar HTTPS en producción
- Configurar un proxy reverso (nginx)
- Usar un servidor WSGI (Gunicorn)
- Configurar logging centralizado
- Usar Redis para rate limiting
- Implementar monitoreo

## Troubleshooting

### Error de Conexión a MySQL:
1. Verificar que MySQL esté ejecutándose
2. Confirmar credenciales en .env
3. Verificar que el usuario tenga permisos

### Error de Importación:
1. Activar entorno virtual
2. Instalar dependencias: `pip install -r requirements.txt`

### Error de Migración:
1. Verificar configuración de base de datos
2. Ejecutar: `flask db upgrade`

## Contribución

1. Fork el proyecto
2. Crear rama para feature: `git checkout -b feature/nueva-caracteristica`
3. Commit cambios: `git commit -m 'Agregar nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.











