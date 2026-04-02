import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';

// dotenv.config();
const app = express();

app.use(cookieParser()) 

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());


// connect to database
import "./config/database.js"

// import moodels
import User from './model/userSchema.js';
import Song from './model/songSchema.js';

// import routes
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';

app.use("/auth",userRoutes)
app.use("/api",userRoutes)
// console.log(process.env.MONGO_DB)

app.listen("5010",() => {
    console.log("Server is running on port 5010");
})