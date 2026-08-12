import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSmartphone, FiCheckCircle, FiShield, FiArrowRight } from 'react-icons/fi'

function QrIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M2 2h4v4H2V2zM1 1v6h6V1H1zm10 1h4v4h-4V2zm-1-1v6h6V1h-6zM2 10h4v4H2v-4zm-1-1v6h6V9H1zm9 1h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm2 0h1v1h-1v-1zm1-1h1v1h-1v-1zm0 2h1v1h-1v-1zm-1 1h1v1h-1v-1zm-2 0h1v1h-1v-1zm0-2h1v1h-1v-1zm1-1h1v1h-1v-1z" />
    </svg>
  )
}

export function AuthModal({ isOpen, onClose }) {
  const [usePhone, setUsePhone] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [codeSent, setCodeSent] = useState(false)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-stone-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            <FiX className="text-lg" />
          </button>

          {!usePhone ? (
            /* QR CODE SCANNER VIEW */
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                <QrIcon className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#111b21]">Log in to KT Web</h3>
              <p className="mt-1 text-xs text-stone-500">Scan this QR code with your phone to log in instantly</p>

              {/* Animated QR Code Box */}
              <div className="relative mx-auto my-6 flex h-48 w-48 items-center justify-center rounded-2xl bg-stone-900 p-3 shadow-inner">
                <div className="relative h-full w-full bg-white p-2 rounded-xl flex items-center justify-center border-4 border-brand-strong">
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-stone-900 rounded-lg">
                    {[...Array(25)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 4 || i === 20 || i === 24
                            ? 'bg-brand-strong'
                            : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Center Logo Badge */}
                  <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-brand-strong text-white font-bold text-xs shadow-md">
                    KT
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-2xl bg-stone-50 p-3 text-left text-xs text-stone-600 space-y-1.5 border border-stone-200/70">
                <p className="font-semibold text-stone-800">How to connect:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open <strong>KT Messenger</strong> on your phone</li>
                  <li>Tap <strong>Settings</strong> ⚙️ &gt; <strong>Linked Devices</strong></li>
                  <li>Point your camera at this screen</li>
                </ol>
              </div>

              <button
                onClick={() => setUsePhone(true)}
                className="mt-4 text-xs font-semibold text-brand-strong hover:underline"
              >
                Link with phone number instead →
              </button>
            </div>
          ) : (
            /* PHONE NUMBER PAIRING VIEW */
            <div>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                <FiSmartphone className="text-2xl" />
              </div>
              <h3 className="text-center text-2xl font-bold text-[#111b21]">Enter Phone Number</h3>
              <p className="mt-1 text-center text-xs text-stone-500">
                Select country and enter your phone number to receive a pairing code
              </p>

              {!codeSent ? (
                <div className="mt-6 space-y-4">
                  <div className="flex rounded-xl border border-stone-300 overflow-hidden focus-within:border-brand-strong">
                    <span className="flex items-center bg-stone-100 px-3 text-xs font-bold text-stone-700">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm text-stone-900 outline-none"
                    />
                  </div>

                  <button
                    onClick={() => setCodeSent(true)}
                    disabled={!phoneNumber}
                    className="w-full rounded-full bg-brand-strong py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-strong-hover disabled:opacity-50"
                  >
                    Get Pairing Code
                  </button>
                </div>
              ) : (
                <div className="mt-6 text-center space-y-4">
                  <div className="rounded-2xl bg-brand-soft p-4 border border-brand-strong/20">
                    <p className="text-xs text-brand-ink font-semibold">Your pairing code:</p>
                    <p className="mt-1 font-mono text-3xl font-extrabold tracking-widest text-brand-strong">
                      748 - 920
                    </p>
                  </div>
                  <p className="text-xs text-stone-500">Enter this code in KT on your phone to link device</p>
                  <button
                    onClick={() => setCodeSent(false)}
                    className="text-xs font-semibold text-stone-600 underline"
                  >
                    Use a different number
                  </button>
                </div>
              )}

              <button
                onClick={() => setUsePhone(false)}
                className="mt-4 block w-full text-center text-xs font-semibold text-stone-600 hover:underline"
              >
                ← Back to QR Code scan
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
