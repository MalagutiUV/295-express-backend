import { Router } from "express";
import { createAuthMiddleware } from "../middleware/auth.middleware.ts";
import { usePrivateKey } from "../config/env.connect.ts";
import {
    createTrip,
    deleteTrip,
    getTripById,
    getTrips,
} from "../services/trips.service.ts";
import { createRateLimitMiddleware } from "../middleware/rate-limit.middleware.ts";

export const createTripsRouter = () => {
    const tripsRouter = Router();
    tripsRouter.use(createAuthMiddleware(usePrivateKey()));
    tripsRouter.use(createRateLimitMiddleware());

    /**
     * @swagger
     * /trips:
     *   get:
     *     summary: Get all trips
     *     tags: [Trips]
     *     responses:
     *       200:
     *         description: A list of trips
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: { $ref: '#/components/schemas/Trip' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *   post:
     *     summary: Create a trip
     *     tags: [Trips]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema: { $ref: '#/components/schemas/TripInput' }
     *     responses:
     *       201:
     *         description: Trip created
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Trip' }
     *       400:
     *         description: Invalid or incomplete trip data
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       404:
     *         description: Driver or car was not found
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     */
    tripsRouter.get("/", getTrips);
    tripsRouter.post("/", createTrip);

    /**
     * @swagger
     * /trips/{id}:
     *   get:
     *     summary: Get a trip by ID with weather and route data
     *     tags: [Trips]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer }
     *     responses:
     *       200:
     *         description: Trip details; weather is null when coordinates are unavailable
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/Trip'
     *                 - type: object
     *                   properties:
     *                     weather: { nullable: true, allOf: [{ $ref: '#/components/schemas/Weather' }] }
     *                     route: { $ref: '#/components/schemas/Route' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       404:
     *         description: Trip was not found
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       502:
     *         description: Weather or route data could not be loaded
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *   delete:
     *     summary: Delete a trip
     *     tags: [Trips]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer }
     *     responses:
     *       200:
     *         description: Trip deleted
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     */
    tripsRouter.get("/:id", getTripById);
    tripsRouter.delete("/:id", deleteTrip);
    return tripsRouter;
};