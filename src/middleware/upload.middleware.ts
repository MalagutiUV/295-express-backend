import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";

const uploadDirectory = path.resolve("uploads");

const getFileExtension = (mimeType: string) => {
    if (mimeType === "image/jpeg") {
        return ".jpg";
    }

    if (mimeType === "image/png") {
        return ".png";
    }

    if (mimeType === "image/webp") {
        return ".webp";
    }

    if (mimeType === "application/pdf") {
        return ".pdf";
    }

    return null;
};

mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) => {
        const fileExtension = getFileExtension(file.mimetype);
        callback(null, `${randomUUID()}${fileExtension}`);
    },
});

export const uploadFile = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!getFileExtension(file.mimetype)) {
            return callback(new Error("Dateityp nicht erlaubt"));
        }

        return callback(null, true);
    },
});