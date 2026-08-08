import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiPause, FiRotateCcw, FiPhone, FiVideo, FiMic, FiMicOff, FiMonitor, FiPhoneOff, FiVolume2 } from 'react-icons/fi'
import avatarMale from '../../../assets/images/avatar_male_1.png'
import avatarFemale from '../../../assets/images/avatar_female_1.png'

export function CallAnimationVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [callState, setCallState] = useState(0) // 0: Ringing, 1: Connected HD, 2: Screen Share Mode
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCallState(0)
          return 0
        }
        const next = prev + 1.25
        if (next > 25 && next <= 65) setCallState(1)
        else if (next > 65) setCallState(2)
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const restartVideo = () => {
    setCallState(0)
    setProgress(0)
    setIsPlaying(true)
  }

  return (
    <div className={`overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-float ${className}`}>
      {/* Video Player Header Bar */}
      <div className="flex items-center justify-between border-b border-line pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-ink uppercase tracking-wider">Video Clip • HD Voice & Video Calling</span>
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
        {callState === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-white">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="h-20 w-20 rounded-full border-4 border-brand-strong p-1 mb-3"
            >
              <img src={avatarFemale} alt="Emiko" className="h-full w-full rounded-full object-cover" />
            </motion.div>
            <h4 className="font-bold text-sm">Emiko Takahashi</h4>
            <p className="text-xs text-brand-ink font-medium mt-0.5 animate-pulse">Incoming 1080p HD Video Call...</p>
            <div className="mt-4 flex gap-4">
              <span className="rounded-full bg-emerald-500 p-3 text-white shadow-lg animate-bounce">
                <FiPhone />
              </span>
            </div>
          </div>
        )}

        {callState === 1 && (
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-900">
            <img src={avatarFemale} alt="Emiko" className="h-full w-full object-cover" />
            
            {/* Self PIP */}
            <div className="absolute top-2 right-2 h-20 w-16 overflow-hidden rounded-lg border-2 border-white/40 bg-slate-800 shadow-md">
              <img src={avatarMale} alt="You" className="h-full w-full object-cover" />
            </div>

            {/* Audio Spectrum overlay */}
            <div className="absolute bottom-12 left-3 flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20">
              <FiVolume2 className="text-brand-strong text-xs" />
              <div className="flex items-center gap-1 h-3">
                {[30, 80, 50, 90, 40].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`] }}
                    transition={{ repeat: Infinity, duration: 0.8 + i * 0.2 }}
                    className="w-1 rounded-full bg-brand-strong"
                  />
                ))}
              </div>
              <span className="text-[9px] text-white font-semibold ml-1">Spatial Audio Active</span>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-2 inset-x-4 flex justify-around rounded-full bg-slate-950/80 p-2 backdrop-blur-md border border-slate-800">
              <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-white bg-slate-800 rounded-full text-xs">
                {isMuted ? <FiMicOff className="text-red-400" /> : <FiMic />}
              </button>
              <button className="p-2 text-white bg-brand-strong rounded-full text-xs">
                <FiVideo />
              </button>
              <button className="p-2 text-white bg-slate-800 rounded-full text-xs">
                <FiMonitor />
              </button>
              <button className="p-2 text-white bg-red-600 rounded-full text-xs">
                <FiPhoneOff />
              </button>
            </div>
          </div>
        )}

        {callState === 2 && (
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-900 p-3 text-white flex flex-col justify-between border border-brand-strong/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold flex items-center gap-1.5 text-brand-ink">
                <FiMonitor className="text-brand-strong" /> Live Desktop Screen Share
              </span>
              <span className="rounded-full bg-brand-strong px-2 py-0.5 text-[9px] font-bold text-white">
                1080p 60FPS
              </span>
            </div>
            <div className="my-auto text-center p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs font-semibold text-slate-200">Broadcasting &quot;Quarterly_Presentation.pdf&quot; to call participants</p>
              <p className="text-[10px] text-brand-ink mt-1">Zero latency • E2E Encrypted Screen Pass</p>
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
