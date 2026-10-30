# WWW canonical redirect: local implementation and deployment handoff

## Findings (30 October 2026)

- Root `src/` is React 19 + Vite; `npm run build` produces static `dist/`.
- `admin/` is a separate React/Vite application.
- Backend entry is `backend/src/server.js`, calling `createApp()` in
  `backend/src/app.js`. It serves API/media/crawler endpoints, not the React site.
- `backend/Dockerfile` builds only the API and starts `npm run start:prod` on
  port 4000. `backend/docker-compose.yml` starts a development database only.
- No production Nginx/Apache config, static-host manifest, or CI pipeline was
  found in the repository. The static origin hosting provider cannot be
  established from these files or Cloudflare response headers.
- Cloudflare is confirmed in public response headers. An existing edge Worker
  is configured in this directory. This does not prove its current deployed
  version or routes; account access is needed to verify those.
- Read-only live GET checks: HTTP WWW returned 301 to HTTPS WWW, HTTPS WWW and
  the apex returned 200 HTML. WWW `/api/health` returned 200 HTML, whereas
  `landing-api.ktmessenger.com/api/health` returned 200 JSON. These responses
  support separate website/API handling; they do not expose upstream logs.
- Existing canonical tags already prefer `https://ktmessenger.com/`. Tags do
  not perform HTTP redirects. No global WWW redirect was present locally.
- Express has `trust proxy = 1`. Whether the production proxy preserves Host
  or rewrites it is not verifiable locally. This change does not use or change
  that setting, forwarded headers, CORS, cookies, credentials, or backend code.

## Implementation

`src/worker.js` checks `new URL(request.url).hostname` at the beginning of the
handler. Only the exact hostname `www.ktmessenger.com` redirects. The Location
is a fixed `https://ktmessenger.com` plus `pathname` plus `search`, returned via
`Response.redirect(..., 301)`. Forwarded headers cannot change the destination.
The redirect precedes the metadata loop marker, so clients cannot bypass it
by supplying that marker. Apex URLs never enter this branch.

`wrangler.toml` replaces the five narrow WWW routes with
`www.ktmessenger.com/*` (no scheme restriction, so both HTTP and HTTPS match).
Existing apex routes remain the same. Normal apex pages do not incur a Worker
invocation. Existing blog/crawler processing remains in place.

API exception: `/api` and `/api/*` retain their original requests and responses,
including POST/OPTIONS, cookies and authorization. This protects login and
forms from 301 method conversion/cross-origin changes. The dedicated
`landing-api.ktmessenger.com` hostname is outside the Worker routes. Thus the
WWW canonical requirement applies to website URLs; API URLs are deliberately
excluded, rather than promising every API request will redirect safely.

## Local verification

Results in this workspace: 13/13 tests passed, including the real loopback HTTP
check. `npm run build` passed (existing large-chunk warning). The running local
backend returned 200 JSON with `db: up` for health and 200 JSON for the blog
list. Production was read only; no commit, push, deployment, or DNS changes
were performed. An existing unrelated Footer.jsx edit was left untouched.

From the repository root:

```powershell
node --test workers/blog-meta/test/redirect.test.mjs
npm run build
curl.exe -i http://127.0.0.1:4000/api/health
curl.exe -i "http://127.0.0.1:4000/api/blog?limit=1"
```

The test suite exercises HTTP and HTTPS Request URLs, homepage/blog/contact,
encoded paths, repeated query parameters, exact host matching, spoofed forwarded
headers, HEAD, loop-marker bypass attempts, API passthrough, apex passthrough,
existing blog/crawler branches and route coverage. A temporary loopback HTTP
server also verifies a real 301 status/Location over HTTP.

Limits: upstream responses are mocked in Worker unit tests. They do not prove
production origin routing, browser login, TLS certificates, or Cloudflare route
installation. HTTPS Request tests exercise the handler, not a TLS handshake.
The loopback HTTP bridge is a test only, not a new production server. Live local
health/blog checks separately verify the existing backend. No database writes,
login attempts, or contact submissions are performed by these tests.

## Deployment owner action (not performed)

A normal frontend Git push/build or backend redeployment alone is NOT sufficient.
The frontend build does not deploy this Worker. No automatic Worker deployment
pipeline was found. The owner must:

1. Confirm the Cloudflare zone, existing Worker, origin DNS/proxy setup and
   valid HTTPS coverage for both site hostnames. No DNS records were changed.
2. Review route overlap: a more-specific route, another Worker, or an earlier
   redirect rule may intercept WWW requests before this handler.
3. Publish this Worker AND its updated routes from `workers/blog-meta` using
   their approved Wrangler version and authenticated deployment environment
   (`wrangler deploy`). Do not deploy a duplicate Worker or replace the apex
   origin. If hosted on Cloudflare Pages, these Worker routes are not the right
   deployment mechanism: the owner must use a zone Redirect Rule or an approved
   Pages integration instead. Confirm hosting before rollout.
4. Existing HTTP-to-HTTPS handling may create two hops (HTTP WWW -> HTTPS WWW ->
   HTTPS apex). If a single hop is required, the owner must install an earlier
   zone redirect for WWW directly to the HTTPS apex. The Worker cannot override
   an edge redirect that runs before it.
5. Verify with GET as well as HEAD after rollout:

```powershell
curl.exe -I http://www.ktmessenger.com/
curl.exe -I https://www.ktmessenger.com/
curl.exe -I https://www.ktmessenger.com/blog
curl.exe -I "https://www.ktmessenger.com/blog?source=test"
curl.exe -sS -D - -o NUL "https://www.ktmessenger.com/blog?source=test"
curl.exe -I -L --max-redirs 5 "http://www.ktmessenger.com/blog?source=test"
curl.exe -I https://ktmessenger.com/
curl.exe -i https://landing-api.ktmessenger.com/api/health
```

Expected: HTTPS WWW returns 301 with the equivalent HTTPS apex Location;
following redirects terminates without loops. The apex homepage returns 200,
and API health returns JSON. Verify a real blog, contact page and login using
the owner's normal smoke tests. If rollback is needed, restore the previous
Worker version and its previous narrow WWW route configuration; permanent
redirects may remain cached by clients.

References:
- https://developers.cloudflare.com/workers/configuration/routing/routes/
- https://developers.cloudflare.com/workers/examples/redirect/
