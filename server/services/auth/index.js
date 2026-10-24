import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
dotenv.config()

import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";


const port = process.env.PORT || 3001

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this before routes
app.use("/",authRouter)
app.get("/", (req, res) => {
  res.send("Hello! from auth");
});

app.listen(port, () => {
  console.log(`Auth is running on port ${port}`);
  connectDB()
});