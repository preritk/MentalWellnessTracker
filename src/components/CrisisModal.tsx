import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useT } from '../lib/i18n'
import { Button } from './ui'

export interface Helpline {
  name: string
  number: string
  note: string
}

// Verified India-wide helplines (free, confidential). Numbers should be re-verified
// before any real launch and localised by state.
export const HELPLINES: Helpline[] = [
  { name: 'Tele-MANAS (Govt of India)', number: '14416', note: '24×7 · multilingual' },
  { name: 'iCall (TISS)', number: '9152987821', note: 'Mon–Sat, 10am–8pm' },
  { name: 'Vandrevala Foundation', number: '18602662345', note: '24×7' },
  { name: 'KIRAN Mental Health', number: '18005990019', note: '24×7 · 13 languages' },
]

interface Props {
  open: boolean
  onClose: () => void
}

/** Modal dialog listing verified crisis helplines, with a focus trap and return-focus. */
export function CrisisModal({ open, onClose }: Props) {
  const { t } = useT()
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  // Remember what had focus before the dialog opened, so we can restore it on close.
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') trapFocus(e, dialogRef.current)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      // Restore focus to the trigger after the dialog has unmounted.
      const toFocus = returnFocusRef.current
      requestAnimationFrame(() => toFocus?.focus())
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="crisis-title"
            className="glass relative w-full max-w-md rounded-3xl p-6 shadow-[var(--shadow-soft)]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <h2
              id="crisis-title"
              className="text-xl font-semibold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('crisis.title')}
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{t('crisis.body')}</p>

            <ul className="mt-4 space-y-2">
              {HELPLINES.map((h) => (
                <li
                  key={h.number}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--hairline)] p-3"
                >
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{h.name}</p>
                    <p className="text-xs text-[var(--ink-soft)]">{h.note}</p>
                  </div>
                  <a
                    href={`tel:${h.number}`}
                    aria-label={`Call ${h.name} at ${h.number}`}
                    className="rounded-2xl bg-[var(--color-brand-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-500)]"
                  >
                    {t('crisis.call')} {h.number}
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs text-[var(--ink-soft)]">{t('crisis.disclaimer')}</p>

            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={onClose}>
                {t('common.close')}
              </Button>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label={t('common.close')}
              className="absolute right-4 top-4 rounded-full p-1 text-[var(--ink)] hover:bg-[var(--hairline)]"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Keep Tab/Shift+Tab focus cycling within the dialog's focusable elements. */
function trapFocus(e: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return
  const focusable = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
  )
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
