import type { RowDataPacket } from "mysql2";
import { connection } from "../config/db.connect.ts";
import { compare, hash } from "bcrypt";

export interface User extends RowDataPacket {
  password: string;
}

export const isUserAndPasswordValid = async (username: string, password: string) => {
  const [users] = await connection.query<User[]>(
    "SELECT password FROM users WHERE username = ?",
    [username],
  );

  const user = users[0];

  if (!user)
    return false;

  const isPasswordValid = await compare(password, user.password)

  if (user && isPasswordValid) {
    return true
  }
  else {
    return false;
  }
};

export const isUsernameAvailable = async(username:string) => {
    const [users] = await connection.query<User[]>(
    "SELECT username FROM users WHERE username = ?",
    [username],
  );

  if(users.length === 0) {
    return true;
  }
  else {
    return false;
  }
}