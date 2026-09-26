import { createRouter } from "@core/app.core";

import statusRoutes from "./status";
import messageRoutes from "./message";
import mediaRoutes from "./media";
import socialRoutes from "./social";
import chatRoutes from "./chat";
import groupRoutes from "./group";
import broadcastRoutes from "./broadcast";
import privacyRoutes from "./privacy";
import callRoutes from "./call";

const router = createRouter()
  .route("/", statusRoutes)
  .route("/", messageRoutes)
  .route("/", mediaRoutes)
  .route("/", socialRoutes)
  .route("/", chatRoutes)
  .route("/", groupRoutes)
  .route("/", broadcastRoutes)
  .route("/", privacyRoutes)
  .route("/", callRoutes);

export default router;
