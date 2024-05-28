import { z } from "zod";

export const htmlToPdfSchema = z.object({
  html: z.string(),
  file_name: z.string(), //with .pdf extension, //*example: test.pdf
  pdf_options: z
    .object({
      format: z.enum(["A3", "A4", "A4", "Letter"]),
      orientation: z.enum(["portrait", "landscape"]),
    })
    .optional(),
});
