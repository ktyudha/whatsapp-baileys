import { createRouter } from "@core/app.core";
import * as statusController from "@controllers/whatsapp/status.controller";
import { StatusRoutes } from "./status.routes";

const routes = new StatusRoutes();

const router = createRouter().openapi(routes.getStatus, statusController.getStatus);

export default router;
