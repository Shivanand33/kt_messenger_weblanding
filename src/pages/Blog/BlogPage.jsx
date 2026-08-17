import { useEffect, useMemo, useState } from 'react'
import { FiSearch, FiArrowLeft, FiClock, FiArrowRight } from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { LinkArrow } from '../../components/common/LinkArrow/LinkArrow'
import { blogPosts } from './blogData'
import footerImg from '../../assets/images/footer.jpg'
import multideviceImg from '../../assets/images/multidevice.jpg'
import privateImg from '../../assets/images/private.jpg'
import groupImg from '../../assets/images/group.jpg'
import heroImg from '../../assets/images/hero.jpg'
import businessImg from '../../assets/images/business.jpg'
import cyberpunkImg from '../../assets/images/cyberpunk_neon_city.png'
import securityImg from '../../assets/images/security.jpg'

const IMAGE_MAP = {
  footer: footerImg,
  multidevice: multideviceImg,
  private: privateImg,
  group: groupImg,
  hero: heroImg,
  business: businessImg,
  cyberpunk: cyberpunkImg,
  security: securityImg,
}
const imageFor = (post) => IMAGE_MAP[post.imageKey] || footerImg

// Render **bold** highlights inside a paragraph or bullet.
function renderText(text) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-ink">{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function ArticleBody({ blocks }) {
  return (
    <div>
      {blocks.map((block, i) => {
        if (block.type === 'h') {
          return (
            <h2 key={i} className="mt-10 text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
              {block.text}
            </h2>
          )
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="mt-4 space-y-2.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-[17px] leading-8 text-body">
                  <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-strong" />
                  <span>{renderText(item)}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="mt-5 text-[17px] leading-8 text-body">
            {renderText(block.text)}
          </p>
        )
      })}
    </div>
  )
}

function ArticleReader({ post, onBack, onOpen }) {
  const related = useMemo(() => {
    const start = blogPosts.findIndex((p) => p.slug === post.slug)
    return [1, 2, 3].map((offset) => blogPosts[(start + offset) % blogPosts.length])
  }, [post.slug])

  // Show the intro paragraph above the hero image so readable content appears
  // immediately; the rest of the article follows below the image.
  const hasLead = post.blocks[0]?.type === 'p'
  const bodyBlocks = hasLead ? post.blocks.slice(1) : post.blocks

  const BackButton = (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand/40 hover:text-brand-ink"
    >
      <FiArrowLeft /> Back to Blogs
    </button>
  )

  return (
    <Container className="py-10 lg:py-16">
      {BackButton}

      <Reveal from="up" className="mx-auto mt-8 max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-ink">
          {post.category}
        </span>
        <h1 className="mt-5 text-[2.1rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.2rem]">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-muted">
          <span>{post.date}</span>
          <span className="h-1 w-1 rounded-full bg-muted/50" />
          <span className="inline-flex items-center gap-1.5">
            <FiClock /> {post.readMins} min read
          </span>
        </div>
      </Reveal>

      {hasLead ? (
        <Reveal from="up" delay={0.04} className="mx-auto mt-6 max-w-3xl">
          <p className="text-lg font-medium leading-8 text-ink sm:text-xl sm:leading-9">
            {renderText(post.blocks[0].text)}
          </p>
        </Reveal>
      ) : null}

      <Reveal from="up" delay={0.08} className="mx-auto mt-8 max-w-4xl">
        <div className="overflow-hidden rounded-block border border-line shadow-card">
          <img src={imageFor(post)} alt={post.title} className="h-60 w-full object-cover sm:h-80 lg:h-[420px]" />
        </div>
      </Reveal>

      <Reveal from="up" delay={0.1} className="mx-auto mt-10 max-w-3xl">
        <ArticleBody blocks={bodyBlocks} />
      </Reveal>

      {/* related */}
      <div className="mx-auto mt-16 max-w-4xl border-t border-line pt-12">
        <h3 className="text-xl font-bold text-ink sm:text-2xl">Related articles</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {related.map((rel) => (
            <button
              key={rel.slug}
              type="button"
              onClick={() => onOpen(rel.slug)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-cream-2 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={imageFor(rel)}
                  alt={rel.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-ink">{rel.category}</span>
                <h4 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-ink">{rel.title}</h4>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-4xl">{BackButton}</div>
    </Container>
  )
}

export function BlogPage() {
  const [activeSlug, setActiveSlug] = useState(null)
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))], [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeSlug])

  const openArticle = (slug) => setActiveSlug(slug)

  const active = blogPosts.find((p) => p.slug === activeSlug)
  if (active) {
    return (
      <MainLayout>
        <ArticleReader post={active} onBack={() => setActiveSlug(null)} onOpen={openArticle} />
      </MainLayout>
    )
  }

  const featured = blogPosts[0]
  const rest = blogPosts.slice(1)
  const visible = category === 'All' ? rest : blogPosts.filter((p) => p.category === category)

  return (
    <MainLayout>
      <Container className="py-14 lg:py-20">
        {/* search */}
        <div className="mb-10 flex justify-end lg:mb-14">
          <label className="flex items-center gap-3 border-b-2 border-line pb-2 text-muted transition-colors focus-within:border-brand">
            <span className="text-sm font-medium">Search blog:</span>
            <input
              type="text"
              className="w-32 bg-transparent text-sm text-ink outline-none placeholder:text-muted sm:w-44"
              aria-label="Search blog"
            />
            <FiSearch />
          </label>
        </div>

        {/* title */}
        <Reveal from="up">
          <h1 className="text-center text-[2.6rem] font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
            KT Messenger Blog
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-body">
            Everything KT can do, explained simply — from messaging and calls to AI, payments, communities and business.
          </p>
        </Reveal>

        {/* featured (only on the unfiltered view) */}
        {category === 'All' ? (
        <Reveal from="up" delay={0.06} className="mt-14 lg:mt-20">
          <button
            type="button"
            onClick={() => openArticle(featured.slug)}
            className="group grid w-full overflow-hidden rounded-[30px] border border-line bg-cream-2 text-left shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-float lg:grid-cols-2"
          >
            <div className="relative min-h-[260px] overflow-hidden lg:min-h-[360px]">
              <img
                src={imageFor(featured)}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-brand-strong px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-brand">
                Featured
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-ink">
                <span>{featured.category}</span>
                <span className="h-1 w-1 rounded-full bg-muted/50" />
                <span className="inline-flex items-center gap-1 text-muted">
                  <FiClock /> {featured.readMins} min read
                </span>
              </div>
              <h2 className="mt-3.5 text-[1.7rem] font-bold leading-[1.15] text-ink lg:text-[2.1rem]">{featured.title}</h2>
              <p className="mt-4 text-[15px] leading-7 text-body">{featured.description}</p>
              <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brand-strong px-5 py-2.5 text-sm font-bold text-white shadow-brand transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand-strong-hover">
                Read More <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </button>
        </Reveal>
        ) : null}

        {/* category filter */}
        <div className="mt-12 flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                category === cat
                  ? 'bg-brand-strong text-white shadow-brand'
                  : 'border border-line bg-surface text-body hover:-translate-y-0.5 hover:border-brand/40 hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* article cards */}
        <div className="mt-10 grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post, index) => (
            <Reveal key={post.slug} from="up" delay={(index % 3) * 0.05} className="h-full">
              <button
                type="button"
                onClick={() => openArticle(post.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-cream-2 text-left shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-float"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={imageFor(post)}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-line bg-surface/90 px-3 py-1 text-[11px] font-bold text-brand-ink shadow-sm backdrop-blur">
                    {post.category}
                  </span>
                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-slate-950/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    <FiClock className="text-[11px]" /> {post.readMins} min
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[11px] font-semibold text-muted">{post.date}</span>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand-ink">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-body line-clamp-3">{post.description}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink">
                    Read More <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>
    </MainLayout>
  )
}
