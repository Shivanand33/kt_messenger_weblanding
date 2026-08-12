import { FiBattery, FiPause, FiPlay, FiRotateCcw, FiWifi } from 'react-icons/fi'

/**
 * Edge-to-edge phone chassis for the KT app-screen animations.
 *
 * Unlike PhoneVideoFrame (used by the feature pages) this frame gives the
 * screen its full bleed, so headers and video feeds can run under the status
 * bar exactly as they do in the real app. `statusTone` switches the clock and
 * indicator colours for light vs dark screens.
 */
export function AppPhoneFrame({
  title = 'KT App',
  progress = 0,
  isPlaying = true,
  onTogglePlay,
  onRestart,
  statusTone = 'light',
  time = '12:05',
  showHomeIndicator = true,
  // Playback chrome. Both default on, as every screen rendered before these
  // knobs existed — turn them off where the phone is purely decorative and the
  // loop should just run.
  showControls = true,
  showProgress = true,
  children,
  className = '',
}) {
  const onLight = statusTone === 'dark'
  const statusColor = onLight ? 'text-slate-900' : 'text-white'

  return (
    <div className={`mx-auto w-full max-w-[300px] sm:max-w-[330px] ${className}`}>
      {/* Playback controls above the device */}
      {showControls ? (
      <div className="mb-2.5 flex items-center justify-between px-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-brand-strong" />
          <span className="line-clamp-1 text-[11px] font-bold uppercase tracking-wider text-ink">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-ink shadow-sm transition-colors hover:bg-brand-strong hover:text-white"
          >
            {isPlaying ? (
              <>
                <FiPause /> Pause
              </>
            ) : (
              <>
                <FiPlay /> Play
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onRestart}
            aria-label="Replay animation"
            title="Replay loop"
            className="grid h-6 w-6 place-items-center rounded-full border border-line bg-surface text-[10px] text-ink transition-colors hover:bg-surface-2"
          >
            <FiRotateCcw />
          </button>
        </div>
      </div>
      ) : null}

      {/* Device chassis */}
      <div className="relative rounded-[44px] border-[3px] border-slate-800 bg-slate-950 p-2 shadow-float transition-colors dark:border-slate-700 dark:bg-slate-900">
        <div className="absolute -left-[7px] top-20 h-9 w-[4px] rounded-l-md bg-slate-700" />
        <div className="absolute -left-[7px] top-32 h-9 w-[4px] rounded-l-md bg-slate-700" />
        <div className="absolute -right-[7px] top-24 h-12 w-[4px] rounded-r-md bg-slate-700" />

        {/* Screen — children own the whole surface */}
        <div className="relative aspect-[9/19.2] w-full overflow-hidden rounded-[36px] bg-white">
          {children}

          {/* Status bar sits above the screen content, like the real device */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 pt-2 text-[10px] font-bold ${statusColor}`}
          >
            <span className="tabular-nums">{time}</span>
            <div className="flex items-center gap-1">
              <FiWifi className="text-[10px]" />
              <FiBattery className="text-[11px]" />
            </div>
          </div>

          {/* Dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-1.5 z-40 h-4 w-[68px] -translate-x-1/2 rounded-full bg-black" />

          {/* Home indicator */}
          {showHomeIndicator ? (
            <div
              className={`pointer-events-none absolute bottom-1.5 left-1/2 z-40 h-1 w-24 -translate-x-1/2 rounded-full ${
                onLight ? 'bg-slate-900/30' : 'bg-white/50'
              }`}
            />
          ) : null}
        </div>
      </div>

      {/* Loop progress under the device */}
      {showProgress ? (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-brand-strong transition-[width] duration-100 ease-linear"
          />
        </div>
      ) : null}
    </div>
  )
}
