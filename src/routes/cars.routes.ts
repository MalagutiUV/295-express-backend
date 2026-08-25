import { Router } from "express";
import {
  createCar,
  deleteCar,
  getCarById,
  getCars,
  updateCar,
} from "../services/cars.service.ts";
import { createAuthMiddleware } from "../middleware/auth.middleware.ts";
import { loadEnvFile } from "node:process";
import { usePrivateKey } from "../config/env.connect.ts";



export const createCarsRouter = () => {
  const carsRouter = Router();
  const privateKey = usePrivateKey();
  const requireAuth = createAuthMiddleware(privateKey);

  carsRouter.use(requireAuth);
  carsRouter.get("/", getCars);
  carsRouter.get("/:id", getCarById);
  carsRouter.post("/", createCar);
  carsRouter.put("/:id", updateCar);
  carsRouter.delete("/:id", deleteCar);

  return carsRouter;
};
