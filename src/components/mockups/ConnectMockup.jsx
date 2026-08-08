import { useState } from 'react'
import { FiPlay, FiPause, FiCheck } from 'react-icons/fi'
import beachImage from '../../assets/images/beach_bicycles.png'
import emikoAvatar from '../../assets/images/private.jpg'
import userAvatar from '../../assets/images/business.jpg'

export function ConnectMockup({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState(null)

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '+']

  return (
    <div className={`relative mx-auto w-full max-w-[420px] select-none p-4 ${className}`}>
      {/* Pinned Message Banner */}
      <div className="relative z-20 mb-6 ml-auto flex max-w-[340px] items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
          <svg className="h-4 w-4 rotate-45 text-stone-700" fill="currentColor" viewBox="0 0 16 16">
            <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182a.5.5 0 0 1-.707-.707l3.182-3.182L.49 7.343a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.92 2.92 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-stone-800">
          Trevor&apos;s recital is on Sunday, 1pm!
        </p>
      </div>

      {/* Main Image Message Card */}
      <div className="relative z-10 mb-8 ml-4 max-w-[320px]">
        {/* Floating Emoji Reaction Bar */}
        <div className="absolute -top-5 left-8 z-30 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-stone-100">
          <div className="mr-1 flex items-center gap-1.5">
            <img src={emikoAvatar} alt="Emiko" className="h-5 w-5 rounded-full object-cover" />
            <span className="text-[11px] font-semibold text-rose-500">Emiko</span>
          </div>
          <div className="h-3.5 w-[1px] bg-stone-200" />
          <div className="flex items-center gap-1.5">
            {emojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEmoji(selectedEmoji === emoji ? null : emoji)}
                className={`text-sm transition-transform hover:scale-125 ${
                  selectedEmoji === emoji ? 'scale-125 rounded-full bg-emerald-100 p-0.5' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Container */}
        <div className="overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.1)] border border-stone-200/60">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-900">
            <img
              src={beachImage}
              alt="Beach bicycles"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {/* Video overlay badge */}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-[10px] font-medium text-white">0:48</span>
            </div>
            {/* Time + status overlay */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] text-white/90 drop-shadow-md">
              <span>11:57</span>
              <div className="flex text-emerald-400">
                <FiCheck className="-mr-1 text-xs" />
                <FiCheck className="text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Note Bubble */}
      <div className="relative z-20 ml-auto max-w-[310px] rounded-2xl rounded-tr-xs bg-[#d9fdd3] p-3 shadow-[0_8px_25px_rgba(0,0,0,0.06)] border border-emerald-200/60">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img src={userAvatar} alt="Sender" className="h-10 w-10 rounded-full object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px]">
              🎤
            </div>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? <FiPause className="text-lg" /> : <FiPlay className="ml-0.5 text-lg" />}
          </button>

          <div className="flex-1">
            {/* Waveform graphic */}
            <div className="flex items-center gap-[2.5px] py-1">
              {[40, 65, 30, 85, 45, 90, 70, 40, 60, 95, 50, 30, 75, 40, 85, 60, 35, 70, 50, 30].map(
                (h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-[3px] rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-emerald-600 animate-pulse'
                        : i < 6
                        ? 'bg-emerald-600'
                        : 'bg-emerald-300'
                    }`}
                  />
                )
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-600 font-medium mt-0.5">
              <span>{isPlaying ? '0:12' : '0:05'}</span>
              <div className="flex items-center gap-1">
                <span>0:20</span>
                <div className="flex text-emerald-600">
                  <FiCheck className="-mr-1 text-xs" />
                  <FiCheck className="text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
