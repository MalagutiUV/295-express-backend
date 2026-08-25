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

    tripsRouter.get("/", getTrips);
    tripsRouter.post("/", createTrip);
    tripsRouter.get("/:id", getTripById);
    tripsRouter.delete("/:id", deleteTrip);
    return tripsRouter;
};