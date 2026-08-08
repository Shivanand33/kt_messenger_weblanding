import { FiVideo, FiMicOff, FiVolume2, FiMoreHorizontal, FiPhoneOff, FiUserPlus, FiMinimize2, FiRefreshCw } from 'react-icons/fi'
import mainFeed from '../../assets/images/group.jpg'
import selfFeed from '../../assets/images/business.jpg'

/** A phone frame showing an end-to-end encrypted group video call. */
export function PhoneCallMockup({ className = '' }) {
  return (
    <div className={`relative mx-auto w-[258px] sm:w-[288px] ${className}`}>
      <div className="rounded-[46px] bg-gradient-to-b from-[#ecd696] to-[#d6ab52] p-2.5 shadow-float">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[38px] bg-black">
          <img src={mainFeed} alt="" className="absolute inset-0 h-full w-full object-cover" />

          {/* status + top controls */}
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-3.5 pb-6 pt-3.5">
            <div className="flex items-center justify-between text-white">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-black/35 backdrop-blur">
                <FiMinimize2 className="text-sm" />
              </span>
              <span className="text-[11px] font-medium text-white/90">End-to-end encrypted</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-black/35 backdrop-blur">
                <FiUserPlus className="text-sm" />
              </span>
            </div>
          </div>

          {/* self view */}
          <div className="absolute bottom-24 right-3 flex flex-col items-center gap-2">
            <div className="h-28 w-[74px] overflow-hidden rounded-2xl border border-white/25 shadow-lg">
              <img src={selfFeed} alt="" className="h-full w-full object-cover" />
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur">
              <FiRefreshCw className="text-xs" />
            </span>
          </div>

          {/* call controls */}
          <div className="absolute inset-x-3 bottom-4 flex items-center justify-between rounded-full bg-black/65 px-2.5 py-2 backdrop-blur">
            <button className="grid h-9 w-9 place-items-center rounded-full text-white/90">
              <FiMoreHorizontal />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full text-white/90">
              <FiVideo />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-white text-black">
              <FiVolume2 />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full text-white/90">
              <FiMicOff />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-[#f0324b] text-white">
              <FiPhoneOff />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
