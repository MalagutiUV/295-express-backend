import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connection } from "../config/db.connect.ts";

interface Trip extends RowDataPacket {
    id: number;
    driver_id: number;
    car_id: number;
    distance_km: number;
    started_at: string;
}

interface ExistsRow extends RowDataPacket {
    id: number;
}

export const getTrips = async (_req: Request, res: Response) => {
    const [trips] = await connection.query<Trip[]>(
        `SELECT trips.*, drivers.name AS driver_name, cars.marke, cars.model
     FROM trips
     JOIN drivers ON drivers.id = trips.driver_id
     JOIN cars ON cars.id = trips.car_id
     ORDER BY trips.started_at DESC`,
    );
    return res.status(200).json(trips);
};

export const createTrip = async (req: Request, res: Response) => {
    const { driverId, carId, distanceKm, startedAt } = req.body;

    const [drivers] = await connection.query<ExistsRow[]>(
        "SELECT id FROM drivers WHERE id = ?",
        [driverId],
    );
    const [cars] = await connection.query<ExistsRow[]>(
        "SELECT id FROM cars WHERE id = ?",
        [carId],
    );

    if (drivers.length === 0 || cars.length === 0) {
        return res.status(404).json({ message: "Driver oder Car wurde nicht gefunden" });
    }

    const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO trips (driver_id, car_id, distance_km, started_at) VALUES (?, ?, ?, ?)",
        [driverId, carId, distanceKm, startedAt],
    );

    return res.status(201).json({
        id: result.insertId,
        driverId,
        carId,
        distanceKm,
        startedAt,
    });
};

export const deleteTrip = async (req: Request, res: Response) => {
    const tripId = Number(req.params.id);
    await connection.query("DELETE FROM trips WHERE id = ?", [tripId]);
    return res.status(200).json({ message: `Trip ${tripId} deleted successfully` });
};