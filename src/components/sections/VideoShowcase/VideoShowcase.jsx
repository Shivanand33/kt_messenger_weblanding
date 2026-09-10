import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiMessageSquare,
  FiPhone,
  FiUsers,
  FiRadio,
  FiCpu,
  FiClock,
  FiShield,
  FiGrid,
  FiPlayCircle,
  FiPlay,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiCheck
} from 'react-icons/fi'
import { Reveal } from '../../common/Reveal/Reveal'
// Real-app screen recreations, used for the features we have app UI for.
import { KtChatScreen } from '../../common/AppScreens/KtChatScreen'
import { KtCallScreen } from '../../common/AppScreens/KtCallScreen'
import { KtStatusScreen } from '../../common/AppScreens/KtStatusScreen'
import { KtNewsScreen } from '../../common/AppScreens/KtNewsScreen'
import { KtMinisScreen } from '../../common/AppScreens/KtMinisScreen'
import { GroupsLoopVideo } from '../../common/VideoAnimations/GroupsLoopVideo'
import { ChannelsLoopVideo } from '../../common/VideoAnimations/ChannelsLoopVideo'
import { KtAiLoopVideo } from '../../common/VideoAnimations/KtAiLoopVideo'
import { SecurityLoopVideo } from '../../common/VideoAnimations/SecurityLoopVideo'
import { PlusLoopVideo } from '../../common/VideoAnimations/PlusLoopVideo'

import { useLanguage } from '../../../context/LanguageContext'

import avatarFemale from '../../../assets/images/avatar_female_1.png'

function CrownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M14.232 3.676a.5.5 0 0 1 .7.127l1 1.5a.5.5 0 0 1-.168.683l-4 2.5a.5.5 0 0 1-.774-.37l-.5-4a.5.5 0 0 1 .632-.544l3.11.804zM1.768 3.676a.5.5 0 0 0-.7.127l-1 1.5a.5.5 0 0 0 .168.683l4 2.5a.5.5 0 0 0 .774-.37l.5-4a.5.5 0 0 0-.632-.544l-3.11.804zM8 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-6 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM8 4a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 4z" />
    </svg>
  )
}

export function VideoShowcase() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('chat')

  const featuresData = {
    chat: {
      id: 'chat',
      route: '/messaging',
      label: t('Messaging'),
      icon: <FiMessageSquare />,
      headline: t('Instant 4K Media & 2GB Files'),
      shortTag: t('Send uncompressed photos, 2GB ZIP files, and voice notes with double blue tick delivery confirmations.'),
      specs: [t('KT 256-bit E2EE'), t('2GB Uncompressed Files'), t('1.5x Speed Voice Notes')],
      badge: t('Instant Delivery • Double Blue Ticks ✔✔'),
      videoComponent: <KtChatScreen showControls={false} showProgress={false} showEncryptionNote={false} />
    },
    call: {
      id: 'call',
      route: '/calling',
      label: t('Calling'),
      icon: <FiPhone />,
      headline: t('Studio 1080p HD Calling & Screen Share'),
      shortTag: t('Crystal clear Opus 48kHz spatial audio with 32 participants and 1-tap live desktop screen sharing.'),
      specs: [t('32-Person Group Calls'), t('1080p 60FPS Screen Share'), t('Spatial Audio Equalizer')],
      badge: t('Studio Audio • 60FPS Screen Share'),
      videoComponent: <KtCallScreen />
    },
    groups: {
      id: 'groups',
      route: '/groups',
      label: t('Groups'),
      icon: <FiUsers />,
      headline: t('1,024 Member Groups & Live Polls'),
      shortTag: t('Real time poll percentage votes, automated event RSVP tracking, and community sub group hubs.'),
      specs: [t('1,024 Member Capacity'), t('Real Time Poll Voting'), t('Event RSVP Calendar')],
      badge: t('1,024 Capacity • Live Poll Engine'),
      videoComponent: <GroupsLoopVideo />
    },
    channels: {
      id: 'channels',
      route: '/channels',
      label: t('Channels'),
      icon: <FiRadio />,
      headline: t('1-to Many Broadcast Channels'),
      shortTag: t('Broadcast to unlimited subscribers while keeping phone numbers & admin identity 100% private.'),
      specs: [t('Unlimited Subscribers'), t('Identity Privacy Shield'), t('Private Emoji Reactions')],
      badge: t('Unlimited Reach • Identity Shield'),
      videoComponent: <ChannelsLoopVideo />
    },
    ai: {
      id: 'ai',
      route: '/ai',
      label: 'KT AI',
      headline: t('Neural AI Multimodal Assistant'),
      shortTag: t('Type `/imagine` prompts for 4K artwork or mention `@KTAI` in groups for instant intelligent answers.'),
      specs: [t('/imagine 4K Artwork'), t('Group Chat Co Pilot'), t('Voice Audio Transcriber')],
      badge: t('Multi Modal AI • Sub Second GPU Render'),
      videoComponent: <KtAiLoopVideo />
    },
    status: {
      id: 'status',
      route: '/status',
      label: t('Status'),
      icon: <FiClock />,
      headline: t('Disappearing 24-Hour Stories'),
      shortTag: t('Share photos, text, and 30-second audio voice notes that automatically vanish after 24 hours.'),
      specs: [t('24-Hour Auto Vanish'), t('30s Voice Status Clips'), t('Granular Privacy Rules')],
      badge: t('24-Hour Vanish • Voice Status'),
      videoComponent: <KtStatusScreen />
    },
    news: {
      id: 'news',
      route: '/news',
      label: t('News'),
      icon: <FiGrid />,
      headline: t('Live News Feed Inside Your Chats'),
      shortTag: t('Trending stories, live channels, and a searchable feed read the day’s headlines without leaving the app.'),
      specs: [t('Trending & Live Channels'), t('Category Filters'), t('Save & Share in One Tap')],
      badge: t('Fresh Headlines • Zero Ad Tracking'),
      videoComponent: <KtNewsScreen />
    },
    minis: {
      id: 'minis',
      route: '/news',
      label: t('Minis'),
      icon: <FiPlayCircle />,
      headline: t('Minis Short Video, Full Screen'),
      shortTag: t('A vertical clip feed with likes, comments and shares, built right beside your chats and calls.'),
      specs: [t('Full Screen Vertical Feed'), t('Like, Comment & Share'), t('Follow Your Creators')],
      badge: t('Short Video • In App Feed'),
      videoComponent: <KtMinisScreen />
    },
    security: {
      id: 'security',
      route: '/security',
      label: t('Security'),
      icon: <FiShield />,
      headline: t('KT Encryption Protocol 256-bit'),
      shortTag: t('Every chat, voice call, and cloud backup is sealed with unique cryptographic keys stored on your device.'),
      specs: [t('KT 256-bit E2EE'), t('Biometric Chat Lock'), t('Silence Unknown Callers')],
      badge: t('100% Encrypted • Zero Logs'),
      videoComponent: <SecurityLoopVideo />
    },
    plus: {
      id: 'plus',
      route: '/plus',
      label: 'KT Plus',
      icon: <CrownIcon />,
      headline: t('KT Plus Theme Engine & Pro Suite'),
      shortTag: t('Custom UI themes (Midnight Sapphire, Electric Cyan, Royal Gold), 10GB file engine, and 5 dual accounts.'),
      specs: [t('Custom UI Theme Engine'), t('10GB RAW File Transfer'), t('5 Dual Space Accounts')],
      badge: t('Pro Suite • 10GB File Engine'),
      videoComponent: <PlusLoopVideo />
    }
  }

  const current = featuresData[activeTab]

  return (
    <section className="relative overflow-hidden bg-cream py-14 lg:py-20 dark:bg-surface border-y border-line">
      {/* Full Bleed Container with Minimal Side Margins */}
      <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-strong/30 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink">
            <FiPlay className="text-brand-strong" /> {t('Interactive Product Video Demonstrator')}
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t('See How Every Feature Works in Action')}
          </h2>
          <p className="mt-3 text-base text-body">
            {t('Tap a feature tab below to watch real time simulated mobile video animations.')}
          </p>

          {/* Sleek Horizontal Feature Tab Switcher */}
          <div className="mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {Object.values(featuresData).map((feat) => {
              const active = activeTab === feat.id
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveTab(feat.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    active
                      ? 'bg-brand-strong text-white shadow-brand scale-105'
                      : 'bg-surface text-ink hover:bg-surface-2 border border-line'
                  }`}
                >
                  {feat.icon}
                  <span>{feat.label}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* FULL-WIDTH ORGANIC 2-COLUMN SHOWCASE CANVAS */}
        <div className="mt-10 relative">
          {/* Keyed on the active tab so switching remounts the panel and replays
              the entrance. Rendered without AnimatePresence: on this React
              version its exiting child never unmounts, which with mode="wait"
              stopped the new tab from ever mounting. */}
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="grid gap-8 lg:grid-cols-12 lg:items-center"
          >
              {/* LEFT COLUMN (5 Columns): Short Punchy Information */}
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                  {current.label} {t('Experience')}
                </div>

                <h3 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.6rem] tracking-tight leading-tight">
                  {current.headline}
                </h3>

                <p className="text-base sm:text-lg leading-relaxed text-body">
                  {current.shortTag}
                </p>

                {/* Micro Tech Specs Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {current.specs.map((spec) => (
                    <span key={spec} className="inline-flex items-center gap-1.5 rounded-xl bg-surface p-2 px-3 text-xs font-bold text-ink border border-line shadow-soft">
                      <FiCheck className="text-brand-strong text-sm" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>

                {/* Primary Action Row */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => navigate(current.route)}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-6 py-3 text-sm font-bold text-white shadow-brand transition-all hover:bg-brand-strong-hover hover:-translate-y-0.5"
                  >
                    <span>{t('Explore')} {current.label}</span>
                    <FiArrowRight />
                  </button>
                  <span className="text-xs font-bold text-brand-ink bg-brand-soft px-3 py-2 rounded-full border border-brand-strong/30">
                    {current.badge}
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN (7 Columns): Full Mobile Video Animation Canvas */}
              <div className="lg:col-span-7 relative flex justify-center py-2">
                
                {/* Background Ambient Radial Glow */}
                <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />

                {/* Floating Emojis (Top-Right) */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2 right-2 sm:right-10 z-20 hidden sm:flex items-center gap-1 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line"
                >
                  <span className="text-base">😍</span>
                  <span className="text-base">😂</span>
                  <span className="text-base">😮</span>
                  <span className="text-base">🙏</span>
                  <span className="text-base">👏</span>
                  <span className="text-base">💯</span>
                </motion.div>

                {/* Floating Perk Badge (Top-Left) */}
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-8 left-2 sm:left-4 z-20 hidden sm:flex items-center gap-1.5 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line"
                >
                  <span className="text-lg">☕</span>
                  <span className="text-xs font-bold text-ink">{t('Private & Instant')}</span>
                </motion.div>

                {/* Mobile Phone Mockup Device Container */}
                <div className="relative z-10">
                  {current.videoComponent}
                </div>

                {/* Floating Voice Note Bar (Bottom-Left) */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-2 left-2 sm:left-6 z-20 flex items-center gap-2.5 rounded-full bg-surface px-3.5 py-2 shadow-float border border-line"
                >
                  <img src={avatarFemale} alt={t('Avatar')} className="h-6 w-6 rounded-full object-cover border border-brand-strong" />
                  <div className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white text-[9px]">
                    ▶
                  </div>
                  <div className="flex items-center gap-0.5 h-2.5">
                    {[30, 80, 50, 90, 40, 70, 30].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`] }}
                        transition={{ repeat: Infinity, duration: 0.8 + i * 0.2 }}
                        className="w-0.5 rounded-full bg-emerald-500"
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-muted">0:03 / 0:30</span>
                </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
