import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();
import cors from "cors"
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controller/user.controller.js";
import { protect } from "./middleware/auth.middleware.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import morgan from "morgan";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(morgan("dev"))
app.use(cookieParser());
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL));
app.use("/api/chat", protect,proxyWithHeader(process.env.CHAT_SERVICE_URL));
app.use("/api/agent",protect,proxy(process.env.AGENT_SERVICE_URL));
app.use("/api/me",protect,getCurrentUser)

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
