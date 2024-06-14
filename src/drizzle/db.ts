// import { drizzle } from "drizzle-orm/node-postgres";
// import {} from "mysql2";
import * as schema from "./schema";

// export const client = new Client({
//   host: "ix.cs.uoregon.edu",
//   port: 3627,
//   user: "mkloberd",
//   password: "password",
//   database: "poke-db",
// });

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// const connection = await mysql.createConnection({
const poolConnection = mysql.createPool({
  host: "ix.cs.uoregon.edu",
  port: 3627,
  user: "mkloberd",
  password: "password",
  database: "poke-db",
});

export const db = drizzle(poolConnection);

// { schema } is used for relational queries
// export const db = drizzle(client, { schema });
