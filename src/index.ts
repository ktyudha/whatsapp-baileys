import env from "@/config/env.config";
import coreRoutes from "@/core/routes.core";
import createApp, { createRouter } from "@/core/app.core";
import whatsappRoutes from "@/routes/whatsapp/index";

// WHATSAPP
import whatsappEvents from "@/core/whatsapp-events.core";
import createWhatsApp from "@/core/whatsapp.core";

const app = createRouter();

coreRoutes(app);
whatsappRoutes(app);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: { title: env.APP_NAME, version: "1.0.0" },
});

createApp(app);
createWhatsApp(whatsappEvents);
