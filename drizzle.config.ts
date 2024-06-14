import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  dbCredentials: {
    host: "ix.cs.uoregon.edu",
    port: 3627,
    user: "mkloberd",
    password: "password",
    database: "poke-db",
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
