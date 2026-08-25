import type { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "Eine Datei ist erforderlich" });
    }

    return res.status(201).json({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
    });
};