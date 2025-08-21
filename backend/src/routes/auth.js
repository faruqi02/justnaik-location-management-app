import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE email=?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users(full_name, email, password_hash, login_status, ip_address) VALUES (?,?,?,?,?)",
      [fullName, email, hashed, "offline", null]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Update login status & IP
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await pool.query("UPDATE users SET login_status='online', ip_address=? WHERE id=?", [
      ipAddress,
      user.id,
    ]);

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, fullName: user.full_name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post("/logout", authRequired, async (req, res) => {
  try {
    await pool.query("UPDATE users SET login_status='offline', ip_address=NULL WHERE id=?", [
      req.user.id,
    ]);
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
