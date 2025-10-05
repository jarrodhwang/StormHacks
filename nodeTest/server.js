const http = require("http");
const sqlite3 = require("sqlite3").verbose();

// === Connect to SQLite ===
const db = new sqlite3.Database("data.db", (err) => {
  if (err) console.error("❌ Database error:", err.message);
  else console.log("✅ Connected to SQLite database.");
});

// === Create table ===
db.run(`
  CREATE TABLE IF NOT EXISTS calendars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_name TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const server = http.createServer((req, res) => {
  // --- CORS HEADERS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // === Handle POST /api/calendars ===
  if (req.url === "/api/calendars" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { sender_name, receiver_email } = JSON.parse(body);

        if (!sender_name || !receiver_email) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing fields" }));
          return;
        }

        const stmt = db.prepare(
          "INSERT INTO calendars (sender_name, receiver_email) VALUES (?, ?)"
        );
        stmt.run(sender_name, receiver_email, function (err) {
          if (err) {
            console.error("❌ DB error:", err.message);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          } else {
            console.log(`📬 Added ${sender_name} → ${receiver_email}`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Calendar created!" }));
          }
        });
        stmt.finalize();
      } catch (err) {
        console.error("❌ JSON parse error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // === Handle GET /api/calendars ===
  if (req.url === "/api/calendars" && req.method === "GET") {
    db.all("SELECT * FROM calendars", [], (err, rows) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows));
      }
    });
    return;
  }

  // Default route
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ Server running. Use POST /api/calendars");
});

server.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
