/**
 * Route a data-file copy array through the translation / admin-override layer.
 *
 * Marketing copy on the News, Markets, Wallet, Notes and Marketplace pages
 * lives in plain data files as object literals, so it never passed through
 * `t()` and was therefore invisible to the admin content override. Mapping the
 * array through this helper at render time fixes that without moving the data,
 * adding a table, or touching any markup.
 *
 * `t()` returns its argument unchanged when nothing overrides it, so wrapping
 * is a no-op until someone edits the string in admin — the rendered output is
 * byte-identical today.
 *
 * Only known copy-bearing fields are translated. Presentation and identity
 * values (icon, colour, gradient, href, image, numeric ids) are deliberately
 * left alone: they are not business copy, and exposing them as editable text
 * would let an edit break styling or routing.
 */

export const COPY_FIELDS = [
  'title',
  'subtitle',
  'desc',
  'description',
  'summary',
  'text',
  'label',
  'name',
  'quote',
  'role',
  'q',
  'a',
  'action',
  'limit',
  'fee',
  'notes',
  'note',
  'hint',
  'level',
  'event',
  'impact',
  'expires',
  'blurb',
  'caption',
]

/**
 * @param {Array} items   The hardcoded array from a data file.
 * @param {Function} t    The translator from useLanguage().
 * @param {string[]} [fields] Override the default copy field list.
 * @returns {Array} A new array with copy fields passed through `t()`.
 */
export function translateCopy(items, t, fields = COPY_FIELDS) {
  if (!Array.isArray(items) || typeof t !== 'function') return items
  return items.map((item) => {
    if (typeof item === 'string') return t(item)
    if (!item || typeof item !== 'object') return item
    const out = { ...item }
    for (const key of fields) {
      if (typeof out[key] === 'string' && out[key]) out[key] = t(out[key])
    }
    return out
  })
}
