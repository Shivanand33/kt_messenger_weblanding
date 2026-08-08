import { Pill } from '../Pill/Pill'

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = 'left',
  className = '',
  titleClassName = '',
  descriptionClassName = '',
}) {
  const isCenter = align === 'center'
  return (
    <div className={`flex flex-col gap-4 ${isCenter ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {eyebrow ? <Pill icon={eyebrowIcon}>{eyebrow}</Pill> : null}
      {title ? (
        <h2
          className={`max-w-2xl text-[1.9rem] font-bold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.7rem] ${titleClassName}`}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className={`max-w-xl text-lg leading-8 text-body ${isCenter ? 'mx-auto' : ''} ${descriptionClassName}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
