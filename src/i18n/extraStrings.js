/**
 * Extra source strings for the translation pipeline.
 *
 * The generator (scripts/i18n-translate.mjs) scans the code for literal
 * t('…') calls. Strings passed to t() through a VARIABLE (e.g. a mapped list
 * like `points.map(p => t(p))`) can't be seen by that scan, so list them here
 * and the pipeline will translate them into every language too.
 *
 * Keep each entry identical to the English source string used at runtime.
 */
export default [
  // DownloadCTA checklist
  'No ads',
  'No subscription',
  'Encrypted by default',

  // TrustBar stats
  'People connected',
  'Messages every day',
  'Countries',
  'Uptime',

  // Features grid
  'Instant messaging',
  'Texts, photos, voice notes, and files that arrive the moment you hit send.',
  'Voice & video calls',
  'Free calls that stay clear, whether it is one friend or a full group.',
  'End to end encryption',
  'Privacy that is on by default, for every chat and every call you make.',
  'Synced everywhere',
  'Pick up any conversation on your phone, tablet, or computer instantly.',
  'Calm notifications',
  'Meaningful alerts you can shape, so you stay present and in control.',
  'Fast & lightweight',
  'Built to feel instant, even on older phones and slower networks.',

  // MultiDevice surface chips
  'iOS & Android',
  'Tablet',
  'Mac & Windows',
]
