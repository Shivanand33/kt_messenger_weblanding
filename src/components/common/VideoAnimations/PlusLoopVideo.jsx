import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUploadCloud, FiUserCheck } from 'react-icons/fi'
import { PhoneVideoFrame } from './PhoneVideoFrame'

function CrownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M14.232 3.676a.5.5 0 0 1 .7.127l1 1.5a.5.5 0 0 1-.168.683l-4 2.5a.5.5 0 0 1-.774-.37l-.5-4a.5.5 0 0 1 .632-.544l3.11.804zM1.768 3.676a.5.5 0 0 0-.7.127l-1 1.5a.5.5 0 0 0 .168.683l4 2.5a.5.5 0 0 0 .774-.37l.5-4a.5.5 0 0 0-.632-.544l-3.11.804zM8 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-6 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM8 4a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 4z" />
    </svg>
  )
}

export function PlusLoopVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [phase, setPhase] = useState(0) // 0: Theme, 1: 10GB Transfer, 2: Multi-Account
  const [activeTheme, setActiveTheme] = useState('Midnight Sapphire')
  const [progress, setProgress] = useState(0)

  const themes = ['Midnight Sapphire', 'Electric Cyan', 'Royal Gold', 'Neon Purple']

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setPhase(0)
          setActiveTheme('Midnight Sapphire')
          return 0
        }
        const next = prev + 1.5
        if (next > 15 && next <= 35) setActiveTheme('Electric Cyan')
        else if (next > 35 && next <= 55) {
          setPhase(1)
          setActiveTheme('Royal Gold')
        } else if (next > 55) {
          setPhase(2)
          setActiveTheme('Neon Purple')
        }
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const restartVideo = () => {
    setPhase(0)
    setProgress(0)
    setActiveTheme('Midnight Sapphire')
    setIsPlaying(true)
  }

  return (
    <PhoneVideoFrame
      title="KT Plus Theme Engine &amp; Pro Perks"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onRestart={restartVideo}
      className={className}
    >
      {/* Mobile Plus Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <CrownIcon className="text-amber-400 text-sm" />
          <span className="text-xs font-bold text-white">KT Plus Engine</span>
        </div>
        <span className="rounded-full bg-brand-strong px-2 py-0.5 text-[8px] font-bold text-white shadow-brand">
          PRO UNLOCKED
        </span>
      </div>

      {/* Screen Body */}
      <div className="my-auto relative h-full flex flex-col justify-center py-1">
        {phase === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5 text-xs my-auto">
            <div className="flex justify-between items-center text-slate-300 text-[10px]">
              <span>Preset Theme:</span>
              <span className="text-brand-ink font-bold">{activeTheme}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {themes.map((t) => (
                <div
                  key={t}
                  className={`rounded-lg p-1.5 text-center text-[9px] font-bold border transition-all ${
                    activeTheme === t
                      ? 'border-brand-strong bg-brand-strong text-white shadow-brand'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 space-y-1.5 text-xs my-auto">
            <div className="flex justify-between items-center font-bold text-brand-ink text-[10px]">
              <span className="flex items-center gap-1"><FiUploadCloud className="text-brand-strong" /> 10GB File Transfer</span>
              <span>8.4 GB / 10 GB</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div className="h-full w-4/5 bg-brand-strong" />
            </div>
            <p className="text-[8px] text-slate-400 text-right">RAW Cinema 4K • Zero Compression</p>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 space-y-1.5 text-xs my-auto">
            <div className="flex justify-between items-center font-bold text-brand-ink text-[10px]">
              <span className="flex items-center gap-1"><FiUserCheck className="text-brand-strong" /> 5 Dual Accounts</span>
              <span className="text-emerald-400 text-[8px]">Active</span>
            </div>
            <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 flex justify-between items-center text-[9px]">
              <span>Personal Account (+91 98765...)</span>
              <span className="rounded-full bg-brand-strong px-2 py-0.5 text-[8px] font-bold text-white">Active</span>
            </div>
            <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 flex justify-between items-center text-[9px]">
              <span>Work / Business Account</span>
              <span className="text-[8px] text-slate-400">Switch ⚡</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Screen Footer */}
      <div className="rounded-xl bg-slate-950 p-1.5 text-center text-[9px] font-bold text-brand-ink border border-slate-800">
        Custom themes, 10GB transfers, &amp; 5-account space
      </div>
    </PhoneVideoFrame>
  )
}
