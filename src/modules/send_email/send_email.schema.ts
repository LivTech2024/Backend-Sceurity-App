import { z } from "zod";

export const sendEmailSchema = z.object({
  to_email: z.string().email(),
  subject: z.string(),
  from_name: z.string(),
  text: z.string().optional().nullable(),
  html: z.string().optional().nullable(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        content: z
          .string()
          .transform((val) => Buffer.from(val, "base64").toString()),
        contentType: z.string(),
      })
    )
    .optional(),
});
