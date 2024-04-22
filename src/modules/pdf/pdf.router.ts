import { Router } from "express";
import * as pdfController from "./pdf.controller";

const htmlToPdfRouter = Router();

htmlToPdfRouter.post("/", pdfController.htmlToPdf);

export default htmlToPdfRouter;
