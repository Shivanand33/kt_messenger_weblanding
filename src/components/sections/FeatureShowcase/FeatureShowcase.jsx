import { Section } from '../../common/Section/Section'
import { SectionHeading } from '../../common/SectionHeading/SectionHeading'
import { MediaFrame } from '../../common/MediaFrame/MediaFrame'
import { IconTile } from '../../common/IconTile/IconTile'
import { Reveal } from '../../common/Reveal/Reveal'

/**
 * The alternating text / image section that appears repeatedly on the page.
 * Content (heading, supporting bullets, stats, floating accent) is passed in
 * as data so each section stays a thin, declarative wrapper.
 */
export function FeatureShowcase({
  id,
  reverse = false,
  eyebrow,
  eyebrowIcon,
  title,
  description,
  image,
  imageAlt,
  imageHeight,
  media,
  bullets,
  stats,
  cta,
  accent,
  children,
  className = '',
}) {
  return (
    <Section id={id} className={className}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal from={reverse ? 'right' : 'left'} className={`flex flex-col ${reverse ? 'lg:order-2' : ''}`}>
          <SectionHeading
            eyebrow={eyebrow}
            eyebrowIcon={eyebrowIcon}
            title={title}
            description={description}
          />

          {bullets?.length ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <div key={bullet.title} className="rounded-card border border-line bg-cream-2 p-5 shadow-soft">
                  {bullet.icon ? <IconTile size="sm">{bullet.icon}</IconTile> : null}
                  <h3 className="mt-3.5 text-base font-semibold text-ink">{bullet.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-body">{bullet.text}</p>
                </div>
              ))}
            </div>
          ) : null}

          {stats?.length ? (
            <div className="mt-9 grid grid-cols-3 gap-4 border-t border-line pt-7">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[1.7rem] font-extrabold tracking-tight text-ink sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-muted sm:text-[13px]">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}

          {children}

          {cta ? <div className="mt-8 flex flex-wrap items-center gap-3">{cta}</div> : null}
        </Reveal>

        <Reveal
          from={reverse ? 'left' : 'right'}
          delay={0.05}
          className={reverse ? 'lg:order-1' : ''}
        >
          {media ? (
            media
          ) : (
            <MediaFrame image={image} alt={imageAlt} height={imageHeight}>
              {accent}
            </MediaFrame>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
