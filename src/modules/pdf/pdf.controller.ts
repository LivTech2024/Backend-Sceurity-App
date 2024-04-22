import { NextFunction, Request, Response } from "express";
import { htmlToPdfSchema } from "./pdf.schema";
import puppeteer from "puppeteer";

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

    const { html, file_name } = result.data;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();
    // await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    //   waitUntil: 'networkidle0',
    // });
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${file_name}`);

    await browser.close();

    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
