export function Badge({ children, className = '' }) {
  return <span className={`inline-flex items-center rounded-full border border-[#dff7e8] bg-[#edfff3] px-3 py-1 text-sm font-semibold text-[#1b7a42] transition-colors duration-300 dark:border-[#2f3740] dark:bg-[#1c242c] dark:text-white ${className}`}>{children}</span>
}
