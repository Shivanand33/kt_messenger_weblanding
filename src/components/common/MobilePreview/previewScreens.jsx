import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  FiArchive,
  FiArrowDownLeft,
  FiArrowLeft,
  FiArrowUpRight,
  FiBell,
  FiBookmark,
  FiCalendar,
  FiCamera,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiCheck,
  FiEdit2,
  FiEye,
  FiFile,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiHeart,
  FiInfo,
  FiKey,
  FiList,
  FiLock,
  FiMapPin,
  FiMessageCircle,
  FiMic,
  FiMinimize2,
  FiMoreHorizontal,
  FiMoreVertical,
  FiPaperclip,
  FiPhone,
  FiPlus,
  FiRepeat,
  FiRotateCw,
  FiSearch,
  FiShare2,
  FiShield,
  FiShoppingBag,
  FiShuffle,
  FiSlash,
  FiSmartphone,
  FiSmile,
  FiSquare,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
  FiUpload,
  FiUser,
  FiUsers,
  FiVolume2,
  FiX,
} from 'react-icons/fi'
import { BsCameraVideoFill, BsFillPlayFill, BsTelephoneFill, BsThreeDots, BsHandThumbsUp } from 'react-icons/bs'
import { MdCallEnd, MdOutlineScreenShare } from 'react-icons/md'
import { IoSparkles } from 'react-icons/io5'
import { img, imgAltOnly } from '../../../utils/imageOverrides'
import { useLanguage } from '../../../context/LanguageContext'
import { usePreviewNav } from './previewNav'
import {
  AvatarArt,
  FACIAL_HAIR,
  HAIR_COLOURS,
  HAIR_STYLES,
  HairGlyph,
  setAvatar,
  shuffleAvatar,
  useAvatarConfig,
} from './previewAvatar'
import {
  Avatar,
  Badge,
  BLUE,
  BackHeader,
  Group,
  Item,
  RadioRow,
  ScreenTitle,
  SearchField,
  SettingsRow,
  Stagger,
  Switch,
  TabBar,
  Tap,
  useCallTimer,
  useTick,
} from './previewParts'
import {
  CALLER,
  CALLS,
  CHANNELS,
  CHATS,
  LANGUAGES,
  ME,
  MINI,
  NEWS_RECENT,
  NEWS_TRENDING,
  PHOTOS,
  STATUSES,
  STATUS_POST,
} from './previewData'

/**
 * The eighteen app surfaces the hero prototype cycles through.
 *
 * Each one is drawn in markup rather than shown as a screenshot: that keeps it
 * crisp at any size, lets the rows animate in, lets the whole app repaint for
 * dark mode from one set of variables, and — the reason it matters most here —
 * means every name and number on screen is the invented cast from previewData,
 * not anyone's real contacts.
 *
 * Colours come from the `--p-*` tokens the device frame sets (see previewTheme),
 * so nothing below hard-codes a grey. Only the brand blue and the vivid icon
 * tiles are fixed, because they read correctly on either skin.
 */

/* ----------------------------------------------------------------- helpers */

/** Faint patterned chat wallpaper, standing in for the app's doodle sheet. */
const DOODLE = {
  backgroundColor: 'var(--p-doodle)',
  backgroundImage:
    'radial-gradient(circle at 18% 22%, var(--p-doodle-ink) 0 2.5px, transparent 2.6px),' +
    'radial-gradient(circle at 72% 58%, var(--p-doodle-ink) 0 3.5px, transparent 3.6px),' +
    'radial-gradient(circle at 44% 82%, var(--p-doodle-ink) 0 2px, transparent 2.1px)',
  backgroundSize: '58px 58px, 82px 82px, 70px 70px',
}

/**
 * Country marker for the language list. Flag emoji are deliberately avoided:
 * Windows ships no regional-indicator glyphs, so they fall back to bare letters
 * there. A small code tile reads the same on every platform.
 */
function CountryTile({ code }) {
  return (
    <span className="grid h-[22px] w-[26px] shrink-0 place-items-center rounded-[4px] bg-[var(--p-surface2)] text-[8.5px] font-bold tracking-wide text-[var(--p-text2)]">
      {code}
    </span>
  )
}

/** Filled check when chosen, empty ring otherwise. */
function RadioDot({ on }) {
  return on ? (
    <span
      className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full text-[11px] text-white"
      style={{ background: BLUE }}
    >
      <FiCheck />
    </span>
  ) : (
    <span className="h-[18px] w-[18px] shrink-0 rounded-full border-2 border-[var(--p-border)]" />
  )
}

/** Shell every list screen shares: app page that scrolls under the tab bar. */
function Page({ bg = 'var(--p-bg)', children, className = '' }) {
  return (
    <div style={{ background: bg }} className={`flex h-full flex-col ${className}`}>
      {children}
    </div>
  )
}

/** Horizontal chip rail under a search field. */
function Chips({ items, active = 0 }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden px-4 pt-3">
      {items.map((chip, i) => (
        <span
          key={chip.label}
          className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-[5px] text-[11.5px] font-semibold ${
            i === active ? 'text-white' : 'bg-[var(--p-surface)] text-[var(--p-text-mid)]'
          }`}
          style={i === active ? { background: BLUE } : undefined}
        >
          {chip.icon}
          {chip.label}
          {chip.count ? <span className="opacity-70">{chip.count}</span> : null}
        </span>
      ))}
    </div>
  )
}

/** Round floating action button; `to` makes it navigate. */
function Fab({ children, to, label, className = '', tone = BLUE, size = 42, halo = false }) {
  const { goTo } = usePreviewNav()
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => to && goTo(to)}
      className={`relative grid shrink-0 cursor-pointer place-items-center rounded-full text-white shadow-[0_6px_16px_-4px_rgba(10,124,255,0.6)] transition-transform active:scale-90 ${className}`}
      style={{ background: tone, width: size, height: size }}
    >
      {halo ? (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: tone }}
          animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  )
}

/** Three bouncing dots — the app's "typing…" indicator. */
function TypingDots({ color = 'var(--p-text2)' }) {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-[4px] w-[4px] rounded-full"
          style={{ background: color }}
          animate={{ y: [0, -3, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------- CHATS */

function ChatsScreen() {
  const { t } = useLanguage()
  // The top thread alternates between its last message and a live "typing…",
  // which is the cheapest way to make a static list feel like a running app.
  const typing = useTick(2600, 2) === 1

  return (
    <Page>
      <ScreenTitle
        title="KT Messenger"
        right={
          <>
            <FiCamera />
            <FiSquare />
            <FiMoreVertical />
          </>
        }
      />
      <SearchField placeholder={t('Ask KT AI or Search')} to="search" />
      <Chips
        items={[
          { label: t('All') },
          { label: t('Notes') },
          { label: t('Unread'), count: 21 },
          { label: t('Groups'), count: 11 },
          { label: t('Communities') },
        ]}
      />

      <Stagger className="mt-2 flex-1 overflow-hidden">
        <Item>
          <Tap to="appLock" label={t('Locked chats')} className="flex items-center gap-3 px-4 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--p-surface2)] text-[var(--p-text2)]">
              <FiLock className="text-[14px]" />
            </span>
            <p className="flex-1 text-[14px] font-semibold text-[var(--p-text)]">{t('Locked chats')}</p>
            <span className="text-[12px] font-semibold" style={{ color: BLUE }}>
              1
            </span>
          </Tap>
        </Item>

        {CHATS.map((c, i) => (
          <Item key={c.id}>
            <Tap to="thread" label={c.name} className="flex items-center gap-3 px-4">
              <Avatar src={c.avatar} initials={c.initials} tone={c.tone} group={c.group} size={42} />
              <div className="flex min-w-0 flex-1 items-start gap-2 border-b border-[var(--p-line)] py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold leading-tight text-[var(--p-text)]">{c.name}</p>
                  {i === 0 && typing ? (
                    <p
                      className="flex items-center gap-1.5 pt-[4px] text-[11.5px] font-semibold leading-tight"
                      style={{ color: BLUE }}
                    >
                      <TypingDots color={BLUE} /> {t('typing…')}
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 truncate pt-[3px] text-[11.5px] leading-tight text-[var(--p-text2)]">
                      {c.doc ? <FiFile className="shrink-0 text-[10px]" /> : null}
                      {c.missed ? <BsCameraVideoFill className="shrink-0 text-[10px] text-[#ef4444]" /> : null}
                      <span className="truncate">{c.preview}</span>
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 pt-[1px]">
                  <span className="text-[10.5px] font-medium" style={{ color: c.unread ? BLUE : 'var(--p-text2)' }}>
                    {c.time}
                  </span>
                  {c.unread ? <Badge value={c.unread} pulse={i === 0} /> : null}
                </div>
              </div>
            </Tap>
          </Item>
        ))}
      </Stagger>

      {/* Compose stack */}
      <div className="absolute bottom-[82px] right-4 z-20 flex flex-col items-end gap-2">
        <Fab
          size={34}
          tone="var(--p-surface)"
          to="search"
          label={t('Ask KT AI')}
          className="shadow-[0_6px_16px_-6px_rgba(2,6,23,0.4)]"
        >
          <IoSparkles className="text-[14px]" style={{ color: BLUE }} />
        </Fab>
        <Fab to="thread" label={t('New chat')}>
          <FiMessageCircle className="text-[18px]" />
        </Fab>
      </div>

      <TabBar active="chats" />
    </Page>
  )
}

/* ------------------------------------------------------------------ SEARCH */

const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

function SearchScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()
  // Letters land in the field one at a time, so the screen looks like someone
  // is actually typing a query rather than sitting on a placeholder.
  const typed = 'Design'
  const caret = useTick(380, typed.length + 6)
  const query = typed.slice(0, Math.min(caret, typed.length))
  const lastKey = query.slice(-1).toUpperCase()

  const recents = [
    { label: 'Noah', initials: 'N', tone: 'violet' },
    { label: 'Design Crew', group: true },
    { label: 'Emma', initials: 'E', tone: 'orange' },
    { label: 'Olivia Bennett', avatar: CALLER.avatar },
  ]

  return (
    <Page>
      <ScreenTitle
        title="KT Messenger"
        right={
          <>
            <FiCamera />
            <FiSquare />
            <FiMoreVertical />
          </>
        }
      />

      <div className="mx-4 flex items-center gap-2.5 rounded-full bg-[var(--p-surface)] px-3.5 py-2.5 shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
        <FiSearch className="shrink-0 text-[15px] text-[var(--p-text2)]" />
        <span className="flex-1 truncate text-[13px] text-[var(--p-text)]">
          {query || <span className="text-[var(--p-text2)]">{t('Ask KT AI or Search')}</span>}
          <motion.span
            className="ml-[1px] inline-block h-[13px] w-[1.5px] translate-y-[2px] rounded-full"
            style={{ background: BLUE }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
        </span>
        <button
          type="button"
          aria-label={t('Clear search')}
          onClick={() => goTo('chats')}
          className="shrink-0 cursor-pointer text-[15px] text-[var(--p-text2)] transition-opacity active:opacity-50"
        >
          <FiX />
        </button>
      </div>

      <div className="flex items-center justify-between px-4 pt-4 text-[10.5px] font-semibold text-[var(--p-text-mid)]">
        {[
          { icon: <FiUser />, label: t('Contacts') },
          { icon: <FiGrid />, label: t('GIFs') },
          { icon: <FiList />, label: t('Polls') },
          { icon: <FiSmile />, label: t('Stickers') },
        ].map((chip) => (
          <span key={chip.label} className="flex items-center gap-1">
            <span className="text-[12px] text-[var(--p-text2)]">{chip.icon}</span>
            {chip.label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <p className="text-[15px] font-bold text-[var(--p-text)]">{t('Recent searches')}</p>
        <span
          className="rounded-full border px-3 py-[3px] text-[11px] font-semibold"
          style={{ color: BLUE, borderColor: BLUE }}
        >
          {t('Clear all')}
        </span>
      </div>

      <Stagger className="flex justify-between px-5 pt-1">
        {recents.map((r) => (
          <Item key={r.label} className="w-[21%]">
            <Tap to="thread" label={r.label} className="flex flex-col items-center gap-1.5 rounded-xl p-1">
              <Avatar src={r.avatar} initials={r.initials} tone={r.tone} group={r.group} size={48} />
              <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-[var(--p-text-mid)]">
                {r.label}
              </span>
            </Tap>
          </Item>
        ))}
      </Stagger>

      {/* Keyboard. The key matching the latest letter lights up as it lands. */}
      <div className="mt-auto bg-[var(--p-keybg)] px-1 pb-5 pt-2">
        {KEY_ROWS.map((row, i) => (
          <div key={i} className={`flex justify-center gap-[4px] pb-[6px] ${i === 1 ? 'px-[14px]' : ''}`}>
            {i === 2 ? (
              <span className="grid h-[30px] w-[32px] place-items-center rounded-[5px] bg-[var(--p-keyalt)] text-[12px] text-[var(--p-text)]">
                <FiChevronUp />
              </span>
            ) : null}
            {row.map((k) => {
              const hit = query.length > 0 && lastKey === k
              return (
                <motion.span
                  key={k}
                  animate={{ scale: hit ? 0.9 : 1 }}
                  transition={{ duration: 0.18 }}
                  className="grid h-[30px] flex-1 place-items-center rounded-[5px] text-[13px] font-medium shadow-[0_1px_0_rgba(2,6,23,0.25)]"
                  style={{
                    background: hit ? BLUE : 'var(--p-key)',
                    color: hit ? '#ffffff' : 'var(--p-text)',
                  }}
                >
                  {k}
                </motion.span>
              )
            })}
            {i === 2 ? (
              <span className="grid h-[30px] w-[32px] place-items-center rounded-[5px] bg-[var(--p-keyalt)] text-[12px] text-[var(--p-text)]">
                <FiX />
              </span>
            ) : null}
          </div>
        ))}
        <div className="flex items-center gap-[4px] px-[2px]">
          <span className="grid h-[30px] w-[34px] place-items-center rounded-[5px] bg-[var(--p-keyalt)] text-[11px] font-semibold text-[var(--p-text)]">
            123
          </span>
          <span className="grid h-[30px] w-[30px] place-items-center rounded-[5px] bg-[var(--p-keyalt)] text-[13px] text-[var(--p-text)]">
            <FiSmile />
          </span>
          <span className="h-[30px] flex-1 rounded-[5px] bg-[var(--p-key)] shadow-[0_1px_0_rgba(2,6,23,0.25)]" />
          <button
            type="button"
            aria-label={t('Search')}
            onClick={() => goTo('thread')}
            className="grid h-[30px] w-[44px] cursor-pointer place-items-center rounded-[5px] text-[13px] text-white transition-transform active:scale-90"
            style={{ background: BLUE }}
          >
            <FiSearch />
          </button>
        </div>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ THREAD */

function ThreadScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()
  // Read receipts flip to blue on a slow cycle, and the other side drops in and
  // out of "typing…" — the two signals that make a chat feel in progress.
  const beat = useTick(2800, 2)
  const read = beat === 1

  return (
    <div className="flex h-full flex-col" style={DOODLE}>
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2.5 bg-[var(--p-bg2)]/95 px-3 pb-2.5 pt-12 backdrop-blur">
        <button
          type="button"
          aria-label={t('Back to chats')}
          onClick={() => goTo('chats')}
          className="shrink-0 cursor-pointer text-[18px] text-[var(--p-text)] transition-opacity active:opacity-50"
        >
          <FiArrowLeft />
        </button>
        <Avatar src={CALLER.avatar} size={34} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold leading-tight text-[var(--p-text)]">{CALLER.name}</p>
          <p className="truncate text-[10.5px] leading-tight" style={{ color: BLUE }}>
            {t('Online')}
          </p>
        </div>
        <button
          type="button"
          aria-label={t('Video call')}
          onClick={() => goTo('videoCall')}
          className="shrink-0 cursor-pointer text-[15px] text-[var(--p-text)] transition-transform active:scale-90"
        >
          <BsCameraVideoFill />
        </button>
        <button
          type="button"
          aria-label={t('Voice call')}
          onClick={() => goTo('voiceCall')}
          className="shrink-0 cursor-pointer text-[14px] text-[var(--p-text)] transition-transform active:scale-90"
        >
          <BsTelephoneFill />
        </button>
        <FiMoreVertical className="shrink-0 text-[16px] text-[var(--p-text)]" />
      </div>

      <Stagger className="flex flex-1 flex-col justify-end gap-2 overflow-hidden px-3 pb-2">
        <Item className="flex justify-start">
          <div className="max-w-[78%] rounded-2xl rounded-tl-md bg-[var(--p-surface)] px-3 py-2 shadow-[0_1px_2px_rgba(2,6,23,0.08)]">
            <p className="text-[12.5px] leading-snug text-[var(--p-text)]">
              {t('Morning! Are we still on for the review?')}
            </p>
            <p className="pt-[2px] text-right text-[9px] text-[var(--p-text4)]">1:12 pm</p>
          </div>
        </Item>

        <Item className="flex justify-center">
          <span className="rounded-full bg-[var(--p-surface)]/80 px-2.5 py-[3px] text-[9px] font-semibold uppercase tracking-wider text-[var(--p-text2)]">
            {t('Yesterday')}
          </span>
        </Item>

        <Item className="flex justify-start">
          <Tap
            to="voiceCall"
            label={t('Voice call')}
            className="flex max-w-[78%] items-center gap-2.5 rounded-2xl rounded-tl-md bg-[var(--p-surface)] px-3 py-2 shadow-[0_1px_2px_rgba(2,6,23,0.08)]"
          >
            <FiArrowDownLeft className="shrink-0 text-[15px] text-[#ef4444]" />
            <div>
              <p className="text-[12.5px] font-semibold leading-tight text-[var(--p-text)]">{t('Voice call')}</p>
              <p className="pt-[1px] text-[10px] leading-tight text-[var(--p-text2)]">{t('Missed call')}</p>
            </div>
            <span className="pl-2 text-[9px] text-[var(--p-text4)]">11:56 am</span>
          </Tap>
        </Item>

        <Item className="flex justify-end">
          <div
            className="max-w-[78%] rounded-2xl rounded-tr-md px-3 py-2 shadow-[0_1px_2px_rgba(2,6,23,0.1)]"
            style={{ background: 'var(--p-bubble)' }}
          >
            <p className="text-[12.5px] leading-snug text-[var(--p-text)]">
              {t('Sorry, I missed it! Calling you right back.')}
            </p>
            <p className="flex items-center justify-end gap-1 pt-[2px] text-[9px] text-[var(--p-text2)]">
              12:06 pm
              <motion.span className="flex" animate={{ color: read ? BLUE : 'var(--p-text2)' }} transition={{ duration: 0.4 }}>
                <FiCheck />
                <FiCheck className="-ml-[5px]" />
              </motion.span>
            </p>
          </div>
        </Item>

        <Item className="flex justify-center">
          <span className="rounded-full bg-[var(--p-surface)]/80 px-2.5 py-[3px] text-[9px] font-semibold uppercase tracking-wider text-[var(--p-text2)]">
            {t('Today')}
          </span>
        </Item>

        <Item className="flex justify-end">
          <div className="w-[62%] overflow-hidden rounded-2xl rounded-tr-md bg-[var(--p-surface)] shadow-[0_2px_8px_rgba(2,6,23,0.12)]">
            <img
              src={img(PHOTOS.beach)}
              alt={imgAltOnly(PHOTOS.beach)}
              loading="lazy"
              className="h-[104px] w-full object-cover"
            />
            <p className="flex items-center justify-end gap-1 px-2 py-1 text-[9px] text-[var(--p-text2)]">
              4:44 pm
              <motion.span className="flex" animate={{ color: read ? BLUE : 'var(--p-text2)' }} transition={{ duration: 0.4 }}>
                <FiCheck />
                <FiCheck className="-ml-[5px]" />
              </motion.span>
            </p>
          </div>
        </Item>

        {/* The other side composing a reply */}
        <Item className="flex h-[32px] items-end justify-start">
          <AnimatePresence>
            {beat === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl rounded-bl-md bg-[var(--p-surface)] px-3 py-2.5 shadow-[0_1px_2px_rgba(2,6,23,0.08)]"
              >
                <TypingDots />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Item>
      </Stagger>

      {/* Composer */}
      <div className="flex shrink-0 items-center gap-2 px-3 pb-5 pt-1.5">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[var(--p-surface)] px-3 py-2 shadow-[0_1px_3px_rgba(2,6,23,0.1)]">
          <FiSmile className="shrink-0 text-[16px] text-[var(--p-text2)]" />
          <span className="flex-1 text-[12.5px] text-[var(--p-text2)]">{t('Message')}</span>
          <FiPaperclip className="shrink-0 text-[15px] text-[var(--p-text2)]" />
          <FiCamera className="shrink-0 text-[15px] text-[var(--p-text2)]" />
        </div>
        <Fab size={36} label={t('Record voice message')} halo>
          <FiMic className="text-[16px]" />
        </Fab>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- UPDATES */

function UpdatesScreen() {
  const { t } = useLanguage()
  return (
    <Page>
      <ScreenTitle
        title={t('Updates')}
        right={
          <>
            <FiBookmark />
            <FiPlus />
            <FiMoreVertical />
          </>
        }
      />
      <SearchField placeholder={t('Search updates...')} to="search" />

      {/* Status rail */}
      <Stagger className="flex gap-2 overflow-hidden px-4 pt-3">
        <Item>
          <Tap
            to="statusViewer"
            label={t('Add status')}
            className="relative h-[108px] w-[76px] shrink-0 overflow-hidden rounded-2xl bg-[var(--p-surface2)]"
          >
            <span className="grid h-full w-full place-items-center bg-[var(--p-surface2)]">
              <AvatarArt size={76} />
            </span>
            <motion.span
              className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-[var(--p-surface)]/90 text-[11px] text-[var(--p-text)]"
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FiPlus />
            </motion.span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-4 text-[9px] font-semibold text-white">
              {t('Add status')}
            </span>
          </Tap>
        </Item>

        {STATUSES.map((s, i) => (
          <Item key={s.id}>
            <Tap
              to="statusViewer"
              label={s.name}
              className="h-[108px] w-[76px] shrink-0 overflow-hidden rounded-2xl bg-[var(--p-surface)]"
            >
              <div className="relative h-[72px]">
                <img src={img(s.cover)} alt={imgAltOnly(s.cover)} loading="lazy" className="h-full w-full object-cover" />
                {/* Unseen-status ring, sweeping like the real one */}
                <motion.span
                  className="absolute -bottom-[13px] left-1/2 h-[28px] w-[28px] -translate-x-1/2 rounded-full"
                  style={{ background: `conic-gradient(${BLUE}, #22d3ee, ${BLUE})` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: 'linear' }}
                />
                <span className="absolute -bottom-[11px] left-1/2 -translate-x-1/2">
                  <Avatar src={s.avatar} initials={s.initials} tone={s.tone} size={24} ring />
                </span>
              </div>
              <div className="pt-[14px] text-center">
                <p className="truncate px-1 text-[9px] font-semibold leading-tight text-[var(--p-text)]">{s.name}</p>
                <p className="text-[8px] leading-tight text-[var(--p-text4)]">{s.time}</p>
              </div>
            </Tap>
          </Item>
        ))}
      </Stagger>

      <div className="flex items-center justify-between px-5 pb-1 pt-4">
        <p className="text-[15px] font-bold text-[var(--p-text)]">{t('Channels')}</p>
        <Tap
          to="createChannel"
          label={t('Explore')}
          className="rounded-full border px-3 py-[3px] text-[11px] font-semibold"
          style={{ borderColor: BLUE }}
        >
          <span style={{ color: BLUE }}>{t('Explore')}</span>
        </Tap>
      </div>

      <Stagger className="flex-1 overflow-hidden">
        {CHANNELS.map((c) => (
          <Item key={c.id}>
            <Tap to="statusViewer" label={c.name} className="flex items-center gap-3 px-4">
              <Avatar src={c.avatar} initials={c.initials} tone={c.tone} size={38} />
              <div className="flex min-w-0 flex-1 items-start gap-2 border-b border-[var(--p-line)] py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold leading-tight text-[var(--p-text)]">{c.name}</p>
                  <p className="flex items-center gap-1 truncate pt-[2px] text-[11px] leading-tight text-[var(--p-text2)]">
                    {c.kind === 'video' ? <BsCameraVideoFill className="shrink-0 text-[9px]" /> : null}
                    {c.kind === 'photo' ? <FiCamera className="shrink-0 text-[9px]" /> : null}
                    <span className="truncate">{c.preview}</span>
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[10px] font-medium" style={{ color: c.unread ? BLUE : 'var(--p-text2)' }}>
                    {c.time}
                  </span>
                  {c.unread ? <Badge value={c.unread} /> : null}
                </div>
              </div>
            </Tap>
          </Item>
        ))}
      </Stagger>

      <div className="absolute bottom-[82px] right-4 z-20 flex flex-col items-end gap-2">
        <Fab
          size={34}
          tone="var(--p-surface)"
          to="createChannel"
          label={t('Create channel')}
          className="shadow-[0_6px_16px_-6px_rgba(2,6,23,0.4)]"
        >
          <FiEdit2 className="text-[14px]" style={{ color: BLUE }} />
        </Fab>
        <Fab to="statusViewer" label={t('Add status')}>
          <FiCamera className="text-[17px]" />
        </Fab>
      </div>

      <TabBar active="updates" />
    </Page>
  )
}

/* -------------------------------------------------------------------- NEWS */

function NewsScreen() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  // The trending rail slides itself between the two cards, the way a carousel
  // advertises that there is more to the right.
  const slot = useTick(3400, 2)

  return (
    <Page>
      <ScreenTitle title={t('News')} right={<FiBookmark />} />
      <SearchField placeholder={t('Search news...')} to="search" />
      <Chips
        items={[
          { label: t('All') },
          { label: t('Finance') },
          { label: t('Video News'), icon: <BsFillPlayFill className="text-[11px]" /> },
          { label: t('World News') },
          { label: t('Politics') },
        ]}
      />

      <Stagger className="flex-1 overflow-hidden pt-3">
        <Item className="flex items-baseline justify-between px-5">
          <p className="text-[14px] font-bold text-[var(--p-text)]">{t('Good Afternoon')}</p>
          <p className="text-[9.5px] text-[var(--p-text4)]">7 Oct · 4:29 PM</p>
        </Item>

        <Item className="flex items-center justify-between px-5 pb-2 pt-2.5">
          <p className="text-[13px] font-bold text-[var(--p-text)]">{t('Trending')}</p>
          <span className="text-[11px] font-semibold" style={{ color: BLUE }}>
            {t('View All')}
          </span>
        </Item>

        <Item className="overflow-hidden px-5">
          <motion.div
            className="flex gap-2.5"
            animate={{ x: reduced ? 0 : slot * -108 }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
          >
            {NEWS_TRENDING.map((n) => (
              <Tap
                key={n.id}
                to="statusViewer"
                label={n.title}
                className="w-[64%] shrink-0 overflow-hidden rounded-xl bg-[var(--p-surface)]"
              >
                <img src={img(n.cover)} alt={imgAltOnly(n.cover)} loading="lazy" className="h-[82px] w-full object-cover" />
                <div className="p-2">
                  <p className="line-clamp-2 text-[11.5px] font-semibold leading-snug text-[var(--p-text)]">{n.title}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[9.5px] font-medium text-[var(--p-text2)]">{n.ago}</span>
                    <FiShare2 className="text-[11px] text-[var(--p-text2)]" />
                  </div>
                </div>
              </Tap>
            ))}
          </motion.div>
        </Item>

        <Item className="px-5 pb-1 pt-3.5">
          <p className="text-[13px] font-bold text-[var(--p-text)]">{t('Recent Stories')}</p>
        </Item>

        {NEWS_RECENT.map((n) => (
          <Item key={n.id}>
            <Tap to="statusViewer" label={n.title} className="flex items-center gap-2.5 px-5">
              <img
                src={img(n.cover)}
                alt={imgAltOnly(n.cover)}
                loading="lazy"
                className="h-[42px] w-[42px] shrink-0 rounded-lg object-cover"
              />
              <div className="flex min-w-0 flex-1 items-center gap-2 border-b border-[var(--p-line)] py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[11.5px] font-semibold leading-snug text-[var(--p-text)]">{n.title}</p>
                  <p className="truncate pt-[2px] text-[9.5px] text-[var(--p-text2)]">
                    {n.source} · {n.ago}
                  </p>
                </div>
                <FiShare2 className="shrink-0 text-[12px] text-[var(--p-text2)]" />
              </div>
            </Tap>
          </Item>
        ))}
      </Stagger>

      <TabBar active="news" />
    </Page>
  )
}

/* ------------------------------------------------------------------- MINIS */

/** Five bars bouncing at different rates — the clip's audio is running. */
function Equalizer() {
  return (
    <span className="flex h-[12px] items-center gap-[2px]">
      {[0.5, 0.9, 0.35, 0.75, 0.55].map((h, i) => (
        <motion.span
          key={i}
          className="h-[11px] w-[2px] origin-center rounded-full bg-white"
          animate={{ scaleY: [h, 1, h * 0.6, 1, h] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

function MinisScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(true)
  const [liked, setLiked] = useState(false)

  // Burned-in subtitles change as the clip runs and the like count climbs.
  // Together with the slow push-in they are what sell this still as footage.
  const line = useTick(2500, MINI.captions.length)
  const bump = useTick(1700, 60)
  const likes = MINI.likes + bump + (liked ? 1 : 0)
  const running = playing && !reduced

  return (
    <div className="relative h-full bg-black">
      <div className="absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4 pb-3 pt-12">
        <button
          type="button"
          aria-label={t('Back to chats')}
          onClick={() => goTo('chats')}
          className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white/15 text-[14px] text-white backdrop-blur transition-transform active:scale-90"
        >
          <FiArrowLeft />
        </button>
        <p className="flex-1 text-[16px] font-semibold text-white">{t('Minis')}</p>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 backdrop-blur">
          {running ? <Equalizer /> : <FiVolume2 className="text-[13px] text-white" />}
        </span>
      </div>

      {/* The clip. A slow push-in and drift is what a locked-off shot looks
          like in motion; pausing freezes it exactly where it is. */}
      <motion.div
        className="h-full w-full"
        animate={running ? { scale: [1, 1.14], x: [0, -10], y: [0, 6] } : {}}
        transition={{ duration: 11, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
      >
        <img src={img(MINI.cover)} alt={imgAltOnly(MINI.cover)} loading="lazy" className="h-full w-full object-cover" />
      </motion.div>

      {/* Tap target over the frame: tap to pause, tap again to resume. */}
      <button
        type="button"
        aria-label={running ? t('Pause') : t('Play')}
        onClick={() => setPlaying((p) => !p)}
        className="absolute inset-0 z-10 cursor-pointer"
      >
        <AnimatePresence>
          {!running ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.3 }}
              className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-[26px] text-white backdrop-blur"
            >
              <BsFillPlayFill />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>

      {/* Burned-in caption */}
      <div className="pointer-events-none absolute inset-x-8 top-[27%] z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={line}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="rounded-md bg-white px-3 py-2 text-center"
          >
            <p className="text-[12.5px] font-bold leading-snug text-[#0b0f14]">{t(MINI.captions[line])}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right action rail */}
      <Stagger className="absolute bottom-[26%] right-3 z-20 flex flex-col items-center gap-4 text-white">
        <Item>
          <button
            type="button"
            aria-label={t('Like')}
            onClick={() => setLiked((v) => !v)}
            className="flex cursor-pointer flex-col items-center gap-[3px] drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)] transition-transform active:scale-75"
          >
            <motion.span animate={liked ? { scale: [1, 1.45, 1] } : {}} transition={{ duration: 0.35 }}>
              <BsHandThumbsUp className="text-[20px]" style={{ color: liked ? BLUE : '#ffffff' }} />
            </motion.span>
            <span className="text-[9px] font-semibold tabular-nums">{(likes / 1000).toFixed(1)}k</span>
          </button>
        </Item>
        {[
          { icon: <FiMessageCircle className="text-[20px]" />, label: MINI.comments },
          { icon: <FiShare2 className="text-[20px]" />, label: '' },
          { icon: <FiBookmark className="text-[20px]" />, label: '' },
          { icon: <FiMoreVertical className="text-[20px]" />, label: '' },
        ].map((a, i) => (
          <Item key={i} className="flex flex-col items-center gap-[3px] drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]">
            {a.icon}
            {a.label ? <span className="text-[9px] font-semibold">{a.label}</span> : null}
          </Item>
        ))}
      </Stagger>

      {/* Creator strip */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 to-transparent px-4 pb-7 pt-10">
        <div className="flex items-center gap-2">
          <Avatar initials="M" tone="violet" size={26} />
          <span className="text-[12px] font-semibold text-white">{MINI.handle}</span>
          <span className="rounded-full border border-white/70 px-2.5 py-[2px] text-[10px] font-semibold text-white">
            {t('Follow')}
          </span>
        </div>
        <p className="pt-2 text-[11px] leading-snug text-white/90">{t(MINI.caption)}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- CALLS */

function CallsScreen() {
  const { t } = useLanguage()
  const quick = [
    { icon: <FiGrid />, label: t('Schedule'), tone: 'bg-[#2563eb]/15 text-[#2563eb]', to: 'createChannel' },
    { icon: <FiList />, label: t('Keypad'), tone: 'bg-[#16a34a]/15 text-[#16a34a]', to: 'voiceCall' },
    { icon: <FiHeart />, label: t('Favorites'), tone: 'bg-[#db2777]/15 text-[#db2777]', to: 'thread' },
  ]

  return (
    <Page>
      <ScreenTitle
        title={t('Calls')}
        right={
          <>
            <FiSearch />
            <FiMoreVertical />
          </>
        }
      />

      <Stagger className="flex-1 overflow-hidden">
        <Item className="flex justify-center gap-8 pb-3 pt-2">
          {quick.map((q) => (
            <Tap key={q.label} to={q.to} label={q.label} className="flex flex-col items-center gap-1.5 rounded-xl p-1">
              <span className={`grid h-11 w-11 place-items-center rounded-full text-[17px] ${q.tone}`}>{q.icon}</span>
              <span className="text-[10.5px] font-medium text-[var(--p-text-mid)]">{q.label}</span>
            </Tap>
          ))}
        </Item>

        <Item className="px-5 pb-1">
          <p className="text-[11px] font-semibold text-[var(--p-text2)]">{t('Today')}</p>
        </Item>

        {CALLS.map((c) => (
          <Item key={c.id}>
            <Tap to={c.kind === 'video' ? 'videoCall' : 'voiceCall'} label={c.name} className="flex items-center gap-3 px-4">
              <Avatar src={c.avatar} size={38} />
              <div className="flex min-w-0 flex-1 items-center gap-2 border-b border-[var(--p-line)] py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold leading-tight text-[var(--p-text)]">{c.name}</p>
                  <p className="flex items-center gap-1 truncate pt-[3px] text-[10.5px] leading-tight text-[var(--p-text2)]">
                    {c.dir === 'in' ? (
                      <FiArrowDownLeft className="shrink-0 text-[11px] text-[#16a34a]" />
                    ) : (
                      <FiArrowUpRight className="shrink-0 text-[11px] text-[#16a34a]" />
                    )}
                    {c.kind === 'video' ? (
                      <BsCameraVideoFill className="shrink-0 text-[9px]" />
                    ) : (
                      <BsTelephoneFill className="shrink-0 text-[8px]" />
                    )}
                    <span className="truncate">
                      {c.time}
                      {c.meta ? ` · ${c.meta}` : ''}
                    </span>
                  </p>
                </div>
                <span className="shrink-0 text-[15px]" style={{ color: BLUE }}>
                  {c.kind === 'video' ? <BsCameraVideoFill /> : <BsTelephoneFill className="text-[13px]" />}
                </span>
              </div>
            </Tap>
          </Item>
        ))}
      </Stagger>

      <div className="absolute bottom-[82px] right-4 z-20">
        <Fab size={46} tone="#5aa9ff" to="voiceCall" label={t('New call')} halo>
          <BsTelephoneFill className="text-[16px]" />
        </Fab>
      </div>

      <TabBar active="calls" />
    </Page>
  )
}

/* ---------------------------------------------------------------- SETTINGS */

function SettingsScreen() {
  const { t } = useLanguage()
  return (
    <Page>
      <ScreenTitle title={t('Settings')} right={<FiSearch />} />

      <Stagger className="flex-1 overflow-hidden">
        <Item>
          <Tap
            to="profile"
            label={ME.name}
            className="mx-3 mt-1 flex items-center gap-3 rounded-2xl bg-[var(--p-surface)] p-3"
          >
            <span className="grid h-[46px] w-[46px] shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--p-surface2)]">
              <AvatarArt size={46} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold leading-tight text-[var(--p-text)]">{ME.name}</p>
              <p className="truncate pt-[2px] text-[11.5px] leading-tight text-[var(--p-text2)]">{t(ME.about)}</p>
            </div>
            <FiGrid className="shrink-0 text-[17px]" style={{ color: BLUE }} />
            <FiPlus className="shrink-0 text-[19px]" style={{ color: BLUE }} />
          </Tap>
        </Item>

        <Item>
          <Group label={t('Personal')}>
            <SettingsRow
              icon={<IoSparkles />}
              tone="bg-[#7c3aed]"
              to="ktAi"
              title={t('KT AI')}
              subtitle={t('AI assistant settings, data and privacy')}
            />
            <SettingsRow
              icon={<FiKey />}
              tone="bg-[#dc2626]"
              to="appLock"
              title={t('Account')}
              subtitle={t('Security notifications, change number')}
            />
            <SettingsRow
              icon={<FiLock />}
              tone="bg-[#4f46e5]"
              to="statusPrivacy"
              title={t('Privacy')}
              subtitle={t('Block contacts, disappearing messages')}
            />
            <SettingsRow
              icon={<FiSmile />}
              tone="bg-[#db2777]"
              to="avatarBuilder"
              title={t('Avatar')}
              subtitle={t('Create, edit, profile photo')}
            />
            <SettingsRow
              icon={<FiShoppingBag />}
              tone="bg-[#0ea5e9]"
              to="wallet"
              title={t('KT Wallet')}
              subtitle={t('Balance, top-ups and marketplace')}
              divider={false}
            />
          </Group>
        </Item>

        <Item>
          <Group label={t('Communication')}>
            <SettingsRow
              icon={<FiList />}
              tone="bg-[#0d9488]"
              to="lastSeen"
              title={t('Lists')}
              subtitle={t('Manage people and groups')}
            />
            <SettingsRow
              icon={<FiMessageCircle />}
              tone="bg-[#16a34a]"
              to="chatHistory"
              title={t('Chats')}
              subtitle={t('Theme, wallpapers, chat history')}
            />
            <SettingsRow
              icon={<FiShare2 />}
              tone="bg-[#ea580c]"
              to="createChannel"
              title={t('Broadcasts')}
              subtitle={t('Manage lists and send broadcasts')}
            />
            <SettingsRow
              icon={<FiBell />}
              tone="bg-[#7c3aed]"
              to="statusPrivacy"
              title={t('Notifications')}
              subtitle={t('Message, group & call tones')}
            />
            <SettingsRow
              icon={<FiBookmark />}
              tone="bg-[#2563eb]"
              to="minis"
              title={t('Saved Minis')}
              subtitle={t('Minis you bookmarked from the feed')}
              divider={false}
            />
          </Group>
        </Item>

        <Item>
          <Group label={t('Device')}>
            <SettingsRow
              icon={<FiGlobe />}
              tone="bg-[#0ea5e9]"
              to="language"
              title={t('App language')}
              subtitle={t('Choose how the app reads')}
            />
            <SettingsRow
              icon={<FiUpload />}
              tone="bg-[#64748b]"
              to="transferChats"
              title={t('Transfer chats')}
              subtitle={t('Move everything to a new phone')}
              divider={false}
            />
          </Group>
        </Item>

        <Item className="h-20" />
      </Stagger>

      <TabBar active="settings" />
    </Page>
  )
}

/* -------------------------------------------------------------- VOICE CALL */

/** One control in the call pad. Toggles stay pressed; `to` navigates. */
function CallButton({ icon, label, end, to, toggle }) {
  const { goTo } = usePreviewNav()
  const [on, setOn] = useState(false)

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={toggle ? on : undefined}
      onClick={() => (toggle ? setOn((v) => !v) : to && goTo(to))}
      className="flex cursor-pointer flex-col items-center gap-1.5 transition-transform active:scale-90"
    >
      <span
        className={`grid h-[52px] w-[52px] place-items-center rounded-full text-[20px] ${
          end ? 'bg-[#ef4444] text-white' : on ? 'text-white' : 'bg-[var(--p-ctrl)] text-[var(--p-text)]'
        }`}
        style={on && !end ? { background: BLUE } : undefined}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium text-[var(--p-text)]">{label}</span>
    </button>
  )
}

function VoiceCallScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()
  const elapsed = useCallTimer(1)

  const controls = [
    { icon: <BsCameraVideoFill />, label: t('Video'), to: 'videoCall' },
    { icon: <FiVolume2 />, label: t('Speaker'), toggle: true },
    { icon: <FiMic />, label: t('Mute'), toggle: true },
    { icon: <FiMoreHorizontal />, label: t('More') },
    { icon: <MdOutlineScreenShare />, label: t('Share') },
    { icon: <MdCallEnd />, label: t('End'), end: true, to: 'calls' },
  ]

  return (
    <div className="flex h-full flex-col" style={DOODLE}>
      <div className="flex shrink-0 items-start justify-between px-4 pt-12">
        <button
          type="button"
          aria-label={t('Minimise call')}
          onClick={() => goTo('calls')}
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)]/70 text-[15px] text-[var(--p-text)] transition-transform active:scale-90"
        >
          <FiMinimize2 />
        </button>
        <div className="pt-1 text-center">
          <p className="text-[17px] font-bold tracking-tight text-[var(--p-text)]">{CALLER.number}</p>
          <p className="pt-[2px] text-[12px] tabular-nums text-[var(--p-text2)]">{elapsed}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)]/70 text-[15px] text-[var(--p-text)]">
          <FiPhone />
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-7">
        <motion.div
          initial={{ scale: 0.84, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 170, damping: 18 }}
          className="relative"
        >
          {/* Ring pulse, so the call reads as live rather than frozen */}
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.18, 1], opacity: [0.9, 0, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <img
            src={img(CALLER.avatar)}
            alt={imgAltOnly(CALLER.avatar)}
            loading="lazy"
            className="h-[118px] w-[118px] rounded-full border-[3px] border-white object-cover shadow-xl"
          />
        </motion.div>

        {/* Connection strength ticks */}
        <div className="flex items-center gap-[7px]">
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.span
              key={i}
              className="h-[5px] w-[5px] rounded-full bg-[var(--p-text4)]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
        </div>
      </div>

      <div className="mx-3 mb-7 shrink-0 rounded-3xl bg-[var(--p-ctrl-card)]/90 p-4 backdrop-blur">
        <Stagger className="grid grid-cols-3 gap-y-4">
          {controls.map((c) => (
            <Item key={c.label} className="flex justify-center">
              <CallButton {...c} />
            </Item>
          ))}
        </Stagger>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- VIDEO CALL */

/** One control in the video-call pill bar. */
function PillButton({ icon, label, end, soft, to, toggle }) {
  const { goTo } = usePreviewNav()
  const [on, setOn] = useState(false)

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={toggle ? on : undefined}
      onClick={() => (toggle ? setOn((v) => !v) : to && goTo(to))}
      className={`grid h-[44px] w-[44px] cursor-pointer place-items-center rounded-full text-[18px] transition-transform active:scale-90 ${
        end ? 'bg-[#ef4444] text-white' : on ? 'text-white' : soft ? 'bg-white/45 text-[#0b0f14]' : 'bg-white text-[#0b0f14]'
      }`}
      style={on && !end ? { background: BLUE } : undefined}
    >
      {icon}
    </button>
  )
}

function VideoCallScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()
  const reduced = useReducedMotion()
  const elapsed = useCallTimer(11)

  return (
    <div className="relative h-full bg-[#9aa3ab]">
      {/* Handheld drift on the far camera */}
      <motion.img
        animate={reduced ? {} : { scale: [1.1, 1.16, 1.1], x: [0, 8, -4, 0], y: [0, -5, 3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        src={img(PHOTOS.landscape)}
        alt={imgAltOnly(PHOTOS.landscape)}
        loading="lazy"
        className="h-full w-full object-cover blur-[2px] saturate-[0.35]"
      />
      <div className="absolute inset-0 bg-white/35" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-4 pt-12">
        <button
          type="button"
          aria-label={t('Minimise call')}
          onClick={() => goTo('calls')}
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-black/25 text-[15px] text-white backdrop-blur transition-transform active:scale-90"
        >
          <FiMinimize2 />
        </button>
        <div className="pt-1 text-center drop-shadow">
          <p className="text-[16px] font-bold tracking-tight text-white">{CALLER.number}</p>
          <p className="pt-[2px] text-[12px] tabular-nums text-white/85">{elapsed}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-black/25 text-[15px] text-white backdrop-blur">
          <FiPhone />
        </span>
      </div>

      {/* Self view */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        className="absolute bottom-[112px] right-4 h-[122px] w-[86px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/40"
      >
        <img src={img(ME.avatar)} alt={imgAltOnly(ME.avatar)} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/40 text-[11px] text-white backdrop-blur">
          <FiRotateCw />
        </span>
      </motion.div>

      <Stagger className="absolute inset-x-5 bottom-8 flex items-center justify-between rounded-full bg-[var(--p-ctrl-card)]/80 px-3 py-2.5 backdrop-blur-xl">
        {[
          { icon: <BsThreeDots />, label: t('More'), soft: true },
          { icon: <BsCameraVideoFill />, label: t('Camera'), toggle: true },
          { icon: <FiVolume2 />, label: t('Speaker'), toggle: true },
          { icon: <FiMic />, label: t('Mute'), soft: true, toggle: true },
          { icon: <MdCallEnd />, label: t('End'), end: true, to: 'calls' },
        ].map((c) => (
          <Item key={c.label}>
            <PillButton {...c} />
          </Item>
        ))}
      </Stagger>
    </div>
  )
}

/* ----------------------------------------------------------- STATUS VIEWER */

function StatusViewerScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()
  const reduced = useReducedMotion()

  return (
    <div className="relative flex h-full flex-col bg-black">
      <div className="flex shrink-0 items-center gap-3 px-4 pb-4 pt-12">
        <button
          type="button"
          aria-label={t('Back to updates')}
          onClick={() => goTo('updates')}
          className="cursor-pointer text-[18px] text-white transition-opacity active:opacity-50"
        >
          <FiArrowLeft />
        </button>
        <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-white/15">
          <AvatarArt size={32} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold leading-tight text-white">{t(STATUS_POST.author)}</p>
          <p className="truncate text-[10px] leading-tight text-white/65">{t(STATUS_POST.time)}</p>
        </div>
        <FiMoreVertical className="text-[16px] text-white" />
      </div>

      <div className="flex flex-1 items-center overflow-hidden">
        {/* Slow push-in, so the still never sits completely dead */}
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={reduced ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.08, 1] }}
          transition={reduced ? { duration: 0.4 } : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          src={img(STATUS_POST.cover)}
          alt={imgAltOnly(STATUS_POST.cover)}
          loading="lazy"
          className="max-h-full w-full object-contain"
        />
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1.5 pb-7 pt-4 text-white/80">
        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <FiChevronUp className="text-[14px]" />
        </motion.span>
        <span className="flex items-center gap-1.5 text-[12px]">
          <FiEye /> 0
        </span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- LANGUAGE */

function LanguageScreen() {
  const { t } = useLanguage()
  const [picked, setPicked] = useState('GB')

  return (
    <Page>
      <BackHeader title={t('App language')} icon={<FiChevronLeft />} to="settings" />

      <div className="mx-4 flex items-center gap-2.5 rounded-xl bg-[var(--p-surface2)] px-3 py-2.5">
        <FiSearch className="shrink-0 text-[14px] text-[var(--p-text2)]" />
        <span className="text-[13px] text-[var(--p-text2)]">{t('Search language')}</span>
      </div>

      <Stagger className="flex-1 overflow-hidden pt-3">
        <Item className="flex items-center gap-3 border-y border-[var(--p-line)] bg-[var(--p-surface)] px-4 py-2.5">
          <FiSmartphone className="shrink-0 text-[17px] text-[var(--p-text-mid)]" />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold leading-tight text-[var(--p-text)]">{t('Device language')}</p>
            <p className="truncate pt-[2px] text-[10.5px] leading-tight text-[var(--p-text3)]">
              {t('Follow your phone settings')} · English
            </p>
          </div>
          <RadioDot on={picked === 'device'} />
        </Item>

        <Item>
          <p className="px-5 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text3)]">
            {t('Selected')}
          </p>
        </Item>

        <Item>
          <Tap
            onTap={() => setPicked('GB')}
            label="English"
            className="flex items-center gap-3 border-y border-[var(--p-sel-line)] bg-[var(--p-sel)] px-4 py-2.5"
          >
            <CountryTile code="GB" />
            <span className="flex-1 text-[14px] font-semibold text-[var(--p-text)]">English</span>
            <RadioDot on={picked === 'GB'} />
          </Tap>
        </Item>

        <Item>
          <p className="px-5 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text3)]">
            {t('All languages')}
          </p>
        </Item>

        {LANGUAGES.map((l) => (
          <Item key={l.native}>
            <Tap
              onTap={() => setPicked(l.flag)}
              label={l.native}
              className="flex items-center gap-3 bg-[var(--p-surface)] px-4"
            >
              <CountryTile code={l.flag} />
              <span className="flex min-w-0 flex-1 items-center gap-2 border-b border-[var(--p-line2)] py-2">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold leading-tight text-[var(--p-text)]">
                    {l.native}
                  </span>
                  {l.english ? (
                    <span className="block truncate pt-[1px] text-[10.5px] leading-tight text-[var(--p-text3)]">
                      {l.english}
                    </span>
                  ) : null}
                </span>
                <RadioDot on={picked === l.flag} />
              </span>
            </Tap>
          </Item>
        ))}
      </Stagger>
    </Page>
  )
}

/* ------------------------------------------------------------ CHAT HISTORY */

function ChatHistoryScreen() {
  const { t } = useLanguage()
  const rows = [
    { icon: <FiUpload />, title: t('Export chat'), desc: t('Pick a chat to save its messages as a text file'), to: 'thread' },
    { icon: <FiArchive />, title: t('Archive all chats'), desc: t('Move every chat to the archived list'), to: 'chats' },
    { icon: <FiRepeat />, title: t('Clear all chats'), desc: t('Delete messages from every chat. Chat rows themselves stay.') },
    {
      icon: <FiTrash2 />,
      title: t('Delete all chats'),
      desc: t('Wipe every chat, message, draft, and cached profile from this device.'),
      danger: true,
    },
  ]

  return (
    <Page bg="var(--p-surface)">
      <BackHeader title={t('Chat history')} icon={<FiChevronLeft />} to="settings" />
      <Stagger className="flex-1 px-5 pt-2">
        {rows.map((r) => (
          <Item key={r.title}>
            <Tap to={r.to} label={r.title} className="flex items-start gap-4 rounded-xl py-3.5">
              <span className={`shrink-0 pt-[2px] text-[18px] ${r.danger ? 'text-[#ef4444]' : 'text-[var(--p-text)]'}`}>
                {r.icon}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-[14.5px] font-medium leading-tight ${
                    r.danger ? 'text-[#ef4444]' : 'text-[var(--p-text)]'
                  }`}
                >
                  {r.title}
                </p>
                <p className="pt-[3px] text-[11.5px] leading-snug text-[var(--p-text2)]">{r.desc}</p>
              </div>
            </Tap>
          </Item>
        ))}
      </Stagger>
    </Page>
  )
}

/* ---------------------------------------------------------------- APP LOCK */

function AppLockScreen() {
  const { t } = useLanguage()
  const options = [
    t('Immediately'),
    t('After 1 minute'),
    t('After 15 minutes'),
    t('After 30 minutes'),
    t('Only after device lock'),
  ]
  const [choice, setChoice] = useState(options.length - 1)

  return (
    <Page bg="var(--p-surface)">
      <BackHeader title={t('App lock')} icon={<FiChevronLeft />} to="settings" />
      <div className="px-5 pt-1">
        <p className="text-[15px] font-bold text-[var(--p-text)]">{t('Automatically lock')}</p>
        <p className="pt-1.5 text-[11.5px] leading-snug text-[var(--p-text2)]">
          {t('Require Face ID / fingerprint or your device passcode to open a locked chat after this much time away.')}
        </p>
      </div>

      <Stagger className="px-5 pt-4">
        {options.map((o, i) => (
          <Item key={o}>
            <Tap onTap={() => setChoice(i)} label={o} className="flex items-center gap-3.5 rounded-lg py-3">
              <span
                className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border-2"
                style={{ borderColor: i === choice ? BLUE : 'var(--p-text)' }}
              >
                {i === choice ? <span className="h-[9px] w-[9px] rounded-full" style={{ background: BLUE }} /> : null}
              </span>
              <span className="text-[14.5px] font-medium text-[var(--p-text)]">{o}</span>
            </Tap>
          </Item>
        ))}
      </Stagger>
    </Page>
  )
}

/* ---------------------------------------------------------- STATUS PRIVACY */

function StatusPrivacyScreen() {
  const { t } = useLanguage()
  const rows = [
    { label: t('My contacts'), hint: t('Everyone in your contacts') },
    { label: t('My contacts except...'), hint: t('0 excluded'), edit: true },
    { label: t('Only share with...'), hint: t('0 included'), edit: true },
  ]
  const [choice, setChoice] = useState(0)

  return (
    <Page bg="var(--p-surface)">
      <BackHeader title={t('Status privacy')} icon={<FiArrowLeft />} to="settings" />
      <p className="px-5 pb-1 pt-1 text-[11.5px] text-[var(--p-text2)]">{t('Who can see my statuses')}</p>

      <Stagger className="px-1">
        {rows.map((r, i) => (
          <Item key={r.label}>
            <Tap onTap={() => setChoice(i)} label={r.label} className="flex items-center gap-3.5 px-4">
              <RadioDot on={i === choice} />
              <span className={`flex-1 py-3 ${i < rows.length - 1 ? 'border-b border-[var(--p-line2)]' : ''}`}>
                <span className="block text-[14px] font-medium leading-tight text-[var(--p-text)]">{r.label}</span>
                <span className="flex items-center gap-1 pt-[2px] text-[11px] leading-tight text-[var(--p-text3)]">
                  {r.hint}
                  {r.edit ? (
                    <>
                      <span>·</span>
                      <span className="font-semibold" style={{ color: BLUE }}>
                        {t('Edit')}
                      </span>
                      <FiChevronRight style={{ color: BLUE }} />
                    </>
                  ) : null}
                </span>
              </span>
            </Tap>
          </Item>
        ))}

        <Item>
          <p className="px-5 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text3)]">
            {t('Resharing')}
          </p>
        </Item>

        <Item className="flex items-center gap-3 px-4 pt-1">
          <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg bg-[#7c3aed]/15 text-[15px] text-[#7c3aed]">
            <FiRepeat />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium leading-tight text-[var(--p-text)]">{t('Allow resharing')}</p>
            <p className="pt-[2px] text-[11px] leading-snug text-[var(--p-text3)]">
              {t('Let people who can see your status reshare and forward it.')}
            </p>
          </div>
          <Switch />
        </Item>

        <Item>
          <p className="px-5 pt-6 text-[11px] leading-snug text-[var(--p-text3)]">
            {t("Changes to your privacy settings won't affect status updates that you've already shared.")}
          </p>
        </Item>
      </Stagger>
    </Page>
  )
}

/* --------------------------------------------------------------- LAST SEEN */

function LastSeenScreen() {
  const { t } = useLanguage()
  const seenOptions = [t('Everyone'), t('My contacts'), t('My contacts except...'), t('Nobody')]
  const onlineOptions = [t('Everyone'), t('Same as last seen')]
  const [seen, setSeen] = useState(0)
  const [online, setOnline] = useState(1)

  return (
    <Page bg="var(--p-surface)">
      <BackHeader title={t('Last seen and online')} icon={<FiChevronLeft />} to="settings" />

      <Stagger className="px-1">
        <Item>
          <p className="px-5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text3)]">
            {t('Who can see my last seen')}
          </p>
        </Item>
        {seenOptions.map((o, i) => (
          <Item key={o}>
            <Tap onTap={() => setSeen(i)} label={o}>
              <RadioRow label={o} checked={i === seen} divider={i < seenOptions.length - 1} filled={false} />
            </Tap>
          </Item>
        ))}

        <Item>
          <div className="mt-2 border-t-[6px] border-[var(--p-line)]" />
          <p className="px-5 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text3)]">
            {t("Who can see when I'm online")}
          </p>
        </Item>
        {onlineOptions.map((o, i) => (
          <Item key={o}>
            <Tap onTap={() => setOnline(i)} label={o}>
              <RadioRow label={o} checked={i === online} divider={i === 0} filled={false} />
            </Tap>
          </Item>
        ))}

        <Item>
          <p className="px-5 pt-5 text-[11px] leading-snug text-[var(--p-text3)]">
            {t(
              "If you don't share when you were last seen or online, you won't be able to see when other people were last seen or online.",
            )}
          </p>
        </Item>
      </Stagger>
    </Page>
  )
}

/* ---------------------------------------------------------- CREATE CHANNEL */

function CreateChannelScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()

  const field = (label, placeholder, tall = false, select = false) => (
    <div className="pt-3">
      <p className="pb-1.5 text-[12.5px] font-semibold text-[var(--p-text)]">{label}</p>
      <div
        className={`flex items-center justify-between rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 ${
          tall ? 'h-[62px] items-start py-2.5' : 'h-[38px]'
        }`}
      >
        <span className={`text-[12.5px] ${select ? 'text-[var(--p-text)]' : 'text-[var(--p-text3)]'}`}>
          {placeholder}
        </span>
        {select ? <FiChevronDown className="text-[14px] text-[var(--p-text2)]" /> : null}
      </div>
    </div>
  )

  return (
    <Page bg="var(--p-bg2)">
      <BackHeader title={t('Create channel')} icon={<FiArrowLeft />} to="updates" />

      <Stagger className="flex-1 overflow-hidden px-5">
        <Item className="flex flex-col items-center pt-1">
          <div className="relative">
            <span className="grid h-[82px] w-[82px] place-items-center rounded-full bg-[var(--p-surface2)] text-[26px] text-[var(--p-text3)] ring-[6px] ring-[var(--p-bg2)]">
              <FiCamera />
            </span>
            <span
              className="absolute bottom-0 right-0 grid h-[26px] w-[26px] place-items-center rounded-full text-[12px] text-white"
              style={{ background: BLUE }}
            >
              <FiCamera />
            </span>
          </div>
          <p className="pt-2 text-[11.5px] text-[var(--p-text2)]">{t('Add a channel photo')}</p>
        </Item>

        <Item>{field(t('Channel name'), t('Channel name'))}</Item>
        <Item>{field(t('Description'), t('What is this channel about?'), true)}</Item>
        <Item>{field(t('Category'), t('General'), false, true)}</Item>
        <Item>{field(t('Your region'), t('Global'), false, true)}</Item>
        <Item>
          <p className="pt-3 text-[12.5px] font-semibold text-[var(--p-text)]">{t('Country')}</p>
        </Item>
      </Stagger>

      <div className="shrink-0 border-t border-[var(--p-line)] bg-[var(--p-bg2)] px-5 pb-6 pt-3">
        <button
          type="button"
          onClick={() => goTo('updates')}
          className="grid h-[44px] w-full cursor-pointer place-items-center rounded-full text-[14px] font-semibold text-white transition-transform active:scale-[0.97]"
          style={{ background: BLUE }}
        >
          {t('Create channel')}
        </button>
      </div>
    </Page>
  )
}

/* ---------------------------------------------------------- TRANSFER CHATS */

function TransferChatsScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()
  const [reveal, setReveal] = useState(false)
  // The passphrase fills in as if someone were typing it and the strength bar
  // follows, so the form demonstrates itself.
  const step = useTick(620, 14)
  const typed = Math.min(step, 13)
  const strength = Math.min(100, typed * 8)
  const label = strength < 40 ? t('Too short') : strength < 80 ? t('Getting there') : t('Strong')
  const colour = strength < 40 ? '#f59e0b' : strength < 80 ? '#0ea5e9' : '#16a34a'

  return (
    <Page bg="var(--p-surface)">
      <BackHeader title={t('Transfer chats to new phone')} icon={<FiChevronLeft />} to="settings" />

      <Stagger className="px-5">
        <Item>
          <p className="pt-1 text-[19px] font-bold tracking-tight text-[var(--p-text)]">{t('Set a passphrase')}</p>
          <p className="pt-2 text-[11.5px] leading-snug text-[var(--p-text2)]">
            {t(
              'Your chats are encrypted on this device before upload. You will enter the same passphrase on the new phone to restore. KT Messenger never sees it.',
            )}
          </p>
        </Item>

        <Item className="pt-5">
          <div className="flex h-[42px] items-center justify-between rounded-xl border border-[var(--p-border)] px-3.5">
            <span className="truncate text-[13px] tracking-[0.18em] text-[var(--p-text)]">
              {typed === 0 ? (
                <span className="tracking-normal text-[var(--p-text3)]">{t('Passphrase (8+ characters)')}</span>
              ) : reveal ? (
                'mountain-ride'.slice(0, typed)
              ) : (
                '•'.repeat(typed)
              )}
            </span>
            <button
              type="button"
              aria-label={reveal ? t('Hide passphrase') : t('Show passphrase')}
              onClick={() => setReveal((v) => !v)}
              className="shrink-0 cursor-pointer text-[15px] text-[var(--p-text)] transition-opacity active:opacity-50"
            >
              <FiEye />
            </button>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--p-line)]">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: colour }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </span>
            <span className="shrink-0 text-[11px] text-[var(--p-text3)]">{label}</span>
          </div>
        </Item>

        <Item className="pt-4">
          <div className="flex h-[42px] items-center rounded-xl border border-[var(--p-border)] px-3.5">
            <span className="text-[13px] text-[var(--p-text3)]">{t('Confirm passphrase')}</span>
          </div>
        </Item>

        <Item className="pt-5">
          <button
            type="button"
            onClick={() => goTo('settings')}
            className="grid h-[46px] w-full cursor-pointer place-items-center rounded-full text-[14.5px] font-semibold text-white transition-transform active:scale-[0.97]"
            style={{ background: BLUE }}
          >
            {t('Start transfer')}
          </button>
        </Item>

        <Item className="flex items-center justify-center gap-1.5 pt-4 text-[10.5px] text-[var(--p-text3)]">
          <FiShield /> {t('End-to-end encrypted backup')}
        </Item>
      </Stagger>
    </Page>
  )
}

/* ----------------------------------------------------------- AVATAR MAKER */

const AVATAR_TABS = [
  { key: 'hair', label: 'Hairstyle' },
  { key: 'colour', label: 'Hair Colour' },
  { key: 'beard', label: 'Facial Hair' },
]

function AvatarBuilderScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()
  const config = useAvatarConfig()
  const [tab, setTab] = useState('hair')

  const sets = { hair: HAIR_STYLES, colour: HAIR_COLOURS, beard: FACIAL_HAIR }
  const items = sets[tab]
  const chosen = config[tab]
  const heading = AVATAR_TABS.find((c) => c.key === tab).label

  return (
    <Page>
      <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-12">
        <button
          type="button"
          aria-label={t('Back to profile')}
          onClick={() => goTo('profile')}
          className="shrink-0 cursor-pointer text-[20px] text-[var(--p-text)] transition-opacity active:opacity-50"
        >
          <FiChevronLeft />
        </button>
        <h3 className="flex-1 text-[17px] font-bold tracking-tight text-[var(--p-text)]">{t('Your avatar')}</h3>
        <button
          type="button"
          onClick={shuffleAvatar}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[13px] font-semibold transition-transform active:scale-90"
          style={{ color: BLUE }}
        >
          <FiShuffle /> {t('Shuffle')}
        </button>
      </div>

      {/* Live preview */}
      <div
        className="mx-3 flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-3.5"
        style={{ background: `linear-gradient(110deg, #4a9bf7, ${BLUE} 70%)` }}
      >
        <motion.span
          key={`${config.hair}-${config.colour}-${config.beard}`}
          initial={{ scale: 0.86 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16 }}
          className="grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-[3px] ring-white/50"
        >
          <AvatarArt size={72} />
        </motion.span>
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight text-white">{t('Build your look')}</p>
          <p className="pt-1 text-[10.5px] leading-snug text-white/85">
            {t('Tap a category, then pick a style. Live preview updates as you go.')}
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex shrink-0 items-center gap-2 overflow-hidden px-3 pt-3">
        {AVATAR_TABS.map((c) => {
          const on = c.key === tab
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setTab(c.key)}
              aria-current={on}
              className={`shrink-0 cursor-pointer rounded-full px-2.5 py-[6px] text-[10.5px] font-semibold transition-transform active:scale-95 ${
                on ? 'text-white' : 'bg-[var(--p-surface)] text-[var(--p-text-mid)]'
              }`}
              style={on ? { background: BLUE } : undefined}
            >
              {t(c.label)}
            </button>
          )
        })}
      </div>

      {/* Picker */}
      <div className="mx-3 mt-3 flex-1 overflow-hidden rounded-2xl bg-[var(--p-surface)] p-3">
        <div className="flex items-baseline justify-between pb-2">
          <p className="text-[14px] font-bold text-[var(--p-text)]">{t(heading)}</p>
          <p className="text-[11px] tabular-nums text-[var(--p-text3)]">
            {chosen + 1} / {items.length}
          </p>
        </div>

        <Stagger className="grid grid-cols-4 gap-2">
          {items.map((item, i) => {
            const on = i === chosen
            return (
              <Item key={item.id}>
                <button
                  type="button"
                  aria-label={t(item.label)}
                  aria-pressed={on}
                  onClick={() => setAvatar({ [tab]: i })}
                  className={`relative grid aspect-square w-full cursor-pointer place-items-center rounded-xl transition-transform active:scale-90 ${
                    on ? 'ring-2' : 'bg-[var(--p-surface2)]'
                  }`}
                  style={on ? { background: `${BLUE}22`, boxShadow: `inset 0 0 0 2px ${BLUE}` } : undefined}
                >
                  {tab === 'colour' ? (
                    <span
                      className="h-7 w-7 rounded-full ring-1 ring-black/10"
                      style={{ background: item.hex }}
                    />
                  ) : item.path ? (
                    <HairGlyph path={item.path} colour="var(--p-text)" size={36} />
                  ) : (
                    // The "none" option: the app's crossed-out circle.
                    <span
                      className="grid h-7 w-7 place-items-center rounded-full border-2 text-[14px]"
                      style={{ borderColor: BLUE, color: BLUE }}
                    >
                      <FiSlash />
                    </span>
                  )}
                  {on ? (
                    <span
                      className="absolute right-1 top-1 grid h-[15px] w-[15px] place-items-center rounded-full text-[9px] text-white"
                      style={{ background: BLUE }}
                    >
                      <FiCheck />
                    </span>
                  ) : null}
                </button>
              </Item>
            )
          })}
        </Stagger>
      </div>

      <div className="shrink-0 px-3 pb-7 pt-3">
        <button
          type="button"
          onClick={() => goTo('profile')}
          className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-[14.5px] font-semibold text-white transition-transform active:scale-[0.97]"
          style={{ background: BLUE }}
        >
          <FiCheck /> {t('Save avatar')}
        </button>
      </div>
    </Page>
  )
}

/* ---------------------------------------------------------------- WALLET  */

function WalletScreen() {
  const { t } = useLanguage()
  // Both buttons really move the balance, so the screen demonstrates itself
  // instead of sitting on a frozen zero.
  const [log, setLog] = useState([])
  const received = log.filter((l) => l.amount > 0).reduce((a, l) => a + l.amount, 0)
  const spent = log.filter((l) => l.amount < 0).reduce((a, l) => a - l.amount, 0)
  const balance = received - spent

  const add = (amount, note) =>
    setLog((l) => [{ id: Date.now() + Math.random(), amount, note, time: 'Just now' }, ...l].slice(0, 4))

  return (
    <Page>
      <BackHeader title="KT Wallet" icon={<FiChevronLeft />} to="settings" />

      <div
        className="mx-3 shrink-0 rounded-2xl px-4 py-4"
        style={{ background: `linear-gradient(120deg, #4a9bf7, ${BLUE} 75%)` }}
      >
        <div className="flex items-start justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">{t('Available balance')}</p>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-[14px] text-white">
            <FiInfo />
          </span>
        </div>
        <p className="flex items-baseline gap-2 pt-2.5">
          <motion.span
            key={balance}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-[34px] font-bold leading-none tabular-nums text-white"
          >
            {balance}
          </motion.span>
          <span className="text-[13px] font-semibold text-white/90">{t('KT Coins')}</span>
        </p>
        <p className="pt-1.5 text-[10.5px] text-white/75">
          ≈ ${(balance * 0.01).toFixed(2)} {t('USD equivalent')}
        </p>

        <div className="flex gap-2 pt-3.5">
          <button
            type="button"
            onClick={() => add(50, t('Top up'))}
            className="flex h-[38px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-white text-[10.5px] font-semibold transition-transform active:scale-95"
            style={{ color: BLUE }}
          >
            <FiPlus /> <span className="truncate">{t('Top Up')}</span>
          </button>
          <button
            type="button"
            onClick={() => balance >= 20 && add(-20, t('Sticker pack'))}
            className="flex h-[38px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-white/20 text-[10.5px] font-semibold text-white ring-1 ring-white/35 transition-transform active:scale-95"
          >
            <FiShoppingBag /> <span className="truncate">{t('Marketplace')}</span>
          </button>
        </div>
      </div>

      <div className="flex shrink-0 gap-2.5 px-3 pt-3">
        {[
          { icon: <FiTrendingUp />, tone: 'bg-[#16a34a]/15 text-[#16a34a]', label: t('Total received'), value: `+${received} KT` },
          { icon: <FiTrendingDown />, tone: 'bg-[#ef4444]/15 text-[#ef4444]', label: t('Total spent'), value: `${spent} KT` },
        ].map((s) => (
          <div key={s.label} className="flex-1 rounded-2xl bg-[var(--p-surface)] p-3">
            <div className="flex items-center gap-2">
              <span className={`grid h-7 w-7 place-items-center rounded-lg text-[13px] ${s.tone}`}>{s.icon}</span>
              <span className="text-[8.5px] font-bold uppercase tracking-[0.08em] text-[var(--p-text3)]">{s.label}</span>
            </div>
            <p className="pt-2 text-[17px] font-bold tabular-nums text-[var(--p-text)]">{s.value}</p>
          </div>
        ))}
      </div>

      <p className="shrink-0 px-5 pb-1 pt-4 text-[14px] font-bold text-[var(--p-text)]">{t('Recent transactions')}</p>

      <div className="flex-1 overflow-hidden px-3">
        {log.length === 0 ? (
          <p className="pt-10 text-center text-[12.5px] text-[var(--p-text3)]">{t('No transactions yet')}</p>
        ) : (
          <AnimatePresence initial={false}>
            {log.map((l) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-3 rounded-xl bg-[var(--p-surface)] px-3 py-2.5"
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-[14px] ${
                    l.amount > 0 ? 'bg-[#16a34a]/15 text-[#16a34a]' : 'bg-[#ef4444]/15 text-[#ef4444]'
                  }`}
                >
                  {l.amount > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[var(--p-text)]">{l.note}</p>
                  <p className="text-[10.5px] text-[var(--p-text3)]">{l.time}</p>
                </div>
                <span
                  className="shrink-0 text-[13px] font-bold tabular-nums"
                  style={{ color: l.amount > 0 ? '#16a34a' : '#ef4444' }}
                >
                  {l.amount > 0 ? `+${l.amount}` : l.amount} KT
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </Page>
  )
}

/* --------------------------------------------------------------- PROFILE  */

function ProfileScreen() {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()

  return (
    <Page>
      {/* Soft decorative discs behind the header, as on the real screen */}
      <div className="pointer-events-none absolute inset-x-0 top-14 h-44 overflow-hidden">
        <span className="absolute -left-10 top-4 h-28 w-28 rounded-full bg-[#4a9bf7]/10" />
        <span className="absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#4a9bf7]/10" />
      </div>

      <div className="relative flex shrink-0 items-center gap-3 px-4 pb-1 pt-12">
        <button
          type="button"
          aria-label={t('Back to settings')}
          onClick={() => goTo('settings')}
          className="shrink-0 cursor-pointer text-[19px] text-[var(--p-text)] transition-opacity active:opacity-50"
        >
          <FiArrowLeft />
        </button>
        <h3 className="text-[17px] font-bold tracking-tight text-[var(--p-text)]">{t('Profile')}</h3>
      </div>

      <Stagger className="relative flex-1 overflow-hidden">
        <Item className="flex flex-col items-center pt-2">
          <Tap
            to="avatarBuilder"
            label={t('Edit avatar')}
            className="relative grid h-[92px] w-[92px] place-items-center overflow-visible rounded-full"
          >
            <span className="grid h-[92px] w-[92px] place-items-center overflow-hidden rounded-full bg-[var(--p-surface)] shadow-[0_8px_20px_-8px_rgba(2,6,23,0.35)]">
              <AvatarArt size={92} />
            </span>
            <span
              className="absolute bottom-0 right-0 grid h-[28px] w-[28px] place-items-center rounded-full text-[13px] text-white ring-[3px] ring-[var(--p-bg)]"
              style={{ background: BLUE }}
            >
              <FiCamera />
            </span>
          </Tap>
          <p className="pt-2.5 text-[20px] font-bold tracking-tight text-[var(--p-text)]">{ME.name}</p>
          <span className="mt-1.5 rounded-full border border-[var(--p-border)] px-4 py-1 text-[12px] font-medium text-[var(--p-text)]">
            {t(ME.about)}
          </span>
        </Item>

        <Item className="mx-3 mt-4 rounded-2xl bg-[var(--p-surface)] p-3.5">
          <div className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#2563eb]/15 text-[15px] text-[#2563eb]">
              <FiUser />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold leading-tight text-[var(--p-text)]">{t('Personal Information')}</p>
              <p className="pt-1 text-[11px] leading-snug text-[var(--p-text2)]">
                {t('This information is visible to your KT Messenger contacts.')}
              </p>
            </div>
          </div>

          <p className="pb-1 pt-3 text-[10.5px] text-[var(--p-text3)]">{t('Name')}</p>
          <div
            className="flex h-[38px] items-center justify-between rounded-xl border px-3"
            style={{ borderColor: BLUE, background: `${BLUE}0d` }}
          >
            <span className="text-[13px] font-medium text-[var(--p-text)]">{ME.name}</span>
            <span className="text-[10px] tabular-nums text-[var(--p-text3)]">{ME.name.length}/25</span>
          </div>

          <p className="pb-1 pt-3 text-[10.5px] text-[var(--p-text3)]">{t('Phone')}</p>
          <div className="flex h-[38px] items-center justify-between rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] px-3">
            <span className="text-[13px] font-medium text-[var(--p-text)]">{ME.number}</span>
            <FiLock className="text-[13px] text-[var(--p-text3)]" />
          </div>
          <p className="pt-1.5 text-[10px] leading-snug text-[var(--p-text3)]">
            {t("Phone number is locked to your account and can't be changed here.")}
          </p>
        </Item>

        <Item className="mx-3 mt-3 overflow-hidden rounded-2xl bg-[var(--p-surface)] p-3.5">
          <div className="flex items-start gap-3 border-b border-[var(--p-line2)] pb-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#7c3aed]/15 text-[15px] text-[#7c3aed]">
              <FiFileText />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold leading-tight text-[var(--p-text)]">{t('About You')}</p>
              <p className="pt-1 text-[11px] leading-snug text-[var(--p-text2)]">
                {t('Help others get to know you better.')}
              </p>
            </div>
          </div>

          {[
            { icon: <FiCalendar />, tone: 'bg-[#2563eb]/15 text-[#2563eb]', label: t('Date of birth') },
            { icon: <FiUsers />, tone: 'bg-[#db2777]/15 text-[#db2777]', label: t('Gender') },
            { icon: <FiMapPin />, tone: 'bg-[#16a34a]/15 text-[#16a34a]', label: t('Location') },
          ].map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center gap-3 py-2.5 ${i < 2 ? 'border-b border-[var(--p-line2)]' : ''}`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[13px] ${r.tone}`}>
                {r.icon}
              </span>
              <span className="flex-1 text-[13px] font-semibold text-[var(--p-text)]">{r.label}</span>
              <span className="text-[12px] text-[var(--p-text3)]">{t('Not set')}</span>
              <FiChevronRight className="text-[14px] text-[var(--p-text4)]" />
            </div>
          ))}
        </Item>

        <Item className="h-6" />
      </Stagger>
    </Page>
  )
}

/* ---------------------------------------------------------------- KT AI   */

function KtAiScreen() {
  const { t } = useLanguage()

  const rows = [
    {
      group: 'Availability',
      items: [
        { icon: <FiMessageCircle />, tone: 'bg-[#16a34a]', title: t('Private Chats'), sub: t('Trigger KT AI using @kt in private chats'), on: true },
        { icon: <FiUsers />, tone: 'bg-[#7c3aed]', title: t('Groups'), sub: t('Allow KT AI to respond in groups'), on: true },
        { icon: <FiVolume2 />, tone: 'bg-[#ea580c]', title: t('Communities'), sub: t('Enable KT AI for community announcements and FAQs'), on: true },
      ],
    },
    {
      group: 'Privacy & data',
      items: [
        { icon: <FiShield />, tone: 'bg-[#0d9488]', title: t('Help improve KT AI'), sub: t('Share anonymized data to improve responses'), on: false },
        { icon: <FiTrash2 />, tone: 'bg-[#ef4444]', title: t('Clear AI Conversation History'), sub: t('Remove all messages from the KT AI chat'), danger: true },
      ],
    },
  ]

  return (
    <Page>
      <BackHeader title={t('KT AI Settings')} icon={<FiChevronLeft />} to="settings" />

      <div
        className="shrink-0 px-5 pb-5 pt-1 text-center"
        style={{
          backgroundColor: 'var(--p-bg)',
          backgroundImage:
            'linear-gradient(135deg, rgba(37,99,235,0.20) 0%, rgba(124,58,237,0.17) 55%, rgba(219,39,119,0.15) 100%)',
        }}
      >
        <motion.span
          className="mx-auto grid h-[62px] w-[62px] place-items-center rounded-full bg-[var(--p-surface)] shadow-[0_6px_18px_-6px_rgba(2,6,23,0.35)]"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="h-7 w-7 rounded-full border-[3px]" style={{ borderColor: BLUE }} />
        </motion.span>
        <p className="pt-2.5 text-[18px] font-bold tracking-tight text-[var(--p-text)]">{t('Meet KT AI')}</p>
        <p className="pt-1 text-[11px] leading-snug text-[var(--p-text2)]">
          {t('Your intelligent companion for smarter conversations.')}
        </p>
      </div>

      <Stagger className="flex-1 overflow-hidden pt-3">
        <Item className="mx-3 flex items-center gap-3 rounded-2xl bg-[var(--p-surface)] p-3">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
            style={{ background: BLUE }}
          >
            <span className="h-3.5 w-3.5 rounded-full border-2 border-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold leading-tight text-[var(--p-text)]">{t('Enable KT AI')}</p>
            <p className="pt-[2px] text-[10.5px] leading-snug text-[var(--p-text3)]">
              {t('Allow KT AI to assist you across the app')}
            </p>
          </div>
          <Switch defaultOn />
        </Item>

        {rows.map((section) => (
          <Item key={section.group}>
            <p className="px-6 pb-1.5 pt-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text3)]">
              {t(section.group)}
            </p>
            <div className="mx-3 overflow-hidden rounded-2xl bg-[var(--p-surface)]">
              {section.items.map((r, i) => (
                <div key={r.title} className="flex items-center gap-3 pl-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[15px] text-white ${r.tone}`}>
                    {r.icon}
                  </span>
                  <div
                    className={`flex min-w-0 flex-1 items-center gap-2 py-2.5 pr-3 ${
                      i < section.items.length - 1 ? 'border-b border-[var(--p-line2)]' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-[13px] font-semibold leading-tight ${
                          r.danger ? 'text-[#ef4444]' : 'text-[var(--p-text)]'
                        }`}
                      >
                        {r.title}
                      </p>
                      <p className="pt-[2px] text-[10.5px] leading-snug text-[var(--p-text3)]">{r.sub}</p>
                    </div>
                    {r.danger ? null : <Switch defaultOn={r.on} />}
                  </div>
                </div>
              ))}
            </div>
          </Item>
        ))}

        <Item>
          <p className="px-5 pt-4 text-[10px] leading-snug text-[var(--p-text3)]">
            {t('KT AI is designed with privacy in mind. It only reads messages when explicitly mentioned with @kt or when you are in the dedicated KT AI chat.')}
          </p>
        </Item>
      </Stagger>
    </Page>
  )
}

/* ---------------------------------------------------------------- manifest */

/**
 * Screen order, the clock each one shows, and whether its surface is light or
 * dark. `tone: "light"` means the screen paints its own dark background, so its
 * status glyphs stay white on either skin. `label` is what the dock under the
 * device announces.
 */
export const SCREENS = [
  { key: 'chats', label: 'Chats', time: '4:28', tone: 'dark', Screen: ChatsScreen },
  { key: 'search', label: 'Search & KT AI', time: '4:45', tone: 'dark', Screen: SearchScreen },
  { key: 'thread', label: 'Conversation', time: '4:44', tone: 'dark', Screen: ThreadScreen },
  { key: 'updates', label: 'Updates', time: '4:30', tone: 'dark', Screen: UpdatesScreen },
  { key: 'news', label: 'News', time: '4:30', tone: 'dark', Screen: NewsScreen },
  { key: 'minis', label: 'Minis', time: '4:30', tone: 'light', Screen: MinisScreen },
  { key: 'calls', label: 'Calls', time: '4:30', tone: 'dark', Screen: CallsScreen },
  { key: 'voiceCall', label: 'Voice call', time: '4:32', tone: 'dark', Screen: VoiceCallScreen },
  { key: 'videoCall', label: 'Video call', time: '4:35', tone: 'light', Screen: VideoCallScreen },
  { key: 'statusViewer', label: 'Status', time: '4:36', tone: 'light', Screen: StatusViewerScreen },
  { key: 'settings', label: 'Settings', time: '4:39', tone: 'dark', Screen: SettingsScreen },
  { key: 'profile', label: 'Profile', time: '4:31', tone: 'dark', Screen: ProfileScreen },
  { key: 'avatarBuilder', label: 'Avatar maker', time: '4:31', tone: 'dark', Screen: AvatarBuilderScreen },
  { key: 'wallet', label: 'KT Wallet', time: '4:31', tone: 'dark', Screen: WalletScreen },
  { key: 'ktAi', label: 'KT AI settings', time: '4:31', tone: 'dark', Screen: KtAiScreen },
  { key: 'createChannel', label: 'Create channel', time: '4:39', tone: 'dark', Screen: CreateChannelScreen },
  { key: 'lastSeen', label: 'Last seen', time: '4:40', tone: 'dark', Screen: LastSeenScreen },
  { key: 'statusPrivacy', label: 'Status privacy', time: '4:40', tone: 'dark', Screen: StatusPrivacyScreen },
  { key: 'appLock', label: 'App lock', time: '4:41', tone: 'dark', Screen: AppLockScreen },
  { key: 'chatHistory', label: 'Chat history', time: '4:42', tone: 'dark', Screen: ChatHistoryScreen },
  { key: 'transferChats', label: 'Transfer chats', time: '4:42', tone: 'dark', Screen: TransferChatsScreen },
  { key: 'language', label: 'App language', time: '4:43', tone: 'dark', Screen: LanguageScreen },
]
