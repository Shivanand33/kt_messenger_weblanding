import { Container } from '../Container/Container'

/**
 * Standardises the vertical rhythm between page sections so every block
 * shares the same breathing space. Set `container={false}` for full-bleed
 * sections that manage their own inner width.
 */
export function Section({ id, children, className = '', container = true, containerClassName = '', ...props }) {
  const content = container ? <Container className={containerClassName}>{children}</Container> : children
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-28 ${className}`} {...props}>
      {content}
    </section>
  )
}
