import { useState } from 'react'
import { FiSearch, FiMoreVertical, FiFilter, FiGlobe, FiCheck } from 'react-icons/fi'
import familyAvatar from '../../assets/images/group.jpg'
import mumAvatar from '../../assets/images/private.jpg'
import mosheAvatar from '../../assets/images/business.jpg'

function PinIcon({ className = 'h-3 w-3 text-emerald-600' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182a.5.5 0 0 1-.707-.707l3.182-3.182L.49 7.343a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.92 2.92 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
    </svg>
  )
}

export function OrganizeMockup({ activeTab = 0, className = '' }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const chats = [
    {
      name: 'The best family 👪',
      msg: 'Moshe: 📷 Good morning!',
      time: '12:01',
      unread: 3,
      avatar: familyAvatar,
      isGroup: true,
      pinned: true,
    },
    {
      name: 'Mum ❤️',
      msg: 'See you soon!',
      time: '11:05',
      unread: 0,
      avatar: mumAvatar,
      isGroup: false,
      pinned: true,
    },
    {
      name: 'Moshe',
      msg: 'Where are you?',
      time: '1:59',
      unread: 1,
      avatar: mosheAvatar,
      isGroup: false,
      pinned: false,
    },
  ]

  const filteredChats = chats.filter((c) => {
    if (activeFilter === 'Unread') return c.unread > 0
    if (activeFilter === 'Groups') return c.isGroup
    return true
  })

  return (
    <div className={`relative mx-auto w-[275px] sm:w-[305px] select-none ${className}`}>
      {/* Phone Shell */}
      <div className="rounded-[44px] bg-stone-900 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-4 border-stone-800">
        <div className="relative aspect-[9/18.5] w-full overflow-hidden rounded-[34px] bg-white flex flex-col">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold text-stone-800">
            <span>12:30</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>5G</span>
            </div>
          </div>

          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="text-xl font-bold tracking-tight text-emerald-600">WhatsApp</h2>
            <div className="flex items-center gap-3 text-stone-700 text-base">
              <FiSearch className="cursor-pointer hover:text-emerald-600" />
              <FiMoreVertical className="cursor-pointer hover:text-emerald-600" />
              <img src={mumAvatar} alt="" className="h-6 w-6 rounded-full object-cover" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-1.5">
            <div className="flex items-center gap-2 rounded-full bg-stone-100 px-3.5 py-1.5 text-[11px] text-stone-500">
              <FiSearch className="text-xs text-stone-400" />
              <span>Ask KT AI or Search</span>
            </div>
          </div>

          {/* TAB CONTENT 0: INBOX FILTERS */}
          {activeTab === 0 && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Filter Pills Bar */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-stone-100 overflow-x-auto [scrollbar-width:none]">
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-600 shrink-0">
                  <FiFilter className="text-xs" />
                </button>
                {['All', 'Unread 12', 'Archived 2', 'Groups'].map((filter) => {
                  const key = filter.split(' ')[0]
                  const isActive = activeFilter === key
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(key)}
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium transition-colors shrink-0 ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 font-semibold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {filter}
                    </button>
                  )
                })}
              </div>

              {/* Chat List */}
              <div className="flex-1 divide-y divide-stone-100 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.name}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                  >
                    <img src={chat.avatar} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-stone-900 truncate">
                          {chat.name}
                        </span>
                        <span
                          className={`text-[10px] ${
                            chat.unread ? 'text-emerald-600 font-semibold' : 'text-stone-400'
                          }`}
                        >
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-[11px] text-stone-500 truncate">{chat.msg}</p>
                        {chat.unread > 0 && (
                          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[9.5px] font-bold text-white shrink-0 ml-1">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT 1: PINNED MESSAGES */}
          {activeTab === 1 && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase tracking-wider px-1">
                <PinIcon className="h-3 w-3 text-emerald-600" /> Pinned Chats
              </div>
              {chats.map((chat) => (
                <div
                  key={chat.name}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100"
                >
                  <img src={chat.avatar} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-stone-900 truncate">
                        {chat.name}
                      </span>
                      <PinIcon className="h-3 w-3 text-emerald-600 rotate-45 shrink-0" />
                    </div>
                    <p className="text-[10.5px] text-stone-500 truncate">{chat.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB CONTENT 2: FORMATTING */}
          {activeTab === 2 && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-stone-50">
              <div className="rounded-xl bg-white p-2.5 shadow-sm text-[11px] text-stone-800">
                <span className="font-bold text-emerald-700">Bold:</span> *Make text bold*
              </div>
              <div className="rounded-xl bg-white p-2.5 shadow-sm text-[11px] text-stone-800">
                <span className="italic text-emerald-700">Italics:</span> _Add smooth italic style_
              </div>
              <div className="rounded-xl bg-white p-2.5 shadow-sm text-[11px] text-stone-800">
                <span className="line-through text-stone-400">Strikethrough:</span> ~Cross out text~
              </div>
              <div className="rounded-xl bg-[#0d1418] p-2.5 text-[10.5px] font-mono text-emerald-400">
                ```Mono-space code```
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: IN-CHAT TRANSLATION */}
          {activeTab === 3 && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#efeae2]">
              <div className="max-w-[85%] rounded-xl rounded-tl-xs bg-white p-2.5 shadow-sm">
                <p className="text-[11.5px] text-stone-800">Bonjour! Comment allez-vous aujourd&apos;hui?</p>
                <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 p-1.5 text-[10.5px] text-emerald-800 border border-emerald-100">
                  <FiGlobe className="text-emerald-600 text-xs shrink-0" />
                  <span>Translated from French: Hello! How are you today?</span>
                </div>
                <div className="mt-1 flex justify-end text-[9px] text-stone-400">11:05</div>
              </div>
              <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-xs bg-[#d9fdd3] p-2.5 shadow-sm">
                <p className="text-[11.5px] text-stone-800">Je vais très bien, merci!</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-stone-500">
                  <span>11:06</span>
                  <FiCheck className="text-emerald-600 text-xs" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
