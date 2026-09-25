import type { Context } from "hono";
import type { WAMediaUpload } from "@whiskeysockets/baileys";

export type ResolvedMediaUpload = {
  jid: string;
  media: WAMediaUpload;
  caption?: string;
  fileName?: string;
  mimetype?: string;
};

export async function resolveMediaUpload(c: Context): Promise<ResolvedMediaUpload | undefined> {
  const contentType = c.req.header("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const body = await c.req.parseBody();
    const file = body.file;

    if (!(file instanceof File)) return undefined;

    const buffer = Buffer.from(await file.arrayBuffer());

    return {
      jid: String(body.jid ?? ""),
      media: buffer,
      caption: body.caption ? String(body.caption) : undefined,
      fileName: body.fileName ? String(body.fileName) : file.name,
      mimetype: body.mimetype ? String(body.mimetype) : file.type || undefined,
    };
  }

  const body = await c.req.json();

  if (!body.url) return undefined;

  return {
    jid: body.jid,
    media: { url: body.url },
    caption: body.caption,
    fileName: body.fileName,
    mimetype: body.mimetype,
  };
}
