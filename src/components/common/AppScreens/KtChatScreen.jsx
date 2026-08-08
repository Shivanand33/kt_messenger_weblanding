import { motion } from 'framer-motion'
import {
  FiArrowLeft,
  FiCamera,
  FiCheck,
  FiChevronDown,
  FiCornerUpRight,
  FiDownload,
  FiMic,
  FiMoreVertical,
  FiPaperclip,
  FiPhone,
  FiSmile,
  FiVideo,
  FiVolume2,
} from 'react-icons/fi'
import { AppPhoneFrame } from './AppPhoneFrame'
import { useLoopClock } from './useLoopClock'
import photoMessage from '../../../assets/images/beach_bicycles.png'

const HIDDEN = { opacity: 0, y: 10, scale: 0.97 }
const SHOWN = { opacity: 1, y: 0, scale: 1 }

/**
 * Reveals its children once the loop passes `at`. Uses explicit animate
 * objects rather than variant labels — variant propagation does not resolve
 * reliably inside this showcase's keyed parent, leaving messages stuck hidden.
 */
function Cue({ at, progress, className = '', children }) {
  return (
    <motion.div
      initial={HIDDEN}
      animate={progress >= at ? SHOWN : HIDDEN}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Grey document card used for the two JPG attachments. */
function FileMessage({ name, time, showDownload }) {
  return (
    <div className="flex items-end gap-1.5">
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-[#e9edf2] p-2">
        <div className="flex items-center gap-2">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#4a5360] text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 2 4 4h-4V4Z" />
            </svg>
            <span className="absolute bottom-0.5 text-[5px] font-black tracking-tight">JPG</span>
          </span>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-bold leading-tight text-slate-900">{name}</div>
            <div className="mt-0.5 text-[9px] font-semibold text-slate-500">JPG · 22.2 KB</div>
          </div>

          {showDownload ? <FiDownload className="shrink-0 text-base text-slate-700" /> : null}
        </div>
        <div className="mt-0.5 text-right text-[8px] font-semibold text-slate-500">{time}</div>
      </div>

      <span className="mb-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e9edf2] text-[10px] text-slate-500">
        <FiCornerUpRight />
      </span>
    </div>
  )
}

/** Small pill used for the received voice/text notes near the bottom. */
function NoteBubble({ text, time, edited }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white px-2.5 py-1.5 shadow-sm">
        <span className="text-[11px] font-semibold text-slate-900">{text}</span>
        {edited ? <span className="text-[8px] font-medium text-slate-400">Edited</span> : null}
        <span className="text-[8px] font-semibold text-slate-400">{time}</span>
      </div>
      <FiVolume2 className="shrink-0 text-[11px] text-slate-500" />
    </div>
  )
}

export function KtChatScreen({ className = '' }) {
  const { progress, isPlaying, togglePlay, restart } = useLoopClock({ durationMs: 15000 })

  const ticksBlue = progress >= 78

  return (
    <AppPhoneFrame
      title="Chat · files, photos &amp; voice"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onRestart={restart}
      statusTone="light"
      time="12:05"
      className={className}
    >
      <div className="flex h-full flex-col bg-[#f4f6f8]">
        {/* ---------------------------------------------------------- HEADER */}
        <div className="relative z-20 shrink-0 bg-gradient-to-r from-[#0f74ee] via-[#1e8bf2] to-[#43aef7] px-3 pb-2.5 pt-9 text-white shadow-sm">
          <div className="flex items-center gap-2">
            <FiArrowLeft className="shrink-0 text-base" />

            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/25 text-[11px] font-bold">
              AM
            </span>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-bold leading-tight">Aarav Mehta</div>
              <div className="truncate text-[9px] font-semibold text-white/85">Last seen 25 min ago</div>
            </div>

            <FiVideo className="shrink-0 text-[13px]" />
            <FiPhone className="shrink-0 text-[13px]" />
            <FiMoreVertical className="shrink-0 text-[13px]" />
          </div>
        </div>

        {/* ------------------------------------------------------------ BODY */}
        <div className="relative flex-1 overflow-hidden px-2.5 pt-2">
          {/* Faint doodle wallpaper, like the real chat background */}
          <div className="pointer-events-none absolute inset-0 select-none text-[13px] text-slate-900/[0.05]">
            <span className="absolute left-4 top-6">♛</span>
            <span className="absolute right-6 top-16">✉</span>
            <span className="absolute left-10 top-32">♡</span>
            <span className="absolute right-10 top-44">☺</span>
            <span className="absolute left-6 top-60">✿</span>
            <span className="absolute right-4 top-72">✈</span>
            <span className="absolute left-16 top-80">★</span>
          </div>

          <div className="relative space-y-2">
            <Cue at={8} progress={progress}>
              <FileMessage name="KT_17849105829…" time="2:33 pm" showDownload />
            </Cue>

            {/* Photo message */}
            <Cue at={24} progress={progress} className="flex items-end gap-1.5">
              <div className="relative overflow-hidden rounded-2xl rounded-tl-md">
                <img src={photoMessage} alt="" className="h-[86px] w-[150px] object-cover" />
                <span className="absolute bottom-1 right-1 rounded bg-black/55 px-1 py-0.5 text-[8px] font-semibold text-white">
                  2:37 pm
                </span>
              </div>
              <span className="mb-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e9edf2] text-[10px] text-slate-500">
                <FiCornerUpRight />
              </span>
            </Cue>

            <Cue at={40} progress={progress}>
              <FileMessage name="single-fresh-red-s…" time="2:37 pm" showDownload />
            </Cue>

            {/* Date divider */}
            <Cue at={52} progress={progress} className="flex justify-center py-0.5">
              <span className="rounded-md bg-white px-2 py-0.5 text-[8px] font-bold text-slate-500 shadow-sm">
                6/8/2026
              </span>
            </Cue>

            <Cue at={58} progress={progress}>
              <NoteBubble text="Deno" time="11:04 am" />
            </Cue>

            {/* Outgoing message */}
            <Cue at={70} progress={progress} className="flex items-center justify-end gap-1.5">
              <FiVolume2 className="shrink-0 text-[11px] text-slate-500" />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-br-md bg-[#1e8bf2] px-2.5 py-1.5 shadow-sm">
                <span className="text-[11px] font-semibold text-white">apple test message</span>
                <span className="text-[8px] font-semibold text-white/80">4:24 pm</span>
                <span className={`flex text-[9px] ${ticksBlue ? 'text-[#7fd4ff]' : 'text-white/60'}`}>
                  <FiCheck />
                  <FiCheck className="-ml-1" />
                </span>
              </div>
            </Cue>

            <Cue at={84} progress={progress}>
              <NoteBubble text="hii" time="6:01 pm" />
            </Cue>
          </div>

          {/* Scroll-to-latest button */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={progress >= 24 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-2 right-3 grid h-7 w-7 place-items-center rounded-full bg-[#1e8bf2] text-white shadow-lg"
          >
            <FiChevronDown className="text-sm" />
          </motion.span>
        </div>

        {/* ------------------------------------------------------- INPUT BAR */}
        <div className="relative z-20 flex shrink-0 items-center gap-1.5 px-2 pb-5 pt-1.5">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-full bg-white px-3 shadow-sm">
            <FiSmile className="shrink-0 text-[13px] text-slate-400" />
            <span className="flex-1 text-[11px] font-medium text-slate-400">Message</span>
            <FiPaperclip className="shrink-0 text-[12px] text-slate-500" />
            <FiCamera className="shrink-0 text-[12px] text-slate-500" />
          </div>

          <motion.span
            animate={{ scale: progress >= 70 && progress < 78 ? [1, 1.12, 1] : 1 }}
            transition={{ duration: 0.6, repeat: progress >= 70 && progress < 78 ? Infinity : 0 }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1e8bf2] text-white shadow-md"
          >
            <FiMic className="text-sm" />
          </motion.span>
        </div>
      </div>
    </AppPhoneFrame>
  )
}
