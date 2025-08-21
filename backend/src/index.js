import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import locationRoutes from "./routes/locations.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

const port = process.env.PORT || 4000;
app.get("/", (req, res) => res.json({ message: `API running on http://localhost:${port}` }));

// Routes
app.use("/auth", authRoutes);
app.use("/locations", locationRoutes);


app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
