# 🌿 MindMitra

A calm, private **wellbeing companion for Indian exam aspirants** (NEET / JEE) — a responsive
web app to track mood, spot stress triggers, reflect, and get the right support across the
whole journey: **prep → exam week → result day.**

> Built as a frontend-only hackathon MVP. **No backend.** All data lives in the browser's
> `sessionStorage` and is wiped when the tab closes — privacy by default, ideal for shared or
> family computers.

## Highlights

- **Exam-calendar aware.** The app knows whether you're in prep, exam week, or result season
  and shifts its tone, suggestions, and surfaces (Exam Mode / Result Mode) accordingly.
- **Mood check-in** — a fast 5-state spectrum with trigger chips, intensity, and a
  "same as yesterday?" shortcut.
- **Right-Now support** — a transparent, capacity-aware rules engine picks one well-timed
  micro-intervention (breathe, reframe, rest, ground, or *talk to a human*).
- **The Quiet Page** — guided + free journaling, a **vent-and-burn** option (write, then let it
  go — nothing is saved), and a sealed *letter to result-day you*.
- **Patterns** — an animated mood "river", a trigger map, and a gentle weekly digest focused on
  coping wins, never a score to maximize.
- **Always-on crisis support** — verified India helplines (Tele-MANAS, iCall, Vandrevala,
  KIRAN) reachable from every screen.
- **English + हिन्दी**, light/dark mode, `prefers-reduced-motion`-aware animations, and a
  **WCAG 2.1 AA** accessibility bar.

## What this is *not*
Not a diagnostic/clinical tool, not therapy, and not a parent/coaching surveillance dashboard.
It's a companion that helps you reflect and points you to real human help when you need it.

## Tech stack
Vite · React 18 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Recharts ·
React Router · Vitest + Testing Library + vitest-axe.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 53 unit/component/a11y tests
npm run build      # type-check + production build
```

## Demo tips
- In **You & Privacy → Load sample data**, seed ~3 weeks of realistic check-ins so the
  Patterns charts and trigger map look alive. Clear it anytime.
- Set an **exam date** within 5 days during onboarding to trigger **Exam Mode**; set a
  **result date** of today to open **Result Mode** (and unseal your letter).

## Project structure
```
src/
  lib/          storage (sessionStorage), i18n (en/hi), phase engine,
                trigger taxonomy, intervention rules engine, insights, seed data
  components/   ui primitives, Layout, CrisisModal, MoodPicker, BreathingExercise
  pages/        Onboarding, Today, Journal, Patterns, Toolkit, ExamMode, ResultMode, Settings
  test/         vitest setup + matcher types
```

## Privacy & safety notes
- Data is stored only in `sessionStorage` (this tab) and never sent anywhere.
- Crisis routing is never paywalled and is reachable from every screen.
- Helpline numbers should be re-verified and localized before any real launch.
