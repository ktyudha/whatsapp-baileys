import { createRouter } from "@core/app.core";
import * as callController from "@controllers/whatsapp/call.controller";
import { CallRoutes } from "./call.routes";

const routes = new CallRoutes();

const router = createRouter().openapi(routes.reject, callController.reject);

export default router;
