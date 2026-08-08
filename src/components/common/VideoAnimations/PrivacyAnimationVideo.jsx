import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiPause, FiRotateCcw, FiLock, FiShield, FiKey, FiEyeOff, FiCheckCircle, FiSmartphone } from 'react-icons/fi'

export function PrivacyAnimationVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [step, setStep] = useState(0) // 0: E2EE Seal, 1: Biometric Lock, 2: Privacy Checkup Status
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStep(0)
          return 0
        }
        const next = prev + 1.25
        if (next > 30 && next <= 65) setStep(1)
        else if (next > 65) setStep(2)
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
          <span className="flex h-3 w-3 rounded-full bg-brand-strong animate-pulse" />
          <span className="text-xs font-bold text-ink uppercase tracking-wider">Video Clip • How Privacy Protection Works</span>
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
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-between text-white">
        {step === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              animate={{ scale: [0.9, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-strong text-white text-3xl shadow-brand mb-3"
            >
              <FiLock />
            </motion.div>
            <h4 className="font-bold text-sm">Signal E2E Encryption Handshake</h4>
            <p className="text-xs text-brand-ink mt-1 font-medium">Scrambling plain text into 256-bit cipher keys...</p>
            <div className="mt-3 rounded-lg bg-slate-900 px-3 py-1.5 font-mono text-[10px] text-slate-300 border border-slate-800">
              0x9F42A7...71B4 [Key Match Verified ✔]
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-strong text-3xl mb-3 border border-brand-strong/30"
            >
              <FiEyeOff />
            </motion.div>
            <h4 className="font-bold text-sm">Biometric Chat Lock Unlocked</h4>
            <p className="text-xs text-slate-300 mt-1">FaceID / Secret Passcode verified for private folder.</p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-brand-ink flex items-center gap-1.5">
                <FiShield /> Privacy Shield 100% Active
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Zero Logs</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span>Silence Unknown Callers</span>
                <FiCheckCircle className="text-brand-strong" />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span>Encrypted 64-bit Cloud Backup</span>
                <FiCheckCircle className="text-brand-strong" />
              </div>
            </div>
          </div>
        )}
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
