import { Router } from "express";
import * as compressImageController from "./compress_image.controller";

const compressImageRouter = Router();

compressImageRouter.post("/", compressImageController.resizeImage);

export default compressImageRouter;
