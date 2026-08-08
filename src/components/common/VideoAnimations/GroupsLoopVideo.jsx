import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiBarChart2, FiCalendar, FiCheckCircle } from 'react-icons/fi'
import { PhoneVideoFrame } from './PhoneVideoFrame'
import groupImg from '../../../assets/images/group.jpg'

export function GroupsLoopVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [phase, setPhase] = useState(0) // 0: Poll, 1: Event RSVP, 2: Communities
  const [progress, setProgress] = useState(0)
  const [voteCount, setVoteCount] = useState(14)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setPhase(0)
          setVoteCount(14)
          return 0
        }
        const next = prev + 1.5
        if (next > 20 && next <= 40) setVoteCount(18)
        else if (next > 40 && next <= 70) setPhase(1)
        else if (next > 70) setPhase(2)
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const restartVideo = () => {
    setPhase(0)
    setProgress(0)
    setVoteCount(14)
    setIsPlaying(true)
  }

  return (
    <PhoneVideoFrame
      title="Groups, Polls &amp; Communities"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onRestart={restartVideo}
      className={className}
    >
      {/* Mobile Group Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <img src={groupImg} alt="Group" className="h-7 w-7 rounded-full object-cover border border-brand-strong" />
          <div>
            <p className="text-xs font-bold text-white">Weekend Trip 🌄</p>
            <p className="text-[9px] text-slate-400">18 members • Encrypted</p>
          </div>
        </div>
        <span className="rounded-full bg-brand-strong/30 px-2 py-0.5 text-[8px] font-bold text-brand-ink border border-brand-strong/40">
          1,024 Max
        </span>
      </div>

      {/* Stream Content */}
      <div className="my-auto space-y-2 py-1">
        {phase === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 space-y-1.5"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-brand-ink">
              <span className="flex items-center gap-1"><FiBarChart2 className="text-brand-strong" /> Poll: Dinner location?</span>
              <span className="text-[9px] text-slate-400">{voteCount} votes</span>
            </div>
            <div className="relative overflow-hidden rounded-lg bg-slate-900 p-2 border border-brand-strong/40">
              <div style={{ width: `${(voteCount / 20) * 100}%` }} className="absolute inset-y-0 left-0 bg-brand-strong/30 transition-all duration-500" />
              <div className="relative flex items-center justify-between text-[10px] font-medium text-slate-200">
                <span className="flex items-center gap-1"><FiCheckCircle className="text-brand-strong text-xs" /> Beach Pizzeria 🍕</span>
                <span className="font-bold text-brand-ink">{Math.round((voteCount / 20) * 100)}%</span>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between text-brand-ink font-bold text-[10px]">
              <span className="flex items-center gap-1"><FiCalendar className="text-brand-strong" /> Group Event</span>
              <span className="rounded bg-brand-strong px-1.5 py-0.5 text-[8px] text-white font-bold">Upcoming</span>
            </div>
            <p className="font-bold text-white text-xs">Annual Beach Picnic 🏖️</p>
            <p className="text-[9px] text-slate-400">Saturday, Aug 12 • 2:00 PM</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] text-emerald-400 font-semibold">✓ 16 Going</span>
              <span className="rounded-full bg-brand-strong px-2.5 py-0.5 text-[9px] font-bold text-white">RSVP Going</span>
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between font-bold text-[10px] text-brand-ink">
              <span className="flex items-center gap-1"><FiUsers className="text-brand-strong" /> Community Hub</span>
              <span className="text-[9px] text-slate-400">5 Sub-Groups</span>
            </div>
            <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 flex items-center justify-between text-[10px]">
              <span>📢 Main Announcement</span>
              <span className="text-[8px] text-brand-strong font-semibold font-mono">1,024 Joined</span>
            </div>
            <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 flex items-center justify-between text-[10px]">
              <span>💬 General Chat</span>
              <span className="text-[8px] text-slate-400 font-mono">342 Joined</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Screen Footer */}
      <div className="rounded-xl bg-slate-950 p-1.5 text-center text-[9px] font-bold text-brand-ink border border-slate-800">
        Live polls &amp; event RSVPs update in real-time
      </div>
    </PhoneVideoFrame>
  )
}
