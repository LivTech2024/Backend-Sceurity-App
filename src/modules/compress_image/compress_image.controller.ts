import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import { compressImgSchema } from "./compress_image.schema";

export const resizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await compressImgSchema.safeParseAsync(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    const { base64_image, height, width, max_size } = result.data;

    const base64Data = base64_image.replace(/^data:image\/\w+;base64,/, "");

    const buffer = Buffer.from(base64Data, "base64");

    let imagePipeline = sharp(buffer).flatten({
      background: { r: 255, g: 255, b: 255 },
    });

    if (height !== null && width !== null) {
      imagePipeline = imagePipeline.resize({ width, height });
    }

    const resizedImage = await imagePipeline.png().rotate().toBuffer();

    let quality = 100;
    let compressedImage = await sharp(resizedImage)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality })
      .rotate()
      .toBuffer();
    while (compressedImage.length > (max_size ?? 300) * 1024 && quality > 0) {
      quality--;
      compressedImage = await sharp(resizedImage)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .rotate()
        .jpeg({ quality })
        .toBuffer();
    }

    res.set("Content-Type", "image/jpeg");
    res.setHeader("Content-Disposition", `attachment; filename=image.jpeg`);
    res.send(compressedImage);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
