-- Neexa Database Initialization Script
-- Create database and user for the application

-- Create database
CREATE DATABASE IF NOT EXISTS neexa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS neexa_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'neexa_user' and 'your_password' with your desired credentials)
CREATE USER IF NOT EXISTS 'neexa_user'@'localhost' IDENTIFIED BY 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON neexa_db.* TO 'neexa_user'@'localhost';
GRANT ALL PRIVILEGES ON neexa_dev.* TO 'neexa_user'@'localhost';

-- Apply privileges
FLUSH PRIVILEGES;

-- Use the development database
USE neexa_dev;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    login_attempts INT DEFAULT 0,
    locked_until DATETIME NULL,
    phone VARCHAR(20) NULL,
    date_of_birth DATE NULL,
    preferred_currency VARCHAR(3) DEFAULT 'ARS',
    
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a sample admin user (password: Admin123!)
INSERT IGNORE INTO users (email, password_hash, first_name, last_name, is_active, is_verified) 
VALUES (
    'admin@neexa.com', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4V1c3Zf7cK', 
    'Admin', 
    'Neexa', 
    TRUE, 
    TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email_active ON users(email, is_active);
CREATE INDEX idx_users_locked_until ON users(locked_until);

-- Show created tables
SHOW TABLES;

-- Show user privileges
SHOW GRANTS FOR 'neexa_user'@'localhost';













