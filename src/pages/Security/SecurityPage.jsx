import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiShield,
  FiLock,
  FiKey,
  FiEyeOff,
  FiCheckCircle,
  FiPhoneOff,
  FiChevronRight,
  FiChevronDown,
  FiHelpCircle,
  FiUploadCloud,
  FiZap,
  FiCheck,
  FiAlertTriangle,
  FiSmartphone,
  FiCopy,
  FiSend
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { SecurityLoopVideo } from '../../components/common/VideoAnimations/SecurityLoopVideo'

export function SecurityPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)
  const [otpCode, setOtpCode] = useState('849-204')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const generateNewOtp = () => {
    const code = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`
    setOtpCode(code)
    setCopied(false)
  }

  const copyOtp = () => {
    navigator.clipboard.writeText(otpCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const securityTabs = [
    {
      title: 'Authentication & OTP Verification',
      icon: <FiKey className="text-xl" />,
      desc: 'Deliver 1-time passcodes (OTP), 2FA login verification codes, and security alerts to over 2.5B users with 99.9% delivery rate and zero SMS roaming fees.',
      highlights: ['1-Tap Autofill Passcode Buttons', 'Signal 256-bit encrypted delivery', '60% cheaper than traditional SMS']
    },
    {
      title: 'Default Signal E2E Encryption',
      icon: <FiLock className="text-xl" />,
      desc: 'All messages, voice calls, video calls, photos, and files are automatically encrypted before leaving your device. Only you and the recipient hold the keys.',
      highlights: ['Open-source Signal Protocol', 'Zero plain-text server logs', 'Automatic key rotation']
    },
    {
      title: 'Chat Lock & Secret Codes',
      icon: <FiEyeOff className="text-xl" />,
      desc: 'Move sensitive chats into a hidden folder protected by FaceID, Fingerprint, or a custom secret passcode that hides the chat from the main list.',
      highlights: ['Biometric FaceID / Fingerprint lock', 'Custom secret entry passcodes', 'Notification content masking']
    },
    {
      title: 'Silence Unknown Callers',
      icon: <FiPhoneOff className="text-xl" />,
      desc: 'Automatically filter out spam calls, unknown numbers, and robo-dialers. Silenced calls appear in your call log without ringing your phone.',
      highlights: ['Automatic spam pattern blocking', 'Silent call log recording', 'Custom contact whitelist']
    },
    {
      title: 'Encrypted Cloud Backups',
      icon: <FiUploadCloud className="text-xl" />,
      desc: 'Secure your Google Drive or iCloud chat archives with a custom password or 64-digit encryption key so cloud providers cannot access your chats.',
      highlights: ['64-digit custom encryption key', 'Password-protected cloud archives', 'Zero-knowledge cloud restore']
    }
  ]

  const metrics = [
    { value: '99.9%', label: 'OTP Instant Delivery Rate' },
    { value: '< 2 sec', label: 'Global OTP Speed' },
    { value: '-60%', label: 'SMS Authentication Cost' },
    { value: '256-bit', label: 'Signal Encryption' }
  ]

  const securityPillars = [
    {
      title: '1-Tap Passcode Autofill',
      desc: 'Users verify sign-ins automatically with a single tap on the "Copy Code" button in KT chat notifications.',
      icon: <FiZap className="text-2xl" />
    },
    {
      title: 'Zero SMS Interception Risk',
      desc: 'Unlike traditional SMS which is vulnerable to SIM-swap attacks, KT Authentication messages travel over Signal E2E encrypted channels.',
      icon: <FiShield className="text-2xl" />
    },
    {
      title: 'Real-time Security Webhooks',
      desc: 'Get instant callback webhooks when passcodes are delivered, read, or consumed by the user application.',
      icon: <FiKey className="text-2xl" />
    },
    {
      title: 'SOC2 Type II & ISO 27001 Certified',
      desc: 'Enterprise security infrastructure meeting global banking compliance standards.',
      icon: <FiLock className="text-2xl" />
    }
  ]

  const comparisonTable = [
    { feature: 'End-to-End Encryption', kt: 'Default (100%)', sms: 'None (Plain Text)', apps: 'Opt-in / Partial' },
    { feature: 'OTP Passcode Autofill', kt: 'Native 1-Tap Copy', sms: 'Manual Typing Required', apps: 'Complex Integration' },
    { feature: 'Zero SIM-Swap Vulnerability', kt: 'Protected (Signal Protocol)', sms: 'Vulnerable', apps: 'Vulnerable' },
    { feature: 'Encrypted Cloud Backups', kt: 'Supported (64-bit key)', sms: 'Not Supported', apps: 'Unencrypted Cloud' },
    { feature: 'Passkey & PIN Protection', kt: 'Included Free', sms: 'Carrier Lock Only', apps: 'Paid Feature' }
  ]

  const faqs = [
    {
      q: 'What are KT Authentication Messages?',
      a: 'KT Authentication Messages are secure, 1-tap One-Time Passcodes (OTPs) and account verification codes sent over KT Messengers Cloud API. They feature instant delivery, 1-tap copy buttons, and high conversion at 60% lower cost than SMS.'
    },
    {
      q: 'How do 1-Tap Autofill Passcodes work?',
      a: 'When an authentication OTP arrives in a user chat, a prominent "Copy Code" button allows the user to copy the passcode or automatically fill it into your app without leaving their screen.'
    },
    {
      q: 'Is end-to-end encryption active on Authentication Messages?',
      a: 'Yes. All authentication passcodes and security alerts are protected by default 256-bit Signal Protocol encryption.'
    },
    {
      q: 'How does KT compare to SMS OTP delivery costs?',
      a: 'KT Authentication messages eliminate international SMS roaming surcharges, saving enterprises up to 60% while increasing delivery speed to under 2 seconds worldwide.'
    }
  ]

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-cream py-16 lg:py-24 dark:bg-surface">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="up">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink border border-brand-strong/20 mb-4">
                <FiShield className="text-brand-strong" /> Security &amp; Authentication API
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Secure Authentication &amp; E2E Encryption
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-body max-w-xl">
                Deliver 1-tap OTP verification passcodes, account login alerts, and Signal 256-bit encrypted security messages at scale.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  Get Started Free <FiChevronRight />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/help')}>
                  View API Docs
                </Button>
              </div>
            </Reveal>

            {/* FULL WIDTH VIDEO & MOCKUP */}
            <Reveal from="scale" delay={0.1}>
              <div className="w-full rounded-[32px] overflow-hidden border border-line bg-surface shadow-2xl p-4 sm:p-6">
                <SecurityLoopVideo />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 2. LIVE INTERACTIVE AUTHENTICATION OTP DEMO SIMULATOR */}
      <section className="py-16 bg-surface border-y border-line">
        <Container>
          <Reveal from="up" className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
              Interactive Live Demo
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Experience 1-Tap KT Authentication Passcodes
            </h2>
            <p className="mt-2 text-base text-body">
              Click the button below to trigger a live 2FA OTP verification passcode simulation.
            </p>
          </Reveal>

          <div className="max-w-2xl mx-auto rounded-3xl border border-line bg-cream p-6 sm:p-8 shadow-card">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-strong text-white font-black">KT</div>
                <div>
                  <h4 className="font-extrabold text-ink text-base">Nova Bank Security</h4>
                  <p className="text-xs text-brand-ink font-semibold">Official Verified Business Account ✓</p>
                </div>
              </div>
              <button onClick={generateNewOtp} className="rounded-xl bg-brand-soft px-3.5 py-1.5 text-xs font-bold text-brand-ink hover:bg-brand-strong hover:text-white transition-all">
                Generate New OTP
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-surface p-4 border border-line shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-muted font-semibold">
                  <span>Authentication Code</span>
                  <span>Expires in 10:00</span>
                </div>
                <div className="text-2xl font-black text-brand-strong tracking-widest">{otpCode}</div>
                <p className="text-xs text-body">Use this code to verify your sign-in request for Nova Bank Enterprise.</p>
                <div className="pt-2">
                  <button
                    onClick={copyOtp}
                    className="w-full rounded-xl bg-brand-strong hover:bg-brand-strong-hover text-white py-2.5 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <FiCopy />
                    <span>{copied ? 'Passcode Copied to Clipboard! ✓' : 'Copy Code (1-Tap Autofill)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. METRICS COUNTER BAR */}
      <section className="bg-cream py-12 border-b border-line dark:bg-surface">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            {metrics.map((m, i) => (
              <Reveal key={i} from="up" delay={i * 0.05}>
                <div className="p-4 rounded-2xl bg-surface border border-line">
                  <div className="text-3xl font-extrabold text-brand-strong">{m.value}</div>
                  <div className="text-xs font-bold text-body mt-1">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. TABS SECTION */}
      <section className="py-20 bg-surface">
        <Container>
          <Reveal from="up" className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Comprehensive Security Architecture</h2>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-2">
              {securityTabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full rounded-2xl p-4 text-left font-bold text-sm transition-all flex items-center gap-3 ${
                    activeTab === idx
                      ? 'bg-brand-strong text-white shadow-brand'
                      : 'bg-cream text-ink hover:bg-cream-2 border border-line dark:bg-surface'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 rounded-3xl border border-line bg-cream p-8 shadow-card dark:bg-surface">
              <h3 className="text-2xl font-extrabold text-ink">{securityTabs[activeTab].title}</h3>
              <p className="mt-4 text-base leading-relaxed text-body">{securityTabs[activeTab].desc}</p>
              <div className="mt-6 space-y-3">
                {securityTabs[activeTab].highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. SECURITY PILLARS GRID */}
      <section className="py-20 bg-cream dark:bg-surface border-t border-line">
        <Container>
          <Reveal from="up" className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Enterprise Security Pillars</h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {securityPillars.map((p, idx) => (
              <Reveal key={idx} from="up" delay={idx * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-sm">
                  <div className="mb-4 inline-block rounded-xl bg-brand-soft p-3 text-brand-strong">{p.icon}</div>
                  <h4 className="text-lg font-bold text-ink">{p.title}</h4>
                  <p className="mt-2 text-xs text-body leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. COMPARISON TABLE */}
      <section className="py-20 bg-surface border-t border-line">
        <Container maxW="max-w-4xl">
          <Reveal from="up" className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-ink">How KT Security Compares</h2>
          </Reveal>

          <div className="overflow-x-auto rounded-3xl border border-line bg-cream shadow-card dark:bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface">
                <tr>
                  <th className="p-4 font-bold text-ink">Security Feature</th>
                  <th className="p-4 font-bold text-brand-strong">KT Messengers</th>
                  <th className="p-4 font-bold text-muted">Traditional SMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-cream-2">
                    <td className="p-4 font-semibold text-ink">{row.feature}</td>
                    <td className="p-4 font-bold text-brand-strong">{row.kt}</td>
                    <td className="p-4 text-muted">{row.sms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* 7. FAQS */}
      <section className="py-20 bg-cream dark:bg-surface border-t border-line">
        <Container maxW="max-w-3xl">
          <Reveal from="up" className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-ink">Frequently Asked Security Questions</h2>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((f, idx) => {
              const open = faqOpen === idx
              return (
                <div key={idx} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
                  <button
                    onClick={() => setFaqOpen(open ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left font-bold text-ink text-base"
                  >
                    <span>{f.q}</span>
                    <FiChevronDown className={`text-xl transition-transform ${open ? 'rotate-180 text-brand-strong' : ''}`} />
                  </button>
                  {open && <p className="mt-3 text-sm text-body leading-relaxed border-t border-line pt-3">{f.a}</p>}
                </div>
              )
            })}
          </div>
        </Container>
      </section>
    </MainLayout>
  )
}
