import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Shared by scripts/prerender-schema.mjs (build) and vite.config.js (dev
// server): maps each route to the page component that owns its JSON-LD, so the
// schema is injected into the served HTML on the dev server too — SEO
// extensions and view source see it without a production build.
// The strings are read straight out of the page components; nothing here
// holds a copy, so the component stays the single source of truth.

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

// [route, page file, schema constant names in render order]
export const SCHEMA_ROUTES = [
  ['/', 'src/pages/Home/Home.jsx', ['ORGANIZATION_SCHEMA', 'WEBSITE_SCHEMA', 'WEBPAGE_SCHEMA']],
  ['/video-calling-app', 'src/pages/Calling/CallingPage.jsx', ['CALLING_PAGE_SCHEMA']],
  ['/messaging', 'src/pages/Messaging/MessagingPage.jsx', ['MESSAGING_PAGE_SCHEMA']],
  ['/group-chat-app', 'src/pages/Groups/GroupsPage.jsx', ['GROUPS_PAGE_SCHEMA']],
  ['/social-media-platform', 'src/pages/Channels/ChannelsPage.jsx', ['CHANNELS_PAGE_SCHEMA']],
  ['/ai-assistant-app', 'src/pages/KtAI/KtAIPage.jsx', ['KTAI_PAGE_SCHEMA']],
  ['/social-feed-app', 'src/pages/Status/StatusPage.jsx', ['STATUS_PAGE_SCHEMA']],
  ['/secure-messaging-app', 'src/pages/Security/SecurityPage.jsx', ['SECURITY_PAGE_SCHEMA']],
  ['/premium-messaging-app', 'src/pages/KtPlus/KtPlusPage.jsx', ['KTPLUS_PAGE_SCHEMA']],
  ['/notes-app', 'src/pages/Notes/NotesPage.jsx', ['NOTES_PAGE_SCHEMA']],
  ['/minis-short-video-app', 'src/pages/Minis/MinisPage.jsx', ['MINIS_PAGE_SCHEMA']],
  ['/private-messaging-app', 'src/pages/Privacy/PrivacyPage.jsx', ['PRIVACY_PAGE_SCHEMA']],
  ['/contact', 'src/pages/Contact/ContactPage.jsx', ['CONTACT_PAGE_SCHEMA']],
]

const sources = new Map()
function sourceOf(file) {
  if (!sources.has(file)) sources.set(file, fs.readFileSync(path.join(root, file), 'utf8'))
  return sources.get(file)
}

/** The runtime string value of `const NAME = `...`` — what React puts in the DOM. */
function schemaRuntimeValue(source, name) {
  const start = source.indexOf(`const ${name} = ` + '`')
  if (start < 0) throw new Error(`constant ${name} not found`)
  const from = start + `const ${name} = `.length + 1
  const end = source.indexOf('`', from)
  if (end < 0) throw new Error(`constant ${name} template literal not terminated`)
  // eslint-disable-next-line no-eval
  return eval('`' + source.slice(from, end) + '`') // same evaluation the browser performs
}

/** [{ id, json }] for the route, [] when the route has no schema. */
export function schemaBlocksFor(route) {
  const entry = SCHEMA_ROUTES.find(([r]) => r === route)
  if (!entry) return []
  const [, file, names] = entry
  const src = sourceOf(file)
  return names.map((name) => {
    const json = schemaRuntimeValue(src, name)
    JSON.parse(json) // fail loudly if a schema is ever invalid
    return { id: name, json }
  })
}

/** Ready-to-insert <script> tags, or '' when the route has no schema. */
export function schemaTagsFor(route) {
  return schemaBlocksFor(route)
    .map(({ id, json }) => `    <script type="application/ld+json" data-jsonld="${id}">${json}</script>`)
    .join('\n')
}
