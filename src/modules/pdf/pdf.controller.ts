import { NextFunction, Request, Response } from "express";
import { htmlToPdfSchema } from "./pdf.schema";
import puppeteer from "puppeteer";

export const htmlToPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let browser;

  try {
    const result = await htmlToPdfSchema.safeParseAsync(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    const { html, file_name } = result.data;

    browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();

    try {
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 10 * 60 * 1000, // Increase timeout to 10 minutes
      });
    } catch (error) {
      console.error("Error setting page content:", error);
      next(new Error("Failed to set page content"));
      return;
    }

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${file_name}`);

    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
