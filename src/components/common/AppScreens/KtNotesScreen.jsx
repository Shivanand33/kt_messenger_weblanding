import { motion } from 'framer-motion'
import { FiX, FiCheckSquare, FiImage, FiMic, FiList, FiCheck, FiClipboard } from 'react-icons/fi'
import { AppPhoneFrame } from './AppPhoneFrame'
import { useLoopClock } from './useLoopClock'
import { useLanguage } from '../../../context/LanguageContext'

export function KtNotesScreen({ className = '' }) {
  const { t } = useLanguage()
  const { progress, isPlaying, togglePlay, restart } = useLoopClock({ durationMs: 12000 })

  const isPinned = progress >= 30
  const isTask = progress >= 60

  return (
    <AppPhoneFrame
      title={t('Add Note · KT Messenger')}
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onRestart={restart}
      statusTone="light"
      time="6:06"
      showHomeIndicator={false}
      showControls={false}
      showProgress={false}
      className={className}
    >
      <div className="flex h-full flex-col bg-[#090e17] text-white font-sans overflow-hidden select-none">
        {/* App Bar with Gradient */}
        <div className="shrink-0 px-3.5 pt-9 pb-3 bg-gradient-to-r from-[#1b85f3] to-[#0a52bd] shadow-md">
          <div className="flex items-center gap-3">
            <FiX className="text-lg text-white font-bold cursor-pointer" />
            <p className="text-[14px] font-extrabold tracking-tight text-white">{t('Add Note')}</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 space-y-3.5 p-3.5 overflow-y-auto bg-[#090e17]">
          {/* Main Card */}
          <div className="rounded-2xl border border-white/10 bg-[#141d2e] p-3.5 shadow-xl">
            {/* Title Section */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400">{t('Title')}</label>
              <div className="mt-1 text-[13px] font-bold text-slate-300">
                {t('Enter note title')}
              </div>
            </div>

            <div className="my-3 h-[1px] w-full bg-white/10" />

            {/* Content Section */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400">{t('Content')}</label>
              <div className="mt-1 text-[12px] font-medium text-slate-400 min-h-[90px] leading-relaxed">
                {t('Write your note...')}
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 px-2 text-slate-400 text-sm">
              <span className="font-bold text-[12px] tracking-tighter">Tᴛ</span>
              <FiList className="text-base" />
              <FiCheckSquare className="text-base" />
              <FiImage className="text-base" />
              <FiMic className="text-base" />
            </div>
          </div>

          {/* Pin note Option Row */}
          <div className="flex items-center justify-between py-1 px-1">
            <div>
              <p className="text-[12px] font-extrabold text-white">{t('Pin note')}</p>
              <p className="text-[9.5px] font-medium text-slate-400">{t('Keep this note at the top')}</p>
            </div>

            {/* Toggle Switch */}
            <div className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-300 flex items-center ${isPinned ? 'bg-[#1b85f3] justify-end' : 'bg-slate-700 justify-start'}`}>
              <motion.div layout className="h-5 w-5 rounded-full bg-white shadow-md" />
            </div>
          </div>

          {/* Mark as Task Option Box */}
          <div className={`rounded-2xl border-2 p-3 transition-colors duration-300 flex items-center justify-between ${isTask ? 'border-[#f39c12] bg-[#1d170e]' : 'border-[#e67e22]/80 bg-[#191510]'}`}>
            <div className="flex items-start gap-2.5">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-[#e67e22]/20 text-[#f39c12] text-sm">
                <FiClipboard />
              </div>
              <div>
                <p className="text-[12px] font-extrabold text-[#f39c12]">{t('Mark as Task')}</p>
                <p className="text-[9px] font-medium leading-tight text-slate-300/80 mt-0.5">
                  {t('Tasks have special visual badges in your notes.')}
                </p>
              </div>
            </div>

            {/* Checkbox */}
            <div className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${isTask ? 'border-[#f39c12] bg-[#f39c12] text-slate-950' : 'border-slate-400 bg-transparent'}`}>
              {isTask && <FiCheck className="text-xs font-black" />}
            </div>
          </div>
        </div>
      </div>
    </AppPhoneFrame>
  )
}
