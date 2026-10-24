import express from "express";
import dotenv from "dotenv";
dotenv.config()
import { connectDB } from "./config/db.config.js";

import agentRouter from  "./routes/agent.route.js";



const port = process.env.PORT || 3001

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",agentRouter)

app.get("/", (req, res) => {
  res.send("Hello! from agent");
});



app.listen(port, () => {
  console.log(`Agent is running on port ${port}`);
  connectDB()
});