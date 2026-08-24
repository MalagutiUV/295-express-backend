import type { RowDataPacket } from "mysql2";
import { connection } from "../config/db.connect.ts";

export interface User extends RowDataPacket {
  password: string;
}

export const isUserAndPasswordValid = async (username: string, password: string) => {
  const [users] = await connection.query<User[]>(
    "SELECT password FROM users WHERE username = ?",
    [username],
  );

  const user = users[0];
  const isPasswordValid = password === user?.password;
  if (user && isPasswordValid) {
    return true
  }
  else {
    return false;
  }
};