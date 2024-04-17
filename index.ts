// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors middleware
import authUserRouter from "./src/modules/auth_user/auth_user.router";
import sendEmailRouter from "./src/modules/send_email/send_email.router";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/auth_user", authUserRouter);
app.use("/api/send_email", sendEmailRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
