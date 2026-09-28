import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Hero } from '../../components/sections/Hero/Hero'
import { Statement } from '../../components/sections/Statement/Statement'
import { LoopWeb } from '../../components/sections/LoopWeb/LoopWeb'
import { MultiDevice } from '../../components/sections/MultiDevice/MultiDevice'
import { Calling } from '../../components/sections/Calling/Calling'
import { Privacy } from '../../components/sections/Privacy/Privacy'
import { Groups } from '../../components/sections/Groups/Groups'
import { Expression } from '../../components/sections/Expression/Expression'
import { Business } from '../../components/sections/Business/Business'
import { Features } from '../../components/sections/Features/Features'
import { Insights } from '../../components/sections/Insights/Insights'
import { VideoShowcase } from '../../components/sections/VideoShowcase/VideoShowcase'
import { DownloadCTA } from '../../components/sections/DownloadCTA/DownloadCTA'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { useSeo } from '../../hooks/useSeo'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORGANIZATION_SCHEMA }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBSITE_SCHEMA }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBPAGE_SCHEMA }} />
      <Hero />
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
    </MainLayout>
  )
}
