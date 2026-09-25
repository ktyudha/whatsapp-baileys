import { Hono } from "hono";
import coreRoutes from "@/core/routes.core";
import createApp from "@/core/app.core";
import whatsappRoutes from "@/routes/whatsapp/index";

// WHATSAPP
import whatsappEvents from "@/core/whatsapp-events.core";
import createWhatsApp from "@/core/whatsapp.core";

const app = new Hono();

coreRoutes(app);
whatsappRoutes(app);
createApp(app);
createWhatsApp(whatsappEvents);
