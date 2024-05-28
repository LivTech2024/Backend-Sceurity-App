import { NextFunction, Request, Response } from "express";
import { htmlToPdfSchema } from "./pdf.schema";
import pdf, { CreateOptions } from "html-pdf";

export const htmlToPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await htmlToPdfSchema.safeParseAsync(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    const { html, file_name, pdf_options } = result.data;

    const options: CreateOptions = {
      format: pdf_options?.format ? pdf_options.format : "A4",
      orientation: pdf_options?.orientation
        ? pdf_options?.orientation
        : "portrait",
      base: "./assets",
    };

    pdf.create(html, options).toBuffer((err: Error, buffer: Buffer) => {
      if (err) {
        console.error("Error during PDF generation process:", err);
        next(err);
        return;
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${file_name}`);
      res.send(buffer);
    });
  } catch (error) {
    console.error("Error during PDF generation process:", error);
    next(error);
  }
};
