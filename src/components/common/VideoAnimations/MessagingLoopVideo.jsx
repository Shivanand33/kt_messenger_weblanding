import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiSmile, FiSend, FiPaperclip, FiMic, FiLock } from 'react-icons/fi'
import { PhoneVideoFrame } from './PhoneVideoFrame'
import avatarFemale from '../../../assets/images/avatar_female_1.png'
import weddingImg from '../../../assets/images/wedding_grid.png'

export function MessagingLoopVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [phase, setPhase] = useState(0) // 0: Text Send, 1: Media Send, 2: Voice Note
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setPhase(0)
          return 0
        }
        const next = prev + 1.5
        if (next > 33 && next <= 66) setPhase(1)
        else if (next > 66) setPhase(2)
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const restartVideo = () => {
    setPhase(0)
    setProgress(0)
    setIsPlaying(true)
  }

  return (
    <PhoneVideoFrame
      title="Instant Messaging &amp; 4K Media"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onRestart={restartVideo}
      className={className}
    >
      {/* Mobile Chat Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <img src={avatarFemale} alt="Sarah" className="h-7 w-7 rounded-full object-cover border border-brand-strong" />
          <div>
            <p className="text-xs font-bold text-white">Sarah Jenkins</p>
            <p className="text-[9px] text-emerald-400 font-semibold">Online • Signal E2EE</p>
          </div>
        </div>
        <span className="rounded-full bg-brand-strong/30 px-2 py-0.5 text-[8px] font-bold text-brand-ink border border-brand-strong/40">
          2GB Media
        </span>
      </div>

      {/* Chat Stream Body */}
      <div className="my-auto space-y-2 py-1">
        {phase === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="ml-auto max-w-[90%] rounded-2xl bg-brand-strong p-2.5 text-white shadow-brand text-xs"
          >
            Hey! I just shared our 4K photos &amp; ZIP files over KT Messengers! 🚀
            <div className="mt-1 flex items-center justify-end gap-1 text-[8px] text-white/80">
              <span>10:45 AM</span>
              <FiCheck className="text-xs text-blue-200" />
            </div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto max-w-[80%] overflow-hidden rounded-2xl bg-slate-950 p-1.5 border border-slate-800 text-xs"
          >
            <img src={weddingImg} alt="Media" className="h-24 w-full rounded-xl object-cover" />
            <div className="mt-1 flex items-center justify-between text-[8px] text-slate-300 px-1">
              <span>Project_Assets.zip (1.85 GB)</span>
              <FiCheck className="text-brand-strong text-xs" />
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[90%] rounded-2xl bg-slate-950 p-2.5 border border-slate-800 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <button className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-strong text-white text-[10px]">
                ▶
              </button>
              <div className="flex-1 space-y-1">
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-2/3 bg-brand-strong" />
                </div>
                <div className="flex justify-between text-[8px] text-slate-400">
                  <span>0:18</span>
                  <span className="text-brand-ink font-bold">1.5x Speed</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 rounded-xl bg-slate-950 p-2 border border-slate-800">
        <FiSmile className="text-slate-400 text-xs" />
        <input
          type="text"
          readOnly
          value={phase === 0 ? "Message sent with double ticks ✔✔" : phase === 1 ? "Sending 4K media..." : "Voice note playing at 1.5x..."}
          className="w-full bg-transparent text-[10px] text-slate-200 outline-none"
        />
        <div className="grid h-6 w-6 place-items-center rounded-lg bg-brand-strong text-white text-[10px] shrink-0 shadow-brand">
          <FiSend />
        </div>
      </div>
    </PhoneVideoFrame>
  )
}
