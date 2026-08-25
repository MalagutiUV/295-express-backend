import { Router } from "express";
import { createAuthMiddleware } from "../middleware/auth.middleware.ts";
import { usePrivateKey } from "../config/env.connect.ts";
import {
    createDriver,
    deleteDriver,
    getDriverById,
    getDrivers,
    updateDriver,
} from "../services/drivers.service.ts";
import { createRateLimitMiddleware } from "../middleware/rate-limit.middleware.ts";

export const createDriversRouter = () => {
    const driversRouter = Router();
    driversRouter.use(createAuthMiddleware(usePrivateKey()));
    driversRouter.use(createRateLimitMiddleware());

    /**
     * @swagger
     * /drivers:
     *   get:
     *     summary: Get all drivers
     *     tags: [Drivers]
     *     responses:
     *       200:
     *         description: A list of drivers
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: { $ref: '#/components/schemas/Driver' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *   post:
     *     summary: Create a driver
     *     tags: [Drivers]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema: { $ref: '#/components/schemas/DriverInput' }
     *     responses:
     *       201:
     *         description: Driver created
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Driver' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     */
    driversRouter.get("/", getDrivers);

    /**
     * @swagger
     * /drivers/{id}:
     *   get:
     *     summary: Get a driver by ID
     *     tags: [Drivers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer }
     *     responses:
     *       200:
     *         description: Driver result, returned as an array by the API
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: { $ref: '#/components/schemas/Driver' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *   put:
     *     summary: Update a driver
     *     tags: [Drivers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer }
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema: { $ref: '#/components/schemas/DriverInput' }
     *     responses:
     *       200:
     *         description: Driver updated
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Driver' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *   delete:
     *     summary: Delete a driver
     *     tags: [Drivers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer }
     *     responses:
     *       200:
     *         description: Driver deleted
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     */
    driversRouter.get("/:id", getDriverById);
    driversRouter.post("/", createDriver);
    driversRouter.put("/:id", updateDriver);
    driversRouter.delete("/:id", deleteDriver);
    return driversRouter;
};