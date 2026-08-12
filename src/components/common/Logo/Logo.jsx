import ktLogo from '../../../assets/kt-logo.svg'

/**
 * KT Messenger brand mark — the official logo asset (rounded blue gradient
 * tile holding a chat bubble, handset and typing dots). "KT" is dark,
 * "Messenger" uses the brand blue.
 *
 * Reused in the navbar, footer, Help Center, Brand Center and app mockups.
 * Pass `markClassName` to size the mark; it replaces the default 40px box
 * entirely so there is no conflicting-utility guesswork. `object-contain`
 * keeps the artwork undistorted inside whatever box it is given.
 */
export function Logo({ showWordmark = true, className = '', wordmarkClassName = '', markClassName = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={ktLogo}
        alt=""
        aria-hidden="true"
        className={`shrink-0 object-contain ${markClassName || 'h-10 w-10'}`}
      />
      {showWordmark ? (
        <span className={`text-[19px] font-extrabold tracking-tight ${wordmarkClassName}`}>
          <span className="text-ink">KT</span> <span className="text-brand-strong">Messenger</span>
        </span>
      ) : null}
    </span>
  )
}
