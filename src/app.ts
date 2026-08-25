import express, { type Express } from "express";
import path from "node:path";

import { loadEnvFile } from "node:process";
import { createAuthRouter } from "./routes/auth.routes.ts";
import { createCarsRouter } from "./routes/cars.routes.ts";
import { createDriversRouter } from "./routes/drivers.routes.ts";
import { createTripsRouter } from "./routes/trips.routes.ts";
import { createUploadsRouter } from "./routes/uploads.routes.ts";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

loadEnvFile();


const app: Express = express();


const swaggerOptions: swaggerJsdoc.Options = {
  swaggerDefinition: {

    openapi: '3.0.0',
    info: {
      title: 'Car and Track API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },

    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional hint for documentation
          name: 'Authorization',
          in: 'header',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'An error occurred' },
          },
          required: ['message'],
        },
        Car: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64', example: 1 },
            marke: { type: 'string', example: 'Volkswagen' },
            model: { type: 'string', example: 'Golf' },
            year: { type: 'integer', example: 2024 },
          },
          required: ['id', 'marke', 'model', 'year'],
        },
        CarInput: {
          type: 'object',
          required: ['marke', 'model', 'year'],
          properties: {
            marke: { type: 'string', example: 'Volkswagen' },
            model: { type: 'string', example: 'Golf' },
            year: { type: 'integer', example: 2024 },
          },
        },
        Driver: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64', example: 1 },
            name: { type: 'string', example: 'Max Mustermann' },
            licenseNumber: { type: 'string', example: 'CH-123456' },
            license_number: { type: 'string', example: 'CH-123456' },
          },
          required: ['id', 'name', 'licenseNumber'],
        },
        DriverInput: {
          type: 'object',
          required: ['name', 'licenseNumber'],
          properties: {
            name: { type: 'string', example: 'Max Mustermann' },
            licenseNumber: { type: 'string', example: 'CH-123456' },
          },
        },
        Trip: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64', example: 1 },
            driverId: { type: 'integer', example: 1 },
            carId: { type: 'integer', example: 1 },
            driver_id: { type: 'integer', example: 1 },
            car_id: { type: 'integer', example: 1 },
            distanceKm: { type: 'number', format: 'double', example: 42.5 },
            startedAt: { type: 'string', format: 'date-time', example: '2026-08-25T09:30:00Z' },
            distance_km: { type: 'number', format: 'double', example: 42.5 },
            started_at: { type: 'string', format: 'date-time', example: '2026-08-25T09:30:00Z' },
            latitude: { type: 'number', format: 'double', example: 47.3769, nullable: true },
            longitude: { type: 'number', format: 'double', example: 8.5417, nullable: true },
            driver_name: { type: 'string', example: 'Max Mustermann' },
            marke: { type: 'string', example: 'Volkswagen' },
            model: { type: 'string', example: 'Golf' },
            status: { type: 'string', enum: ['planned', 'completed', 'cancelled'], example: 'planned' },
          },
        },
        TripInput: {
          type: 'object',
          required: ['driverId', 'carId', 'distanceKm', 'startedAt', 'latitude', 'longitude'],
          properties: {
            driverId: { type: 'integer', example: 1 },
            carId: { type: 'integer', example: 1 },
            distanceKm: { type: 'number', format: 'double', example: 42.5 },
            startedAt: { type: 'string', format: 'date-time', example: '2026-08-25T09:30:00Z' },
            latitude: { type: 'number', format: 'double', example: 47.3769 },
            longitude: { type: 'number', format: 'double', example: 8.5417 },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'max.mustermann' },
            password: { type: 'string', format: 'password', example: 'secret' },
          },
        },
        RegisterRequest: {
          $ref: '#/components/schemas/LoginRequest',
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login erfolgreich' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
          required: ['message', 'token'],
        },
        UploadResponse: {
          type: 'object',
          properties: {
            filename: { type: 'string', example: 'vehicle.jpg' },
            originalName: { type: 'string', example: 'vehicle.jpg' },
            mimeType: { type: 'string', example: 'image/jpeg' },
            size: { type: 'integer', example: 24576 },
            url: { type: 'string', example: '/uploads/vehicle.jpg' },
          },
          required: ['filename', 'originalName', 'mimeType', 'size', 'url'],
        },
        Weather: {
          type: 'object',
          additionalProperties: true,
          description: 'Weather archive response returned by Open-Meteo.',
        },
        Route: {
          type: 'object',
          properties: {
            destination: { type: 'string', example: 'Schaffhausen' },
            distanceKm: { type: 'number', example: 68.42 },
            durationMinutes: { type: 'integer', example: 52 },
            geometry: { type: 'object', additionalProperties: true },
            steps: { type: 'array', items: { type: 'object', additionalProperties: true } },
            waypoints: { type: 'array', items: { type: 'object', additionalProperties: true } },
          },
        },
      },
    },

  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", createAuthRouter());
app.use("/cars", createCarsRouter());
app.use("/drivers", createDriversRouter());
app.use("/trips", createTripsRouter());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/uploads", createUploadsRouter());



app.listen(3000);
