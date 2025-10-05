// index.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// ✅ Import routers
import createRoute from "./CRUD/Create.js";
import readRoute from "./CRUD/Read.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Create and open the SQLite database
const dbPromise = open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

// ✅ Initialize the database
(async () => {
  const db = await dbPromise;

  // Create user table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER
    )
  `);

  // Create product table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL
    )
  `);

  console.log("✅ SQLite database connected and tables ready");
})();

// ✅ Register your routes here
app.use("/api/create", createRoute(dbPromise));
app.use("/api/read", readRoute(dbPromise));

// ✅ Start server
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
