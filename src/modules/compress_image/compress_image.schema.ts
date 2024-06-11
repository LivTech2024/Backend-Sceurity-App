import { z } from "zod";

export const compressImgSchema = z.object({
  base64_image: z.string(),
  height: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  max_size: z.number().optional().nullable(), // In Kb
});
