import { FiPlay, FiPause, FiRotateCcw, FiWifi, FiBattery } from 'react-icons/fi'

export function PhoneVideoFrame({
  title = 'Loop Video',
  progress = 0,
  isPlaying = true,
  onTogglePlay,
  onRestart,
  children,
  className = ''
}) {
  return (
    <div className={`mx-auto w-full max-w-[320px] sm:max-w-[360px] ${className}`}>
      {/* Outer Video Control Header Bar */}
      <div className="flex items-center justify-between mb-2.5 px-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-brand-strong animate-pulse" />
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider line-clamp-1">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-ink hover:bg-brand-strong hover:text-white transition-colors shadow-sm"
          >
            {isPlaying ? <><FiPause /> Pause</> : <><FiPlay /> Play</>}
          </button>
          <button
            onClick={onRestart}
            className="grid h-6 w-6 place-items-center rounded-full bg-surface text-ink hover:bg-surface-2 border border-line text-[10px] transition-colors"
            title="Replay loop"
          >
            <FiRotateCcw />
          </button>
        </div>
      </div>

      {/* Realistic Mobile Smartphone Chassis Container */}
      <div className="relative rounded-[46px] border-[3px] border-slate-800 bg-slate-950 p-2.5 shadow-float dark:border-slate-700 dark:bg-slate-900 transition-colors">
        {/* Left Side Buttons (Volume keys mockup) */}
        <div className="absolute -left-[7px] top-20 h-9 w-[4px] rounded-l-md bg-slate-700" />
        <div className="absolute -left-[7px] top-32 h-9 w-[4px] rounded-l-md bg-slate-700" />
        {/* Right Side Button (Power key mockup) */}
        <div className="absolute -right-[7px] top-24 h-12 w-[4px] rounded-r-md bg-slate-700" />

        {/* Mobile Screen Container */}
        <div className="relative aspect-[9/18.5] w-full overflow-hidden rounded-[38px] bg-slate-900 text-white shadow-inner flex flex-col justify-between border border-slate-800">
          
          {/* Smartphone Status Bar + Dynamic Island Notch */}
          <div className="relative z-30 flex items-center justify-between px-4 pt-2.5 pb-1 text-[10px] font-semibold text-white/90 shrink-0">
            <span>9:41</span>
            
            {/* Dynamic Island Pill */}
            <div className="absolute left-1/2 top-2 h-3.5 w-16 -translate-x-1/2 rounded-full bg-black border border-slate-800 flex items-center justify-end px-1.5">
              <span className="h-1 w-1 rounded-full bg-blue-500 animate-ping" />
            </div>

            <div className="flex items-center gap-1">
              <FiWifi className="text-[10px]" />
              <span className="text-[8px] font-mono font-bold">5G</span>
              <FiBattery className="text-[10px]" />
            </div>
          </div>

          {/* Main Simulated Screen Viewport Content */}
          <div className="relative flex-1 overflow-hidden flex flex-col justify-between p-3">
            {children}
          </div>

          {/* Integrated Internal Loop Progress Line inside Phone Home Bar */}
          <div className="z-30 pb-2 pt-1 flex flex-col items-center gap-1 shrink-0 px-4">
            <div className="h-1 w-full max-w-[120px] rounded-full bg-white/20 overflow-hidden">
              <div style={{ width: `${progress}%` }} className="h-full bg-brand-strong transition-all duration-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
