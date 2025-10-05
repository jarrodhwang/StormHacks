import { createServer } from "http";
import Database from "better-sqlite3";

const db = new Database("data.db");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS test_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL 
    )
`
).run();

console.log("SQLite connected and table ready");

const server = createServer((req, res) => {
  if (req.url === "/add" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { name } = JSON.parse(body);
      db.prepare("INSERT INTO test_table (name) VALUES (?)").run(name);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Inserted successfully!" }));
    });
  } else if (req.url === "/list" && req.method === "GET") {
    const rows = db.prepare("SELECT * FROM test_table").all();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server running! Use /add or /list");
  }
});

server.listen(3000, () =>
  console.log("Test server running on http://localhost:3000")
);
