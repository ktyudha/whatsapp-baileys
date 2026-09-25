# whatsapp-baileys

WhatsApp bot & HTTP API built on [Baileys](https://github.com/WhiskeySockets/Baileys) (multi-device WebSocket client, no browser/Puppeteer) and [Hono](https://hono.dev). One process runs both: an HTTP API for sending messages/media/etc. programmatically, and a persistent WhatsApp socket for receiving messages and running bot behavior (auto-reply, forwarding, `!`-commands, call handling).

## Requirements

- [Bun](https://bun.sh) (runtime — not Node.js)
- For local (non-Docker) sticker conversion: no extra system deps, `ffmpeg-static` bundles its own binary

## Getting started

```sh
bun install
cp .env.example .env   # then edit values, see below
bun run dev
```

On first run, either scan the printed QR code or, if `WA_PAIRING_NUMBER` is set in `.env`, use the pairing code flow instead. Session credentials are persisted to `WA_AUTH_DIR` (`auth_info_baileys/` by default) so you don't need to re-auth on restart.

The HTTP API listens on `PORT` (default `2881`). All `/api/whatsapp/*` routes are defined with [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) — request bodies/params are Zod-validated automatically, and the generated OpenAPI 3.0 spec is served at `/openapi.json`.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start with hot reload |
| `bun run start` | Start without hot reload |
| `bun run typecheck` | Type-check with `tsc --noEmit` |

## API

All endpoints live under `/api/whatsapp` (messages, media, social, chat, groups, broadcast, privacy, calls, status) plus a health check at `/status`. Full request/response schemas are self-documenting via the generated spec:

```
GET /openapi.json
```

Load that URL into any OpenAPI viewer (e.g. [Swagger Editor](https://editor.swagger.io)) for interactive docs — there's no bundled UI in this repo.

## Configuration

All environment variables are validated with Zod ([src/config/type.config.ts](src/config/type.config.ts)). See [.env.example](.env.example) for the full list with descriptions. Highlights:

- `WA_PAIRING_NUMBER` — set to auth via pairing code instead of QR
- `WA_AUTO_REPLY_ENABLED` / `WA_AUTO_REPLY_MESSAGE` — static auto-reply for private chats
- `WA_FORWARD_ENABLED` / `WA_FORWARD_SOURCE_WHITELIST` / `WA_FORWARD_TARGET_JIDS` — forward messages from specific chats to other chats
- `WA_REDIRECT_GROUP_ID` — forward every private message into this group, with reply-routing back to the original sender
- `WA_COMMAND_ADMIN_JIDS` — whitelist of JIDs allowed to run `!`-commands (empty disables all commands)
- `WA_REJECT_CALLS` — auto-reject incoming voice/video calls with a text reply; call outcomes are reported to `WA_REDIRECT_GROUP_ID` when set

## Architecture

See [CLAUDE.md](CLAUDE.md) for a detailed breakdown of the layers (controllers → services → Baileys), the event pipeline, JID/LID handling, and the command/call/redirect subsystems.

## Security note

There is currently **no authentication** on the HTTP API and no SSRF/size guard on media URL uploads — don't expose the port beyond a trusted network as-is.

## Docker

```sh
docker compose up -d --build
```

See [docker-compose.yml](docker-compose.yml). The WhatsApp session (`auth_info_baileys/`) is bind-mounted from the project root so it survives container restarts/recreation. Unlike `whatsapp-web.js`, Baileys has no separate on-disk cache directory — only the auth session needs to persist.
