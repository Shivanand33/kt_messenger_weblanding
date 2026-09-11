import { makeImageResolver } from './imageKey'

/**
 * Admin image replacements, resolved at render time.
 *
 * This is deliberately a module-level function rather than a React hook.
 * Images are rendered from many places — nested sub-components, module-scope
 * helper functions, mapped card renderers — and a hook is only usable inside a
 * component body. A plain import works everywhere, so wiring an `<img>` can
 * never land somewhere the resolver is out of scope.
 *
 * The map is filled once by LanguageProvider, whose own state change re-renders
 * the tree, so no subscription mechanism is needed here.
 */
let resolve = makeImageResolver({})

/** Called by LanguageProvider when the admin overrides arrive. */
export function setImageOverrides(map) {
  resolve = makeImageResolver(map)
}

/**
 * Resolve an image source to its admin override, or return it unchanged.
 * Safe before the overrides load and safe if they never load.
 */
export function img(src) {
  return resolve(src)
}
