import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiLock } from 'react-icons/fi'
import { PhoneVideoFrame } from './PhoneVideoFrame'
import techImg from '../../../assets/images/hd_landscape.png'

export function ChannelsLoopVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [subscribers, setSubscribers] = useState(148500)
  const [reactions, setReactions] = useState({ '❤️': 1420, '🔥': 980, '👏': 650 })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setSubscribers(148500)
          setReactions({ '❤️': 1420, '🔥': 980, '👏': 650 })
          return 0
        }
        const next = prev + 1.5
        if (next > 30 && next <= 60) setSubscribers(148501)
        else if (next > 60) {
          setReactions({ '❤️': 1435, '🔥': 1012, '👏': 675 })
        }
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const restartVideo = () => {
    setSubscribers(148500)
    setReactions({ '❤️': 1420, '🔥': 980, '👏': 650 })
    setProgress(0)
    setIsPlaying(true)
  }

  return (
    <PhoneVideoFrame
      title="Broadcast Channels &amp; Privacy"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onRestart={restartVideo}
      className={className}
    >
      {/* Mobile Channel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <img src={techImg} alt="Channel" className="h-7 w-7 rounded-full object-cover border border-brand-strong" />
          <div>
            <p className="flex items-center gap-1 font-bold text-xs text-white">
              KT Tech Pulse <FiCheckCircle className="text-brand-strong text-xs" />
            </p>
            <p className="text-[9px] text-brand-ink font-semibold">{subscribers.toLocaleString()} subscribers</p>
          </div>
        </div>
        <span className="rounded-full bg-brand-strong px-2.5 py-0.5 text-[8px] font-bold text-white shadow-brand">
          Following ✓
        </span>
      </div>

      {/* Broadcast Post */}
      <div className="my-auto rounded-xl bg-slate-950 p-2.5 border border-slate-800 space-y-2 text-xs">
        <p className="text-[11px] text-slate-200 leading-relaxed">
          🚀 <strong>Broadcast Update:</strong> Next-gen features are live! Enjoy HD video notes, theme engine, and AI search.
        </p>
        <div className="flex items-center justify-between text-[8px] text-slate-400 border-t border-slate-800 pt-1.5">
          <span className="flex items-center gap-1"><FiLock className="text-brand-strong" /> Privacy Shield Active</span>
          <span>12:30 PM</span>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          {Object.entries(reactions).map(([emoji, count]) => (
            <motion.span
              key={emoji}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-semibold text-slate-200 border border-slate-800"
            >
              <span>{emoji}</span>
              <span className="text-[8px] text-brand-ink">{count}</span>
            </motion.span>
          ))}
        </div>
      </div>

      {/* Screen Footer */}
      <div className="rounded-xl bg-slate-950 p-1.5 text-center text-[9px] font-bold text-brand-ink border border-slate-800">
        Subscribers react privately without sharing phone numbers
      </div>
    </PhoneVideoFrame>
  )
}
