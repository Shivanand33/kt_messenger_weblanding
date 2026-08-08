import { motion } from 'framer-motion'
import {
  FiChevronLeft,
  FiChevronRight,
  FiCornerUpLeft,
  FiLock,
  FiMaximize2,
  FiMic,
  FiMinimize2,
  FiMonitor,
  FiMoreHorizontal,
  FiPhone,
  FiPhoneOff,
  FiRefreshCw,
  FiUserPlus,
  FiVideo,
  FiVolume2,
} from 'react-icons/fi'
import { AppPhoneFrame } from './AppPhoneFrame'
import { useLoopClock } from './useLoopClock'
import callerAvatar from '../../../assets/images/avatar_male_1.png'
import selfAvatar from '../../../assets/images/avatar_female_1.png'
import videoFeed from '../../../assets/images/hd_landscape.png'

const PHASE_STOPS = [34, 66]

const clock = (seconds) => `00:${String(Math.floor(seconds)).padStart(2, '0')}`

/** One round control button in the call action panel. */
function CallButton({ icon, label, tone = 'muted', dark = false }) {
  const tones = {
    muted: dark ? 'bg-white/15 text-white' : 'bg-[#e8ecf2] text-slate-800',
    active: 'bg-white text-slate-900',
    end: 'bg-[#f2445c] text-white',
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`grid h-9 w-9 place-items-center rounded-full text-[13px] ${tones[tone]}`}>{icon}</span>
      <span className={`text-[8px] font-semibold ${dark ? 'text-white/85' : 'text-slate-700'}`}>{label}</span>
    </div>
  )
}

export function KtCallScreen({ className = '' }) {
  const { progress, phase, isPlaying, togglePlay, restart } = useLoopClock({
    durationMs: 16000,
    phaseStops: PHASE_STOPS,
  })

  // One continuous timer from the moment the call is answered, so it keeps
  // counting across the voice → video switch instead of jumping.
  const callSeconds = Math.max(0, (progress - PHASE_STOPS[0]) * 0.9)

  return (
    <AppPhoneFrame
      title="Calling · incoming, voice &amp; video"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onRestart={restart}
      statusTone={phase === 2 ? 'light' : 'dark'}
      time="12:06"
      className={className}
    >
      {/* ------------------------------------------------ PHASE 0 · INCOMING */}
      {phase === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full flex-col items-center bg-[#eff3f8] px-4 pb-6 pt-10"
        >
          <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[9px] font-semibold text-slate-700 shadow-sm">
            <FiLock className="text-[9px]" /> End-to-end encrypted
          </span>

          <motion.img
            src={callerAvatar}
            alt=""
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-8 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
          />

          <h4 className="mt-5 text-center text-[17px] font-semibold leading-tight text-slate-900">Priya Nair</h4>
          <p className="mt-1 text-[11px] font-medium text-slate-600">Incoming voice call</p>

          <div className="mt-auto flex w-full flex-col items-center gap-4">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-bold text-slate-800 shadow-sm">
              <FiCornerUpLeft className="text-[11px]" /> Reply
            </span>

            {/* Swipe-to-answer bar */}
            <div className="relative flex w-full items-center justify-between overflow-hidden rounded-full bg-gradient-to-r from-[#fdeaee] via-white to-[#e6f2fd] px-3 py-2">
              <span className="flex items-center gap-1 text-[9px] font-bold text-[#e5566f]">
                <FiChevronLeft /> Swipe left to decline
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-[#1e8bf2]">
                Swipe right to answer <FiChevronRight />
              </span>

              <motion.span
                animate={{ x: [-6, 6, -6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#1e8bf2] text-white shadow-lg"
              >
                <FiPhone className="text-base" />
              </motion.span>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* --------------------------------------------------- PHASE 1 · VOICE */}
      {phase === 1 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full flex-col bg-[#eff3f8] px-4 pb-6 pt-9"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[12px] text-slate-700 shadow-sm">
              <FiMinimize2 />
            </span>
            <div className="pt-0.5 text-center">
              <div className="text-[13px] font-bold leading-tight text-slate-900">Aarav Mehta</div>
              <div className="mt-0.5 text-[11px] font-medium tabular-nums text-slate-600">{clock(callSeconds)}</div>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[12px] text-slate-700 shadow-sm">
              <FiUserPlus />
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <motion.span
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-[#1e9bf0] text-[34px] font-bold text-white shadow-md"
            >
              AM
            </motion.span>

            {/* Audio level dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: dot * 0.12 }}
                  className="h-1.5 w-1.5 rounded-full bg-slate-400"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-y-4 rounded-3xl bg-white px-3 py-4 shadow-sm">
            <CallButton icon={<FiVideo />} label="Video" />
            <CallButton icon={<FiPhone />} label="Phone" />
            <CallButton icon={<FiMic />} label="Mute" />
            <CallButton icon={<FiMoreHorizontal />} label="More" />
            <CallButton icon={<FiMonitor />} label="Share" />
            <CallButton icon={<FiPhoneOff />} label="End" tone="end" />
          </div>
        </motion.div>
      ) : null}

      {/* --------------------------------------------------- PHASE 2 · VIDEO */}
      {phase === 2 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-full w-full bg-black">
          {/* Remote feed — slow drift reads as a live camera */}
          <motion.img
            src={videoFeed}
            alt=""
            animate={{ scale: [1.08, 1.16, 1.08], x: [0, -8, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between px-3 pt-9">
            <div className="rounded-2xl bg-black/45 px-2.5 py-1.5 backdrop-blur-sm">
              <div className="text-[11px] font-bold leading-tight text-white">Aarav Mehta</div>
              <div className="text-[10px] font-medium tabular-nums text-white/80">{clock(callSeconds)}</div>
            </div>
            <div className="flex gap-1.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25 text-[12px] text-white backdrop-blur-sm">
                <FiMaximize2 />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25 text-[12px] text-white backdrop-blur-sm">
                <FiUserPlus />
              </span>
            </div>
          </div>

          {/* Self view + camera flip */}
          <div className="absolute bottom-32 right-3 flex flex-col items-end gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black/45 text-[12px] text-white backdrop-blur-sm">
              <FiRefreshCw />
            </span>
            <div className="h-20 w-14 overflow-hidden rounded-xl border border-white/40 bg-slate-800 shadow-lg">
              <img src={selfAvatar} alt="" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="absolute inset-x-3 bottom-6 grid grid-cols-3 gap-y-4 rounded-3xl bg-black/65 px-3 py-4 backdrop-blur-md">
            <CallButton icon={<FiVideo />} label="Video" tone="active" dark />
            <CallButton icon={<FiVolume2 />} label="Speaker" tone="active" dark />
            <CallButton icon={<FiMic />} label="Mute" dark />
            <CallButton icon={<FiMoreHorizontal />} label="More" dark />
            <CallButton icon={<FiMonitor />} label="Share" dark />
            <CallButton icon={<FiPhoneOff />} label="End" tone="end" dark />
          </div>
        </motion.div>
      ) : null}
    </AppPhoneFrame>
  )
}
