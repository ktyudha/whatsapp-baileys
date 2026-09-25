import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";

import { log } from "@core/helpers/logger.helper";

if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

export async function imageToWebpSticker(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp()
    .toBuffer();
}

export async function videoToWebpSticker(buffer: Buffer): Promise<Buffer> {
  const dir = await mkdtemp(path.join(tmpdir(), "sticker-"));
  const inputPath = path.join(dir, `${randomUUID()}.mp4`);
  const outputPath = path.join(dir, `${randomUUID()}.webp`);

  try {
    await writeFile(inputPath, buffer);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-vcodec libwebp",
          "-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0",
          "-loop 0",
          "-preset default",
          "-an",
          "-vsync 0",
          "-t 6",
        ])
        .toFormat("webp")
        .on("end", () => resolve())
        .on("error", reject)
        .save(outputPath);
    });

    return await readFile(outputPath);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch((error) =>
      log.warn("Sticker: failed to clean up temp dir", { dir, err: error }),
    );
  }
}
