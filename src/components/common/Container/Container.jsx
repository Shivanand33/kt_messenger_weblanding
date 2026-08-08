/**
 * Page gutter + max width. Pass `maxW` (a Tailwind max-w-* class) to narrow a
 * single block — reading columns, forms, FAQ lists — without losing the shared
 * horizontal padding.
 */
export function Container({ children, className = '', maxW = 'max-w-[1200px]' }) {
  return <div className={`mx-auto w-full ${maxW} px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}
