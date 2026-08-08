import { motion } from 'framer-motion'
import { FiArrowLeft, FiBookmark, FiHeart, FiMessageCircle, FiMoreVertical, FiSend, FiVolume2 } from 'react-icons/fi'
import { AppPhoneFrame } from './AppPhoneFrame'
import { useLoopClock } from './useLoopClock'
import clipFrame from '../../../assets/images/wedding_grid.png'

export function KtMinisScreen({ className = '' }) {
  const { progress, isPlaying, togglePlay, restart } = useLoopClock({ durationMs: 14000 })

  // The heart fills part-way through, the way a viewer double-taps mid-clip.
  const liked = progress >= 46
  const following = progress >= 66

  return (
    <AppPhoneFrame
      title="Minis · short video feed"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onRestart={restart}
      statusTone="light"
      time="12:09"
      showHomeIndicator={false}
      className={className}
    >
      <div className="relative h-full w-full overflow-hidden bg-black">
        {/* Clip frame with a slow push-in so it reads as playing video */}
        <motion.img
          src={clipFrame}
          alt=""
          animate={{ scale: [1.06, 1.16, 1.06] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-full object-cover opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center gap-2 px-3 pt-9">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-[12px] text-white backdrop-blur-sm">
            <FiArrowLeft />
          </span>
          <span className="flex-1 text-[14px] font-bold text-white">Minis</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-[12px] text-white backdrop-blur-sm">
            <FiVolume2 />
          </span>
        </div>

        {/* On-clip caption burn-in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[15px] font-black italic tracking-tight text-white drop-shadow-lg"
        >
          MORE <span className="text-[#f5e642]">MUSCLE</span>
        </motion.div>

        {/* Right action rail */}
        <div className="absolute bottom-24 right-2.5 flex flex-col items-center gap-3.5">
          <div className="flex flex-col items-center gap-0.5">
            <motion.span
              animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.45 }}
              className={`text-[19px] ${liked ? 'text-[#f2445c]' : 'text-white'}`}
            >
              <FiHeart className={liked ? 'fill-current' : ''} />
            </motion.span>
            <span className="text-[8px] font-bold text-white">{liked ? 1 : 0}</span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <FiMessageCircle className="text-[19px] text-white" />
            <span className="text-[8px] font-bold text-white">5</span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <FiSend className="text-[18px] text-white" />
            <span className="text-[8px] font-bold text-white">0</span>
          </div>

          <FiBookmark className="text-[18px] text-white" />
          <FiMoreVertical className="text-[16px] text-white" />
        </div>

        {/* Creator + caption */}
        <div className="absolute inset-x-0 bottom-0 px-3 pb-4">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1e8bf2] text-[10px] font-bold text-white">
              C
            </span>
            <span className="truncate text-[10px] font-bold text-white">@citlalli90999099</span>
            <span
              className={`shrink-0 rounded-md border px-2 py-0.5 text-[8px] font-bold transition-colors ${
                following ? 'border-white bg-white text-slate-900' : 'border-white text-white'
              }`}
            >
              {following ? 'Following' : 'Follow'}
            </span>
          </div>

          <p className="mt-1.5 text-[9px] font-medium leading-snug text-white/95">
            5 Ways to Build More Muscle 💪 🤝
            <br />
            #musclebuilding #gymtips #workouttips #g…{' '}
            <span className="font-bold text-white/70">more</span>
          </p>

          {/* Clip scrubber */}
          <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/25">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-[#1e8bf2] transition-[width] duration-100 ease-linear"
            />
          </div>
        </div>
      </div>
    </AppPhoneFrame>
  )
}
