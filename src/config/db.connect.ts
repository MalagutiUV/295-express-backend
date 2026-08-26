
import mysql from "mysql2/promise";
import { useDbConfig } from "./env.connect.ts";

const dbConfig = useDbConfig();

export const connection = await mysql.createConnection(dbConfig);


