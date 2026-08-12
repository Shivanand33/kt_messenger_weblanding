import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronRight,
  FiCompass,
  FiCopy,
  FiDownload,
  FiDroplet,
  FiFileText,
  FiImage,
  FiMail,
  FiMaximize,
  FiType,
  FiUsers,
  FiXCircle,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { Logo } from '../../components/common/Logo/Logo'
import ktLogoRaw from '../../assets/kt-logo.svg?raw'
import { PageHero } from '../../components/feature/PageHero'
import { PageNav } from '../../components/feature/PageNav'
import { SectionHead } from '../../components/feature/SectionHead'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { Toast } from '../../components/feature/Toast'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'logo', label: 'Logo', icon: <FiImage /> },
  { id: 'colour', label: 'Colour', icon: <FiDroplet /> },
  { id: 'type', label: 'Typography', icon: <FiType /> },
  { id: 'clearspace', label: 'Clear space', icon: <FiMaximize /> },
  { id: 'misuse', label: 'Do & don’t', icon: <FiAlertTriangle /> },
  { id: 'downloads', label: 'Downloads', icon: <FiDownload /> },
]

const PALETTE = [
  { name: 'Brand Blue', hex: '#1570EF', role: 'Primary actions, links, active states', swatch: 'bg-[#1570EF]', onDark: true },
  { name: 'Brand Light', hex: '#2E90FA', role: 'Hover states and the logo gradient', swatch: 'bg-[#2E90FA]', onDark: true },
  { name: 'Brand Deep', hex: '#175CD3', role: 'Pressed states on light surfaces', swatch: 'bg-[#175CD3]', onDark: true },
  { name: 'Ink', hex: '#0E1A13', role: 'Headings and primary text', swatch: 'bg-[#0E1A13]', onDark: true },
  { name: 'Body', hex: '#47544C', role: 'Paragraph text on light backgrounds', swatch: 'bg-[#47544C]', onDark: true },
  { name: 'Cream', hex: '#FCF5EB', role: 'Default page background', swatch: 'bg-[#FCF5EB]', onDark: false },
  { name: 'Surface', hex: '#FFFFFF', role: 'Cards and raised panels', swatch: 'bg-white', onDark: false },
  { name: 'Line', hex: '#ECE1D1', role: 'Borders and dividers', swatch: 'bg-[#ECE1D1]', onDark: false },
  { name: 'Dark Canvas', hex: '#0B141A', role: 'Dark-mode page background', swatch: 'bg-[#0B141A]', onDark: true },
  { name: 'Dark Surface', hex: '#17232B', role: 'Dark-mode cards', swatch: 'bg-[#17232B]', onDark: true },
  { name: 'Success', hex: '#10B981', role: 'Confirmations and positive change', swatch: 'bg-[#10B981]', onDark: true },
  { name: 'Danger', hex: '#F43F5E', role: 'Destructive actions and negative change', swatch: 'bg-[#F43F5E]', onDark: true },
]

const TYPE_SCALE = [
  { label: 'Display', size: '60 / 64', weight: '800', usage: 'Page heroes only', className: 'text-5xl font-extrabold' },
  { label: 'Heading 1', size: '36 / 42', weight: '800', usage: 'Section titles', className: 'text-4xl font-extrabold' },
  { label: 'Heading 2', size: '24 / 32', weight: '800', usage: 'Card and block titles', className: 'text-2xl font-extrabold' },
  { label: 'Body large', size: '17 / 28', weight: '500', usage: 'Hero descriptions', className: 'text-[17px] font-medium' },
  { label: 'Body', size: '15 / 24', weight: '400', usage: 'Default paragraph text', className: 'text-[15px]' },
  { label: 'Caption', size: '11 / 16', weight: '800', usage: 'Eyebrows and metadata', className: 'text-[11px] font-extrabold uppercase tracking-[0.14em]' },
]

const DOS = [
  'Keep the full wordmark lockup whenever there is room for it.',
  'Use the blue tile mark on its own only at 24px and above.',
  'Place the logo on Cream, Surface, Dark Canvas or a solid brand blue.',
  'Respect the clear space: one mark-height on every side.',
]

const DONTS = [
  'Recolour the mark or apply gradients other than the supplied one.',
  'Stretch, rotate, outline or add a drop shadow to the logo.',
  'Set the logo over a busy photograph without a solid backing plate.',
  'Rebuild the wordmark in a different typeface or letter-spacing.',
]

const ASSETS = [
  { name: 'Logo lockup — SVG', desc: 'Full mark plus wordmark, scalable and colour-accurate.', file: 'kt-messenger-logo.svg', kind: 'svg' },
  { name: 'App icon — SVG', desc: 'The tile mark on its own, for avatars and favicons.', file: 'kt-messenger-icon.svg', kind: 'icon' },
  { name: 'Brand guidelines', desc: 'Clear space, minimum sizes, colour values and misuse examples.', file: 'kt-brand-guidelines.txt', kind: 'doc' },
  { name: 'Colour tokens', desc: 'Every palette value as CSS custom properties, light and dark.', file: 'kt-colour-tokens.css', kind: 'tokens' },
]

const RELATED = [
  { to: '/about', label: 'About', desc: 'Our mission, story and the no-ads charter.', icon: <FiCompass /> },
  { to: '/contact', label: 'Contact', desc: 'Brand and press enquiries go here.', icon: <FiMail /> },
  { to: '/careers', label: 'Careers', desc: 'We are hiring a brand designer right now.', icon: <FiUsers /> },
  { to: '/blog', label: 'Blog', desc: 'Product announcements and press material.', icon: <FiFileText /> },
]

// Real, downloadable asset contents so every download button produces a usable
// file. The logo downloads serve the exact same source file the site renders,
// so a partner can never end up with a stale mark.
const LOGO_SVG = ktLogoRaw

const TOKENS_CSS = `/* KT Messenger — colour tokens */
:root {
  --kt-brand: #2E90FA;
  --kt-brand-strong: #1570EF;
  --kt-brand-deep: #175CD3;
  --kt-ink: #0E1A13;
  --kt-body: #47544C;
  --kt-cream: #FCF5EB;
  --kt-surface: #FFFFFF;
  --kt-line: #ECE1D1;
  --kt-success: #10B981;
  --kt-danger: #F43F5E;
}

:root[data-theme="dark"], .dark {
  --kt-cream: #0B141A;
  --kt-surface: #17232B;
  --kt-ink: #E9EDEF;
  --kt-body: #AEBAC1;
  --kt-line: #263640;
}
`

const GUIDELINES_TXT = `KT MESSENGERS — BRAND GUIDELINES (summary)

1. LOGO
   - Use the full lockup (mark + wordmark) wherever there is room.
   - The tile mark may stand alone at 24px and above.
   - Minimum lockup width: 120px. Minimum mark size: 24px.

2. CLEAR SPACE
   - Leave clear space equal to the mark height on all four sides.
   - Nothing may enter that area, including page edges.

3. COLOUR
   Brand Blue    #1570EF   primary actions, links
   Brand Light   #2E90FA   hover states, logo gradient
   Brand Deep    #175CD3   pressed states
   Ink           #0E1A13   headings
   Body          #47544C   paragraph text
   Cream         #FCF5EB   light background
   Surface       #FFFFFF   cards
   Dark Canvas   #0B141A   dark background
   Dark Surface  #17232B   dark cards

4. TYPOGRAPHY
   Inter across the whole system.
   Display 60/64 800 · H1 36/42 800 · H2 24/32 800
   Body 15/24 400 · Caption 11/16 800 uppercase, 0.14em tracking

5. MISUSE — never do these
   - Recolour the mark or change its gradient.
   - Stretch, rotate, outline or add shadows.
   - Place the logo on a busy photo without a backing plate.
   - Rebuild the wordmark in another typeface.

Questions: brand@ktmessenger.example
`

export function BrandCenterPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const copyHex = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      setToast(`${hex} copied to your clipboard.`)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setToast(`Copy failed — the value is ${hex}.`)
    }
  }

  const downloadAsset = (asset) => {
    const payload =
      asset.kind === 'tokens' ? TOKENS_CSS : asset.kind === 'doc' ? GUIDELINES_TXT : LOGO_SVG
    const type = asset.kind === 'tokens' ? 'text/css' : asset.kind === 'doc' ? 'text/plain' : 'image/svg+xml'

    const blob = new Blob([payload], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = asset.file
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setToast(`${asset.file} downloaded.`)
  }

  return (
    <MainLayout>
      <PageHero
        badge={
          <>
            <FiImage /> Brand Center · v3.2
          </>
        }
        title="KT"
        highlight="Brand Center"
        description="Logos, colour values, type scale and the rules for using them. Everything here is downloadable and free to use within these guidelines."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })}>
              Download assets <FiDownload />
            </Button>
            <Button size="lg" variant="onDark" onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }}>
              Brand enquiries <FiChevronRight />
            </Button>
          </>
        }
        chips={[
          { icon: <FiCheckCircle />, label: 'Free for editorial use' },
          { icon: <FiDroplet />, label: '12 documented colours' },
          { icon: <FiType />, label: 'Inter across the system' },
        ]}
        aside={
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-300">Primary lockup</span>
            <div className="mt-6 grid place-items-center rounded-2xl bg-white p-10">
              <Logo />
            </div>
            <div className="mt-3 grid place-items-center rounded-2xl bg-[#0B141A] p-10">
              <Logo wordmarkClassName="[&>span:first-child]:text-white" />
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-slate-400">
              The wordmark switches its first word to white on dark canvases. The blue never changes.
            </p>
          </div>
        }
      />

      <PageNav items={NAV_ITEMS} />

      {/* LOGO */}
      <Section id="logo" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Logo"
          title="One mark, two lockups"
          description="The tile mark carries the brand on its own. The wordmark joins it whenever there is horizontal room."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            { label: 'Full lockup', note: 'Default. Minimum width 120px.', content: <Logo /> },
            { label: 'Mark only', note: 'Avatars, favicons. Minimum 24px.', content: <Logo showWordmark={false} /> },
            { label: 'On dark', note: 'First word turns white; blue is unchanged.', content: <Logo wordmarkClassName="[&>span:first-child]:text-white" />, dark: true },
          ].map((item, index) => (
            <Reveal key={item.label} from="up" delay={index * 0.06} className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-cream shadow-soft dark:bg-cream-2">
                <div className={`grid flex-1 place-items-center p-12 ${item.dark ? 'bg-[#0B141A]' : 'bg-white'}`}>
                  {item.content}
                </div>
                <div className="border-t border-line p-5">
                  <h3 className="text-sm font-extrabold text-ink">{item.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-body">{item.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* COLOUR */}
      <Section id="colour" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Colour"
          title="Twelve values, each with a job"
          description="Tap any swatch to copy its hex. Every value below is the exact token used in the product."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PALETTE.map((colour, index) => (
            <Reveal key={colour.hex + colour.name} from="up" delay={Math.min(index * 0.03, 0.2)} className="h-full">
              <button
                type="button"
                onClick={() => copyHex(colour.hex)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-line bg-surface text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span className={`relative flex h-24 items-end justify-end p-3 ${colour.swatch}`}>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-black opacity-0 transition-opacity group-hover:opacity-100 ${
                      colour.onDark ? 'bg-white/20 text-white' : 'bg-black/10 text-[#0E1A13]'
                    }`}
                  >
                    {copied === colour.hex ? 'Copied!' : 'Click to copy'}
                  </span>
                </span>

                <span className="flex flex-1 flex-col p-4">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-ink">{colour.name}</span>
                    <span className="flex items-center gap-1.5 font-mono text-xs font-black text-brand-ink">
                      {copied === colour.hex ? <FiCheckCircle /> : <FiCopy />}
                      {colour.hex}
                    </span>
                  </span>
                  <span className="mt-1.5 text-[11px] leading-relaxed text-body">{colour.role}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* TYPOGRAPHY */}
      <Section id="type" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Typography"
          title="Inter, six steps, no exceptions"
          description="One typeface across product, marketing and documentation. The scale below is the whole system."
        />

        <Reveal from="up" className="mt-12 overflow-hidden rounded-[26px] border border-line bg-cream shadow-card dark:bg-cream-2">
          <ul className="divide-y divide-line">
            {TYPE_SCALE.map((step) => (
              <li key={step.label} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <span className={`min-w-0 truncate text-ink ${step.className}`}>{step.label}</span>
                <span className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-bold text-muted">
                  <span>{step.size}</span>
                  <span>Weight {step.weight}</span>
                  <span className="text-brand-ink">{step.usage}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* CLEAR SPACE */}
      <Section id="clearspace" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHead
            align="left"
            eyebrow="Clear space"
            title="Give the mark one mark-height on every side"
            description="Nothing enters that margin — not text, not other logos, not the edge of the page. At small sizes this matters more than it looks like it should."
          >
            <ul className="mt-8 space-y-3">
              {[
                'Clear space = the height of the tile mark, on all four sides.',
                'Minimum lockup width is 120px; below that use the mark alone.',
                'Minimum mark size is 24px — the typing dots stop reading below it.',
                'On photography, place the logo on a solid backing plate.',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-brand-strong" />
                  {point}
                </li>
              ))}
            </ul>
          </SectionHead>

          <Reveal from="scale" delay={0.08}>
            <div className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-10">
              <div className="relative grid place-items-center rounded-2xl border-2 border-dashed border-brand/40 bg-white p-14">
                <span className="absolute left-2 top-2 rounded bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-ink">
                  clear space = 1×
                </span>
                <div className="rounded-lg outline-2 outline-offset-4 outline-brand/30">
                  <Logo />
                </div>
              </div>
              <p className="mt-4 text-center text-[11px] font-bold text-muted">
                Dashed area shows the minimum clear space around the lockup.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* MISUSE */}
      <Section id="misuse" className="scroll-mt-36 bg-surface">
        <SectionHead eyebrow="Do & don’t" title="Four rules each, and they are not negotiable" />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal from="up">
            <div className="h-full rounded-[24px] border border-emerald-300 bg-emerald-50 p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <h3 className="flex items-center gap-2 text-base font-extrabold text-emerald-700 dark:text-emerald-300">
                <FiCheckCircle /> Please do
              </h3>
              <ul className="mt-5 space-y-3">
                {DOS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="h-full rounded-[24px] border border-rose-300 bg-rose-50 p-6 dark:border-rose-500/30 dark:bg-rose-500/10">
              <h3 className="flex items-center gap-2 text-base font-extrabold text-rose-700 dark:text-rose-300">
                <FiXCircle /> Please don’t
              </h3>
              <ul className="mt-5 space-y-3">
                {DONTS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                    <FiXCircle className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* DOWNLOADS */}
      <Section id="downloads" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Downloads"
          title="Take what you need"
          description="Each button downloads a real file. Using these assets means agreeing to the rules above."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {ASSETS.map((asset, index) => (
            <Reveal key={asset.file} from="up" delay={index * 0.05} className="h-full">
              <div className="flex h-full items-start gap-4 rounded-[24px] border border-line bg-surface p-6 shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-ink">
                  {asset.kind === 'doc' ? <FiFileText /> : asset.kind === 'tokens' ? <FiDroplet /> : <FiImage />}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold text-ink">{asset.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-body">{asset.desc}</p>
                  <button
                    type="button"
                    onClick={() => downloadAsset(asset)}
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-brand-strong px-4 text-xs font-bold text-white shadow-brand transition-colors hover:bg-brand-strong-hover"
                  >
                    <FiDownload /> {asset.file}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal from="up" className="mx-auto mt-10 max-w-3xl rounded-[24px] border border-line bg-surface p-6">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-body">
            <FiAlertTriangle className="mt-0.5 shrink-0 text-lg text-amber-500" />
            These assets are free for editorial, press and integration use. They may not be used to imply partnership or
            endorsement, or as part of another product&apos;s identity. For anything outside that, ask us first.
          </p>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Need something else"
        title="Press kit, product screenshots or a partnership lockup"
        description="Tell us what you are publishing and we will send the right assets — usually within one working day."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }}>
              Contact the brand team
            </Button>
            <Button size="lg" variant="onDark" onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })}>
              Back to downloads
            </Button>
          </>
        }
        points={['Free for editorial use', 'One-day turnaround', 'SVG and token files', 'v3.2 · updated 2026']}
      />

      <Section container={false} className="bg-surface">
        <Container>
          <SectionHead eyebrow="Keep exploring" title="More about KT Messenger" />
          <RelatedPages className="mt-12" items={RELATED} />
        </Container>
      </Section>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}
