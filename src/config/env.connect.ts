import { loadEnvFile } from "process";

loadEnvFile();

export const usePrivateKey = () => {
   const privateKey = process.env.TOKEN_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("TOKEN_PRIVATE_KEY is required in .env");
  }
  return privateKey;
}

