import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiLock, FiKey, FiEyeOff, FiPhoneOff, FiCheckCircle } from 'react-icons/fi'
import { PhoneVideoFrame } from './PhoneVideoFrame'

export function SecurityLoopVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [phase, setPhase] = useState(0) // 0: Key, 1: Chat Lock, 2: Caller Filter
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
      title="Signal E2EE &amp; Security Shield"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onRestart={restartVideo}
      className={className}
    >
      {/* Mobile Security Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="text-xs font-bold text-brand-ink flex items-center gap-1">
          <FiShield className="text-brand-strong" /> Security Firewall
        </span>
        <span className="text-[9px] text-emerald-400 font-semibold">100% Protected</span>
      </div>

      {/* Stream Content */}
      <div className="my-auto relative h-full flex flex-col justify-center py-1">
        {phase === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2 my-auto">
            <motion.div animate={{ scale: [0.95, 1.1, 0.95] }} transition={{ repeat: Infinity, duration: 1.5 }} className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-strong text-white text-xl shadow-brand">
              <FiLock />
            </motion.div>
            <h4 className="font-bold text-xs text-white">Signal 256-bit Key Handshake</h4>
            <p className="font-mono text-[9px] text-brand-ink bg-slate-950 p-2 rounded-lg border border-slate-800">
              Keys generated on-device • Zero cloud tracking
            </p>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-2 my-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-strong text-xl border border-brand-strong/30">
              <FiEyeOff />
            </div>
            <h4 className="font-bold text-xs text-white">Biometric Chat Lock &amp; Passcode</h4>
            <p className="text-[10px] text-slate-300">FaceID / Fingerprint verified for secret chats.</p>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5 text-xs my-auto">
            <div className="flex items-center justify-between rounded-xl bg-slate-950 p-2 border border-slate-800 text-[10px]">
              <span className="flex items-center gap-1.5"><FiPhoneOff className="text-brand-strong" /> Silence Unknown Callers</span>
              <FiCheckCircle className="text-brand-strong text-sm" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950 p-2 border border-slate-800 text-[10px]">
              <span className="flex items-center gap-1.5"><FiKey className="text-brand-strong" /> 2-Step Verification PIN</span>
              <FiCheckCircle className="text-brand-strong text-sm" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Screen Footer */}
      <div className="rounded-xl bg-slate-950 p-1.5 text-center text-[9px] font-bold text-brand-ink border border-slate-800">
        Chats, voice calls &amp; backups encrypted by default
      </div>
    </PhoneVideoFrame>
  )
}
