import type { Request, Response } from "express";
import type { ResultSetHeader } from "mysql2/promise";
import { connection } from "../config/db.connect.ts";

export const getCars = async (_req: Request, res: Response) => {
  const [rows] = await connection.query("SELECT * FROM `cars`;");
  return res.status(200).json(rows);
};

export const getCarById = async (req: Request, res: Response) => {
  const carId = parseInt(req.params.id as string, 10);
  const [results] = await connection.query(
    "SELECT * FROM cars WHERE id = ?",
    [carId],
  );
  return res.status(200).json(results);
};


export const createCar = async (req: Request, res: Response) => {
  const { marke, model, year } = req.body;

  const [result] = await connection.query<ResultSetHeader>(
    "INSERT INTO cars (marke, model, year) VALUES (?, ?, ?)",
    [marke, model, year],
  );

  return res.status(201).json({ id: result.insertId, marke, model, year });
};

export const updateCar = async (req: Request, res: Response) => {
  const carId = parseInt(req.params.id as string, 10);
  const { marke, model, year } = req.body;

  await connection.query(
    "UPDATE cars SET marke = ?, model = ?, year = ? WHERE id = ?",
    [marke, model, year, carId],
  );

  return res.status(200).json({ id: carId, marke, model, year });
};

export const deleteCar = async (req: Request, res: Response) => {
  const carId = parseInt(req.params.id as string, 10);

  await connection.query("DELETE FROM cars WHERE id = ?", [carId]);

  return res
    .status(200)
    .json({ message: `Car with id ${carId} deleted successfully` });
};
