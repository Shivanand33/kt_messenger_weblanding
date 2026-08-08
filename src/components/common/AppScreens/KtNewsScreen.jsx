import { motion } from 'framer-motion'
import {
  FiBookmark,
  FiGrid,
  FiMessageSquare,
  FiPhone,
  FiPlayCircle,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiShare2,
} from 'react-icons/fi'
import { AppPhoneFrame } from './AppPhoneFrame'
import { useLoopClock } from './useLoopClock'
import trend1 from '../../../assets/images/business.jpg'
import trend2 from '../../../assets/images/private.jpg'
import story1 from '../../../assets/images/security.jpg'
import story2 from '../../../assets/images/multidevice.jpg'

const CHIPS = ['All', 'Finance', 'Video News', 'World News', 'P…']

const TRENDING = [
  { image: trend1, title: 'She Is Russia’s Richest Woman. Her Business Empi…', length: '04:01', shares: 0 },
  { image: trend2, title: 'Senate eyes the exit after GOP-Trump deal', length: '03:53', shares: 0 },
]

const RECENT = [
  { image: trend1, title: 'She Is Russia’s Richest Woman. Her Business Empire Is Going Up in Fla…', source: 'The New York Times', when: '2h ago' },
  { image: trend2, title: 'Senate eyes the exit after GOP-Trump deal', source: 'Politico', when: '2h ago' },
  { image: story1, title: 'Thune, Trump, Senate conservatives reach deal to set aside budget, SA…', source: 'The Hill', when: '3h ago' },
  { image: story2, title: 'Markets steady as central banks hold rates for a third meeting', source: 'Reuters', when: '4h ago' },
]

const NAV = [
  { icon: <FiMessageSquare />, label: 'Chats', badge: 1 },
  { icon: <FiRefreshCw />, label: 'Updates' },
  { icon: <FiGrid />, label: 'News', active: true },
  { icon: <FiPlayCircle />, label: 'Minis' },
  { icon: <FiPhone />, label: 'Calls', badge: 9 },
  { icon: <FiSettings />, label: 'Settings' },
]

export function KtNewsScreen({ className = '' }) {
  const { progress, isPlaying, togglePlay, restart } = useLoopClock({ durationMs: 15000 })

  // The feed scrolls slowly, then resets — like a thumb flick through stories.
  const scroll = Math.min(Math.max((progress - 22) * 2.1, 0), 108)
  const activeChip = progress < 45 ? 0 : progress < 70 ? 1 : 2

  return (
    <AppPhoneFrame
      title="News · trending &amp; live channels"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onRestart={restart}
      statusTone="light"
      time="12:09"
      className={className}
    >
      <div className="flex h-full flex-col bg-[#f2f5f9]">
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-[#0f74ee] via-[#1e8bf2] to-[#43aef7] px-3 pb-3 pt-9">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-white">News</span>
            <FiBookmark className="text-[15px] text-white" />
          </div>

          <div className="mt-2.5 flex h-8 items-center gap-2 rounded-full bg-white px-3 shadow-sm">
            <FiSearch className="shrink-0 text-[12px] text-slate-400" />
            <span className="text-[10px] font-medium text-slate-400">Search news…</span>
          </div>
        </div>

        {/* Category chips */}
        <div className="shrink-0 overflow-hidden px-3 py-2">
          <div className="flex gap-1.5">
            {CHIPS.map((chip, index) => (
              <span
                key={chip}
                className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-semibold transition-colors ${
                  activeChip === index
                    ? 'border-[#1e8bf2] bg-[#dcecfd] text-[#1e8bf2]'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {chip === 'Video News' ? <FiPlayCircle className="text-[9px]" /> : null}
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Scrolling feed */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div animate={{ y: -scroll }} transition={{ duration: 0.4, ease: 'linear' }} className="px-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-bold text-slate-900">Good Afternoon</span>
              <span className="text-[8px] font-medium text-slate-500">Aug 8, 2026 · 12:09 PM</span>
            </div>

            <div className="mt-2">
              <div className="text-[10px] font-bold text-slate-900">Live channels</div>
              <div className="mt-0.5 text-[9px] font-medium text-slate-500">No live channels right now</div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-900">Trending</span>
              <span className="text-[9px] font-bold text-[#1e8bf2]">View All</span>
            </div>

            <div className="mt-1.5 flex gap-2 overflow-hidden">
              {TRENDING.map((item) => (
                <div key={item.title} className="w-[112px] shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
                  <img src={item.image} alt="" className="h-[62px] w-full object-cover" />
                  <div className="p-1.5">
                    <p className="line-clamp-2 text-[9px] font-bold leading-tight text-slate-900">{item.title}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[8px] font-semibold text-slate-500">
                      <span>{item.length}</span>
                      <span>·</span>
                      <FiShare2 className="text-[8px]" />
                      <span>{item.shares}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[10px] font-bold text-slate-900">Recent Stories</div>
            <div className="mt-1 divide-y divide-slate-200">
              {RECENT.map((item) => (
                <div key={item.title} className="flex items-center gap-2 py-2">
                  <img src={item.image} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[9.5px] font-bold leading-tight text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-[8px] font-medium text-slate-500">
                      {item.source} · {item.when}
                    </p>
                  </div>
                  <FiShare2 className="shrink-0 text-[11px] text-slate-500" />
                </div>
              ))}
            </div>
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#f2f5f9] to-transparent" />
        </div>

        {/* Bottom tab bar */}
        <div className="flex shrink-0 items-start justify-between border-t border-slate-200 bg-white px-2 pb-4 pt-1.5">
          {NAV.map((item) => (
            <div key={item.label} className="relative flex flex-1 flex-col items-center gap-0.5">
              <span className={`relative text-[14px] ${item.active ? 'text-[#1e8bf2]' : 'text-slate-400'}`}>
                {item.icon}
                {item.badge ? (
                  <span className="absolute -right-1.5 -top-1 grid h-2.5 min-w-2.5 place-items-center rounded-full bg-[#1e8bf2] px-0.5 text-[6px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span className={`text-[7px] font-semibold ${item.active ? 'text-[#1e8bf2]' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {item.active ? <span className="mt-0.5 h-[2px] w-5 rounded-full bg-[#1e8bf2]" /> : null}
            </div>
          ))}
        </div>
      </div>
    </AppPhoneFrame>
  )
}
