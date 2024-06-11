// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors middleware
import authUserRouter from "./src/modules/auth_user/auth_user.router";
import sendEmailRouter from "./src/modules/send_email/send_email.router";
import htmlToPdfRouter from "./src/modules/pdf/pdf.router";
import bodyParser from "body-parser";
import compressImageRouter from "./src/modules/compress_image/compress_image.router";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/auth_user", authUserRouter);
app.use("/api/send_email", sendEmailRouter);
app.use("/api/html_to_pdf", htmlToPdfRouter);
app.use("/api/compress_image", compressImageRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
