import { Router } from "express";
import { usePrivateKey } from "../config/env.connect.ts";
import { createRateLimitMiddleware } from "../middleware/rate-limit.middleware.ts";
import { login, register } from "../services/auth.service.ts";

export const createAuthRouter = () => {
    const authRouter = Router();
    const privateKey = usePrivateKey();

    authRouter.use(createRateLimitMiddleware());

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Log in and receive a JWT
     *     security: []
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/AuthResponse' }
     *       400:
     *         description: Username and password are required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       401:
     *         description: Invalid username or password
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     */
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

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register a user
     *     security: []
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterRequest'
     *     responses:
     *       201:
     *         description: User created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id: { type: integer, example: 1 }
     *                 username: { type: string, example: max.mustermann }
     *       400:
     *         description: Username and password are required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       409:
     *         description: Username is already taken
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     */
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
