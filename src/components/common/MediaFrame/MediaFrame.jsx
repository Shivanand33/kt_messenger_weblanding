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
  return (
    <div className={`relative ${className}`}>
      <div className={`overflow-hidden rounded-block border border-line bg-surface p-3 shadow-card ${frameClassName}`}>
        <img src={image} alt={alt} loading="lazy" className={`w-full rounded-media object-cover ${height}`} />
      </div>
      {children}
    </div>
  )
}
