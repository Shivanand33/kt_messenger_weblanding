/**
 * Light and dark skins for the in-phone app screens.
 *
 * These are plain CSS custom properties set on the device's screen element, so
 * every screen below it can use `bg-[var(--p-surface)]` and switch theme with a
 * single style object — no duplicated `dark:` class on hundreds of nodes, and
 * no dependence on the site's own `dark` class, which lives far above the
 * portal this prototype renders into.
 */
export const SKINS = {
  light: {
    '--p-bg': '#eff3f7',
    '--p-bg2': '#f7f9fb',
    '--p-surface': '#ffffff',
    '--p-surface2': '#e9eef4',
    // Frosted bar: the fill stays well under half opaque so the blur behind it
    // actually shows, `edge` draws the hairline rim and `sheen` the light
    // falling across the top of the glass.
    '--p-glass': 'rgba(255,255,255,0.55)',
    '--p-glass-edge': 'rgba(255,255,255,0.8)',
    '--p-glass-sheen': 'rgba(255,255,255,0.65)',
    '--p-text': '#0b0f14',
    '--p-text-mid': '#3d4854',
    '--p-text2': '#7c8894',
    '--p-text3': '#8b95a1',
    '--p-text4': '#9aa5b1',
    '--p-line': '#e4e9ef',
    '--p-line2': '#eef1f4',
    '--p-border': '#cfd6de',
    '--p-sel': '#dceaff',
    '--p-sel-line': '#c6dcff',
    '--p-bubble': '#d7e9ff',
    '--p-ctrl': '#dfe4ea',
    '--p-ctrl-card': '#eef1f5',
    '--p-key': '#ffffff',
    '--p-keybg': '#d6dae1',
    '--p-keyalt': '#adb3bd',
    '--p-doodle': '#f1f4f7',
    '--p-doodle-ink': 'rgba(15,33,56,0.05)',
  },
  dark: {
    '--p-bg': '#0b1117',
    '--p-bg2': '#10181f',
    '--p-surface': '#161e27',
    '--p-surface2': '#1f2a35',
    '--p-glass': 'rgba(18,26,35,0.55)',
    '--p-glass-edge': 'rgba(255,255,255,0.14)',
    '--p-glass-sheen': 'rgba(255,255,255,0.12)',
    '--p-text': '#eef3f8',
    '--p-text-mid': '#c2ccd6',
    '--p-text2': '#8d9aa7',
    '--p-text3': '#7a8794',
    '--p-text4': '#6f7d89',
    '--p-line': '#232e3a',
    '--p-line2': '#1d262f',
    '--p-border': '#36434f',
    '--p-sel': '#16314d',
    '--p-sel-line': '#1f4a73',
    '--p-bubble': '#1f3f63',
    '--p-ctrl': '#2a3540',
    '--p-ctrl-card': '#161e27',
    '--p-key': '#475160',
    '--p-keybg': '#171e26',
    '--p-keyalt': '#333d49',
    '--p-doodle': '#0c141c',
    '--p-doodle-ink': 'rgba(255,255,255,0.05)',
  },
}
