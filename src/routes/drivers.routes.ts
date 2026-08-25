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

export const createDriversRouter = () => {
    const driversRouter = Router();
    driversRouter.use(createAuthMiddleware(usePrivateKey()));
    driversRouter.get("/", getDrivers);
    driversRouter.get("/:id", getDriverById);
    driversRouter.post("/", createDriver);
    driversRouter.put("/:id", updateDriver);
    driversRouter.delete("/:id", deleteDriver);
    return driversRouter;
};