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
    *     tags: [Cars]
   *     responses:
   *       200:
   *         description: A list of cars
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: { $ref: '#/components/schemas/Car' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *   post:
     *     summary: Create a car
     *     tags: [Cars]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema: { $ref: '#/components/schemas/CarInput' }
     *     responses:
     *       201:
     *         description: Car created
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Car' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
   */
  carsRouter.get("/", getCars);

  /**
   * @swagger
   * /cars/{id}:
   *   get:
   *     summary: Get a car by ID
   *     tags: [Cars]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Car result, returned as an array by the API
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items: { $ref: '#/components/schemas/Car' }
   *       401:
   *         description: Authentication required
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Error' }
   *   put:
   *     summary: Update a car
   *     tags: [Cars]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/CarInput' }
   *     responses:
   *       200:
   *         description: Car updated
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Car' }
   *       401:
   *         description: Authentication required
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Error' }
   *   delete:
   *     summary: Delete a car
   *     tags: [Cars]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Car deleted
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Error' }
   *       401:
   *         description: Authentication required
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Error' }
   */

  carsRouter.get("/:id", getCarById);
  carsRouter.post("/", createCar);
  carsRouter.put("/:id", updateCar);
  carsRouter.delete("/:id", deleteCar);

  return carsRouter;
};
