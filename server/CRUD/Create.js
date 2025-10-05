import express from "express";

const router = express.Router();

export default (dbPromise) => {
  router.get("/", async (req, res) => {
    const db = await dbPromise;
    const users = await db.all("SELECT * FROM users");
    res.json(users);
  });

  router.post("/", async (req, res) => {
    const { name, age } = req.body;
    const db = await dbPromise;
    await db.run("INSERT INTO users (name, age) VALUES (?, ?)", [name, age]);
    res.json({ message: "User added" });
  });

  return router;
};
