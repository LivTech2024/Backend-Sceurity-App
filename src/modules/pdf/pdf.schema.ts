import { z } from "zod";

export const htmlToPdfSchema = z.object({
  html: z.string(),
  file_name: z.string(), //with .pdf extension, //*example: test.pdf
});
