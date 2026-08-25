import { Router } from "express";
import {
  createCar,
  deleteCar,
  getCarById,
  getCars,
  updateCar,
} from "../services/cars.service.ts";
import { createAuthMiddleware } from "../middleware/auth.middleware.ts";
import { usePrivateKey } from "../config/env.connect.ts";
import { createRateLimitMiddleware } from "../middleware/rate-limit.middleware.ts";



export const createCarsRouter = () => {
  const carsRouter = Router();
  const privateKey = usePrivateKey();
  const requireAuth = createAuthMiddleware(privateKey);
  carsRouter.use(requireAuth);

  carsRouter.use(createRateLimitMiddleware());

  /**
   * @swagger
   * /cars:
   *   get:
   *     summary: Get all cars
   *     responses:
   *       200:
   *         description: A list of cars
   */
  carsRouter.get("/", getCars);


  carsRouter.get("/:id", getCarById);
  carsRouter.post("/", createCar);
  carsRouter.put("/:id", updateCar);
  carsRouter.delete("/:id", deleteCar);

  return carsRouter;
};
