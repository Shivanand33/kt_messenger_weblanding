import { img, imgAlt } from '../../../utils/imageOverrides'
/**
 * The signature framed image used across showcase sections: a padded surface
 * frame with a large radius and a soft premium shadow. Children render on top
 * for floating accent chips.
 */
export function MediaFrame({
  image,
  alt = '',
  height = 'h-[420px] sm:h-[500px] lg:h-[560px]',
  className = '',
  frameClassName = '',
  children,
}) {
  const resolvedAlt = imgAlt(image, alt)
  return (
    <div className={`group relative ${className}`} title={resolvedAlt}>
      <div className={`relative overflow-hidden rounded-block border border-line bg-surface p-3 shadow-card ${frameClassName}`}>
        <img src={img(image)} alt={resolvedAlt} title={resolvedAlt} loading="lazy" className={`w-full rounded-media object-cover ${height}`} />
        
        {resolvedAlt && (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/85 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md border border-white/20">
              {resolvedAlt}
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
