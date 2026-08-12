import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiArrowLeft, FiVideo, FiPhone, FiMoreVertical, FiFile, FiPlay } from 'react-icons/fi'
import { PhoneVideoFrame } from './PhoneVideoFrame'

/** Messages land one after another so the loop reads as a live conversation. */
const STEPS = 4

/** Static bar heights (%) for the voice-note waveform. */
const WAVE = [35, 60, 100, 55, 80, 45, 95, 65, 40, 75, 50, 85, 30, 70, 45]

export function MessagingLoopVideo({ className = '' }) {
  const [progress, setProgress] = useState(0)

  // No playback controls on this demo — the loop simply runs, forever.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.5))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const shown = Math.min(STEPS, Math.floor(progress / (100 / STEPS)) + 1)
  const enter = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } }

  return (
    <PhoneVideoFrame
      width="max-w-[300px]"
      screenClassName="p-0"
      showControls={false}
      showProgress={false}
      className={className}
    >
      {/* Chat header — full-bleed under the status bar, like a real handset */}
      <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 px-3 py-2 text-white shadow-md">
        <div className="flex items-center gap-2">
          <FiArrowLeft className="text-sm" />
          <div className="grid h-7 w-7 place-items-center rounded-full bg-white/25 text-[10px] font-extrabold text-white shadow">
            DM
          </div>
          <div>
            <h4 className="text-xs font-extrabold leading-tight tracking-tight">David Miller</h4>
            <span className="block text-[8px] font-medium leading-tight text-sky-100">online</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/90">
          <FiVideo />
          <FiPhone />
          <FiMoreVertical />
        </div>
      </div>

      {/* Thread — anchored to the bottom so new messages push the old ones up */}
      <div className="flex flex-1 flex-col justify-end gap-1 overflow-hidden bg-[#f5f8fa] px-2.5 py-2 text-slate-900">
        <div className="flex justify-center pb-0.5">
          <span className="rounded-full bg-white px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-slate-400 shadow-sm">
            Today
          </span>
        </div>

        {shown >= 1 && (
          <motion.div {...enter} className="flex justify-start">
            <div className="max-w-[82%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-2 shadow-sm">
              <span className="text-[10px] font-semibold leading-snug">
                Hey David! Check out these fresh strawberries we picked today! 🍓✨
              </span>
              <div className="pt-0.5 text-right font-mono text-[7px] text-slate-400">2:33 pm</div>
            </div>
          </motion.div>
        )}

        {shown >= 2 && (
          <motion.div {...enter} className="flex justify-end">
            <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-sky-500 to-blue-600 p-2 text-white shadow-md">
              <span className="text-[10px] font-semibold leading-snug">
                Good morning! That looks amazing! Hope you have a wonderful day ☀️✨
              </span>
              <div className="mt-0.5 flex items-center justify-end gap-1 font-mono text-[7px] text-sky-100">
                <span>4:24 pm</span>
                <span className="flex text-[9px] text-white">
                  <FiCheck />
                  <FiCheck className="-ml-1" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {shown >= 3 && (
          <motion.div {...enter} className="flex justify-end">
            <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-sky-500 to-blue-600 p-1.5 text-white shadow-md">
              <div className="flex items-center gap-2 rounded-xl bg-white/15 p-1.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/25">
                  <FiFile className="text-xs" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-bold leading-tight">Project_Archive.zip</p>
                  <p className="font-mono text-[7px] leading-tight text-sky-100">1.85 GB • ZIP</p>
                </div>
              </div>
              <div className="mt-0.5 flex items-center justify-end gap-1 pr-0.5 font-mono text-[7px] text-sky-100">
                <span>4:25 pm</span>
                <span className="flex text-[9px] text-white">
                  <FiCheck />
                  <FiCheck className="-ml-1" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {shown >= 4 && (
          <motion.div {...enter} className="flex justify-start">
            <div className="flex max-w-[82%] items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-2 shadow-sm">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-500 text-white">
                <FiPlay className="text-[9px]" />
              </div>
              <div className="flex h-4 flex-1 items-center gap-[2px]">
                {WAVE.map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} className="w-[2px] shrink-0 rounded-full bg-sky-400" />
                ))}
              </div>
              <span className="shrink-0 rounded-full bg-sky-50 px-1.5 py-0.5 text-[7px] font-bold text-sky-600">
                1.5×
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom input pill bar */}
      <div className="flex shrink-0 items-center gap-1.5 border-t border-slate-200 bg-white px-2 py-1.5">
        <div className="flex flex-1 items-center justify-between rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">😃</span>
            <span className="font-medium text-slate-400">Message</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>📎</span>
            <span>📷</span>
          </div>
        </div>
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-500 text-[10px] text-white shadow-md">
          🎙️
        </div>
      </div>
    </PhoneVideoFrame>
  )
}
