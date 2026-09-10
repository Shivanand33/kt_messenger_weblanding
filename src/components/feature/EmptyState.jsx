import { FiInbox } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'

/** Shown when a search or filter combination returns nothing. */
export function EmptyState({ icon = <FiInbox />, title, description, action }) {
  const { t } = useLanguage()
  return (
    <div className="rounded-[28px] border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-2xl text-brand-ink">
        {icon}
      </span>
      <h3 className="mt-5 text-lg font-extrabold text-ink">{t(title)}</h3>
      {description ? <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-body">{t(description)}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
