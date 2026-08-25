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
