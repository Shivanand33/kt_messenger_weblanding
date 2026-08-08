import { useState } from 'react'
import { FiPlay, FiSmile, FiCheck, FiHeart } from 'react-icons/fi'
import sunsetImage from '../../assets/images/sunset_landscape.png'
import lillyAvatar from '../../assets/images/private.jpg'

export function ExpressMockup({ activeTab = 1, className = '' }) {
  const [reactions, setReactions] = useState({
    '😮': 3,
    '❤️': 4,
    '🍿': 2,
  })

  const emojiList = ['👍', '❤️', '😂', '😮', '😢', '🙏', '+']

  const handleEmojiClick = (emoji) => {
    if (emoji === '+') return
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }))
  }

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0)

  return (
    <div className={`relative mx-auto w-full max-w-[340px] select-none p-2 ${className}`}>
      {/* MOCKUP TAB 1: REACTIONS (SCREENSHOT 5 EXACT MATCH) */}
      {activeTab === 1 && (
        <div className="relative rounded-3xl bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-stone-200/80">
          {/* Reaction Bar Floating Above Image */}
          <div className="absolute -top-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-[0_6px_25px_rgba(0,0,0,0.15)] border border-stone-100">
            {emojiList.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleEmojiClick(emoji)}
                className="text-base transition-transform duration-200 hover:scale-135 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Chat Bubble Container */}
          <div className="pt-2">
            {/* Header info */}
            <div className="mb-2 flex items-center gap-2">
              <img src={lillyAvatar} alt="Lilly" className="h-6 w-6 rounded-full object-cover" />
              <span className="text-xs font-semibold text-stone-800">Lilly</span>
            </div>

            {/* Photo Card */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-900">
              <img
                src={sunsetImage}
                alt="Sunset landscape"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Timestamp */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] text-white/90 drop-shadow-md">
                <span>11:57</span>
              </div>

              {/* Reaction Badges Pill (Bottom Left of photo) */}
              <div className="absolute -bottom-2.5 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-md backdrop-blur-sm border border-stone-200">
                <span className="text-xs">😮</span>
                <span className="text-xs">❤️</span>
                <span className="text-xs">🍿</span>
                <span className="ml-1 text-[11px] font-bold text-stone-700">{totalReactions}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOCKUP TAB 0: STICKERS AND GIFS */}
      {activeTab === 0 && (
        <div className="rounded-3xl bg-white p-3 shadow-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-3">
            <img src={lillyAvatar} alt="Lilly" className="h-6 w-6 rounded-full object-cover" />
            <span className="text-xs font-semibold text-stone-800">Lilly</span>
          </div>

          {/* Sticker Message */}
          <div className="my-2 flex justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-2xl bg-emerald-50 text-6xl animate-bounce">
              🐱‍🏍
            </div>
          </div>

          {/* Sticker Tray Drawer */}
          <div className="mt-3 rounded-2xl bg-stone-100 p-2">
            <div className="flex justify-around text-2xl">
              <button className="hover:scale-125 transition-transform">🥳</button>
              <button className="hover:scale-125 transition-transform">🔥</button>
              <button className="hover:scale-125 transition-transform">✨</button>
              <button className="hover:scale-125 transition-transform">🍕</button>
              <button className="hover:scale-125 transition-transform">🎉</button>
            </div>
          </div>
        </div>
      )}

      {/* MOCKUP TAB 2: VIDEO NOTES */}
      {activeTab === 2 && (
        <div className="rounded-3xl bg-white p-4 shadow-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-3">
            <img src={lillyAvatar} alt="Lilly" className="h-6 w-6 rounded-full object-cover" />
            <span className="text-xs font-semibold text-stone-800">Lilly (Video Note)</span>
          </div>

          {/* Circular Video Note Frame */}
          <div className="mx-auto relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-lg">
            <div className="h-full w-full overflow-hidden rounded-full bg-stone-900 relative">
              <img src={sunsetImage} alt="Video preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-emerald-600 shadow-md">
                  <FiPlay className="ml-0.5 text-xl" />
                </div>
              </div>
              <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-semibold text-white">
                0:15
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOCKUP TAB 3: VOICE NOTES */}
      {activeTab === 3 && (
        <div className="rounded-3xl bg-[#d9fdd3] p-4 shadow-xl border border-emerald-200">
          <div className="flex items-center gap-3">
            <img src={lillyAvatar} alt="Lilly" className="h-10 w-10 rounded-full object-cover" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
              <FiPlay className="ml-0.5 text-lg" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 py-1">
                {[50, 80, 40, 90, 60, 30, 70, 100, 40, 80, 50, 30, 90].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-[3px] rounded-full bg-emerald-600"
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-stone-600 font-medium">
                <span>0:08</span>
                <span>0:24</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
