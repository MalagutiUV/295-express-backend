import { Router } from "express";
import { createAuthMiddleware } from "../middleware/auth.middleware.ts";
import { usePrivateKey } from "../config/env.connect.ts";
import {
    createTrip,
    deleteTrip,
    getTrips,
} from "../services/trips.service.ts";

export const createTripsRouter = () => {
    const tripsRouter = Router();
    tripsRouter.use(createAuthMiddleware(usePrivateKey()));
    tripsRouter.get("/", getTrips);
    tripsRouter.post("/", createTrip);
    tripsRouter.delete("/:id", deleteTrip);
    return tripsRouter;
};