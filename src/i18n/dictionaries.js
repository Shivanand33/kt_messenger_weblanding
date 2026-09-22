import { DEFAULT_LANG, currentLanguage } from './languageUrls'

/**
 * UI translations: src/i18n/locales/<lang>/common.json (shared across the
 * site) and <Page>.json (the strings only that page shows). Every file is its
 * own chunk, so a visitor downloads the shared file plus the pages they open —
 * and English, which needs no dictionary, downloads nothing.
 */
const loaders = import.meta.glob('./locales/*/*.json', { import: 'default' })

// The dictionary LanguageProvider translates with; pages add to it as they load.
let dictionary = {}

async function load(lang, part) {
  const loader = loaders[`./locales/${lang}/${part}.json`]
  if (!loader) return {}
  try {
    return (await loader()) || {}
  } catch {
    // Offline or a failed chunk: that text stays English, the page still works.
    return {}
  }
}

/** The shared dictionary of `lang`, loaded by main.jsx before the first render. */
export async function loadDictionary(lang) {
  dictionary = { ...(await load(lang, 'common')) }
  return dictionary
}

/** Add one page's strings (src/pages/<page>/) — App.jsx loads it with the page's code. */
export async function loadPageDictionary(page) {
  const { lang } = currentLanguage()
  if (lang === DEFAULT_LANG) return
  Object.assign(dictionary, await load(lang, page))
}
