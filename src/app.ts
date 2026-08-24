import express, {
  type Express,
  type Request,
  type Response,
} from "express";

import {
  type ResultSetHeader,
} from "mysql2/promise";
import { hash } from "bcrypt";
import { isUserAndPasswordValid, isUsernameAvailable } from "./services/user.service.ts";
import { connection } from "./config/db.connect.ts";
import jwt from "jsonwebtoken";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post("/users", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const isValid = await isUserAndPasswordValid(username, password);
  if(isValid) {
    return res.status(409).json({ message: "Username ist bereits vergeben" });
  }
  else{
    try {
    const hashedPassword = await hash(password, 10);
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
    );

    return res.status(201).json({ id: result.insertId, username });
  } catch (err) {
    console.log(err);
    return res.status(409).json({ message: "Username ist bereits vergeben" });
  }
 }});

app.get("/login", async (req: Request, res: Response) => {
  const username = String(req.query.username ?? "");
  const password = String(req.query.password ?? "");

  const isValid = await isUserAndPasswordValid(username, password);

  // Speichern 
  const privateKey = "super-secret-pk"

  // create jwt token and return it to client (postman, browser, curl)
  const token = jwt.sign({username: username}, privateKey);


  if(isValid) {
    return res.status(200).json({ message: "Login erfolgreich" });
  }
  else {
    return res.status(401).json({ message: "Username oder Passwort falsch" });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const isUsernameFree = await isUsernameAvailable(username);
  
  if(isUsernameFree){
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const [results, fields] = await connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
    );

    return res.status(200).json({"message": "register success"});
  }
  else {
    return res.status(400).json({"message": "username already exists"})
  }

});

app.get("/cars", async (req: Request, res: Response) => {
  
  // get token from request (header) 
 
  // if token-.-.
  // check if I created this token (valid gültig date)


  // return data to user


    
  
  if(!isValid) {
    return res.status(401).json({ message: "Username oder Passwort falsch" });
  }
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
  const { username, password } = req.query;
  const isValid = await isUserAndPasswordValid(
    String(username),
    String(password),
  );
  if (!isValid) {
    return res.status(401).json({ message: "Username oder Passwort falsch" });
  }

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

  const isValid = await isUserAndPasswordValid(
    String(username),
    String(password),
  );
  if (isValid) {

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
  const { marke, model, year, username, password } = req.body;
  const isValid = await isUserAndPasswordValid(
    String(username),
    String(password),
  );
  if (!isValid) {
    return res.status(401).json({ message: "Username oder Passwort falsch" });
  }

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
  const { username, password } = req.body;
  const isValid = await isUserAndPasswordValid(
    String(username),
    String(password),
  );
  if (!isValid) {
    return res.status(401).json({ message: "Username oder Passwort falsch" });
  }

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
