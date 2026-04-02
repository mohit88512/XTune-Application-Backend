import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import "./config/database.js"
import User from './model/userSchema.js';
import Song from './model/songSchema.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());  // ← ye add karo

app.use("/auth", userRoutes);
app.use("/api", userRoutes);

app.listen("5010", () => {
    console.log("Server is running on port 5010");
});