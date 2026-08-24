# KT Messenger — Website, Backend & Admin

A complete platform for the **KT Messenger marketing website**:

| Part | Stack | Location | Runs on |
|---|---|---|---|
| **Public website** | React 19 + Vite + Tailwind (existing, unchanged) | repository root (`src/`, `public/`, …) | http://localhost:5174 |
| **Backend API + CMS** | Node.js + Express + PostgreSQL + Prisma | [`backend/`](backend) | http://localhost:4000 |
| **Admin panel** | React 18 + Vite + React Router | [`admin/`](admin) | http://localhost:5173 |

> This backend powers the **website and its content** (blog, help center, FAQs, downloads, forms, analytics). It is **not** the backend for the actual KT messaging app — no chat/calls/E2E/WebSocket/push here, by design.

The three parts are fully separated. The public website is untouched except for one additive, opt-in file (`src/services/apiClient.js`).

---

## 1. Frontend analysis → what the backend models

Every place the website hardcodes data maps to an entity, an API and an admin screen:

| Website surface | Hardcoded in | DB entity | Public API | Admin screen |
|---|---|---|---|---|
| Blog list + featured + pagination + search | `pages/Blog/BlogPage` | `BlogPost`, `BlogCategory`, `BlogTag` | `GET /api/blog`, `/blog/featured`, `/blog/:slug` | Blogs, Categories, Tags |
| Help Center tree, article bodies, popular, feedback | `pages/Help/HelpPage` | `HelpCategory`→`HelpSubcategory`→`HelpArticle`, `Feedback` | `GET /api/help/tree`, `/help/articles/:slug`, `/help/popular` | Help Center, Feedback |
| Calling/Messaging FAQs, hero/section copy | `pages/Calling`, `pages/Messaging` | `Faq`, `WebsiteContent` | `GET /api/faqs`, `/content/:key` | FAQs, Website Content |
| Business success stories + search | `pages/Business/BusinessPage` | `SuccessStory` | `GET /api/success-stories`, `/search` | Success Stories |
| Apps download cards + store links | `pages/Apps/AppsPage` | `AppRelease` | `GET /api/downloads` | App Releases |
| Navbar items, Features menu | `layout/Navbar` | `NavigationItem` | `GET /api/navigation` | Navigation |
| Footer columns/links | `layout/Footer` | `FooterSection`, `FooterLink` | `GET /api/footer` | Footer |
| Language selector | Footer/Help | `Locale` | `GET /api/locales` | Locales |
| Download / Get Started CTAs | all pages | `Subscriber` | `POST /api/subscribe` | Subscribers |
| Contact form | (contact CTA) | `ContactMessage` | `POST /api/contact` | Contact Messages |
| "Was this helpful?" widget | Help/feature pages | `Feedback` | `POST /api/feedback` | Feedback |
| Download buttons / page views | all pages | `DownloadEvent`, `AnalyticsEvent` | `POST /api/track/download`, `/track/event` | Analytics |
| — (admin only) | — | `Admin`, `Role`, `Permission`, `Media`, `AuditLog` | `/api/admin/*` | Admin Users, Roles, Media, Audit Log |

---

## 2. Prerequisites

- **Node.js 20+** (tested on Node 24)
- **PostgreSQL 14+** — either your own instance, or the bundled Docker one:
  ```bash
  cd backend && docker compose up -d      # starts Postgres on :5432 (user/pass/db = kt)
  ```

---

## 3. Setup & run (three terminals)

### a) Backend — API + database
```bash
cd backend
npm install
cp .env.example .env          # then edit JWT_SECRET etc. for real use
npm run db:migrate            # create tables (needs a running Postgres)
npm run db:seed               # roles, permissions, super admin + sample content
npm run dev                   # → http://localhost:4000  (GET /api/health)
```

### b) Admin panel
```bash
cd admin
npm install
cp .env.example .env          # VITE_API_URL defaults to http://localhost:4000/api
npm run dev                   # → http://localhost:5173
```
Log in with the seeded super admin:
```
admin@ktmessenger.local  /  ChangeMe123!      (change these via SEED_ADMIN_* env)
```

### c) Public website (unchanged)
```bash
npm install
npm run dev                   # → http://localhost:5174
```

---

## 4. Environment variables

**backend/.env** (see `.env.example`):
`NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGINS`, `FRONTEND_URL`, `ADMIN_URL`, `STORAGE_PROVIDER`, `MEDIA_PUBLIC_URL`, `MAX_UPLOAD_MB`, `SEED_ADMIN_*`, `EMAIL_PROVIDER`.

**admin/.env**: `VITE_API_URL`. **root .env**: `VITE_API_URL` (only used once a page opts into the API).

Never commit real `.env` files (all three are git-ignored).

---

## 5. Backend commands

| Command | Description |
|---|---|
| `npm run dev` | Start API with auto-reload |
| `npm start` | Start API (production) |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed roles, permissions, admin, content |
| `npm run db:reset` | Drop, re-migrate and re-seed |
| `npm run db:studio` | Open Prisma Studio |

---

## 6. RBAC — roles seeded by default

Backend enforces every permission (`resource:action`); the admin UI only hides what you can't do.

| Role | Access |
|---|---|
| **super_admin** | Everything (bypass) — manages admins & roles |
| **admin** | All content, media, forms, analytics (not admins/roles) |
| **editor** | Blogs, categories, tags, help center, FAQs, media |
| **support** | Help center (read), contact messages, feedback |
| **marketing** | Blogs, success stories, website content, analytics |

---

## 7. API overview

Public (read + spam-protected writes): `/api/blog*`, `/api/help/*`, `/api/faqs`, `/api/success-stories*`, `/api/downloads`, `/api/locales`, `/api/navigation`, `/api/footer`, `/api/content/:key`, `/api/search`, `POST /api/subscribe|contact|feedback|track/download|track/event`.

Admin (JWT + RBAC): `/api/admin/auth/*`, `/api/admin/dashboard`, `/api/admin/blogs*`, `/api/admin/blog-categories`, `/api/admin/blog-tags`, `/api/admin/help/*`, `/api/admin/faqs`, `/api/admin/success-stories`, `/api/admin/app-releases`, `/api/admin/website-content`, `/api/admin/navigation`, `/api/admin/footer-*`, `/api/admin/media`, `/api/admin/subscribers`, `/api/admin/contact`, `/api/admin/feedback`, `/api/admin/analytics`, `/api/admin/admins`, `/api/admin/roles`, `/api/admin/permissions`, `/api/admin/locales`, `/api/admin/audit-logs`.

Health: `GET /api/health` → `{ status, db, uptime }`.

All responses use one envelope: `{ success, data, meta? }` or `{ success:false, message, error, details? }`.

---

## 8. Connecting the website to the API (module-by-module)

The website stays fully static until you opt a module in. The pattern keeps the exact UI and falls back to existing content if the API is down:

```jsx
import { api } from '../../services/apiClient'

const HARDCODED = [ /* keep the existing array as the fallback */ ]

function BlogPage() {
  const [posts, setPosts] = useState(HARDCODED)
  useEffect(() => {
    api.listBlog({ page: 1, pageSize: 6 })
      .then(({ items }) => { if (items?.length) setPosts(items) })
      .catch(() => {}) // network/API down → keep HARDCODED, UI unchanged
  }, [])
  // …render exactly as before…
}
```

Recommended order (each is an independent, low-risk swap): **Blog → Help Center → FAQs → Success Stories → App Releases → Website Content → Search → Subscribe → Contact → Feedback → Download/Analytics tracking**. Only the data *source* changes; props, layout, styling and behaviour stay identical.

> **Blog is fully wired to the DB** as the reference implementation, with **one source of truth** (PostgreSQL → `GET /api/blog` → every surface):
> - [`src/pages/Blog/BlogPage.jsx`](src/pages/Blog/BlogPage.jsx) — the `/blog` list + in-page reader (`GET /api/blog`, `GET /api/blog/:slug`).
> - [`src/components/sections/Insights/Insights.jsx`](src/components/sections/Insights/Insights.jsx) — the Home "From the KT Blog" cards fetch the 6 newest published posts from the **same** endpoint, so create/edit/publish/draft/delete are reflected on the next load.
>
> Drafts never appear (the public API returns only published posts). Each keeps its bundled fallback array **only** for offline resilience if the API is unreachable. The visual design is unchanged — API payloads are adapted into the exact shape the existing cards/reader already render. Blog content is authored in the admin (**Blogs** section); the body renderer accepts markdown **or** HTML without `dangerouslySetInnerHTML`.

---

## 9. Security

Helmet, restricted CORS (allow-list), rate limiting (global + strict on public writes + login brute-force), Zod validation on every write, Argon-strength bcrypt hashing (never returned), JWT auth + backend RBAC, honeypot on public forms, hashed IPs for tracking, centralized error handler that never leaks internals in production, and an audit log for sensitive admin actions.

---

## 10. Production notes

- Set a strong `JWT_SECRET`, real `DATABASE_URL`, and lock `CORS_ORIGINS` to your domains.
- `npm run db:deploy` for migrations; run the API behind a process manager / container.
- Media: `STORAGE_PROVIDER=local` serves `/uploads`; swap for S3/R2 by implementing the provider in `services/storage.service.js` (interface already abstracted).
- Website and admin build to static assets (`npm run build`) and deploy to any CDN/static host.
- `GET /api/health` is your uptime/readiness probe.

---

## 11. Verified in this environment

Verified against a **live PostgreSQL 17 + running backend + dev servers**:

- `GET /api/health` → `{ db: "up" }`; migrations applied and seed data present.
- **Full Blog flow end-to-end (29/29 automated assertions):** unauthenticated create rejected (401); login; create-without-title rejected (422); create **draft** (auto-slug, category + tags); draft **hidden** on public list & detail (404); real **image upload** (multipart) + served publicly; cover attached; **publish** (status + publishedAt); post now **public** with body/cover/tags; **edit title** reflected publicly with a **stable slug**; **delete** removes it from public list & detail; shared **categories/tags preserved** after delete; test media cleaned up.
- **Public website renders from the DB:** `/blog` fetches `GET /api/blog` and shows all published posts (featured + grid + category filter); opening an article fetches `GET /api/blog/:slug` and renders the parsed body, tags and related posts. Body parser handles both markdown and HTML bodies (no `dangerouslySetInnerHTML`). No console/network errors; frontend `npm run build` passes.
- Admin **builds** successfully (`vite build`).
