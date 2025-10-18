#!/usr/bin/env python3
"""
Script de inicio rápido para Neexa Backend
Configura el entorno y ejecuta la aplicación
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Verificar versión de Python"""
    if sys.version_info < (3, 8):
        print("Error: Se requiere Python 3.8 o superior")
        print(f"   Versión actual: {sys.version}")
        sys.exit(1)
    print(f"Python {sys.version.split()[0]} detectado")

def check_virtual_env():
    """Verificar si el entorno virtual está activo"""
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("Advertencia: No se detecto entorno virtual")
        print("   Se recomienda crear y activar un entorno virtual:")
        print("   python -m venv venv")
        print("   venv\\Scripts\\activate  # Windows")
        print("   source venv/bin/activate  # Linux/Mac")
        return False
    print("Entorno virtual activo")
    return True

def install_requirements():
    """Instalar dependencias"""
    print("\nInstalando dependencias...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Dependencias instaladas correctamente")
        return True
    except subprocess.CalledProcessError:
        print("Error instalando dependencias")
        return False

def check_env_file():
    """Verificar archivo de configuración"""
    env_file = Path(".env")
    if not env_file.exists():
        print("\nArchivo .env no encontrado")
        print("   Copiando desde env.example...")
        try:
            import shutil
            shutil.copy("env.example", ".env")
            print("Archivo .env creado")
            print("   IMPORTANTE: Edita .env con tus credenciales de MySQL")
        except Exception as e:
            print(f"Error creando .env: {e}")
            return False
    else:
        print("Archivo .env encontrado")
    return True

def setup_database():
    """Configurar base de datos"""
    print("\nConfigurando base de datos...")
    try:
        from app import create_app, db
        from app.models.user import User
        
        app = create_app()
        with app.app_context():
            db.create_all()
            print("Tablas de base de datos creadas")
            
            # Verificar si existe usuario admin
            admin = User.query.filter_by(email='admin@neexa.com').first()
            if not admin:
                admin = User(
                    email='admin@neexa.com',
                    password='Admin123!',
                    first_name='Admin',
                    last_name='Neexa'
                )
                admin.is_verified = True
                db.session.add(admin)
                db.session.commit()
                print("Usuario admin creado (admin@neexa.com / Admin123!)")
            else:
                print("Usuario admin ya existe")
        
        return True
    except Exception as e:
        print(f"Error configurando base de datos: {e}")
        print("   Verifica que MySQL esté ejecutándose y las credenciales en .env sean correctas")
        return False

def start_server():
    """Iniciar servidor"""
    print("\nIniciando servidor...")
    print("   La API estará disponible en: http://localhost:5000")
    print("   Presiona Ctrl+C para detener el servidor")
    print("\n" + "="*50)
    
    try:
        from app import create_app
        app = create_app()
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n\nServidor detenido")
    except Exception as e:
        print(f"\nError iniciando servidor: {e}")

def main():
    """Función principal"""
    print("Neexa Backend - Script de Inicio Rapido")
    print("="*50)
    
    # Verificaciones básicas
    check_python_version()
    
    # Verificar entorno virtual (opcional)
    check_virtual_env()
    
    # Instalar dependencias
    if not install_requirements():
        return
    
    # Configurar archivo .env
    if not check_env_file():
        return
    
    # Configurar base de datos
    if not setup_database():
        print("\nConsejos para resolver problemas de base de datos:")
        print("   1. Asegúrate de que MySQL esté ejecutándose")
        print("   2. Verifica las credenciales en .env")
        print("   3. Ejecuta manualmente: mysql -u root -p < database/init.sql")
        return
    
    # Iniciar servidor
    start_server()

if __name__ == "__main__":
    main()




