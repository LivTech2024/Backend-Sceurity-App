import { NextFunction, Request, Response } from "express";
import { htmlToPdfSchema } from "./pdf.schema";
import puppeteer from "puppeteer";
import { compressAndConvertImages } from "./pdf.utils";

export const htmlToPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let browser;

  // Set timeout to 5 minutes
  const timeout = 5 * 60 * 1000;

  try {
    const result = await htmlToPdfSchema.safeParseAsync(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    const { html, file_name } = result.data;

    const formattedHtml = await compressAndConvertImages(html);

    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      headless: true,
    });

    const page = await browser.newPage();

    page.setDefaultTimeout(timeout);

    await page.setContent(formattedHtml, {
      waitUntil: "networkidle0",
    });

    let pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${file_name}`);

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error during PDF generation process:", error);
    next(error);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
};
