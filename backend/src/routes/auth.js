import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT id FROM users WHERE email=?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users(full_name, email, password_hash) VALUES (?,?,?)",
      [fullName, email, hashed]
    );

    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: result.insertId, fullName, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, fullName: user.full_name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout (frontend deletes token client-side)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

export default router;
