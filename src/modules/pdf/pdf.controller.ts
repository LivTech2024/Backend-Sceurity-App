import { NextFunction, Request, Response } from "express";
import { htmlToPdfSchema } from "./pdf.schema";
import puppeteer from "puppeteer";

export const htmlToPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let browser;

  // Set timeout to 10 minutes (600,000 ms)
  const timeout = 10 * 60 * 1000;

  try {
    const result = await htmlToPdfSchema.safeParseAsync(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    const { html, file_name } = result.data;

    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      headless: true,
      timeout,
      protocolTimeout: timeout,
    });

    const page = await browser.newPage();

    try {
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout,
      });
    } catch (error) {
      console.error("Error setting page content:", error);
      next(new Error("Failed to set page content"));
      return;
    }

    let pdfBuffer;
    try {
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        timeout,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      next(new Error("Failed to generate PDF"));
      return;
    }

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
