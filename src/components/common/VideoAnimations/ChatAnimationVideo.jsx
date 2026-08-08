import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiPause, FiRotateCcw, FiCheck, FiImage, FiSmile, FiMic, FiSend } from 'react-icons/fi'
import avatarFemale from '../../../assets/images/avatar_female_1.png'
import avatarMale from '../../../assets/images/avatar_male_1.png'
import weddingImg from '../../../assets/images/wedding_grid.png'

export function ChatAnimationVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // Simulation steps timer
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStep(0)
          return 0
        }
        const next = prev + 1.25
        if (next > 20 && next <= 45) setStep(1)
        else if (next > 45 && next <= 70) setStep(2)
        else if (next > 70) setStep(3)
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const restartVideo = () => {
    setStep(0)
    setProgress(0)
    setIsPlaying(true)
  }

  return (
    <div className={`overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-float ${className}`}>
      {/* Video Player Header Bar */}
      <div className="flex items-center justify-between border-b border-line pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-bold text-ink uppercase tracking-wider">Video Clip • How Chatting Works</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink hover:bg-brand-strong hover:text-white transition-colors"
          >
            {isPlaying ? <><FiPause /> Pause</> : <><FiPlay /> Play</>}
          </button>
          <button
            onClick={restartVideo}
            className="grid h-7 w-7 place-items-center rounded-full bg-cream text-ink hover:bg-line text-xs"
            title="Replay video"
          >
            <FiRotateCcw />
          </button>
        </div>
      </div>

      {/* Video Screen Viewport */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950 p-4 border border-slate-800">
        {/* Simulated Chat Interface */}
        <div className="flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <img src={avatarFemale} alt="Sarah" className="h-8 w-8 rounded-full object-cover border border-brand-strong" />
              <div>
                <p className="text-xs font-bold text-white">Sarah Jenkins</p>
                <p className="text-[10px] text-emerald-400 font-semibold">Online • Signal E2EE</p>
              </div>
            </div>
            <span className="rounded-full bg-brand-strong/30 px-2 py-0.5 text-[9px] font-bold text-brand-ink border border-brand-strong/40">
              1080p Media
            </span>
          </div>

          {/* Chat Stream Messages */}
          <div className="flex-1 overflow-y-auto py-2 space-y-2 text-xs">
            {step >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[75%] rounded-2xl bg-slate-900 p-2.5 text-slate-200 border border-slate-800"
              >
                Hey! Are we still sending the project files over KT? 📁
                <span className="mt-1 block text-[8px] text-slate-400 text-right">10:42 AM</span>
              </motion.div>
            )}

            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-auto max-w-[80%] rounded-2xl bg-brand-strong p-2.5 text-white shadow-brand"
              >
                Yes! Just attaching the 4K photos & 2GB ZIP project archive. Watch this! 🚀
                <div className="mt-1 flex items-center justify-end gap-1 text-[8px] text-white/80">
                  <span>10:43 AM</span>
                  <FiCheck className="text-xs text-blue-200" />
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-auto max-w-[70%] overflow-hidden rounded-2xl bg-slate-900 p-1.5 border border-slate-800"
              >
                <img src={weddingImg} alt="Attachment" className="h-28 w-full rounded-xl object-cover" />
                <div className="mt-1 flex items-center justify-between px-1 text-[9px] text-slate-300">
                  <span>Project_Design.zip (1.8 GB)</span>
                  <FiCheck className="text-brand-strong text-xs" />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-[10px] text-slate-400 italic"
              >
                <span>Sarah is typing...</span>
                <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }}>•</motion.span>
                <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>•</motion.span>
              </motion.div>
            )}
          </div>

          {/* Typing Bar Simulation */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
            <FiSmile className="text-slate-400 text-sm" />
            <input
              type="text"
              readOnly
              value={step === 0 ? "Typing message..." : step === 1 ? "Sending HD image asset..." : "Message delivered via E2EE ✔"}
              className="w-full bg-transparent text-[11px] text-slate-200 outline-none"
            />
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-strong text-white text-xs shrink-0 shadow-brand">
              <FiSend />
            </div>
          </div>
        </div>
      </div>

      {/* Video Progress Scrubber */}
      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-cream overflow-hidden border border-line">
          <div style={{ width: `${progress}%` }} className="h-full bg-brand-strong transition-all duration-100" />
        </div>
        <span className="font-mono text-[10px] font-bold text-muted">
          0:0{Math.floor((progress / 100) * 15)} / 0:15s
        </span>
      </div>
    </div>
  )
}
