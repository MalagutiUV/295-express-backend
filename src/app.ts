import express, { type Express, type Request, type Response } from "express";

import mysql, { type ResultSetHeader } from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "backendDb",
});

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/users", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username und Passwort sind erforderlich" });
  }

  try {
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
    );

    return res.status(201).json({ id: result.insertId, username });
  } catch (err) {
    console.log(err);
    return res.status(409).json({ message: "Username ist bereits vergeben" });
  }
});

app.get("/login", async (req: Request, res: Response) => {
  const username = String(req.query.username ?? "");
  const password = String(req.query.password ?? "");

  const [users] = await connection.query(
    "SELECT id, username FROM users WHERE username = ? AND password = ?",
    [username, password],
  );

  if (Array.isArray(users) && users.length > 0) {
    return res.status(200).json({ message: "Login erfolgreich", user: users[0] });
  }

  return res.status(401).json({ message: "Username oder Passwort falsch" });
});

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
  const { marke, model, year, username, password } = req.body;

  const [users] = await connection.query(
    "SELECT id FROM users WHERE username = ? AND password = ?",
    [username, password],
  );

  if (Array.isArray(users) && users.length > 0) {

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
  }

  return res.status(401).json({ message: "Unauthorized" });
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
