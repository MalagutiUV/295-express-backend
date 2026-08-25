import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connection } from "../config/db.connect.ts";

interface Driver extends RowDataPacket {
    id: number;
    name: string;
    license_number: string;
}

export const getDrivers = async (_req: Request, res: Response) => {
    const [drivers] = await connection.query<Driver[]>(
        "SELECT * FROM drivers ORDER BY name",
    );
    return res.status(200).json(drivers);
};

export const getDriverById = async (req: Request, res: Response) => {
    const driverId = Number(req.params.id);
    const [drivers] = await connection.query<Driver[]>(
        "SELECT * FROM drivers WHERE id = ?",
        [driverId],
    );
    return res.status(200).json(drivers);
};

export const createDriver = async (req: Request, res: Response) => {
    const { name, licenseNumber } = req.body;
    const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO drivers (name, license_number) VALUES (?, ?)",
        [name, licenseNumber],
    );

    return res.status(201).json({ id: result.insertId, name, licenseNumber });
};

export const updateDriver = async (req: Request, res: Response) => {
    const driverId = Number(req.params.id);
    const { name, licenseNumber } = req.body;

    await connection.query(
        "UPDATE drivers SET name = ?, license_number = ? WHERE id = ?",
        [name, licenseNumber, driverId],
    );

    return res.status(200).json({ id: driverId, name, licenseNumber });
};

export const deleteDriver = async (req: Request, res: Response) => {
    const driverId = Number(req.params.id);
    await connection.query("DELETE FROM drivers WHERE id = ?", [driverId]);
    return res.status(200).json({ message: `Driver ${driverId} deleted successfully` });
};