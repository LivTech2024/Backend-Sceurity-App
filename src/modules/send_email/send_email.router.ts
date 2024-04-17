import { Router } from "express";
import * as sendEmailController from "./send_email.controller";

const sendEmailRouter = Router();

sendEmailRouter.post("/", sendEmailController.sendEmail);

export default sendEmailRouter;
