import { loadEnvFile } from "process";

loadEnvFile();

export const usePrivateKey = () => {
  const privateKey = process.env.TOKEN_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("TOKEN_PRIVATE_KEY is required in .env");
  }
  return privateKey;
}

export const useDbConfig = () => {
  const dbHost = process.env.DB_HOST;
  const dbPassword = process.env.DB_PASSWORD;
  const dbPort = parseInt(process.env.DB_PORT!, 10);
  const dbUser = process.env.DB_USER;

  if (!dbHost) {
    throw new Error("DB_HOST ist missing")
  }

  if (!dbPassword) {
    throw new Error("DB_PASSWORD ist missing")
  }
  if (!dbPort) {
    throw new Error("DB_PORT ist missing")
  }
  if (!dbUser) {
    throw new Error("DB_USER ist missing")
  }
  return {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: dbPort,
    database: "backendDb",
  }
}
