import jwt from "jsonwebtoken";
import pool from "../db.js";

export async function authRequired(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const [rows] = await pool.query(
      "SELECT login_status, ip_address FROM users WHERE id=?",
      [decoded.id]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];
    const currentIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // ❌ If user is offline OR IP changed → force logout
    if (user.login_status !== "online" || user.ip_address !== currentIp) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
