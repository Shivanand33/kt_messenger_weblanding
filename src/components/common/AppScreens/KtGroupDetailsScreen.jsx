import { motion } from 'framer-motion'
import {
  FiArrowLeft,
  FiMoreVertical,
  FiChevronRight,
  FiUserPlus,
  FiShield,
  FiCheck,
  FiImage
} from 'react-icons/fi'
import { AppPhoneFrame } from './AppPhoneFrame'
import { useLoopClock } from './useLoopClock'
import avatarMale from '../../../assets/images/avatar_male_1.png'
import privateImg from '../../../assets/images/private.jpg'
import groupImg from '../../../assets/images/group.jpg'

export function KtGroupDetailsScreen({ className = '' }) {
  const { progress, isPlaying, togglePlay, restart } = useLoopClock({ durationMs: 15000 })

  return (
    <AppPhoneFrame
      title="KT Messenger Group Info &amp; Members"
      progress={progress}
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onRestart={restart}
      statusTone="dark"
      time="12:19"
      className={className}
    >
      <div className="flex h-full flex-col bg-[#0b141a] text-white font-sans overflow-hidden select-none">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3 pt-8 pb-2 text-slate-300 z-10 shrink-0">
          <FiArrowLeft className="text-lg cursor-pointer hover:text-white" />
          <FiMoreVertical className="text-lg cursor-pointer hover:text-white" />
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-4 pb-4">
          {/* Group Profile Card */}
          <div className="text-center pt-2 pb-1 space-y-2">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#059669] text-white text-2xl font-bold mx-auto shadow-lg border-2 border-emerald-400/30">
              KD
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">kt messenger discussion</h3>
              <p className="text-[11px] text-slate-400 font-medium">Group • 18 members</p>
            </div>
            <p className="text-[11px] text-slate-300 max-w-[240px] mx-auto leading-tight bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
              Use the application and share the issues over here
            </p>
          </div>

          {/* Media, links, and docs Card */}
          <div className="rounded-2xl bg-[#111b21] p-3 border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between pb-2.5 text-xs">
              <span className="font-bold text-slate-200">Media, links, and docs</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                3 <FiChevronRight />
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <div className="h-16 w-20 shrink-0 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 relative">
                <img src={privateImg} alt="Media" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 text-[8px] bg-black/70 px-1 py-0.2 rounded font-mono text-white">Voice call</span>
              </div>
              <div className="h-16 w-20 shrink-0 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 relative">
                <img src={groupImg} alt="Media" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 text-[8px] bg-sky-600/90 px-1 py-0.2 rounded font-mono text-white">Check notif</span>
              </div>
              <div className="h-16 w-20 shrink-0 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 relative p-1">
                <div className="h-full w-full rounded-lg bg-slate-800 p-1 flex flex-col justify-between text-[7px] text-slate-300">
                  <div className="font-bold text-sky-400">Invite via QR</div>
                  <div className="text-[6px] text-slate-400">Tap to share</div>
                </div>
              </div>
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <FiChevronRight className="text-xs" />
              </div>
            </div>
          </div>

          {/* Members Header */}
          <div className="pt-1">
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">18 MEMBERS</span>
              <span className="text-[11px] font-bold text-sky-400 cursor-pointer hover:underline">See all</span>
            </div>

            {/* Member List */}
            <div className="rounded-2xl bg-[#111b21] border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden shadow-md">
              {/* Add members */}
              <div className="flex items-center justify-between p-2.5 hover:bg-slate-800/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white shadow">
                    <FiUserPlus className="text-sm" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">Add members</h5>
                    <p className="text-[10px] text-slate-400">Add contacts from your phone</p>
                  </div>
                </div>
                <FiChevronRight className="text-slate-500 text-xs" />
              </div>

              {/* You */}
              <div className="flex items-center justify-between p-2.5 hover:bg-slate-800/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src={avatarMale} alt="You" className="h-9 w-9 rounded-full object-cover border border-slate-700" />
                  <div>
                    <h5 className="font-bold text-xs text-white">You</h5>
                    <p className="text-[10px] text-sky-400 font-semibold">Add member tag</p>
                  </div>
                </div>
                <FiChevronRight className="text-slate-500 text-xs" />
              </div>

              {/* Farhan Bhai (Admin) */}
              <div className="flex items-center justify-between p-2.5 hover:bg-slate-800/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-white font-extrabold text-xs shadow">
                    FB
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-xs text-white">Farhan Bhai</h5>
                      <span className="rounded bg-sky-500/20 px-1.5 py-0.2 text-[9px] font-bold text-sky-400 border border-sky-500/30">Admin</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Group admin</p>
                  </div>
                </div>
              </div>

              {/* Irfan Bhai (Omre) */}
              <div className="flex items-center justify-between p-2.5 hover:bg-slate-800/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow">
                    IO
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">Irfan Bhai (Omre)</h5>
                    <p className="text-[10px] text-slate-400">Tap for options</p>
                  </div>
                </div>
              </div>

              {/* Saad Bhati */}
              <div className="flex items-center justify-between p-2.5 hover:bg-slate-800/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-600 text-white font-extrabold text-xs shadow">
                    SB
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">Saad Bhati</h5>
                    <p className="text-[10px] text-slate-400">Active recently</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppPhoneFrame>
  )
}
