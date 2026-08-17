import express, { type Express, type Request, type Response } from "express";

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dein_passwort",
  database: "backendDb",
});

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/cars", async (req: Request, res: Response) => {
  try {
    const [rows, fields] = await connection.query("SELECT * FROM `cars`;");

    console.log(rows); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
  }
});

app.get("/cars/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const carId = parseInt(id, 10);
  const [results, fields] = await connection.query(
    "SELECT * FROM cars WHERE id = ?",
    [carId],
  );
  return res.status(200).json(results);
});

app.post("/cars", async (req: Request, res: Response) => {
  const { marke, model, year } = req.body;
  const newCar = {
    marke,
    model,
    year,
  };
  const [results, fields] = await connection.query(
    "INSERT INTO cars (marke, model, year) VALUES (?, ?, ?)",
    [newCar.marke, newCar.model, newCar.year],
  );

  return res.status(201).json({ id: results, ...newCar });
});

app.put("/cars/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const carId = parseInt(id, 10);
  const { marke, model, year } = req.body;
  const [results, fields] = await connection.query(
    "UPDATE cars SET marke = ?, model = ?, year = ? WHERE id = ?",
    [marke, model, year, carId],
  );

  console.log(results);

  return res.status(200).json({ id: carId, marke, model, year });
});

app.delete("/cars/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const carId = parseInt(id, 10);
  const [findResult] = await connection.query(
    "SELECT * FROM cars WHERE id = ?",
    [carId],
  );

  const [results, fields] = await connection.query(
    "DELETE FROM cars WHERE id = ?",
    [carId],
  );

  return res
    .status(200)
    .json({ message: `Car with id ${carId} deleted successfully` });
});

app.listen(3000);
