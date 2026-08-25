CREATE DATABASE backendDb;

USE backendDb;

CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marke VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    car_id INT NOT NULL,
    distance_km DECIMAL(10, 2) NOT NULL,
    started_at DATETIME NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    weather_data JSON,
    status ENUM(
        'planned',
        'completed',
        'cancelled'
    ) DEFAULT 'planned',
    FOREIGN KEY (driver_id) REFERENCES drivers (id),
    FOREIGN KEY (car_id) REFERENCES cars (id)
);