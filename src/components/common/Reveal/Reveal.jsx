import { motion } from 'framer-motion'

const EASE = [0.22, 0.61, 0.36, 1]

const variants = {
  up: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
}

/**
 * Scroll-reveal wrapper — a single source of truth for the page's entrance
 * animations so every section fades/slides in with the same easing and feel.
 */
export function Reveal({
  children,
  as = 'div',
  from = 'up',
  delay = 0,
  duration = 0.7,
  amount = 0.3,
  once = true,
  className = '',
  ...props
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants[from] || variants.up}
      transition={{ duration, ease: EASE, delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
