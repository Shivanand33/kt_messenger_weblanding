import { lazy, Suspense } from 'react'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Hero } from '../../components/sections/Hero/Hero'
const Statement = lazy(() => import('../../components/sections/Statement/Statement').then((m) => ({ default: m.Statement })))
const LoopWeb = lazy(() => import('../../components/sections/LoopWeb/LoopWeb').then((m) => ({ default: m.LoopWeb })))
const MultiDevice = lazy(() => import('../../components/sections/MultiDevice/MultiDevice').then((m) => ({ default: m.MultiDevice })))
const Calling = lazy(() => import('../../components/sections/Calling/Calling').then((m) => ({ default: m.Calling })))
const Privacy = lazy(() => import('../../components/sections/Privacy/Privacy').then((m) => ({ default: m.Privacy })))
const Groups = lazy(() => import('../../components/sections/Groups/Groups').then((m) => ({ default: m.Groups })))
const Expression = lazy(() => import('../../components/sections/Expression/Expression').then((m) => ({ default: m.Expression })))
const Business = lazy(() => import('../../components/sections/Business/Business').then((m) => ({ default: m.Business })))
const Features = lazy(() => import('../../components/sections/Features/Features').then((m) => ({ default: m.Features })))
const Insights = lazy(() => import('../../components/sections/Insights/Insights').then((m) => ({ default: m.Insights })))
const VideoShowcase = lazy(() => import('../../components/sections/VideoShowcase/VideoShowcase').then((m) => ({ default: m.VideoShowcase })))
const DownloadCTA = lazy(() => import('../../components/sections/DownloadCTA/DownloadCTA').then((m) => ({ default: m.DownloadCTA })))
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { useSeo } from '../../hooks/useSeo'
import { JsonLd } from '../../components/common/JsonLd/JsonLd'

const ORGANIZATION_SCHEMA = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://ktmessenger.com/#organization",
  "name": "Kt Messenger.",
  "url": "https://ktmessenger.com/",
  "brand": {
    "@type": "Brand",
    "@id": "https://ktmessenger.com/#brand",
    "name": "KT Messenger",
    "url": "https://ktmessenger.com/"
  },
  "description": "Learn how KT Messenger protects your privacy with secure messaging, private chats, encryption, privacy controls, and safe communication features.",
  "sameAs": [
    "https://ktmessenger.com/"
  ]
}`

const WEBSITE_SCHEMA = `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://ktmessenger.com/#website",
  "url": "https://ktmessenger.com/",
  "name": "KT Messenger",
  "description": "KT Messenger is a secure messaging app for private chats, calls, AI features, and communities. Connect safely and privately across all your devices.",
  "publisher": {
    "@type": "Organization",
    "@id": "https://ktmessenger.com/#organization",
    "name": "Posh Enterprise Inc.",
    "url": "https://ktmessenger.com/"
  },
  "inLanguage": "en"
}`

const WEBPAGE_SCHEMA = `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://ktmessenger.com/#webpage",
  "url": "https://ktmessenger.com/",
  "name": "KT Messenger",
  "description": "Learn how KT Messenger protects your privacy with secure messaging, private chats, encryption, privacy controls, and safe communication features.",
  "isPartOf": {
    "@id": "https://ktmessenger.com/#website"
  },
  "about": {
    "@id": "https://ktmessenger.com/#organization"
  },
  "inLanguage": "en"
}`

export function Home() {
  useSeo({
    title: 'KTMessenger | Secure Messaging App For Private Messaging.',
    description: 'KT Messenger is a secure messaging app for private chats, calls, AI features, and communities. Connect safely and privately across all your devices.',
    path: '/',
  })

  // Per-page SEO from admin (Website Content -> seo.home).
  // No block configured = unchanged behaviour.
  useAdminSeo('home', '/')

  return (
    <MainLayout>
      <JsonLd id="ORGANIZATION_SCHEMA" json={ORGANIZATION_SCHEMA} />
      <JsonLd id="WEBSITE_SCHEMA" json={WEBSITE_SCHEMA} />
      <JsonLd id="WEBPAGE_SCHEMA" json={WEBPAGE_SCHEMA} />
      <Hero />
      {/* Below-the-fold sections load as their own chunks right after the first
          paint: the hero no longer waits for the whole page's code. */}
      <Suspense fallback={null}>
      <VideoShowcase />
      <Statement />
      <LoopWeb />
      <MultiDevice />
      <Calling />
      <Privacy />
      <Groups />
      <Expression />
      <Business />
      <Features />
      <Insights />
      <DownloadCTA />
      </Suspense>
    </MainLayout>
  )
}
