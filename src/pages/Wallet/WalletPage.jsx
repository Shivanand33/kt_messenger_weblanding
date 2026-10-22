import { translateCopy } from '../../utils/translateCopy'
import { api } from '../../services/apiClient'
import { useRemoteContent } from '../../hooks/useRemoteContent'
import { useEffect } from 'react'
import {
  FiActivity,
  FiAlertCircle,
  FiBell,
  FiCheckCircle,
  FiCreditCard,
  FiDownload,
  FiFileText,
  FiGift,
  FiGrid,
  FiInfo,
  FiLock,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiShield,
  FiShoppingBag,
  FiSliders,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Button } from '../../components/common/Button/Button'
import { PageHero } from '../../components/feature/PageHero'
import { SectionHead } from '../../components/feature/SectionHead'
import { FeatureGrid } from '../../components/feature/FeatureGrid'
import { Steps } from '../../components/feature/Steps'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { useModal } from '../../context/ModalContext'
import { useLanguage } from '../../context/LanguageContext'
import { useSeo } from '../../hooks/useSeo'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import {
  securityFeatures as RAW_SECURITY_FEATURES,
  walletFaqs as FALLBACK_WALLETFAQS,
  walletFeatures as RAW_WALLET_FEATURES,
  walletSteps as RAW_WALLET_STEPS,
} from './walletData'

/*
 * This page used to carry a working wallet: ten tabbed sections — send,
 * split, activity, cards, bills, goals, rewards, crypto, limits — each with
 * its own form, state and toasts, about eleven hundred lines of it. It now
 * describes the product rather than imitating it, which is what the rest of
 * the feature pages do.
 *
 * What went with the tabs: the balance, transaction, goal and card state, the
 * receipt modal and the toast. Nothing else on the site read any of it, and
 * the sample rows those sections ran on — contacts, transactions, cards,
 * payment methods, bill categories, rewards, goals, holdings, limits — are
 * gone from `./walletData` too. What that file still holds is the copy this
 * page renders.
 */

/*
 * The figures on the hero card. They are a picture of the app's wallet, so
 * they match what the app shows a new account: nothing yet.
 *
 * Zero is also the only pair of numbers that is safe to print. The app states
 * a balance in KT Coins and a USD equivalent underneath, and any non-zero
 * pair would be claiming an exchange rate — which is a real number, not one
 * to invent for a marketing card. Put the real figures here when they are
 * known; nothing else needs touching.
 */
const DEMO_BALANCE = '0'
const DEMO_BALANCE_USD = '≈ $0.00 USD equivalent'

// Positional: each icon list is read alongside its copy from walletData, so a
// row added there needs an icon added here.
const FEATURE_ICONS = [
  <FiSend key="a" />,
  <FiBell key="b" />,
  <FiUsers key="c" />,
  <FiCreditCard key="d" />,
  <FiFileText key="e" />,
  <FiTarget key="f" />,
  <FiZap key="g" />,
  <FiGift key="h" />,
  <FiDownload key="i" />,
]

const STEP_ICONS = [<FiMessageSquare key="a" />, <FiSend key="b" />, <FiLock key="c" />, <FiCheckCircle key="d" />]

const SECURITY_ICONS = [
  <FiLock key="lock" />,
  <FiShield key="shield" />,
  <FiCreditCard key="card" />,
  <FiSliders key="sliders" />,
  <FiMessageSquare key="message" />,
  <FiAlertCircle key="alert" />,
]

const RELATED = [
  { to: '/markets', label: 'Markets', desc: 'Track prices and convert currencies at mid market.', icon: <FiTrendingUp /> },
  { to: '/marketplace', label: 'Marketplace', desc: 'Buy from verified stores and pay in one tap.', icon: <FiGrid /> },
  { to: '/news', label: 'News', desc: 'Business headlines and a daily audio brief.', icon: <FiActivity /> },
  { to: '/notes-app', label: 'Notes', desc: 'Keep receipts and budgets in an encrypted vault.', icon: <FiFileText /> },
]

const scrollTo = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export function WalletPage() {
  // This page only declared its hreflang before, which left it on the shell's
  // shared title, no description of its own and no canonical at all. The block
  // below is also what gets this route prerendered: scripts/route-seo.mjs
  // reads these literals straight out of the source, so a route without one
  // never gets a static HTML file written for it.
  useSeo({
    title: 'KT Wallet & Pay | Send Money and Split Bills in Chat.',
    description:
      'Send money, split a bill, pay a merchant or hold crypto without leaving your KT Messenger chat. Every payment is approved with a passkey.',
    path: '/wallet',
  })

  useAdminSeo('wallet', '/wallet')

  // Admin-managed FAQs for this page (Admin -> FAQs, page='wallet').
  const [walletFaqs] = useRemoteContent(
    () => api.listFaqs('wallet').then((rows) => rows.map((r) => ({ q: r.question, a: r.answer }))),
    FALLBACK_WALLETFAQS,
  )
  const { downloadLink } = useModal()
  const { t } = useLanguage()

  // Marketing copy from the data file, routed through the admin content
  // override. t() returns the original string when nothing overrides it.
  const securityFeatures = translateCopy(RAW_SECURITY_FEATURES, t)
  const walletFeatures = translateCopy(RAW_WALLET_FEATURES, t)
  const walletSteps = translateCopy(RAW_WALLET_STEPS, t)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <MainLayout>
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                              */}
      {/* ---------------------------------------------------------------- */}
      <PageHero
        badge={
          <>
            <FiShield /> {t('Bank grade security · zero fee transfers')}
          </>
        }
        title="KT"
        highlight={t('Wallet & Pay')}
        description={t('Send money, split a bill, pay a merchant and hold crypto all from inside the conversation you are already having.')}
        actions={
          /* `white` and `onDark` are for a dark hero. This one is cream in
             light mode, which left "See how it works" as white text on a
             white outline — invisible. primary + secondary is what the other
             light heroes use, and both read in either theme. */
          <>
            <Button size="lg" variant="primary" {...downloadLink}>
              {t('Get the app')} <FiZap />
            </Button>
            {/* Both hero buttons used to be live: one opened the transfer
                demo. With the demo gone this one points at the explanation
                instead, rather than at a section that no longer exists. */}
            <Button size="lg" variant="secondary" onClick={scrollTo('how')}>
              {t('See how it works')} <FiSend />
            </Button>
          </>
        }
        aside={
          /* A picture of the wallet as it actually looks in the app: the same
             blue card, the same balance block, the same pair of actions. It
             is an illustration, not a control — the two action chips are
             hidden from assistive technology because there is nothing behind
             them to press here. */
          /* A column, so the label can sit at the top and everything else at
             the bottom — the way the app lays it out. `mt-auto` on the
             balance takes up whatever height is left over, which is what
             puts the gap between the two rather than a fixed margin that
             would guess wrong at other widths. */
          <div className="relative flex min-h-[290px] flex-col overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2f9bfb] via-[#2088f5] to-[#1b73e8] p-6 text-white shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">
                {t('Available balance')}
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 text-lg" aria-hidden="true">
                <FiInfo />
              </span>
            </div>

            <div className="mt-auto flex flex-wrap items-baseline gap-x-2.5 gap-y-1 pt-8">
              <span className="text-5xl font-black leading-none tracking-tight">{DEMO_BALANCE}</span>
              <span className="text-lg font-bold">{t('KT Coins')}</span>
            </div>
            <p className="mt-2 text-[13px] font-medium text-white/75">{DEMO_BALANCE_USD}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row" aria-hidden="true">
              <span className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-[15px] font-bold text-brand-strong">
                <FiPlus className="text-lg" /> {t('Top Up Balance')}
              </span>
              <span className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/20 text-[15px] font-bold text-white">
                <FiShoppingBag /> {t('Marketplace')}
              </span>
            </div>
          </div>
        }
      />

      {/* The four-counter StatStrip that used to sit here is gone with its
          data: the component is a stub that returns null, so it had been
          rendering nothing on this page for some time. */}

      {/* ---------------------------------------------------------------- */}
      {/* WHAT YOU GET + HOW IT WORKS                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section id="how" className="scroll-mt-36 bg-surface">
        <SectionHead eyebrow={t('What you get')} title={t('A wallet that fits inside a conversation')} />
        <FeatureGrid className="mt-12" items={walletFeatures.map((item, index) => ({ ...item, icon: FEATURE_ICONS[index] }))} />

        <div className="mt-20">
          <SectionHead eyebrow={t('How a payment works')} title={t('Four steps, about three seconds')} />
          <Steps className="mt-12" items={walletSteps.map((item, index) => ({ ...item, icon: STEP_ICONS[index] }))} />
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SECURITY                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section id="security" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow={t('Security')}
          title={t('Six controls doing the real work')}
          description={t('Not badges on a page switches and defaults that change what an attacker can actually do.')}
        />

        <FeatureGrid
          className="mt-12"
          items={securityFeatures.map((item, index) => ({ ...item, icon: SECURITY_ICONS[index] }))}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      {/* Back on the light surface now that the testimonials are gone: it
          followed the cream Security band, and leaving the FAQ cream too
          would run the two together as one long block behind a hairline. */}
      <Section id="faq" container={false} className="scroll-mt-36 bg-surface">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow={t('FAQ')} title={t('Money questions, answered plainly')} />
          <div className="mt-12">
            <FaqAccordion items={walletFaqs} placeholder={t('Search the FAQ…')} />
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA + RELATED                                                     */}
      {/* ---------------------------------------------------------------- */}
      <CtaBand
        eyebrow={t('Get started')}
        title={t('Payments that live where your conversations already do')}
        description={t('Zero fee transfers, passkey approval and encrypted notes set up in under two minutes.')}
        actions={
          <>
            <Button size="lg" variant="white" {...downloadLink}>
              {t('Download KT Messenger')}
            </Button>
            <Button size="lg" variant="onDark" onClick={scrollTo('faq')}>
              {t('Read the FAQ')}
            </Button>
          </>
        }
        points={[t('₹0 on P2P transfers'), t('Passkey on every payment'), t('Instant card freeze'), t('Exportable statements')]}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow={t('Keep exploring')} title={t('More of KT Messenger')} />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>
    </MainLayout>
  )
}
