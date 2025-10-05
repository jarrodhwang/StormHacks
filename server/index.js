import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js backend!" });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


// Create and open the database
const dbPromise = open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

// Create a sample table if not exists
(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER
    )
  `);
  console.log("✅ SQLite database connected and table ready");
})();

// API: Get all users
app.get("/api/users", async (req, res) => {
  const db = await dbPromise;
  const users = await db.all("SELECT * FROM users");
  res.json(users);
});

// API: Add user
app.post("/api/users", async (req, res) => {
  const { name, age } = req.body;
  const db = await dbPromise;
  await db.run("INSERT INTO users (name, age) VALUES (?, ?)", [name, age]);
  res.json({ message: "User added!" });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

