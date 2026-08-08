import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPhone, FiVideo, FiMic, FiMicOff, FiMonitor, FiPhoneOff, FiVolume2, FiShield } from 'react-icons/fi'
import { PhoneVideoFrame } from './PhoneVideoFrame'
import avatarFemale from '../../../assets/images/avatar_female_1.png'
import avatarMale from '../../../assets/images/avatar_male_1.png'

export function CallLoopVideo({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [phase, setPhase] = useState(0) // 0: Ringing, 1: HD Call, 2: Screen Share
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
        if (next > 30 && next <= 70) setPhase(1)
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
      title="1080p Calling &amp; Screen Share"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onRestart={restartVideo}
      className={className}
    >
      {/* Mobile Screen Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <img src={avatarFemale} alt="Emiko" className="h-7 w-7 rounded-full object-cover border border-brand-strong" />
          <div>
            <p className="text-xs font-bold text-white">Emiko Takahashi</p>
            <p className="text-[9px] text-emerald-400 font-semibold">1080p HD • Signal Encrypted</p>
          </div>
        </div>
        <span className="rounded-full bg-brand-strong/30 px-2 py-0.5 text-[8px] font-bold text-brand-ink border border-brand-strong/40">
          HD Audio
        </span>
      </div>

      {/* Screen Body */}
      <div className="my-auto relative h-full w-full flex flex-col justify-center py-2">
        {phase === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center my-auto space-y-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="mx-auto h-20 w-20 rounded-full border-4 border-brand-strong p-1 shadow-brand"
            >
              <img src={avatarFemale} alt="Calling" className="h-full w-full rounded-full object-cover" />
            </motion.div>
            <div>
              <h4 className="font-bold text-sm text-white">Emiko Takahashi</h4>
              <p className="text-xs text-brand-ink font-semibold animate-pulse mt-0.5">Incoming 1080p Video Call...</p>
            </div>
            <div className="flex justify-center gap-6 pt-2">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-red-600 text-white text-base shadow-lg">
                <FiPhoneOff />
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white text-base shadow-lg animate-bounce">
                <FiPhone />
              </span>
            </div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-full w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
            <img src={avatarFemale} alt="Video Stream" className="h-full w-full object-cover" />
            
            {/* Self PIP */}
            <div className="absolute top-2 right-2 h-16 w-12 overflow-hidden rounded-lg border-2 border-white/40 bg-slate-900 shadow-md">
              <img src={avatarMale} alt="You" className="h-full w-full object-cover" />
            </div>

            {/* Spatial Audio Spectrum */}
            <div className="absolute bottom-10 left-2 flex items-center gap-1.5 bg-black/75 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">
              <FiVolume2 className="text-brand-strong text-[10px]" />
              <div className="flex items-center gap-0.5 h-2.5">
                {[30, 85, 45, 95, 60].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
                    transition={{ repeat: Infinity, duration: 0.7 + i * 0.2 }}
                    className="w-0.5 rounded-full bg-brand-strong"
                  />
                ))}
              </div>
              <span className="text-[8px] font-bold text-white">Spatial Audio</span>
            </div>

            {/* Call Action Controls Bar */}
            <div className="absolute bottom-1 inset-x-2 flex justify-around rounded-full bg-slate-950/80 p-1.5 backdrop-blur-md border border-slate-800">
              <span className="p-1.5 text-white bg-slate-800 rounded-full text-[10px]"><FiMic /></span>
              <span className="p-1.5 text-white bg-brand-strong rounded-full text-[10px] shadow-brand"><FiVideo /></span>
              <span className="p-1.5 text-white bg-slate-800 rounded-full text-[10px]"><FiMonitor /></span>
              <span className="p-1.5 text-white bg-red-600 rounded-full text-[10px]"><FiPhoneOff /></span>
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-auto rounded-xl bg-slate-950 p-3 border border-brand-strong/40 text-center space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px]">
              <span className="font-bold text-brand-ink flex items-center gap-1"><FiMonitor className="text-brand-strong" /> Screen Broadcast</span>
              <span className="bg-brand-strong text-white px-1.5 py-0.5 rounded font-bold text-[8px]">1080p 60FPS</span>
            </div>
            <p className="text-xs font-semibold text-white">Sharing &quot;Quarterly_Strategy.pdf&quot;</p>
            <p className="text-[9px] text-brand-ink">Live stream delivered with E2EE protection</p>
          </motion.div>
        )}
      </div>

      {/* Screen Footer */}
      <div className="rounded-xl bg-slate-950 p-1.5 text-center text-[9px] font-bold text-brand-ink border border-slate-800">
        1080p HD voice &amp; screen sharing on iOS, Android &amp; Desktop
      </div>
    </PhoneVideoFrame>
  )
}
