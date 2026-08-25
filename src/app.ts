import express, { type Express } from "express";

import { loadEnvFile } from "node:process";
import { createAuthRouter } from "./routes/auth.routes.ts";
import { createCarsRouter } from "./routes/cars.routes.ts";
import { createDriversRouter } from "./routes/drivers.routes.ts";
import { createTripsRouter } from "./routes/trips.routes.ts";

loadEnvFile();


const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", createAuthRouter());
app.use("/cars", createCarsRouter());
app.use("/drivers", createDriversRouter());
app.use("/trips", createTripsRouter());



app.listen(3000);
