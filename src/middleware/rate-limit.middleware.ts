import type { RequestHandler } from "express";

interface RequestCounter {
    count: number;
    resetAt: number;
}

export const createRateLimitMiddleware = (
    maxRequests = 5,
    windowMs = 60_000,
): RequestHandler => {
    const requestsByClient = new Map<string, RequestCounter>();

    return (req, res, next) => {
        const clientId = req.ip ?? req.socket.remoteAddress ?? "unknown";
        const now = Date.now();
        const current = requestsByClient.get(clientId);

        if (!current || current.resetAt <= now) {
            requestsByClient.set(clientId, { count: 1, resetAt: now + windowMs });
            return next();
        }

        if (current.count >= maxRequests) {
            const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
            res.setHeader("Retry-After", retryAfterSeconds);
            return res.status(429).json({
                message: "Zu viele Anfragen. Bitte später erneut versuchen.",
            });
        }

        current.count += 1;
        return next();
    };
};
