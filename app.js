import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "./config/database.js";
import User from "./model/userSchema.js";
import Song from "./model/songSchema.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:5173", process.env.ORIGIN];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser()); // ← ye add karo
app.get("/test", (req, res) => {
  res.send("Test route working ✅");
});
app.use("/auth", userRoutes);
app.use("/api", userRoutes);


const PORT = process.env.PORT || 5010;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
