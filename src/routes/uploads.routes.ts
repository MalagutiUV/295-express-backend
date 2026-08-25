import { Router } from "express";
import { createAuthMiddleware } from "../middleware/auth.middleware.ts";
import { uploadFile } from "../middleware/upload.middleware.ts";
import { usePrivateKey } from "../config/env.connect.ts";
import { uploadFile as handleUpload } from "../services/upload.service.ts";

export const createUploadsRouter = () => {
    const uploadsRouter = Router();
    uploadsRouter.use(createAuthMiddleware(usePrivateKey()));

    uploadsRouter.post("/", uploadFile.single("file"), handleUpload);

    return uploadsRouter;
};