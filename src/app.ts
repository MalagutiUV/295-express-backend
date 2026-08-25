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
import { loadEnvFile } from "node:process";
import { createCarsRouter } from "./routes/cars.routes.ts";
import { usePrivateKey } from "./config/env.connect.ts";

loadEnvFile();


const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post("/users", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const isValid = await isUserAndPasswordValid(username, password);
  if (isValid) {
    return res.status(409).json({ message: "Username ist bereits vergeben" });
  }
  else {
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
  }
});

app.get("/login", async (req: Request, res: Response) => {
  const username = String(req.query.username ?? "");
  const password = String(req.query.password ?? "");

  const isValid = await isUserAndPasswordValid(username, password);

  const privateKey = usePrivateKey();
  // create jwt token and return it to client (postman, browser, curl)
  const token = jwt.sign({ username: username }, privateKey);


  if (isValid) {
    return res.status(200).json({ message: "Login erfolgreich", token: token });
  }
  else {
    return res.status(401).json({ message: "Username oder Passwort falsch" });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const isUsernameFree = await isUsernameAvailable(username);

  if (isUsernameFree) {
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const [results, fields] = await connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
    );

    return res.status(200).json({ "message": "register success" });
  }
  else {
    return res.status(400).json({ "message": "username already exists" })
  }

});

app.use("/cars", createCarsRouter());



app.listen(3000);
