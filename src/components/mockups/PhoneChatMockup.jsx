import { FiVideo, FiPhone, FiMoreVertical, FiArrowLeft, FiLock, FiSmile, FiMic, FiPaperclip, FiWifi } from 'react-icons/fi'
import contactAvatar from '../../assets/images/business.jpg'

const dotPattern = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
  backgroundSize: '15px 15px',
}

/** A phone frame showing an end-to-end encrypted chat. */
export function PhoneChatMockup({ className = '' }) {
  return (
    <div className={`relative mx-auto w-[256px] sm:w-[286px] ${className}`}>
      <div className="rounded-[46px] bg-gradient-to-b from-[#1b2730] to-[#0c141a] p-2.5 shadow-float">
        <div className="relative flex aspect-[9/19] flex-col overflow-hidden rounded-[38px] bg-[#0b141a]">
          {/* status bar */}
          <div className="flex items-center justify-between px-4 pb-1 pt-2.5 text-[10px] font-medium text-white/80">
            <span>12:30</span>
            <span className="flex items-center gap-1.5">
              <FiWifi className="text-[11px]" />
              <span className="inline-block h-2.5 w-4 rounded-[2px] border border-white/60" />
            </span>
          </div>

          {/* chat header */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-[#111c24] px-3 py-2">
            <FiArrowLeft className="text-sm text-white/70" />
            <img src={contactAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            <div className="flex-1 leading-tight">
              <p className="text-[13px] font-semibold text-white">Anika</p>
              <p className="text-[10px] text-white/50">online</p>
            </div>
            <FiVideo className="text-sm text-white/70" />
            <FiPhone className="text-sm text-white/70" />
            <FiMoreVertical className="text-sm text-white/70" />
          </div>

          {/* chat body */}
          <div className="flex-1 space-y-2 overflow-hidden px-3 py-3" style={dotPattern}>
            <div className="mx-auto flex w-fit items-center gap-1 rounded-md bg-[#182a1e] px-2.5 py-1 text-center text-[8.5px] text-[#8fd0a6]">
              <FiLock className="text-[9px]" /> Messages are end-to-end encrypted
            </div>
            <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-[#1f2c35] px-3 py-2 text-[11px] leading-snug text-white">
              Did you get the photos I sent? 📸
            </div>
            <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm bg-[#1570ef] px-3 py-2 text-[11px] leading-snug text-white">
              Yes — all safe and encrypted.
              <span className="ml-1 text-[9px] text-white/70">12:30</span>
            </div>
            <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-[#1f2c35] px-3 py-2 text-[11px] leading-snug text-white">
              Perfect. Only we can ever see them. 🔒
            </div>
          </div>

          {/* input bar */}
          <div className="m-3 flex items-center gap-2 rounded-full bg-[#1f2c35] px-3 py-2">
            <FiSmile className="text-sm text-white/50" />
            <span className="flex-1 text-[10px] text-white/40">Message</span>
            <FiPaperclip className="text-sm text-white/50" />
            <FiMic className="text-sm text-white/50" />
          </div>
        </div>
      </div>

      {/* floating encryption badge */}
      <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-brand/30 bg-surface px-3.5 py-2 shadow-card">
        <FiLock className="text-brand-ink" />
        <span className="whitespace-nowrap text-xs font-semibold text-brand-ink">End-to-end encrypted</span>
      </div>
    </div>
  )
}
