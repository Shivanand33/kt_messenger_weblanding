import { FiSearch, FiVideo, FiPhone, FiMoreVertical, FiPhoneOff, FiCheck, FiPlus } from 'react-icons/fi'
import { Logo } from '../common/Logo/Logo'
import photoMessage from '../../assets/images/group.jpg'
import nadiaAvatar from '../../assets/images/nadia_avatar.png'
import female1Avatar from '../../assets/images/avatar_female_1.png'
import male1Avatar from '../../assets/images/avatar_male_1.png'
import privateAvatar from '../../assets/images/private.jpg'
import businessAvatar from '../../assets/images/business.jpg'
import groupAvatar from '../../assets/images/group.jpg'

const chats = [
  { name: 'Maya Kusuma', msg: 'Yes, that is my favourite too!', time: 'Yesterday', avatar: female1Avatar },
  { name: 'Ayesha', msg: 'Deal, can’t wait!', time: '14:15', avatar: nadiaAvatar, active: true },
  { name: 'Dario', msg: 'Honestly this sourdough…', time: '13:54', avatar: male1Avatar },
  { name: 'Anika Chavan', msg: 'Are you coming today?', time: '12:16', avatar: privateAvatar },
  { name: 'Design Crew', msg: '@Chris R joining us?', time: '10:34', avatar: groupAvatar },
]

/** A desktop chat app window with a floating incoming call. */
export function DesktopAppMockup({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-line bg-cream-2 px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-2 flex items-center gap-1.5">
            <Logo showWordmark={false} markClassName="h-5 w-5 rounded-[7px]" />
            <span className="text-xs font-semibold text-ink">KT Messengers</span>
          </div>
        </div>

        <div className="flex h-[340px] sm:h-[392px]">
          {/* chat list */}
          <div className="flex w-[45%] flex-col border-r border-line bg-surface">
            <div className="p-2.5">
              <div className="flex items-center gap-2 rounded-full bg-cream px-3 py-2 text-[11px] text-muted">
                <FiSearch className="text-sm" /> Search
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {chats.map((chat) => (
                <div
                  key={chat.name}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 ${chat.active ? 'bg-brand-soft' : ''}`}
                >
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="h-9 w-9 shrink-0 rounded-full object-cover border border-stone-200 shadow-xs"
                  />
                  <div className="min-w-0 flex-1 border-b border-line/60 pb-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[12px] font-semibold text-ink">{chat.name}</p>
                      <span className="shrink-0 text-[9px] text-muted">{chat.time}</span>
                    </div>
                    <p className="truncate text-[11px] text-muted">{chat.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* conversation */}
          <div className="flex flex-1 flex-col bg-cream-2">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <div className="flex items-center gap-2">
                <img
                  src={nadiaAvatar}
                  alt="Ayesha"
                  className="h-8 w-8 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <p className="text-[12px] font-semibold text-ink">Ayesha</p>
                  <p className="text-[9px] text-brand-ink">online</p>
                </div>
              </div>
              <div className="flex gap-3 text-muted">
                <FiVideo className="text-sm" />
                <FiPhone className="text-sm" />
                <FiMoreVertical className="text-sm" />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-3">
              <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-surface px-3 py-2 text-[11px] text-ink shadow-soft">
                Hey, any plans for Saturday?
              </div>
              <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-surface px-3 py-2 text-[11px] text-ink shadow-soft">
                We could all get together at the park.
              </div>
              <div className="ml-auto max-w-[70%] overflow-hidden rounded-2xl rounded-tr-sm shadow-soft">
                <img src={photoMessage} alt="" className="h-24 w-full object-cover" />
              </div>
              <div className="ml-auto flex max-w-[78%] items-center gap-1 rounded-2xl rounded-tr-sm bg-[#dbeafe] px-3 py-2 text-[11px] text-ink dark:bg-[#1e3a63] dark:text-white">
                Sounds amazing!
                <FiCheck className="text-[10px] text-brand-ink dark:text-brand" />
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-line p-2">
              <FiPlus className="text-muted" />
              <div className="flex-1 rounded-full bg-surface px-3 py-2 text-[11px] text-muted">Type a message</div>
            </div>
          </div>
        </div>
      </div>

      {/* floating incoming call */}
      <div className="absolute -right-3 top-16 hidden w-44 rounded-2xl bg-[#0b1220] p-3 text-white shadow-float sm:block border border-stone-800">
        <div className="flex items-center gap-2 mb-2">
          <img src={businessAvatar} alt="Pablo Morales" className="h-7 w-7 rounded-full object-cover border border-white/20" />
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">Pablo Morales</p>
            <p className="text-[9px] text-white/60 truncate">KT video call</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f0324b] text-white">
            <FiPhoneOff className="text-xs" />
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1570ef] text-white">
            <FiVideo className="text-xs" />
          </span>
        </div>
      </div>
    </div>
  )
}
