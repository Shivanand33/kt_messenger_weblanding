/**
 * Languages of the site.
 *
 * The translations themselves live in src/i18n/locales/<lang>.json — one file
 * per language, keyed by the English source string — and a visitor downloads
 * only their own language (src/i18n/dictionaries.js). `npm run i18n:translate`
 * fills them for every string the UI passes to `t()`. `en` has no file: with no
 * entry, `t()` returns the key, which is already the English text. Brand and
 * product names (KT Messenger, KT AI, KT Plus, KT Web, iPhone, Android, Mac & PC,
 * Marketplace) stay in English, as is standard for proper nouns.
 *
 * Text that comes from the admin (Help Center, blog, business pages, FAQs…) is
 * translated by the backend and arrives with the content itself
 * (src/i18n/contentTranslations.js).
 */
export const SUPPORTED_LANGS = ["en","es","pt","fr","de","it","nl","pl","ru","uk","tr","ar","he","fa","hi","bn","gu","mr","pa","ur","ta","te","kn","ml","si","ne","th","vi","id","ms","fil","zh-Hans","zh-Hant","ja","ko","sw","af","zu","ha","yo","am","sq","az","be","bg","ca","hr","cs","da","et","fi","ka","el","hu","is","ga","kk","lv","lt","mk","no","ro","sr","sk"]

// Languages that read right-to-left.
export const RTL_LANGS = ["ar","he","fa","ur"]
