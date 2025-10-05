const { createServer } = require("http");
const Database = require("better-sqlite3");

// Initialize DB
const db = new Database("data.db");
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS calendars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_name TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

console.log("✅ Database ready");

const server = createServer((req, res) => {
  // --- CORS HEADERS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (browser sends an OPTIONS request before POST)
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- Handle POST /api/calendars ---
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

        db.prepare(
          "INSERT INTO calendars (sender_name, receiver_email) VALUES (?, ?)"
        ).run(sender_name, receiver_email);

        console.log(`📬 Added ${sender_name} → ${receiver_email}`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Calendar created!" }));
      } catch (err) {
        console.error("❌ Error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- Default fallback route ---
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ Server running. Use POST /api/calendars");
});

server.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
