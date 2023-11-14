import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./db";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database Connected...");
    app.listen(port, () => console.log(`App listening on port ${port}!`));
  } catch (error) {
    console.error(error);
  }
}

main();