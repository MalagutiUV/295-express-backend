import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

if (existsSync(".env")) {
  loadEnvFile();
}

const getEnv = (name: string) => process.env[name]?.replace(/^("|')|("|')$/g, "");

export const usePrivateKey = () => {
  const privateKey = getEnv("TOKEN_PRIVATE_KEY");
  if (!privateKey) {
    throw new Error("TOKEN_PRIVATE_KEY is required in .env");
  }
  return privateKey;
}

export const useDbConfig = () => {
  const dbHost = getEnv("DB_HOST");
  const dbPassword = getEnv("DB_PASSWORD");
  const dbPort = parseInt(getEnv("DB_PORT") ?? "", 10);
  const dbUser = getEnv("DB_USER");

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
