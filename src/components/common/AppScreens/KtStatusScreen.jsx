import { motion } from 'framer-motion'
import { FiArrowLeft, FiBell, FiPause, FiX } from 'react-icons/fi'
import { AppPhoneFrame } from './AppPhoneFrame'
import { useLoopClock } from './useLoopClock'
import ktLogo from '../../../assets/kt-logo.svg'
import storyBackdrop from '../../../assets/images/sunset_landscape.png'
import tile1 from '../../../assets/images/avatar_female_1.png'
import tile2 from '../../../assets/images/avatar_male_1.png'
import tile3 from '../../../assets/images/nadia_avatar.png'
import tile4 from '../../../assets/images/beach_bicycles.png'

const TILES = [tile1, tile2, tile3, tile4]

export function KtStatusScreen({ className = '' }) {
  const { progress, isPlaying, togglePlay, restart } = useLoopClock({ durationMs: 13000 })

  return (
    <AppPhoneFrame
      title="Updates · 24-hour stories"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onRestart={restart}
      statusTone="light"
      time="12:08"
      showHomeIndicator={false}
      className={className}
    >
      <div className="flex h-full flex-col bg-black">
        {/* Story progress + channel header */}
        <div className="shrink-0 px-3 pt-9">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/25">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-white transition-[width] duration-100 ease-linear"
            />
          </div>

          <div className="mt-3 flex items-center gap-2 pb-3">
            <FiArrowLeft className="shrink-0 text-base text-white" />
            <img src={ktLogo} alt="" className="h-6 w-6 shrink-0 rounded-md object-contain" />
            <span className="flex-1 truncate text-[12px] font-bold text-white">KT Updates</span>
            <FiPause className="shrink-0 text-[13px] text-white" />
            <FiX className="shrink-0 text-base text-white" />
          </div>
        </div>

        {/* Story card */}
        <div className="relative flex-1 overflow-hidden">
          <motion.img
            src={storyBackdrop}
            alt=""
            animate={{ scale: [1.05, 1.14, 1.05] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b3a63]/85 via-[#0b3a63]/45 to-black/80" />

          <div className="relative flex h-full flex-col p-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[10px] font-semibold text-white/80">Stay in the Loop</p>
              <h4 className="mt-1 text-[19px] font-extrabold leading-[1.15] text-white">
                Never Miss
                <br />
                What Matters
              </h4>
            </motion.div>

            {/* Photo grid, revealing tile by tile */}
            <div className="mt-4 grid w-[52%] grid-cols-2 gap-1.5 self-end">
              {TILES.map((tile, index) => (
                <motion.img
                  key={tile}
                  src={tile}
                  alt=""
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={progress >= 12 + index * 9 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="h-[42px] w-full rounded-md border border-white/60 object-cover shadow"
                />
              ))}
            </div>

            {/* Notification callout */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={progress >= 52 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.45 }}
              className="mt-auto flex items-start gap-2 rounded-2xl bg-white p-2.5 shadow-lg"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e6f0ff] text-[12px] text-[#1e8bf2]">
                <FiBell />
              </span>
              <p className="text-[9.5px] font-medium leading-snug text-slate-700">
                Enable <span className="font-bold text-[#1e8bf2]">@all</span> notifications and make sure every update
                reaches everyone. One mention is all it takes.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </AppPhoneFrame>
  )
}
