import { Hono } from "hono";
import coreRoutes from "@/core/routes.core";
import createApp from "@/core/app.core";

const app = new Hono();

coreRoutes(app);
createApp(app);

