/**
 * JSON-LD schema block. Renders nothing when the same schema was already
 * delivered in the static HTML for this route (see scripts/prerender-schema.mjs),
 * so crawlers that read the raw document and crawlers that run JavaScript
 * both see exactly one copy of each schema.
 */
export function JsonLd({ id, json }) {
  if (typeof document !== 'undefined' && document.querySelector(`script[data-jsonld="${id}"]`)) {
    return null
  }
  return <script type="application/ld+json" data-jsonld={id} dangerouslySetInnerHTML={{ __html: json }} />
}
