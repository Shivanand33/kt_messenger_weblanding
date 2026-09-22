/**
 * Put values into a translated sentence, so the whole sentence is translated
 * (word order included) rather than pieces of it:
 *
 *   fill(t('Request for {amount} sent to {name}.'), { amount, name })
 *
 * `npm run i18n:translate` keeps {placeholders} unchanged in every language.
 */
export const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match))
