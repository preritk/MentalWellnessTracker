import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Shared design primitives — used everywhere so screens stay consistent.
// ---------------------------------------------------------------------------

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

/** Standard entrance animation (respects reduced-motion via CSS override). */
export const riseIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
}

/** Stagger container + child for card grids. */
export const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.07 } },
  },
  item: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  },
}

interface CardProps extends HTMLMotionProps<'section'> {
  children: ReactNode
  className?: string
  /** Render with the glass surface (default true). */
  glass?: boolean
}

export function Card({ children, className, glass = true, ...rest }: CardProps) {
  return (
    <motion.section
      className={cx(
        'rounded-3xl p-5 sm:p-6 shadow-[var(--shadow-card)]',
        glass ? 'glass' : 'bg-[var(--surface)]',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.section>
  )
}

interface SectionTitleProps {
  children: ReactNode
  sub?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function SectionTitle({ children, sub, as = 'h2', className }: SectionTitleProps) {
  const Heading = as
  return (
    <div className={cx('mb-3', className)}>
      <Heading
        className={cx(
          'font-[var(--font-display)] tracking-tight text-[var(--ink)]',
          as === 'h1' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl',
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {children}
      </Heading>
      {sub && <p className="mt-1 text-sm text-[var(--ink-soft)]">{sub}</p>}
    </div>
  )
}

type Variant = 'primary' | 'ghost' | 'soft' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-500)] shadow-[var(--shadow-soft)]',
  soft: 'bg-[var(--color-brand-300)]/25 text-[var(--color-brand-600)] hover:bg-[var(--color-brand-300)]/40',
  ghost: 'bg-transparent text-[var(--ink)] hover:bg-[var(--hairline)]',
  danger: 'bg-red-600/90 text-white hover:bg-red-600',
}

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold',
        'transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: ReactNode
}

export function Chip({ active, className, children, role, ...rest }: ChipProps) {
  // When used as a radio/option (role supplied), aria-pressed is invalid ARIA —
  // the caller drives state via aria-checked/aria-selected instead.
  const ariaPressed = role ? undefined : active
  return (
    <button
      type="button"
      role={role}
      aria-pressed={ariaPressed}
      className={cx(
        'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150',
        'border',
        active
          ? 'bg-[var(--color-brand-500)] text-white border-transparent'
          : 'bg-transparent text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--hairline)]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/** A calm, polite empty-state block. */
export function EmptyState({ emoji, children }: { emoji: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-[var(--ink-soft)]">
      <span className="text-3xl" aria-hidden>
        {emoji}
      </span>
      <p className="max-w-xs text-sm">{children}</p>
    </div>
  )
}
