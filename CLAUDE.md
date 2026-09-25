# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun install` — install dependencies
- `bun run dev` — start with hot reload (`bun run --hot src/index.ts`)
- `bun run start` — start without hot reload
- `bun run typecheck` — `tsc --noEmit`; there is no test suite in this repo
- `bunx tsc --noEmit -p .` — same as typecheck, use this to verify changes compile before calling a task done

Runtime is **Bun**, not Node — package scripts and imports assume Bun's built-in `.env` loading, `Bun.serve`, etc.

## Architecture

This is a WhatsApp bot/API server built on **Baileys** (a WebSocket-based multi-device WhatsApp client — no browser/Puppeteer involved) and **Hono** for the HTTP layer. Two things run side by side from `src/index.ts`: an HTTP API (for programmatically sending messages/media/etc.) and a persistent WhatsApp socket connection (for receiving messages and running bot behavior).

### Path aliases

`tsconfig.json` maps `@*` → `./src/*`, so `@core/...`, `@services/...`, `@controllers/...`, `@routes/...` all resolve into `src/<same-name>/...`. Follow this convention for new files — don't use relative `../../` imports across top-level folders.

### Layers

- `src/controllers/whatsapp/*.controller.ts` — Hono request handlers. Always wrapped in `withSocket` ([http-response.helper.ts](src/core/helpers/http-response.helper.ts)), which injects the live `WASocket` and turns thrown errors / "not connected" into consistent JSON error responses (`ok()` / `fail()`). Input comes from `c.req.valid("json" | "param")`, already validated by the route's Zod schema — controllers don't validate manually and contain no Baileys calls directly, only calls into a service.
- `src/routes/whatsapp/*.routes.ts` (plural) — OpenAPI route *definitions*: a `class XRoutes extends BaseRoutes` ([base.route.ts](src/routes/base.route.ts)) with one `createRoute({...})` property per endpoint (path, method, Zod request/response schemas, tags). `src/routes/whatsapp/*.route.ts` (singular) wires each definition to its controller via `createRouter().openapi(routes.x, controller.x)` and default-exports the resulting sub-router; `src/routes/whatsapp/index.ts` mounts every sub-router onto the app at `/api/whatsapp`.
- `src/services/whatsapp/**/*.service.ts` — one file per capability group (message, group, chat, call, command, broadcast, privacy, authentication...), each wrapping the corresponding `sock.<baileysMethod>()` calls with try/catch + structured logging via `log.*`. Both controllers (HTTP-triggered) and the event pipeline (socket-triggered) call into these same services — this is the layer to add new WhatsApp capabilities to.
- `src/core/` — wiring and cross-cutting concerns:
  - `whatsapp.core.ts` — creates the Baileys socket (`createWhatsApp`), wires reconnect-on-close.
  - `whatsapp-socket.core.ts` — holds the single active `WASocket` singleton (`getActiveSocket`/`setActiveSocket`), used by controllers via `withSocket`.
  - `whatsapp-events.core.ts` — the one place all `sock.ev.on(...)` listeners are registered; each handler is delegated to a service function. **This is the entry point to read when tracing "what happens when X arrives".**
  - `whatsapp-cache.core.ts` — all in-memory `NodeCache` state: message cache (for `getMessage`), group metadata cache, the group-redirect reply mapping, and call state tracking. TTLs are env-configurable where noted below.
  - `app.core.ts` / `routes.core.ts` — Hono app bootstrap and health/root routes.
  - `helpers/index.helper.ts` re-exports everything under `helpers/*.helper.ts` (jid, date, message-content, http-response, logger, media-upload, sticker) — import from `@core/helpers/index.helper` rather than the individual files.

### Incoming message pipeline

`whatsapp-events.core.ts` → `handleIncomingMessages` ([incoming-message.service.ts](src/services/whatsapp/message/incoming-message.service.ts)) is the router for every inbound message. Order matters — it checks, per message, in this sequence: command prefix → redirect-group reply → forward-source match → private→group redirect → auto-reply fallback. When adding new inbound behavior, decide where in this chain it belongs rather than bolting it on at the end.

### JID handling (important, and easy to get wrong)

Baileys' multi-device protocol can address a private chat by a **LID** (`@lid`, a privacy-preserving rotating identifier) instead of the real phone-number JID (`@s.whatsapp.net`). Any code that needs to display or message back a "real" phone number must not just read `message.key.remoteJid` — it must prefer `message.key.remoteJidAlt` (or `participantAlt` inside groups). Use the helpers in [jid.helper.ts](src/core/helpers/jid.helper.ts) instead of reading `message.key` fields directly:

- `getMessageSenderJid(message)` — real (non-LID) JID of whoever sent a message, normalized.
- `toWhatsAppJid(input)` — normalizes a bare number, `@c.us` (whatsapp-web.js-style), or already-valid JID into `@s.whatsapp.net`. Use this for any user-supplied number/JID (API body, command args) rather than string-concatenating `@s.whatsapp.net` yourself.
- `isJidWhitelisted(jid, whitelist)` — compares against a whitelist using `areJidsSameUser` (handles LID/PN equivalence), not raw string equality.
- `isGroupChat` / `isPrivateChat` / `getJidType` — classify a JID.

### Group-redirect feature

When `WA_REDIRECT_GROUP_ID` is set, every private message to the bot is forwarded into that group with a sender header (see [forward-to-group.service.ts](src/services/whatsapp/message/forward-to-group.service.ts)), and replies to those forwarded messages in the group get routed back to the original sender. This works by mapping `sentMessage.key.id → senderJid` in `whatsapp-cache.core.ts` (`WA_REDIRECT_MAP_TTL_S` TTL) — **every** bubble sent into the group as part of a forward (header text, media, location) must be registered via `rememberMapping`/`setCallState`-style calls, or a reply to that specific bubble will silently fail to route back. `getQuotedStanzaId` ([message-content.helper.ts](src/core/helpers/message-content.helper.ts)) must be kept in sync with every message type that can carry a quote context (`extendedTextMessage`, `imageMessage`, `videoMessage`, `documentMessage`, `audioMessage`, `stickerMessage`) — missing one silently breaks reply-routing for that media type only.

### Command system

[command.service.ts](src/services/whatsapp/command/command.service.ts) implements a `!`-prefixed command router (prefix configurable via `WA_COMMAND_PREFIX`), triggered first in the incoming-message pipeline. **All commands are gated by `WA_COMMAND_ADMIN_JIDS`** (comma-separated JID whitelist, empty = commands fully disabled) — `isCommandSenderAllowed` checks the resolved real sender JID before any handler runs. Register new commands via `commands.set(name, handler)`; handlers get `(sock, message, args, senderJid)`.

### Call handling

[call.service.ts](src/services/whatsapp/call/call.service.ts) tracks call lifecycle (`offer` → `accept`/`reject`/`timeout` → `terminate`) in a short-TTL cache (`whatsapp-cache.core.ts`, `CallState`) to compute duration and final outcome, then reports it to the redirect group. Note: when the bot itself rejects a call (`WA_REJECT_CALLS=true`), WhatsApp does not reliably echo a `reject` status event back — the code finalizes as "Ditolak" immediately after calling `rejectCall` rather than waiting for one. Baileys in this project exposes no outbound-call capability, only `rejectCall`.

### Media

- `WAMediaUpload` accepts either a `Buffer` or `{ url }` (Baileys fetches the URL server-side — the media-upload endpoints in `media.controller.ts` accept both raw file uploads and remote URLs via [media-upload.helper.ts](src/core/helpers/media-upload.helper.ts)).
- WhatsApp stickers must be WebP. [sticker.helper.ts](src/core/helpers/sticker.helper.ts) converts images via `sharp` and video/gif via `fluent-ffmpeg` + `ffmpeg-static` (bundled static binary, no system ffmpeg required) before sending — never pass a raw jpg/png/mp4 buffer as a `stickerMessage`, WhatsApp clients render it as an undownloadable placeholder.

### OpenAPI + Zod routing

Every `whatsapp` route goes through `@hono/zod-openapi`: the app root is `createRouter()` (an `OpenAPIHono`, from [app.core.ts](src/core/app.core.ts)), not plain `Hono` — this matters because `OpenAPIHono#route()` is what merges a sub-router's schema registry into the parent's; mounting onto a plain `Hono` instance silently drops the OpenAPI docs (routing still works, but `/openapi.json` won't list them). `src/index.ts` serves the generated spec at `/openapi.json`.

To add an endpoint: add/extend a Zod schema in `src/core/schemas/*.schema.ts` (reuse `common.schema.ts`'s `jidSchema`/`messageKeySchema`/`nullSuccessResponse`/`anySuccessResponse` where they fit), add a `createRoute` entry to the module's `*.routes.ts`, wire it in `*.route.ts`, and implement the controller function typed as `RouteHandler<TheRouteType>` reading via `c.req.valid(...)`.

Two things that bite easily when adding a route wrapped in `withSocket`:
- `ok`/`fail`/`withSocket` are all generic over `Context`/data/status specifically so the branded `TypedResponse` survives being passed through them — don't re-type their parameters as plain `Context`/`Response`, that erases the branding and breaks the `RouteHandler<...>` assignment with a wall of `JSONRespondReturn<...>` errors.
- `withSocket`'s catch block can return **either** a 500 (`INTERNAL_ERROR`) or 503 (`SOCKET_NOT_READY`) response depending on the error — every route using it must declare both `500` and `503` in `responses`, even if the handler's own success path never fails with a 500. Missing one fails assignment to `RouteHandler<...>` (TS sometimes only flags a subset of the affected routes per run, so don't assume "tsc didn't complain about this one" means it's actually fine — audit for the pair explicitly).

`media.routes.ts` is the deliberate exception: those routes omit `request.body` entirely (no schema-driven validation) because the endpoints accept either `multipart/form-data` or JSON with a remote `url`, resolved manually by [media-upload.helper.ts](src/core/helpers/media-upload.helper.ts)'s `resolveMediaUpload` — letting the auto-validator read the body first would consume the stream before that manual parse can run.

### Env config

All env vars are declared and validated with Zod in [type.config.ts](src/config/type.config.ts) (`EnvSchema`) and parsed in `parse-env.config.ts`; `env.config.ts` exports the parsed singleton. Add new config there, not via raw `process.env` reads elsewhere. `jidListEnv()` is the helper for comma-separated JID-list env vars — reuse it for any new whitelist-style setting instead of writing custom parsing. Update `.env.example` (and `.env` if present locally) alongside any new var.

### No authentication on the HTTP API

There is currently no auth middleware on the Hono app — every controller route is open to anyone who can reach the server. There is also no SSRF guard on the media `url` upload path and no upload size cap. Treat this as known/unaddressed rather than assuming it's handled; don't expose the HTTP port beyond a trusted network without adding auth first.
