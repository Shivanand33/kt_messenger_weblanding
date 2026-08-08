import { FiVideo, FiMic, FiMonitor, FiPhoneOff, FiLock } from 'react-icons/fi'
import feed1 from '../../assets/images/hero.jpg'
import feed2 from '../../assets/images/group.jpg'
import feed3 from '../../assets/images/business.jpg'
import feed4 from '../../assets/images/private.jpg'
import feed5 from '../../assets/images/security.jpg'
import feed6 from '../../assets/images/multidevice.jpg'

const tiles = [
  { src: feed2, name: 'Aria' },
  { src: feed3, name: 'Ken' },
  { src: feed1, name: 'Maya' },
  { src: feed4, name: 'Sam' },
  { src: feed6, name: 'Lena' },
  { src: feed5, name: 'You' },
]

/** Two stacked browser windows — the front one on a group video call. */
export function BrowserCallMockup({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* back window peeking out */}
      <div className="absolute -right-5 -top-5 hidden h-[86%] w-[92%] rounded-2xl border border-line bg-surface shadow-card lg:block" />

      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#0b1220] shadow-float">
        {/* browser chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-[11px] text-muted">
            <FiLock className="text-[11px]" /> web.kt.com/call
          </div>
        </div>

        {/* video grid */}
        <div className="grid grid-cols-3 gap-1 bg-black p-1">
          {tiles.map((tile) => (
            <div key={tile.name} className="relative aspect-[4/3] overflow-hidden rounded-md">
              <img src={tile.src} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white">
                {tile.name}
              </span>
            </div>
          ))}
        </div>

        {/* call controls */}
        <div className="flex items-center justify-center gap-2.5 bg-[#0b1220] py-3">
          <button className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white">
            <FiMic className="text-sm" />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white">
            <FiVideo className="text-sm" />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white">
            <FiMonitor className="text-sm" />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-[#f0324b] text-white">
            <FiPhoneOff className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}
