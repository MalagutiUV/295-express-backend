import { Router } from "express";
import { usePrivateKey } from "../config/env.connect.ts";
import { createRateLimitMiddleware } from "../middleware/rate-limit.middleware.ts";
import { login, register } from "../services/auth.service.ts";

export const createAuthRouter = () => {
    const authRouter = Router();
    const privateKey = usePrivateKey();

    authRouter.use(createRateLimitMiddleware());

    authRouter.post("/login", async (req, res) => {
        const { username, password } = req.body;

        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Username und Passwort sind erforderlich" });
        }

        const token = await login(username, password, privateKey);

        if (!token) {
            return res.status(401).json({ message: "Username oder Passwort falsch" });
        }

        return res.status(200).json({ message: "Login erfolgreich", token });
    });

    authRouter.post("/register", async (req, res) => {
        const { username, password } = req.body;

        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Username und Passwort sind erforderlich" });
        }

        const user = await register(username, password);

        if (!user) {
            return res.status(409).json({ message: "Username ist bereits vergeben" });
        }

        return res.status(201).json(user);
    });

    return authRouter;
};
