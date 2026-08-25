import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connection } from "../config/db.connect.ts";
import {
    getRouteToSchaffhausen,
    getWeather,
} from "./weather.service.ts";

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

export const getTripById = async (req: Request, res: Response) => {
    const tripId = Number(req.params.id);
    const [trips] = await connection.query<Trip[]>(
        `SELECT trips.*, DATE_FORMAT(trips.started_at, '%Y-%m-%d %H:%i:%s') AS started_at,
        drivers.name AS driver_name, cars.marke, cars.model
     FROM trips
     JOIN drivers ON drivers.id = trips.driver_id
     JOIN cars ON cars.id = trips.car_id
     WHERE trips.id = ?`,
        [tripId],
    );

    if (trips.length === 0) {
        return res.status(404).json({ message: "Trip wurde nicht gefunden" });
    }

    const trip = trips[0];
    if (trip.latitude === null || trip.longitude === null) {
        return res.status(200).json({ ...trip, weather: null });
    }

    try {
        const [weather, route] = await Promise.all([
            getWeather(trip.latitude, trip.longitude, trip.started_at),
            getRouteToSchaffhausen(trip.latitude, trip.longitude),
        ]);
        return res.status(200).json({ ...trip, weather, route });
    } catch (error) {
        console.error(error);
        return res.status(502).json({
            message: "Wetter- oder Routendaten konnten nicht geladen werden",
        });
    }
};

export const createTrip = async (req: Request, res: Response) => {
    const {
        driverId,
        carId,
        distanceKm,
        startedAt,
        latitude,
        longitude,
    } = req.body;

    if (
        !Number.isInteger(driverId) ||
        !Number.isInteger(carId) ||
        typeof distanceKm !== "number" ||
        typeof startedAt !== "string" ||
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {
        return res.status(400).json({
            message: "Driver, Car, Distanz, Koordinaten und Startzeit sind erforderlich",
        });
    }

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
        `INSERT INTO trips (
            driver_id, car_id, distance_km, started_at, latitude, longitude
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [driverId, carId, distanceKm, startedAt, latitude, longitude],
    );

    return res.status(201).json({
        id: result.insertId,
        driverId,
        carId,
        distanceKm,
        startedAt,
        latitude,
        longitude,
    });
};

export const deleteTrip = async (req: Request, res: Response) => {
    const tripId = Number(req.params.id);
    await connection.query("DELETE FROM trips WHERE id = ?", [tripId]);
    return res.status(200).json({ message: `Trip ${tripId} deleted successfully` });
};