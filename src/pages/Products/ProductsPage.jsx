import { useState } from 'react'
import { FiCopy, FiCheck, FiDownload } from 'react-icons/fi'
import { FaAndroid, FaApple } from 'react-icons/fa'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { Modal } from '../../components/feature/Modal'
import { useSeo } from '../../hooks/useSeo'
import { useModal } from '../../context/ModalContext'
import jaadoeIcon from '../../assets/images/social/jaadoe.png'
import seezittIcon from '../../assets/images/social/seezitt.svg'
import werfieIcon from '../../assets/images/social/werfie.png'
import vidmeroIcon from '../../assets/images/social/vidmero.png'

// PLAY STORE ICONS: Jaadoe, Seezitt, Werfie and Vidmero use the official
// logos already shipped in the site's assets (the social profile icons).
// KT Messenger, KT Business, WN Social, Mizdah, Omre, Allnera and Omre Pengo
// use the official icons fetched from their Google Play listings and stored
// in src/assets/images/products/ — files there are picked up automatically
// by the `key`, so replacing a file with the same name updates its card.
const iconModules = import.meta.glob('../../assets/images/products/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
})

const iconFor = (key, fallback) => {
  const path = Object.keys(iconModules).find((p) => {
    const base = p.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase()
    return base === key
  })
  return path ? iconModules[path] : fallback
}

// The company's apps, in display order. Names and categories come from each
// app's official Google Play listing. `play` is the Google Play URL, `ios`
// the App Store URL (only apps with an iOS version have one).
const PRODUCTS = [
  { key: 'kt-messenger', name: 'KT Messenger', icon: null, category: 'Communication', play: 'https://play.google.com/store/apps/details?id=com.ogoul.kalamtime', ios: 'https://apps.apple.com/in/app/kt-messenger/id6478195913' },
  { key: 'kt-business', name: 'KT Business', icon: null, category: 'Business', play: 'https://play.google.com/store/apps/details?id=com.kalamtime.business.posh', ios: 'https://apps.apple.com/in/app/kt-business/id6769260317' },
  { key: 'jaadoe', name: 'Jaadoe', icon: jaadoeIcon, category: 'Entertainment', play: 'https://play.google.com/store/apps/details?id=com.posh.jaadoe' },
  { key: 'wn-social', name: 'WN Social', icon: null, category: 'Social', play: 'https://play.google.com/store/apps/details?id=com.ogoul.worldnoor', ios: 'https://apps.apple.com/in/app/wn-social-worldnoor/id1526428169' },
  { key: 'seezitt', name: 'Seezitt', icon: seezittIcon, category: 'Entertainment', play: 'https://play.google.com/store/apps/details?id=com.posh.seezitt', ios: 'https://apps.apple.com/in/app/seezitt/id6444735823' },
  { key: 'werfie', name: 'Werfie', icon: werfieIcon, category: 'Social', play: 'https://play.google.com/store/apps/details?id=com.ogoul.werfieapp' },
  { key: 'mizdah', name: 'Mizdah', icon: null, category: 'Communication', play: 'https://play.google.com/store/apps/details?id=com.posh.mizdahapp', ios: 'https://apps.apple.com/in/app/mizdah-video-communications/id6445909307' },
  { key: 'omre', name: 'Omre', icon: null, category: 'Entertainment', play: 'https://play.google.com/store/apps/details?id=com.omre.app.posh', ios: 'https://apps.apple.com/in/app/omre/id6769281067' },
  { key: 'vidmero', name: 'Vidmero', icon: vidmeroIcon, category: 'Entertainment', play: 'https://play.google.com/store/apps/details?id=com.ogoul.vidmero', ios: 'https://apps.apple.com/in/app/vidmero/id6749327826' },
  { key: 'allnera', name: 'Allnera', icon: null, category: 'Business', play: 'https://play.google.com/store/apps/details?id=com.posh.allnera' },
  { key: 'pengo', name: 'Omre Pengo', icon: null, category: 'Education', play: 'https://play.google.com/store/apps/details?id=com.posh.omre.pengo' },
]

// QR image for a store URL, rendered by the free qrserver.com API.
const qrFor = (url) => `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(url)}`

function ProductCard({ product, index, onSelect }) {
  const icon = iconFor(product.key, product.icon)
  return (
    <Reveal from="up" delay={Math.min(index, 7) * 0.04} className="h-full">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="group flex h-full w-full flex-col items-center rounded-3xl border border-transparent bg-surface-2 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card"
      >
        {icon ? (
          <img
            src={icon}
            alt={`${product.name} app icon`}
            width="80"
            height="80"
            loading="lazy"
            className="h-20 w-20 rounded-[22px] object-cover shadow-[0_10px_24px_-12px_rgba(17,27,33,0.45)] transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // Placeholder tile — replaced automatically once the app's icon
          // file exists under src/assets/images/products/ (see note above).
          <span
            aria-hidden
            className="grid h-20 w-20 place-items-center rounded-[22px] bg-brand-soft text-2xl font-extrabold text-brand-ink"
          >
            {product.name.charAt(0)}
          </span>
        )}
        <span className="mt-4 text-lg font-bold text-ink">{product.name}</span>
        <span className="mt-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-ink">
          {product.category}
        </span>
      </button>
    </Reveal>
  )
}

/** QR + copy + download dialog for the selected app and store. `initialPlatform`
    is the section the card was clicked from, so the popup opens on that store. */
function ProductDialog({ product, onClose, initialPlatform = 'android' }) {
  const [platform, setPlatform] = useState(initialPlatform)
  const [copied, setCopied] = useState(false)
  if (!product) return null

  const hasAndroid = Boolean(product.play)
  const hasIos = Boolean(product.ios)
  // The toggle only offers platforms the app actually has; a single-store
  // app always resolves to its one store.
  const active = hasAndroid && hasIos ? platform : hasIos ? 'ios' : 'android'
  const url = active === 'ios' ? product.ios : product.play

  const copyLink = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }).catch(() => {})
    }
  }

  return (
    <Modal open={Boolean(product)} onClose={onClose} title={product.name} eyebrow={product.category} size="sm">
      <div className="flex flex-col items-center">
        {hasAndroid && hasIos ? (
          <div className="flex rounded-full border border-line bg-surface-2 p-1">
            {[
              { id: 'android', label: 'Android', Icon: FaAndroid },
              { id: 'ios', label: 'iOS', Icon: FaApple },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setPlatform(id); setCopied(false) }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  active === id ? 'bg-brand text-white' : 'text-body hover:text-ink'
                }`}
              >
                <Icon /> {label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Always white behind the QR so scanners read it in dark mode too. */}
        <div className="mt-5 inline-block rounded-2xl border border-line bg-white p-3">
          <img
            src={qrFor(url)}
            alt={`QR code to download ${product.name}`}
            width="220"
            height="220"
            className="block h-[180px] w-[180px] sm:h-[220px] sm:w-[220px]"
          />
        </div>
        <p className="mt-3 text-sm font-semibold text-muted">
          Scan with your phone to open the {active === 'ios' ? 'App Store' : 'Google Play'} page
        </p>

        <div className="mt-5 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={copyLink}>
            {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
            Download <FiDownload />
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function ProductsPage() {
  useSeo({
    title: 'Products | KT Messenger.',
    path: '/products',
  })

  const { openDownloadModal } = useModal()
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('android')
  const androidProducts = PRODUCTS
  const iosProducts = PRODUCTS.filter((p) => p.ios)

  return (
    <MainLayout>
      <section className="py-16 lg:py-24">
        <Container>
          <Reveal from="up">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Our Products
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-body">
              Apps built by the KT Messenger team — messaging, social, video, business tools and more.
              Tap any product for its QR code and store link.
            </p>
          </Reveal>

          {/* Platform tabs — Android | iOS, like the store switcher in the
              download dialog. The grid re-animates on every switch (key). */}
          <Reveal from="up" className="mt-12">
            <div className="flex gap-7 border-b border-line" role="tablist" aria-label="Choose a platform">
              {[
                { id: 'android', label: 'Android', Icon: FaAndroid },
                { id: 'ios', label: 'iOS', Icon: FaApple },
              ].map(({ id, label, Icon }) => {
                const activeTab = tab === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab}
                    onClick={() => setTab(id)}
                    className={`relative flex items-center gap-2 pb-3 text-lg font-bold transition-colors ${
                      activeTab ? 'text-brand-ink' : 'text-body hover:text-ink'
                    }`}
                  >
                    <Icon className="text-xl" /> {label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand transition-opacity ${
                        activeTab ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </Reveal>

          <div key={tab} className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {(tab === 'android' ? androidProducts : iosProducts).map((product, index) => (
              <ProductCard key={product.key} product={product} index={index} onSelect={setSelected} />
            ))}
          </div>

          <Reveal from="up" className="mt-16">
            <div className="rounded-3xl border border-line bg-surface-2 px-6 py-10 text-center sm:px-12 sm:py-14">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Get KT Messenger
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-body">
                The flagship app that connects them all — free private messaging, HD calls and AI
                features on Android, iOS, Mac, Windows and the web.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" onClick={openDownloadModal}>
                  Download Free <FiDownload />
                </Button>
                <Button size="lg" variant="secondary" href="https://play.google.com/store/apps/details?id=com.ogoul.kalamtime" target="_blank" rel="noopener noreferrer">
                  View on Google Play
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <ProductDialog key={selected ? selected.key : 'none'} product={selected} initialPlatform={tab} onClose={() => setSelected(null)} />
    </MainLayout>
  )
}
