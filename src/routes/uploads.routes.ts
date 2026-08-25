import { Router } from "express";
import { createAuthMiddleware } from "../middleware/auth.middleware.ts";
import { uploadFile } from "../middleware/upload.middleware.ts";
import { usePrivateKey } from "../config/env.connect.ts";
import { uploadFile as handleUpload } from "../services/upload.service.ts";

export const createUploadsRouter = () => {
    const uploadsRouter = Router();
    uploadsRouter.use(createAuthMiddleware(usePrivateKey()));

    /**
     * @swagger
     * /uploads:
     *   post:
     *     summary: Upload a file
     *     tags: [Uploads]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required: [file]
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: JPEG, PNG, WebP, or PDF file up to 5 MB
     *     responses:
     *       201:
     *         description: File uploaded
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/UploadResponse' }
     *       400:
     *         description: A file is required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       401:
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema: { $ref: '#/components/schemas/Error' }
     *       413:
     *         description: File exceeds the 5 MB limit
     */
    uploadsRouter.post("/", uploadFile.single("file"), handleUpload);

    return uploadsRouter;
};