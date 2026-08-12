import { useEffect, useMemo, useState } from 'react'
import {
  FiActivity,
  FiBell,
  FiBookmark,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCommand,
  FiCompass,
  FiCopy,
  FiCreditCard,
  FiDownload,
  FiEdit3,
  FiFileText,
  FiGrid,
  FiLayers,
  FiLock,
  FiMessageSquare,
  FiMic,
  FiPause,
  FiPlay,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiSmartphone,
  FiTrash2,
  FiTrendingUp,
  FiWifiOff,
  FiZap,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { PageHero } from '../../components/feature/PageHero'
import { PageNav } from '../../components/feature/PageNav'
import { StatStrip } from '../../components/feature/StatStrip'
import { SectionHead } from '../../components/feature/SectionHead'
import { FilterBar } from '../../components/feature/FilterBar'
import { FeatureGrid } from '../../components/feature/FeatureGrid'
import { Steps } from '../../components/feature/Steps'
import { Testimonials } from '../../components/feature/Testimonials'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { Modal } from '../../components/feature/Modal'
import { Toast } from '../../components/feature/Toast'
import { EmptyState } from '../../components/feature/EmptyState'
import { useModal } from '../../context/ModalContext'
import {
  initialChecklist,
  initialNotes,
  noteCategories,
  noteColors,
  noteTemplates,
  notesFaqs,
  notesFeatures,
  notesSteps,
  notesTestimonials,
  notesTips,
  reminders,
  shortcuts,
  syncDevices,
  voiceMemos,
} from './notesData'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'vault', label: 'Vault', icon: <FiLock /> },
  { id: 'checklist', label: 'Checklist', icon: <FiCheckCircle /> },
  { id: 'voice', label: 'Voice memos', icon: <FiMic /> },
  { id: 'templates', label: 'Templates', icon: <FiLayers /> },
  { id: 'reminders', label: 'Reminders', icon: <FiBell /> },
  { id: 'selfchat', label: 'Self-chat', icon: <FiMessageSquare /> },
  { id: 'sync', label: 'Sync', icon: <FiRefreshCw /> },
  { id: 'encryption', label: 'Encryption', icon: <FiShield /> },
  { id: 'shortcuts', label: 'Shortcuts', icon: <FiCommand /> },
  { id: 'faq', label: 'FAQ', icon: <FiFileText /> },
]

const STATS = [
  { value: 36, label: 'Notes in this vault', icon: <FiFileText />, hint: 'Across six categories, all encrypted.' },
  { value: 256, label: 'Bit AES encryption', icon: <FiLock />, hint: 'Sealed on-device before anything syncs.' },
  { value: 6, label: 'Devices in sync', icon: <FiSmartphone />, hint: 'Phone, tablet, desktop, web and watch.' },
  { value: 100, suffix: '%', label: 'Works offline', icon: <FiWifiOff />, hint: 'Edits reconcile when you reconnect.' },
]

const COLOR_STYLES = {
  default: 'border-line bg-cream dark:bg-cream-2',
  amber: 'border-amber-300 bg-amber-50 dark:border-amber-500/25 dark:bg-amber-500/10',
  emerald: 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/10',
  rose: 'border-rose-300 bg-rose-50 dark:border-rose-500/25 dark:bg-rose-500/10',
  violet: 'border-violet-300 bg-violet-50 dark:border-violet-500/25 dark:bg-violet-500/10',
  sky: 'border-sky-300 bg-sky-50 dark:border-sky-500/25 dark:bg-sky-500/10',
}

const COLOR_SWATCHES = {
  default: 'bg-slate-400',
  amber: 'bg-amber-400',
  emerald: 'bg-emerald-400',
  rose: 'bg-rose-400',
  violet: 'bg-violet-400',
  sky: 'bg-sky-400',
}

const REMINDER_TONES = {
  security: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
  finance: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
  personal: 'bg-violet-500/12 text-violet-600 dark:text-violet-400',
  travel: 'bg-sky-500/12 text-sky-600 dark:text-sky-400',
}

const FEATURE_ICONS = [
  <FiLock key="a" />,
  <FiMessageSquare key="b" />,
  <FiCheckCircle key="c" />,
  <FiMic key="d" />,
  <FiLayers key="e" />,
  <FiBell key="f" />,
  <FiBookmark key="g" />,
  <FiRefreshCw key="h" />,
  <FiWifiOff key="i" />,
]

const STEP_ICONS = [<FiZap key="a" />, <FiGrid key="b" />, <FiEdit3 key="c" />, <FiBell key="d" />]

const RELATED = [
  { to: '/news', label: 'News', desc: 'Save stories straight into your reading list.', icon: <FiActivity /> },
  { to: '/wallet', label: 'Wallet', desc: 'Keep receipts and budgets beside your notes.', icon: <FiCreditCard /> },
  { to: '/markets', label: 'Markets', desc: 'Track a watchlist and journal your thinking.', icon: <FiTrendingUp /> },
  { to: '/marketplace', label: 'Marketplace', desc: 'Turn a shopping list into an actual order.', icon: <FiGrid /> },
]

const PAGE_SIZE = 12

const emptyDraft = { id: null, title: '', content: '', category: 'Work', color: 'default', pinned: false }

export function NotesPage() {
  const { openDownloadModal } = useModal()

  const [notes, setNotes] = useState(initialNotes)
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [draft, setDraft] = useState(null)
  const [checklist, setChecklist] = useState(initialChecklist)
  const [newTask, setNewTask] = useState('')
  const [playingMemo, setPlayingMemo] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = notes.filter((note) => {
      const matchesCategory = activeCategory === 'All' || note.category === activeCategory
      const matchesTerm =
        !term ||
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        note.tags.some((tag) => tag.toLowerCase().includes(term))
      return matchesCategory && matchesTerm
    })
    // Pinned notes always float to the top of the vault.
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned))
  }, [notes, activeCategory, query])

  const visible = filtered.slice(0, visibleCount)
  const pinnedCount = notes.filter((note) => note.pinned).length

  const chips = noteCategories.map((label) => ({
    label,
    count: label === 'All' ? notes.length : notes.filter((note) => note.category === label).length,
  }))

  const resetPaging = () => setVisibleCount(PAGE_SIZE)

  // ------------------------------------------------------------------ Notes
  const openNewNote = (preset = {}) =>
    setDraft({ ...emptyDraft, category: activeCategory === 'All' ? 'Work' : activeCategory, ...preset })

  const saveDraft = (event) => {
    event.preventDefault()
    if (!draft.title.trim()) {
      setToast('Give the note a title before saving.')
      return
    }

    const payload = {
      title: draft.title.trim(),
      content: draft.content.trim() || 'No details yet.',
      category: draft.category,
      color: draft.color,
      pinned: draft.pinned,
      updated: 'Just now',
      tags: draft.tags ?? ['new'],
    }

    if (draft.id) {
      setNotes((current) => current.map((note) => (note.id === draft.id ? { ...note, ...payload } : note)))
      setToast('Note updated and re-encrypted.')
    } else {
      setNotes((current) => [{ id: Date.now(), ...payload }, ...current])
      setToast('Note saved to your encrypted vault.')
    }

    setDraft(null)
  }

  const deleteNote = (id) => {
    setNotes((current) => current.filter((note) => note.id !== id))
    setDraft(null)
    setToast('Moved to trash — purged from every device in 30 days.')
  }

  const togglePin = (id) => {
    let nowPinned = false
    setNotes((current) =>
      current.map((note) => {
        if (note.id !== id) return note
        nowPinned = !note.pinned
        return { ...note, pinned: !note.pinned }
      }),
    )
    setToast(nowPinned ? 'Pinned to the top of your vault.' : 'Unpinned.')
  }

  const duplicateNote = (note) => {
    setNotes((current) => [{ ...note, id: Date.now(), title: `${note.title} (copy)`, pinned: false, updated: 'Just now' }, ...current])
    setToast('Duplicate created.')
  }

  // -------------------------------------------------------------- Checklist
  const addTask = (event) => {
    event.preventDefault()
    if (!newTask.trim()) return
    setChecklist((current) => [...current, { id: `c${Date.now()}`, text: newTask.trim(), done: false }])
    setNewTask('')
  }

  const toggleTask = (id) =>
    setChecklist((current) => current.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))

  const doneCount = checklist.filter((item) => item.done).length
  const checklistProgress = checklist.length > 0 ? (doneCount / checklist.length) * 100 : 0

  return (
    <MainLayout>
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                              */}
      {/* ---------------------------------------------------------------- */}
      <PageHero
        badge={
          <>
            <FiLock /> Encrypted vault · 36 notes synced
          </>
        }
        title="KT"
        highlight="Notes & Self-Chat"
        description="Message yourself, pin what matters, record a thought while walking — and keep every word sealed on your device before it ever syncs."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => openNewNote()}>
              Create a note <FiPlus />
            </Button>
            <Button size="lg" variant="onDark" onClick={openDownloadModal}>
              Get the app <FiZap />
            </Button>
          </>
        }
        chips={[
          { icon: <FiShield />, label: 'Sealed before sync' },
          { icon: <FiWifiOff />, label: 'Fully offline capable' },
          { icon: <FiMic />, label: 'On-device transcription' },
        ]}
        aside={
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="flex items-center gap-2 text-sm font-extrabold text-white">
                <FiEdit3 className="text-sky-400" /> Quick capture
              </span>
              <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-[10px] font-black uppercase text-sky-300">
                E2E encrypted
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => openNewNote()}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-sky-400/40 hover:bg-white/[0.07]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-strong text-white">
                  <FiPlus />
                </span>
                <span>
                  <span className="block text-xs font-bold text-white">New blank note</span>
                  <span className="block text-[10px] font-semibold text-slate-400">Starts empty, saves instantly</span>
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {noteTemplates.slice(0, 4).map((template) => (
                  <button
                    key={template.name}
                    type="button"
                    onClick={() =>
                      openNewNote({ title: template.name, content: template.body, category: template.category })
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-sky-400/40 hover:bg-white/[0.07]"
                  >
                    <span className="text-xl">{template.emoji}</span>
                    <span className="mt-1.5 block truncate text-[11px] font-bold text-white">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
              {[
                { value: notes.length, label: 'Notes' },
                { value: pinnedCount, label: 'Pinned' },
                { value: voiceMemos.length, label: 'Memos' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-base font-black text-white">{item.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-xl">
          <FiSearch className="ml-3 shrink-0 text-xl text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              resetPaging()
            }}
            placeholder="Search titles, content and tags across the vault…"
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                resetPaging()
              }}
              className="mr-2 shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Clear
            </button>
          ) : null}
        </div>
        {query ? (
          <p className="mt-3 text-xs font-semibold text-sky-300">
            {filtered.length} {filtered.length === 1 ? 'note matches' : 'notes match'} “{query}”
          </p>
        ) : null}
      </PageHero>

      <StatStrip items={STATS} />

      <PageNav items={NAV_ITEMS} />

      {/* ---------------------------------------------------------------- */}
      {/* VAULT                                                             */}
      {/* ---------------------------------------------------------------- */}
      <div id="vault" className="scroll-mt-36">
        <FilterBar
          chips={chips}
          active={activeCategory}
          onChange={(label) => {
            setActiveCategory(label)
            resetPaging()
          }}
          query={query}
          onQuery={(value) => {
            setQuery(value)
            resetPaging()
          }}
          placeholder="Search the vault…"
          right={
            <button
              type="button"
              onClick={() => openNewNote()}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-brand-strong px-3.5 text-[11px] font-bold text-white shadow-brand transition-colors hover:bg-brand-strong-hover"
            >
              <FiPlus /> New note
            </button>
          }
        />

        <Section className="bg-surface">
          <SectionHead
            eyebrow={`${filtered.length} notes`}
            title={activeCategory === 'All' ? 'Your encrypted vault' : activeCategory}
            description="Pinned notes float to the top. Tap any card to edit — changes are re-encrypted the moment you save."
          />

          {visible.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                icon={<FiSearch />}
                title="No notes match"
                description="Try another category, clear the search, or start a new note from scratch."
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setQuery('')
                        setActiveCategory('All')
                        resetPaging()
                      }}
                    >
                      Reset filters
                    </Button>
                    <Button onClick={() => openNewNote()}>
                      New note <FiPlus />
                    </Button>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((note, index) => (
                <Reveal key={note.id} from="up" delay={Math.min((index % 3) * 0.05, 0.15)} className="h-full">
                  <article
                    className={`flex h-full flex-col rounded-[24px] border p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                      COLOR_STYLES[note.color] ?? COLOR_STYLES.default
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-surface/80 px-3 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-ink">
                        {note.category}
                      </span>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => togglePin(note.id)}
                          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                          className={`grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-surface/70 ${
                            note.pinned ? 'text-brand-strong' : 'text-muted'
                          }`}
                        >
                          <FiBookmark className={note.pinned ? 'fill-current' : ''} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDraft({ ...note })}
                          aria-label="Edit note"
                          className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface/70 hover:text-ink"
                        >
                          <FiEdit3 />
                        </button>
                      </div>
                    </div>

                    <h3
                      role="link"
                      tabIndex={0}
                      onClick={() => setDraft({ ...note })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') setDraft({ ...note })
                      }}
                      className="mt-3 cursor-pointer text-base font-extrabold leading-snug text-ink transition-colors hover:text-brand-strong"
                    >
                      {note.title}
                    </h3>

                    <p className="mt-2 line-clamp-4 flex-1 whitespace-pre-line text-xs leading-relaxed text-body">
                      {note.content}
                    </p>

                    {note.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {note.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-surface/80 px-2.5 py-0.5 text-[10px] font-bold text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex items-center justify-between border-t border-line/70 pt-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted">
                        <FiLock /> {note.updated}
                      </span>

                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => duplicateNote(note)}
                          aria-label="Duplicate note"
                          className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface/70 hover:text-ink"
                        >
                          <FiCopy />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNote(note.id)}
                          aria-label="Delete note"
                          className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          {visibleCount < filtered.length ? (
            <div className="mt-12 flex flex-col items-center gap-3">
              <Button variant="secondary" size="lg" onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}>
                Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more notes
              </Button>
              <span className="text-xs font-semibold text-muted">
                Showing {visible.length} of {filtered.length}
              </span>
            </div>
          ) : null}
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CHECKLIST                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Section id="checklist" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Checklists"
          title="Tick things off and watch the bar move"
          description="Add an item, mark it done, clear the finished ones. Everything below is live — try it."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Reveal from="up">
            <div className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-ink">Things to do</h3>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-black text-brand-ink">
                  {doneCount}/{checklist.length} done
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-brand-strong transition-[width] duration-500"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>

              <form onSubmit={addTask} className="mt-6 flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value)}
                  placeholder="Add an item…"
                  aria-label="New checklist item"
                  className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm font-semibold text-ink outline-none focus:border-brand/60 placeholder:font-medium placeholder:text-muted dark:bg-cream-2"
                />
                <Button type="submit" className="shrink-0" aria-label="Add item">
                  <FiPlus />
                </Button>
              </form>

              {checklist.length === 0 ? (
                <p className="py-10 text-center text-sm font-semibold text-muted">
                  Nothing on the list. Add the first item above.
                </p>
              ) : (
                <ul className="mt-5 space-y-2">
                  {checklist.map((item) => (
                    <li key={item.id}>
                      <div
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-colors ${
                          item.done ? 'border-line bg-cream opacity-65 dark:bg-cream-2' : 'border-line bg-cream dark:bg-cream-2'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTask(item.id)}
                          aria-pressed={item.done}
                          aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                            item.done ? 'border-brand-strong bg-brand-strong text-white' : 'border-line text-transparent hover:border-brand/50'
                          }`}
                        >
                          <FiCheck className="text-sm" />
                        </button>

                        <span
                          className={`flex-1 text-sm font-semibold ${item.done ? 'text-muted line-through' : 'text-ink'}`}
                        >
                          {item.text}
                        </span>

                        <button
                          type="button"
                          onClick={() => setChecklist((current) => current.filter((task) => task.id !== item.id))}
                          aria-label="Remove item"
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {doneCount > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setChecklist((current) => current.filter((item) => !item.done))
                    setToast(`${doneCount} completed ${doneCount === 1 ? 'item' : 'items'} cleared.`)
                  }}
                  className="mt-5 text-xs font-bold text-brand-ink underline-offset-4 hover:underline"
                >
                  Clear {doneCount} completed
                </button>
              ) : null}
            </div>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              {[
                {
                  icon: <FiCheckCircle />,
                  title: 'Completed items fade back',
                  desc: 'Finished tasks dim rather than vanish, so you can still see what you got through today.',
                },
                {
                  icon: <FiRefreshCw />,
                  title: 'Shared lists stay in step',
                  desc: 'Send a checklist into a group and everyone ticks the same boxes, updated live.',
                },
                {
                  icon: <FiBell />,
                  title: 'Attach a reminder',
                  desc: 'Give any list a time and it comes back as a message when it is due, not before.',
                },
                {
                  icon: <FiLock />,
                  title: 'Encrypted like everything else',
                  desc: 'Checklists are sealed on your device. The sync server only ever sees ciphertext.',
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-1 items-start gap-4 rounded-[24px] border border-line bg-surface p-5 shadow-soft">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* VOICE MEMOS                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section id="voice" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Voice memos"
          title="Speak it now, edit it later"
          description="Transcription runs on-device using the local model, so neither the audio nor the transcript leaves your phone."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {voiceMemos.map((memo, index) => {
            const isPlaying = playingMemo === memo.title
            return (
              <Reveal key={memo.title} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
                <div className="flex h-full flex-col rounded-[24px] border border-line bg-cream p-5 shadow-soft dark:bg-cream-2">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setPlayingMemo(isPlaying ? null : memo.title)}
                      aria-label={isPlaying ? `Pause ${memo.title}` : `Play ${memo.title}`}
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors ${
                        isPlaying ? 'bg-brand-strong text-white shadow-brand' : 'bg-brand-soft text-brand-ink hover:bg-brand-soft/70'
                      }`}
                    >
                      {isPlaying ? <FiPause /> : <FiPlay />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-ink">{memo.title}</h3>
                      <p className="mt-0.5 text-[11px] font-semibold text-muted">{memo.when}</p>
                    </div>
                  </div>

                  {/* Static waveform — bar heights vary by index so each memo looks distinct. */}
                  <div className="mt-4 flex h-10 items-end gap-[3px]" aria-hidden="true">
                    {Array.from({ length: 28 }).map((_, bar) => {
                      const height = 20 + ((bar * 37 + index * 13) % 80)
                      return (
                        <span
                          key={bar}
                          className={`flex-1 rounded-full transition-colors ${isPlaying ? 'bg-brand-strong' : 'bg-line'}`}
                          style={{ height: `${height}%` }}
                        />
                      )
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11px] font-bold text-muted">
                    <span className="flex items-center gap-1.5">
                      <FiClock /> {memo.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiLock /> {memo.size}
                    </span>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TEMPLATES                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Section id="templates" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Templates"
          title="Never start from a blank page"
          description="Eight starting points for the notes you write over and over. Tap one and it opens pre-filled."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {noteTemplates.map((template, index) => (
            <Reveal key={template.name} from="up" delay={Math.min(index * 0.04, 0.24)} className="h-full">
              <button
                type="button"
                onClick={() => openNewNote({ title: template.name, content: template.body, category: template.category })}
                className="group flex h-full w-full flex-col items-start rounded-[24px] border border-line bg-surface p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-card"
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">{template.emoji}</span>
                <span className="mt-3 text-sm font-extrabold text-ink">{template.name}</span>
                <span className="mt-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-ink">
                  {template.category}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-brand-ink">
                  Use template <FiChevronRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* REMINDERS                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Section id="reminders" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Reminders"
          title="Notes that come back at the right moment"
          description="Attach a time to any note and it arrives as an ordinary message — no separate reminders app to check."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder, index) => (
            <Reveal key={reminder.title} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
              <div className="flex h-full items-start gap-4 rounded-[24px] border border-line bg-cream p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card dark:bg-cream-2">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg ${REMINDER_TONES[reminder.tone]}`}>
                  <FiBell />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold leading-snug text-ink">{reminder.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-muted">
                    <FiClock /> {reminder.when}
                  </p>
                  <span className="mt-2 inline-block rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-muted">
                    {reminder.repeat}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SELF-CHAT                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Section id="selfchat" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHead
            align="left"
            eyebrow="Message yourself"
            title="The fastest capture surface you already have"
            description="Your own chat thread is an inbox for links, photos, voice notes and half-formed thoughts. File them into notes whenever you get a minute — or never."
          >
            <ul className="mt-8 space-y-3">
              {[
                'Forward anything from any chat into your own thread in two taps.',
                'Search it later exactly like any other conversation.',
                'Convert a message into a full note without retyping it.',
                'Everything stays end-to-end encrypted, including to yourself.',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-brand-strong" />
                  {point}
                </li>
              ))}
            </ul>
          </SectionHead>

          <Reveal from="scale" delay={0.08}>
            <div className="mx-auto w-full max-w-sm rounded-[32px] border border-line bg-surface p-4 shadow-float">
              <div className="flex items-center gap-3 border-b border-line pb-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-strong text-sm font-black text-white">
                  You
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-ink">Message yourself</div>
                  <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    End-to-end encrypted
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 py-4">
                {[
                  { text: 'Flight JL-748 · 12:40 · Terminal 3', time: '09:12' },
                  { text: 'Idea: receipt parser inside chat 💡', time: '09:40' },
                  { text: '🎙️ Voice memo · 0:38', time: '10:05', voice: true },
                  { text: 'Ryokan booking ref #84920', time: '11:22' },
                  { text: 'Remind me: verify recovery share', time: '13:04' },
                ].map((message) => (
                  <div key={message.text} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-soft px-3.5 py-2.5">
                      <p className="text-xs font-semibold leading-relaxed text-ink">{message.text}</p>
                      <span className="mt-1 flex items-center justify-end gap-1 text-[9px] font-bold text-brand-ink/70">
                        {message.voice ? <FiMic /> : null}
                        {message.time} <FiCheck />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-line pt-3">
                <div className="flex h-10 flex-1 items-center rounded-full border border-line bg-cream px-4 text-xs font-medium text-muted dark:bg-cream-2">
                  Type a note to yourself…
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-strong text-white">
                  <FiMic />
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SYNC                                                              */}
      {/* ---------------------------------------------------------------- */}
      <Section id="sync" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Sync"
          title="Six devices, one vault"
          description="Every device shows when it last synced, and you can revoke any of them without touching the others."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {syncDevices.map((device, index) => (
            <Reveal key={device.name} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
              <div className="flex h-full items-center gap-4 rounded-[24px] border border-line bg-cream p-5 shadow-soft dark:bg-cream-2">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface text-2xl">
                  {device.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-extrabold text-ink">{device.name}</h3>
                  <p className="truncate text-[11px] font-semibold text-muted">{device.kind}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {device.status}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setToast(`${device.name} signed out of your vault.`)}
                  className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 text-[10px] font-bold text-muted transition-colors hover:border-rose-400 hover:text-rose-600"
                >
                  Revoke
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* ENCRYPTION                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Section id="encryption" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Encryption"
          title="What “encrypted” actually means here"
          description="Four honest specifics, including the tradeoff most products leave out."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {[
            {
              icon: <FiLock />,
              title: 'Sealed before it leaves',
              desc: 'Notes are encrypted with a key derived on your device. Sync only ever transports ciphertext.',
            },
            {
              icon: <FiRefreshCw />,
              title: 'Keys rotate on schedule',
              desc: 'Session keys rotate automatically, so a compromised key exposes a narrow window rather than your history.',
            },
            {
              icon: <FiShield />,
              title: 'Attachments included',
              desc: 'Images, PDFs and voice memos are encrypted with the same key material as the note text.',
            },
            {
              icon: <FiDownload />,
              title: 'Recovery is your responsibility',
              desc: 'Because we hold no key, losing every recovery share means the vault is unrecoverable. Store shares apart.',
            },
          ].map((item, index) => (
            <Reveal key={item.title} from="up" delay={index * 0.06} className="h-full">
              <div className="flex h-full items-start gap-4 rounded-[24px] border border-line bg-surface p-6 shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-ink">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SHORTCUTS + TIPS                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Section id="shortcuts" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Keyboard shortcuts"
          title="Ten keys worth learning"
          description="The desktop and web clients share the same bindings."
        />

        <Reveal from="up" className="mt-12 overflow-hidden rounded-[26px] border border-line bg-cream shadow-card dark:bg-cream-2">
          <ul className="divide-y divide-line sm:grid sm:grid-cols-2 sm:divide-y-0">
            {shortcuts.map((shortcut) => (
              <li key={shortcut.keys} className="flex items-center justify-between gap-4 border-line px-5 py-4 sm:border-b">
                <span className="text-sm font-semibold text-body">{shortcut.action}</span>
                <kbd className="shrink-0 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-black text-ink">
                  {shortcut.keys}
                </kbd>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-20">
          <SectionHead eyebrow="Tips" title="Six habits that make a vault useful" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notesTips.map((tip, index) => (
              <Reveal key={tip.title} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
                <div className="flex h-full flex-col rounded-[24px] border border-line bg-cream p-6 shadow-soft dark:bg-cream-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-sm font-black text-brand-ink">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-base font-extrabold leading-snug text-ink">{tip.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{tip.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FEATURES + STEPS                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead eyebrow="What you get" title="Nine things the vault does well" />
        <FeatureGrid className="mt-12" items={notesFeatures.map((item, index) => ({ ...item, icon: FEATURE_ICONS[index] }))} />

        <div className="mt-20">
          <SectionHead eyebrow="How it works" title="Capture, file, act" />
          <Steps className="mt-12" items={notesSteps.map((item, index) => ({ ...item, icon: STEP_ICONS[index] }))} />
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TESTIMONIALS                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section className="bg-surface">
        <SectionHead eyebrow="People who keep notes here" title="What actually changed for them" />
        <Testimonials className="mt-12" items={notesTestimonials} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="faq" container={false} className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow="FAQ" title="Encryption, sync and recovery" />
          <div className="mt-12">
            <FaqAccordion items={notesFaqs} placeholder="Search the FAQ…" />
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA + RELATED                                                     */}
      {/* ---------------------------------------------------------------- */}
      <CtaBand
        eyebrow="Start writing"
        title="A vault that only you can open"
        description="Notes, checklists and voice memos sealed on your device, synced across everything you own, and readable with no signal at all."
        actions={
          <>
            <Button size="lg" variant="white" onClick={openDownloadModal}>
              Download KT Messenger
            </Button>
            <Button size="lg" variant="onDark" onClick={() => openNewNote()}>
              Try the editor
            </Button>
          </>
        }
        points={['End-to-end encrypted', 'Works fully offline', 'On-device transcription', 'Export any time']}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow="Keep exploring" title="More of KT Messenger" />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* NOTE EDITOR MODAL                                                 */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={Boolean(draft)}
        onClose={() => setDraft(null)}
        eyebrow={draft?.id ? 'Editing note' : 'New note'}
        title={draft?.id ? draft.title : 'Create a note'}
        size="md"
        footer={
          draft ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {draft.id ? (
                <button
                  type="button"
                  onClick={() => deleteNote(draft.id)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-xs font-bold text-body transition-colors hover:border-rose-400 hover:text-rose-600"
                >
                  <FiTrash2 /> Delete
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
                  <FiLock /> Encrypted before it syncs
                </span>
              )}

              <Button type="submit" form="note-editor">
                {draft.id ? 'Save changes' : 'Save to vault'} <FiCheck />
              </Button>
            </div>
          ) : null
        }
      >
        {draft ? (
          <form id="note-editor" onSubmit={saveDraft}>
            <label htmlFor="note-title" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
              Title
            </label>
            <input
              id="note-title"
              type="text"
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Flight booking confirmation"
              className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm font-bold text-ink outline-none focus:border-brand/60 placeholder:font-medium placeholder:text-muted dark:bg-cream-2"
            />

            <label htmlFor="note-body" className="mb-1.5 mt-5 block text-[11px] font-black uppercase tracking-wide text-muted">
              Content
            </label>
            <textarea
              id="note-body"
              value={draft.content}
              onChange={(event) => setDraft({ ...draft, content: event.target.value })}
              rows={7}
              placeholder="Write the details, or paste a link…"
              className="w-full resize-none rounded-2xl border border-line bg-cream p-4 text-sm font-semibold leading-relaxed text-ink outline-none focus:border-brand/60 placeholder:font-medium placeholder:text-muted dark:bg-cream-2"
            />

            <label htmlFor="note-category" className="mb-1.5 mt-5 block text-[11px] font-black uppercase tracking-wide text-muted">
              Category
            </label>
            <select
              id="note-category"
              value={draft.category}
              onChange={(event) => setDraft({ ...draft, category: event.target.value })}
              className="h-12 w-full rounded-2xl border border-line bg-cream px-3 text-sm font-bold text-ink outline-none focus:border-brand/60 dark:bg-cream-2"
            >
              {noteCategories
                .filter((category) => category !== 'All')
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>

            <span className="mb-2 mt-5 block text-[11px] font-black uppercase tracking-wide text-muted">Colour</span>
            <div className="flex flex-wrap gap-2">
              {noteColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setDraft({ ...draft, color })}
                  aria-label={`Use ${color} colour`}
                  aria-pressed={draft.color === color}
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 transition-all ${
                    draft.color === color ? 'border-brand-strong scale-110' : 'border-transparent'
                  }`}
                >
                  <span className={`h-7 w-7 rounded-full ${COLOR_SWATCHES[color]}`} />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setDraft({ ...draft, pinned: !draft.pinned })}
              aria-pressed={draft.pinned}
              className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-xs font-bold transition-colors ${
                draft.pinned ? 'border-brand-strong bg-brand-soft text-brand-ink' : 'border-line text-body hover:bg-surface-2'
              }`}
            >
              <FiBookmark className={draft.pinned ? 'fill-current' : ''} />
              {draft.pinned ? 'Pinned to top' : 'Pin to top'}
            </button>
          </form>
        ) : null}
      </Modal>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}
