import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const createAuthMiddleware = (privateKey: string): RequestHandler => {
  return (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token malformed" });
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      return res.status(401).json({ message: "Token malformed" });
    }

    try {
      jwt.verify(token, privateKey);
      next();
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
