# Clearcut Land Management: Project Handoff

_Last updated: 2026-10-08_

This is the state of the project for whoever picks it up next, person or AI assistant. Read it top to bottom before changing anything.

---

## 1. What this is

A marketing website plus an admin back office for **Clearcut Land Management**, a forestry mulching and land clearing business serving Charlotte, NC and the surrounding area.

- **Public site:** home page, 6 service pages, pricing, a project portfolio with before/after photos, blog, a multi-step quote form that creates leads, and 12 city landing pages for local SEO.
- **Admin (`/admin`):** lead tracking with notes, activity history and CSV export; blog editor; drag-and-drop CMS page builder; media library; redirects; testimonials; branding settings; four user roles (super_admin, admin, editor, sales); internal docs; an AI SEO helper.

It was originally built on Replit as "Forestry Boss" (earlier names: Brush Boss, BrushWhackers). On 2026-10-07 it was rebranded to Clearcut Land Management, the Replit leftovers were removed, and it was moved to Railway.

## 2. Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 7, TypeScript, Tailwind 3, shadcn/ui, wouter (routing), TanStack Query |
| Backend | Node 22, Express 5, Passport (local strategy), express-session (in-memory store) |
| Database | PostgreSQL, Drizzle ORM. Schema in `shared/schema.ts`, applied with `drizzle-kit push` (no migration files). |
| Hosting | Railway: `web` service, `Postgres` service, and a volume for uploads |
| DNS | Cloudflare (zone `clearcutlandmanagement.com`) |

Key folders:
- `client/src/pages/`: public pages; `client/src/pages/admin/` holds the admin pages.
- `client/src/components/`: layout (top nav, footer), the preview gate, and shadcn UI components.
- `server/routes.ts`, `server/cms-routes.ts` and `server/ai-routes.ts`: API routes.
- `server/auth.ts`: login, sessions, roles, and the default admin seed.
- `server/seed-*.ts` and `server/docs-data.ts`: starter content, inserted on boot when tables are empty.
- `client/public/brand/`: logo files.

## 3. Brand

The source files are in `~/Desktop/Clearcut Land Management/Branding/` on Mike's Mac. The chosen identity is the board `Agency Boards/clearcut1.png`; the other two boards are unused alternates.

| Role | Name | Hex | HSL token |
|---|---|---|---|
| Primary (buttons, links, icons) | Forest Green | `#123D2A` | `153 54% 15%` |
| Accent (highlight text on dark photo banners) | Earth Gold | `#A88635` | `42 52% 43%` |
| Text | Charcoal | `#2B2F2D` | `150 4% 18%` |
| Background tint | Warm Ivory | `#F5F3EC` | `47 31% 94%` |

- **Fonts:** headings (h1–h3) use **Barlow Condensed** Bold; body text uses **Inter**.
- **Logos:** `client/public/brand/clearcut-horizontal.svg` (main logo) and `client/public/brand/clearcut-symbol.svg` (symbol).
- **Icons:** the symbol is the favicon (`client/public/favicon.svg`, cropped tighter), the iPhone home-screen icon (`client/public/apple-touch-icon.png`, on ivory) and the icon everywhere else. This is the owner's request.
- **Name:** always write **"Clearcut Land Management"**, with a lowercase "cut".
- **Contact:** phone **(951) 316-0826**, email **info@clearcutlandmanagement.com**.

⚠️ **Colors live in two places.** CSS tokens are in `client/src/index.css` (plus `gold` and `ivory` in `tailwind.config.ts`). The `site_settings` table also stores `primary_color` and `secondary_color`, and at runtime they override `--primary` (see `client/src/hooks/use-site-settings.tsx`). Change both.

⚠️ **The phone number is hard-coded** in many page files as well as in `site_settings`. Search for `316-0826` and `19513160826` before changing it.

## 4. Pre-launch protections (currently ON)

The owner wants these kept **until he explicitly says to remove them**.

1. **Password gate.** In `client/src/components/preview-gate.tsx`, wrapped around the router in `client/src/App.tsx`.
   - The password is **`Preview@2026`**.
   - Visitors see a frosted, unreadable version of the site behind a "Private preview" box. Once a browser is unlocked it stays unlocked (stored in localStorage).
   - `/admin` is not gated, because it has its own login.
   - This is only a curtain, not real security: the password is visible in the page's JavaScript, and the data APIs are open.
2. **Noindex**, set in three places:
   - a `<meta name="robots" content="noindex, nofollow">` tag in `client/index.html`;
   - `client/src/hooks/use-page-meta.ts`, which forces `noindex, nofollow`. The original line to restore at launch is in a comment there.
   - an `X-Robots-Tag: noindex, nofollow` header on every response, set in `server/index.ts`.

**At launch:** remove `<PreviewGate>` from `App.tsx`, the meta tag, the forced line in `use-page-meta.ts` and the header middleware.

## 5. Deployment

### Railway
- **Workspace:** "Digital Alchemy", account mike@godigitalalchemy.com.
- **Project:** "Clearcut Land Management" (`2b8bf802-c3d8-4b70-b057-bd1eab25ae0e`).
- **Services:**
  - `web`: `db2aba85-8c79-44d3-8022-816b151db3a5`
  - `Postgres`: `362a40b8-a421-4dac-827f-c2ce2358e4c7`, Postgres 18
- **Railway URL:** https://web-production-f3566.up.railway.app
- **Auto-deploy:** `web` deploys from GitHub **`Go-Digital-Alchemy-Repos/ClearCut`, branch `main`**. Every push to `main` deploys. Prefer pushing over `railway up`, which deploys local files that may not be committed.
- **Build and start:** set in `railway.json`.
  - build: `npm run build`
  - start: `npm run db:push && npm start` (applies schema changes on every boot, then starts the server)
  - health check: `/api/health`
- **Volume:** mounted at `/data`; uploaded media goes to `UPLOADS_DIR=/data/uploads`.
- **Port:** the app listens on Railway's `PORT`, which is 8080.
- **Environment variables on `web`:**
  - `DATABASE_URL`, which references `${{Postgres.DATABASE_URL}}`
  - `SESSION_SECRET` (random)
  - `ADMIN_PASSWORD` (random)
  - `ADMIN_EMAIL=admin@clearcutlandmanagement.com`
  - `PUBLIC_SITE_URL=https://clearcutlandmanagement.com`
  - `UPLOADS_DIR=/data/uploads`
  - Optional, not set: `OPENAI_API_KEY`, which turns on the AI SEO helper. The key can also be entered in Admin → Settings.
- **Admin login:** `admin@clearcutlandmanagement.com`. Get the password with:
  ```bash
  railway variable list -s web --kv | grep ADMIN_PASSWORD
  ```
- **Deprecation:** Railway warns that `railway.json` (config as code) is deprecated and stops working **2026-12-01**. Run `railway config migrate` before then.

### DNS: ⚠️ NOT DONE YET
The custom domains `clearcutlandmanagement.com` and `www.clearcutlandmanagement.com` have been **added in Railway**, but **no records exist in Cloudflare yet**. The domain's nameservers are Cloudflare's (`johnathan` and `hera`). There are no A, CNAME or MX records yet; there is one Google Workspace verification TXT record.

Records to create in the Cloudflare zone `clearcutlandmanagement.com`:

| Type | Name | Value | Proxy |
|---|---|---|---|
| CNAME | `@` | `asprfko3.up.railway.app` | DNS only (grey cloud) until the certificate is issued |
| CNAME | `www` | `h8dy8gmb.up.railway.app` | DNS only (grey cloud) until the certificate is issued |
| TXT | `_railway-verify` | `railway-verify=9e0d5a54ab3c9ed2324f55c5de58cd7d897c0588cb4a086778a5f3d3fee6fad0` | n/a |
| TXT | `_railway-verify.www` | `railway-verify=a3e3153f9316fc6b5a5639a4a223b687a5a975f0b849bd31bddd5b1d71f5ec05` | n/a |

These values come from Railway. If they've changed, re-check with `railway domain status`, or delete and re-add the domains. If you turn on Cloudflare's proxy (orange cloud) later, set SSL/TLS to **Full**.

**Why it isn't done:**
- The `wrangler` CLI on Mike's Mac is logged in as a *different* Cloudflare account (`m.carney3002@gmail.com`), and wrangler can't edit DNS records anyway.
- The plan was to use a Cloudflare API token with the **Edit zone DNS** template, limited to this zone and created in the Digital Alchemy Cloudflare account (mike@godigitalalchemy.com). It would be saved as `CLOUDFLARE_API_TOKEN=...` in the local `.env`, which git ignores, and then the Cloudflare API would be called directly. Two paste attempts failed, so no valid token has been saved yet.
- The other option is to add the four records by hand in the Cloudflare dashboard.

**After DNS goes live, check:**
- https://clearcutlandmanagement.com and the www version load over HTTPS;
- the frosted password screen shows (the owner explicitly asked for this);
- the `X-Robots-Tag` header and the robots meta tag both say `noindex`.

## 6. Local development

Prerequisites: Node 22+ and Docker (OrbStack or Docker Desktop). Homebrew Postgres isn't installed.

```bash
npm install
docker run -d --name clearcut-db --restart unless-stopped -e POSTGRES_USER=clearcut -e POSTGRES_PASSWORD=clearcut -e POSTGRES_DB=clearcut -p 127.0.0.1:5435:5432 -v clearcut-pgdata:/var/lib/postgresql/data postgres:16-alpine
npm run db:push
npm run dev
```

- The local database container `clearcut-db` already exists on Mike's Mac on port **5435**, because ports 5432–5434 are used by other projects.
- The app runs at http://localhost:5050. Port 5000 is taken by macOS AirPlay Receiver.
- `.env` is ignored by git; `server/env.ts` and `drizzle.config.ts` load it. Contents:
  ```
  DATABASE_URL=postgres://clearcut:clearcut@127.0.0.1:5435/clearcut
  SESSION_SECRET=<random>
  ADMIN_PASSWORD=<anything for local>
  PUBLIC_SITE_URL=http://localhost:5050
  PORT=5050
  # OPENAI_API_KEY=            (optional)
  # CLOUDFLARE_API_TOKEN=      (only for the DNS task, never commit)
  ```
- `.claude/launch.json` defines a `clearcut` preview server for Claude Code.
- To reset the local database:
  ```bash
  docker exec clearcut-db psql -U clearcut -c "drop schema public cascade; create schema public;"
  ```
  Then run `npm run db:push` and restart. The seed content comes back on boot.
- After changing `site_settings` values, expect up to about 3 minutes of stale data: the server caches public settings for 2 minutes and browsers cache them for 60 seconds. Restart the dev server to clear the server cache.

## 7. Changes made on 2026-10-07 (commit `485cb5e`)

- **Rebrand:** every Forestry Boss / Brush Boss reference became Clearcut Land Management, with the new phone number, email and domain throughout.
- **Brand identity:** logo, symbol icons, palette and fonts as in §3.
- **Replit removed:** `.replit`, `replit.md`, `attached_assets/`, the `@replit/*` Vite plugins, the Replit favicon, and Replit's voice/chat/image AI integrations. The unused `conversations` and `messages` tables went with them; those integrations' API routes needed no login.
- **AI SEO helper** (`server/ai-routes.ts`): now uses the standard OpenAI SDK with `OPENAI_API_KEY`, or the key saved in Settings, and requires a CMS role to call it.
- **Security fixes:**
  - `/api/public/settings` no longer returns `mailgunApiKey` or `chatgptApiKey`;
  - the hard-coded fallback admin passwords are gone;
  - the default admin is seeded only when `ADMIN_PASSWORD` is set.
- **Portability:**
  - `.env` loading;
  - `reusePort` turned on only on Linux (it crashes on macOS);
  - `UPLOADS_DIR` can be set;
  - `engines.node >= 22`;
  - `railway.json` added.
- **Pre-launch gate and noindex:** as in §4.
- **Mobile fix:** a decorative glow (`.spotlight-glow::before`) made the homepage wider than a phone screen.

## 8. Known issues and to-dos

**Before public launch**
- [ ] **DNS:** see §5.
- [ ] **Placeholder marketing claims:** the homepage stats (500+ acres, 10+ years, 100% insured, 4.9 rating) and every testimonial (in `client/src/pages/home.tsx` and `server/seed-cms.ts`) were written by Replit's AI. Replace them with real numbers and quotes, or remove them.
- [ ] **Email:** the domain has **no MX records**, so mail to info@clearcutlandmanagement.com won't arrive. A Google Workspace verification TXT record exists, so Workspace may be partly set up.
- [ ] **Phone area code:** (951) is a Southern California area code, but the site targets Charlotte, NC. Confirm with the owner that this is intended.
- [ ] **Remove the pre-launch protections** (§4), but only when the owner says so.

**Technical debt**
- **45 TypeScript errors** (`npx tsc --noEmit`). Most are one problem: Express 5 types `req.params` values as `string | string[]`. They don't affect runtime, because the build uses esbuild and Vite without type-checking.
- **No tests.**
- **Sessions use an in-memory store** (`memorystore`), so admins are logged out on every deploy or restart. `connect-pg-simple` is installed and can replace it.
- **`setupAuth(app)` is called twice:** in `server/index.ts` and again in `server/routes.ts`.
- **Secrets in the database:** the Mailgun and ChatGPT keys entered in Admin → Settings are stored as plaintext in `site_settings`.
- **Railway's config-as-code deadline** (2026-12-01): see §5.
- **Large homepage images:** several are about 2.5 MB PNGs in `client/src/assets/images/`. Converting them to WebP would speed up the site.
- **Old password in git history:** commits before `485cb5e` contain `.replit` with the plaintext `ADMIN_PASSWORD` `brushwhackers2026`. The current site doesn't use it.

## 9. Accounts and access summary

| What | Where |
|---|---|
| GitHub repo | `Go-Digital-Alchemy-Repos/ClearCut`, branch `main` |
| Railway | Digital Alchemy workspace, mike@godigitalalchemy.com |
| Cloudflare zone | Expected under the Digital Alchemy account (mike@godigitalalchemy.com); not yet verified by API |
| Site admin | `admin@clearcutlandmanagement.com`; the password is in the Railway variable `ADMIN_PASSWORD` |
| Preview gate | `Preview@2026` |
