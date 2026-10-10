import { FiWifi } from 'react-icons/fi'
import { SKINS } from './previewTheme'

/**
 * iPhone-style chassis for the hero's Mobile Preview prototype.
 *
 * This is deliberately its own frame rather than AppPhoneFrame: that one is
 * shared by the feature pages and carries loop controls and a progress rail
 * this prototype does not want, and changing it would move those pages too.
 *
 * The screen is full-bleed — the status bar, Dynamic Island and home indicator
 * float above whatever the active screen renders, exactly as on a real handset.
 */
export function PreviewPhoneFrame({ time = '4:28', tone = 'dark', skin = 'light', children, className = '' }) {
  // `tone` describes the SCREEN: "light" means it paints its own dark surface
  // (Minis, a video call), so its glyphs are white whichever skin is on. Every
  // other screen follows the skin — dark glyphs on the light theme, light ones
  // once the app itself goes dark.
  const darkGlyphs = tone === 'dark' && skin === 'light'
  const ink = darkGlyphs ? 'text-slate-900' : 'text-white'
  const dot = darkGlyphs ? 'bg-slate-900' : 'bg-white'

  return (
    <div className={`relative ${className}`}>
      {/* Titanium rail. The gradient reads as a brushed metal edge catching
          light from the top-left, which is what sells the device at this size. */}
      <div className="relative rounded-[3.1rem] bg-gradient-to-br from-slate-300 via-slate-500 to-slate-800 p-[3px] shadow-[0_40px_80px_-24px_rgba(2,6,23,0.65)]">
        {/* Side buttons */}
        <span className="absolute -left-[3px] top-[7.5rem] h-7 w-[3px] rounded-l bg-slate-500" />
        <span className="absolute -left-[3px] top-[10rem] h-12 w-[3px] rounded-l bg-slate-500" />
        <span className="absolute -left-[3px] top-[13.5rem] h-12 w-[3px] rounded-l bg-slate-500" />
        <span className="absolute -right-[3px] top-[11rem] h-20 w-[3px] rounded-r bg-slate-500" />

        <div className="rounded-[3rem] bg-black p-[7px]">
          <div
            style={SKINS[skin] || SKINS.light}
            className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.6rem] bg-[var(--p-bg)]"
          >
            {children}

            {/* Status bar */}
            <div className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between px-6 pt-3 ${ink}`}>
              <span className="text-[13px] font-semibold tabular-nums tracking-tight">{time}</span>
              <div className="flex items-center gap-[5px] pt-[3px]">
                {/* Cellular strength, drawn as the four dots the app shows */}
                <span className="flex items-center gap-[2px]">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={`h-[4px] w-[4px] rounded-full ${dot} opacity-60`} />
                  ))}
                </span>
                <FiWifi className="text-[13px]" strokeWidth={2.5} />
                {/* Battery */}
                <span className="relative flex h-[11px] w-[22px] items-center rounded-[3px] border border-current px-[1.5px] opacity-80">
                  <span className={`h-[6px] w-[6px] rounded-[1px] ${dot}`} />
                  <span className="absolute -right-[3px] top-1/2 h-[4px] w-[2px] -translate-y-1/2 rounded-r-sm bg-current" />
                </span>
              </div>
            </div>

            {/* Dynamic Island */}
            <div className="pointer-events-none absolute left-1/2 top-[9px] z-40 h-[26px] w-[88px] -translate-x-1/2 rounded-full bg-black" />

            {/* Home indicator */}
            <div
              className={`pointer-events-none absolute bottom-[6px] left-1/2 z-40 h-[4px] w-[108px] -translate-x-1/2 rounded-full ${
                darkGlyphs ? 'bg-slate-900/35' : 'bg-white/60'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
