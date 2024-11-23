import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import { roomsTable } from "./schema";

async function main() {
  const DB_URL = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!DB_URL)
    throw new Error("POSTGRES_URL or DATABASE_URL env variable not found");

  const db = drizzle(DB_URL);

  try {
    await seed(
      db,
      { roomsTable },
      {
        seed: Number(process.env.SEED) ?? 1,
        count: Number(process.env.SEED_DATA_COUNT) ?? 5,
      }
    );
  } catch (error) {
    console.log("[INFO] Already seeded db");
  }
  console.log("[INFO] Done seeding 🌱");
}

void main();
