import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMic, FiLock } from 'react-icons/fi'
import { PhoneVideoFrame } from './PhoneVideoFrame'
import sunsetImage from '../../../assets/images/sunset_landscape.png'
import familyAvatar from '../../../assets/images/group.jpg'

export function StatusLoopVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [phase, setPhase] = useState(0) // 0: Photo Story, 1: Voice Status, 2: Privacy Exclusions
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
        if (next > 35 && next <= 70) setPhase(1)
        else if (next > 70) setPhase(2)
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
      title="24-Hour Stories &amp; Voice Status"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onRestart={restartVideo}
      className={className}
    >
      {/* Mobile Status Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <img src={familyAvatar} alt="Avatar" className="h-7 w-7 rounded-full border border-brand-strong object-cover" />
          <div>
            <p className="text-xs font-bold text-white">My Status</p>
            <p className="text-[9px] text-slate-400">24-Hour Disappearing</p>
          </div>
        </div>
        <span className="rounded-full bg-brand-strong/30 px-2 py-0.5 text-[8px] font-bold text-brand-ink border border-brand-strong/40">
          30s Voice
        </span>
      </div>

      {/* Stream Content */}
      <div className="my-auto relative h-full flex flex-col justify-center py-1">
        {phase === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-full w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
            <img src={sunsetImage} alt="Story" className="h-full w-full object-cover" />
            <div className="absolute bottom-2 inset-x-2 text-center">
              <span className="text-[10px] font-semibold text-white bg-black/65 px-2.5 py-1 rounded-full backdrop-blur-md">
                Evening sunset run vibes! 🌄
              </span>
            </div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-center space-y-2 my-auto">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand-strong text-white text-sm shadow-brand">
              <FiMic />
            </div>
            <p className="text-[11px] font-bold text-slate-200">&quot;Morning thoughts on our launch! ☕&quot;</p>
            <div className="flex items-center justify-center gap-1.5 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              <button className="text-[10px] text-brand-strong">▶</button>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-brand-strong" />
              </div>
              <span className="text-[8px] font-mono text-slate-400">0:22/0:30s</span>
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-xs space-y-1.5 my-auto">
            <div className="flex items-center justify-between font-bold text-[10px] text-brand-ink">
              <span className="flex items-center gap-1"><FiLock className="text-brand-strong" /> Status Privacy</span>
              <span className="text-emerald-400 text-[8px]">Encrypted</span>
            </div>
            <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 flex justify-between text-[10px]">
              <span>Contacts Except...</span>
              <span className="text-brand-strong font-bold">ACTIVE</span>
            </div>
            <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 flex justify-between text-[10px]">
              <span>Quick Emoji Reply</span>
              <span className="text-brand-strong font-bold">ENABLED</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Screen Footer */}
      <div className="rounded-xl bg-slate-950 p-1.5 text-center text-[9px] font-bold text-brand-ink border border-slate-800">
        Status updates automatically vanish after 24 hours
      </div>
    </PhoneVideoFrame>
  )
}
