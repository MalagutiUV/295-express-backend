import { hash } from "bcrypt";
import type { ResultSetHeader } from "mysql2/promise";
import jwt from "jsonwebtoken";
import { connection } from "../config/db.connect.ts";
import {
    isUserAndPasswordValid,
    isUsernameAvailable,
} from "./user.service.ts";

export const login = async (
    username: string,
    password: string,
    privateKey: string,
) => {
    const isValid = await isUserAndPasswordValid(username, password);

    if (!isValid) {
        return null;
    }

    return jwt.sign({ username }, privateKey);
};

export const register = async (username: string, password: string) => {
    const isUsernameFree = await isUsernameAvailable(username);

    if (!isUsernameFree) {
        return null;
    }

    const hashedPassword = await hash(password, 10);
    const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
    );

    return { id: result.insertId, username };
};
