import { translationTarget, translationsFor } from '../services/translation.service.js'

// Responses that carry no page text worth translating.
const SKIP = /^\/locales\/?$/

/**
 * Public GET requests with `?lang=<site language>` get a `translations` map
 * ({ English: translated }) for the text in their `data`, next to it. Failures
 * never break a response — it is then sent without translations (English).
 */
export function translateResponses(req, res, next) {
  const lang = req.method === 'GET' && !SKIP.test(req.path) ? translationTarget(req.query.lang) : null
  if (!lang) return next()
  const send = res.json.bind(res)
  res.json = (body) => {
    if (res.statusCode >= 400 || !body || body.success !== true || body.data == null) return send(body)
    translationsFor(body.data, lang)
      .then((translations) => send(Object.keys(translations).length ? { ...body, translations } : body))
      .catch(() => send(body))
    return res
  }
  next()
}
