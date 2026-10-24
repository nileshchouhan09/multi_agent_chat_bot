import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
dotenv.config()

import chatRouter from "./routes/chat.route.js";


const port = process.env.PORT || 3001

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/",chatRouter)
app.get("/", (req, res) => {
  res.send("Hello! from chat");
});

app.listen(port, () => {
  console.log(`Chat is running on port ${port}`);
  connectDB()
});