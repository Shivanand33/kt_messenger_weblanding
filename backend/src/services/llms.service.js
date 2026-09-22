import { env } from '../config/env.js'
import { getSiteModel, absolute } from './siteModel.service.js'

/**
 * /llms.txt (https://llmstxt.org): a Markdown overview of the public website
 * for AI assistants and language models, built from the shared site model so
 * it lists the same canonical URLs as /sitemap.xml.
 *
 *   # KT Messenger
 *   > one-line summary
 *   short notes, then one "## Section" per topic with "- [Title](URL): notes"
 *   and a final "## Optional" section for secondary links.
 *
 * Every URL is checked before it is written: absolute on the production
 * origin, a safe path, not an internal area, and listed only once. Test
 * content (the admin form's placeholder text, test/dummy titles) and
 * duplicate titles are left out.
 */

// Areas that are never public pages, even if something points there.
const INTERNAL = /^\/(admin|dashboard|api|auth|login|internal)(\/|$)/i
const SAFE_URL = /^https:\/\/[^\s()<>[\]]+$/

// Collapse to one line and cap the length at a word boundary.
function oneLine(text, max = 200) {
  const s = String(text || '').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 40 ? cut.lastIndexOf(' ') : max).replace(/[\s,;:.-]+$/, '')}…`
}

// Link text may not contain brackets in Markdown.
const linkText = (s) => oneLine(s, 120).replace(/[[\]]/g, (c) => `\\${c}`)

// One entry per title: when several share a title, keep the one whose slug
// is not a numbered copy (welcome-to-kt-messenger over welcome-to-kt-messenger-2).
function uniqueByTitle(items) {
  const best = new Map()
  for (const item of items) {
    const key = item.title.toLowerCase()
    const current = best.get(key)
    if (!current || (/-\d+$/.test(current.slug || '') && !/-\d+$/.test(item.slug || ''))) best.set(key, item)
  }
  return items.filter((item) => best.get(item.title.toLowerCase()) === item)
}

export function renderLlms(model) {
  const seen = new Set()
  const link = (title, path, description) => {
    const url = absolute(path)
    if (!url.startsWith(`${env.siteUrl}/`) || !SAFE_URL.test(url) || INTERNAL.test(path) || !title) return null
    const key = url.toLowerCase()
    if (seen.has(key)) return null
    seen.add(key)
    const notes = oneLine(description)
    return `- [${linkText(title)}](${url})${notes ? `: ${notes}` : ''}`
  }
  const sections = []
  const section = (heading, lines) => {
    const items = lines.filter(Boolean)
    if (items.length) sections.push(`## ${heading}\n\n${items.join('\n')}`)
  }
  const page = (id) => model.pages.find((p) => p.id === id)
  const pageLink = (p) => (p ? link(p.name, p.path, p.description) : null)
  const inGroup = (group) => model.pages.filter((p) => p.group === group)

  const home = page('home')
  const business = model.business.filter((b) => !b.test)
  const developers = business.filter((b) => /developer/i.test(b.group))
  const articles = uniqueByTitle(model.articles.filter((a) => !a.test))
  const posts = uniqueByTitle(model.posts.filter((p) => !p.test))

  section('Main pages', ['home', 'apps', 'about', 'contact'].map((id) => pageLink(page(id))))
  section('Features', inGroup('features').map(pageLink))
  section('Privacy and security', inGroup('trust').map(pageLink))
  section('KT for Business', [
    ...inGroup('business').map(pageLink),
    ...business.filter((b) => !developers.includes(b)).map((b) => link(b.title, b.path, b.description)),
  ])
  section('Developer documentation', developers.map((b) => link(b.title, b.path, b.description)))
  section('Help Center', inGroup('help').map(pageLink))

  // One section per Help Center category, in the admin's order.
  const categories = new Map()
  for (const a of [...articles].sort((x, y) => x.categoryOrder - y.categoryOrder || x.subcategoryOrder - y.subcategoryOrder || x.order - y.order)) {
    const name = a.category || 'Articles'
    if (!categories.has(name)) categories.set(name, [])
    categories.get(name).push(link(a.title, a.path, a.description))
  }
  for (const [name, lines] of categories) section(`Help Center: ${name}`, lines)

  section('Blog', [...inGroup('blog').map(pageLink), ...posts.map((p) => link(p.title, p.path, p.description))])
  section('Optional', [
    ...inGroup('optional').map(pageLink),
    link('Sitemap', '/sitemap.xml', 'XML sitemap with every public URL of the website'),
  ])

  const summary = oneLine(home?.description || 'KT Messenger is a secure messaging and calling app.', 300)
  return [
    '# KT Messenger',
    '',
    `> ${summary}`,
    '',
    `This file lists the main public pages of ${env.siteUrl}, grouped by topic, for AI assistants and language models. Every link is the page's canonical URL. The complete list of public URLs is in the sitemap: ${absolute('/sitemap.xml')}`,
    '',
    sections.join('\n\n'),
    '',
  ].join('\n')
}

let last = null // { model, text }

/** The current llms.txt; re-rendered only when the cached site model changes. */
export async function getLlmsTxt() {
  const model = await getSiteModel()
  if (last && last.model === model) return last.text
  const text = renderLlms(model)
  last = { model, text }
  return text
}
