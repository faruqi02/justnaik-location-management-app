import express from "express";
import pool from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all locations for logged-in user
router.get("/", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM locations WHERE user_id = ?", [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching locations" });
  }
});

// ✅ Add a new location
router.post("/", authRequired, async (req, res) => {
  const { name, lat, lng } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO locations (user_id, name, lat, lng) VALUES (?, ?, ?, ?)",
      [req.user.id, name, lat, lng]
    );
    res.json({ id: result.insertId, name, lat, lng, user_id: req.user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding location" });
  }
});
// ✅ Update location
router.put("/:id", authRequired, async (req, res) => {
  const { id } = req.params;
  const { name, lat, lng } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE locations SET name=?, lat=?, lng=? WHERE id=? AND user_id=?",
      [name, lat, lng, id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json({ id: parseInt(id), name, lat, lng, user_id: req.user.id });
  } catch (err) {
    res.status(500).json({ message: "Error updating location" });
  }
});

// ✅ Delete a location
router.delete("/:id", authRequired, async (req, res) => {
  try {
    await pool.query("DELETE FROM locations WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting location" });
  }
});

export default router;
