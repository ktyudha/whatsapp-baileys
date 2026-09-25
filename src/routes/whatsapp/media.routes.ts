import { createRoute } from "@hono/zod-openapi";

import { anySuccessResponse } from "@core/schemas/common.schema";
import { BaseRoutes } from "@routes/base.route";

// Media endpoints accept either `multipart/form-data` (fields: jid, file,
// caption?, fileName?, mimetype?) or `application/json` (fields: jid, url,
// caption?, fileName?, mimetype?), resolved manually by
// media-upload.helper.ts#resolveMediaUpload. Deliberately not declared as a
// typed `request.body` here: the automatic Zod validator would consume the
// request body stream before resolveMediaUpload can read it (multipart in
// particular can't be safely parsed twice).
const UPLOAD_DESCRIPTION =
  "Body is either multipart/form-data (jid, file, caption?, fileName?, mimetype?) " +
  "or application/json (jid, url, caption?, fileName?, mimetype?).";

export class MediaRoutes extends BaseRoutes {
  sendImage = createRoute({
    tags: ["Media"],
    description: `Send an image. ${UPLOAD_DESCRIPTION}`,
    path: "/media/image",
    method: "post",
    responses: {
      200: this.successResponse(anySuccessResponse, "Image sent"),
      400: this.errorResponse("Missing jid and url/file"),
      500: this.errorResponse("Failed to send image"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendVideo = createRoute({
    tags: ["Media"],
    description: `Send a video. ${UPLOAD_DESCRIPTION}`,
    path: "/media/video",
    method: "post",
    responses: {
      200: this.successResponse(anySuccessResponse, "Video sent"),
      400: this.errorResponse("Missing jid and url/file"),
      500: this.errorResponse("Failed to send video"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendAudio = createRoute({
    tags: ["Media"],
    description: `Send an audio message. ${UPLOAD_DESCRIPTION}`,
    path: "/media/audio",
    method: "post",
    responses: {
      200: this.successResponse(anySuccessResponse, "Audio sent"),
      400: this.errorResponse("Missing jid and url/file"),
      500: this.errorResponse("Failed to send audio"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendDocument = createRoute({
    tags: ["Media"],
    description: `Send a document. ${UPLOAD_DESCRIPTION} \`fileName\` is required.`,
    path: "/media/document",
    method: "post",
    responses: {
      200: this.successResponse(anySuccessResponse, "Document sent"),
      400: this.errorResponse("Missing jid, url/file, or fileName"),
      500: this.errorResponse("Failed to send document"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendSticker = createRoute({
    tags: ["Media"],
    description: `Send a WebP sticker. ${UPLOAD_DESCRIPTION}`,
    path: "/media/sticker",
    method: "post",
    responses: {
      200: this.successResponse(anySuccessResponse, "Sticker sent"),
      400: this.errorResponse("Missing jid and url/file"),
      500: this.errorResponse("Failed to send sticker"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });
}

export type SendImageRoute = typeof MediaRoutes.prototype.sendImage;
export type SendVideoRoute = typeof MediaRoutes.prototype.sendVideo;
export type SendAudioRoute = typeof MediaRoutes.prototype.sendAudio;
export type SendDocumentRoute = typeof MediaRoutes.prototype.sendDocument;
export type SendStickerRoute = typeof MediaRoutes.prototype.sendSticker;
