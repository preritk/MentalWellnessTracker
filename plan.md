# MindMitra — Frontend-only Hackathon MVP (plan)

## Context
We need a demoable, browser-based wellbeing companion for Indian exam aspirants (NEET/JEE),
built in ~1 hour for a hackathon. **No backend** — all data lives in the browser via
`localStorage`. This doubles as our privacy story ("private, on your device, not a parental
dashboard"). Stack is already scaffolded: Vite + React 18 + TS + Tailwind v4 + react-router
+ recharts (`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html` exist; deps not
yet installed).

Decisions locked with the user: **seed sample data + reset toggle**, **English + Hindi
toggle (lightweight i18n for key strings)**, and **all surfaces in scope** (core loop,
Patterns, Exam/Result modes, Crisis + Settings).

Tasks are ordered so the **core loop is demoable first**; richer surfaces layer on after. If
time runs out, everything through Task 8 is a complete demo.

## Architecture
- `localStorage` single namespaced key `mindmitra.v1`, JSON blob, schema-versioned.
- Lightweight i18n: a `t(key)` dict (`en`/`hi`) + language in profile; translate key surfaces
  and all nudge/prompt copy, not every micro-label.
- Phase engine derives prep / exam-week / result-wait / result-day / general from `examDate`.
- Rules-based "Right-Now" intervention picker (no ML) keyed on mood × phase × time × triggers.
- **Motion: add `framer-motion`** for page transitions, card entrances, and micro-interactions.

## Visual & motion design (first-class — must look great)
- **Aesthetic:** calm, premium, low-arousal. Soft gradient backgrounds (muted blue-green →
  warm lilac), glassmorphism cards (subtle blur + soft shadow), generous whitespace, rounded
  2xl corners, a friendly variable font (Inter/Nunito via Google Fonts), tasteful emoji/icon
  accents. Light + dark mode; dark is the late-night-study default-friendly palette.
- **Hero touches:** an animated ambient gradient/"breathing" background, a draggable
  **emotion color-wheel** for mood nuance, and a flowing mood "river" chart (gradient area,
  animated draw-in) rather than a clinical line.
- **Motion language (Framer Motion):** soft fade+rise entrances (staggered for card grids),
  spring-based mood-selection feedback, animated route transitions, a genuinely animated
  **breathing exercise** (expanding/contracting orb synced to 4-7-8 timing), confetti-free
  gentle celebration on Result-Day positive branch. Keep all motion calm and `prefers-reduced
  -motion`-aware — never jittery/stressful (aligns with "calm over engagement").
- **Tailwind setup:** define palette + shadows in CSS theme tokens; reusable `Card`,
  `Button`, `Chip`, `SectionTitle` primitives so every screen feels consistent and polished.

## Testing & code quality
- **Vitest + React Testing Library + jsdom** for unit/component tests; **vitest-axe** for
  automated a11y assertions. `npm test` runs the suite headless.
- Pure logic gets the most coverage: `phase`, `interventions` (rules engine),
  `insights`, `storage` (load/save/version guard, vent-and-burn never persisted).
- Each page/component ships at least one render + key-interaction test + an axe check.
- Quality bar: TS `strict`, no `any` in domain code, shared primitives (no copy-paste UI),
  small focused files, clear prop types, no dead code.

## Accessibility (top-notch — WCAG 2.1 AA target)
- Semantic landmarks (`nav`/`main`/`header`), correct heading order, labelled controls.
- Full keyboard operability (mood picker, chips, modal focus-trap + Esc, skip-to-content link).
- Visible focus rings; AA color contrast in light **and** dark mode; never color-only meaning
  (mood = color + word + emoji).
- `aria-live` for check-in confirmation + Right-Now suggestion updates.
- `prefers-reduced-motion` disables non-essential animation; all motion is calming by design.
- Crisis affordance reachable by keyboard from every screen.

## Data model (localStorage `mindmitra.v1`)
- `profile`: { name, exam, examDate, resultDate?, language: 'en'|'hi', checkInTime, onboarded }
- `checkIns`: [{ id, ts, mood: Drained|Low|Okay|Steady|Bright, triggers: string[], intensity, note }]
- `journal`: [{ id, ts, prompt, text, mood }]  (vent-and-burn entries are NOT persisted)
- `feedback`: [{ id, ts, interventionId, helpful: boolean }]
- `selfLetter`: { text, sealedUntil } | null
- `settings`: { sharing: false, seeded: boolean }

## Tasks (small, ordered)

1. **Finalize scaffold + boot + design tokens** — `src/main.tsx`, `src/index.css`
   (`@import "tailwindcss"` + theme tokens: palette, gradients, shadows, font), Google Font,
   `src/App.tsx` (router + onboarding gate + animated route transitions). Add `framer-motion`
   to deps. Run `npm install`, confirm `npm run dev` boots.

2. **Storage + types + i18n** — `src/lib/storage.ts` (typed load/save, `useStore` hook,
   version guard), `src/lib/i18n.ts` (`en`/`hi` dict + `useT`), `src/lib/seed.ts`
   (3 weeks of demo check-ins/journal + reset).

3. **Domain logic** — `src/lib/phase.ts` (phase from dates), `src/lib/triggers.ts`
   (India-specific taxonomy), `src/lib/interventions.ts` (library + `pickIntervention`),
   `src/lib/insights.ts` (mood trend series, trigger frequency map, bounce-back).

4. **Design primitives + Layout + Crisis** — shared `Card`/`Button`/`Chip`/`SectionTitle`
   primitives + animated gradient background. `src/components/Layout.tsx` (left sidebar → top
   nav on mobile, phase banner, language toggle, dark-mode toggle, persistent "I need help
   now"), `src/components/CrisisModal.tsx` (animated reveal; verified India helplines:
   Tele-MANAS 14416, iCall 9152987821, Vandrevala 1860-2662-345, KIRAN 1800-599-0019; calm,
   not alarming).

5. **Onboarding** — `src/pages/Onboarding.tsx`: name, exam, exam/result dates, language,
   "what I am / am not" + privacy reassurance, try-a-check-in-first.

6. **Mood check-in** — `src/components/MoodPicker.tsx`: animated 5-state spectrum (spring
   feedback on select) + draggable emotion color-wheel + trigger chips + intensity;
   "Same as yesterday?" shortcut. Writes a check-in.

7. **Today dashboard** — `src/pages/Today.tsx`: multi-panel (check-in card · Right-Now
   suggestion via `pickIntervention` · gentle insight rail). Capacity-aware copy.

8. **Quiet Page (journal)** — `src/pages/Journal.tsx`: phase-aware guided prompts, free-write,
   **vent-and-burn** (Keep vs Let it go), sealed "letter to result-day you".

9. **Patterns** — `src/pages/Patterns.tsx`: animated mood "river" gradient area chart
   (recharts, draw-in), trigger-map bubbles, weekly narrative digest. Reads seeded data so it
   looks alive.

10. **Toolkit** — `src/pages/Toolkit.tsx`: intervention library grid (staggered entrance) +
    `src/components/BreathingExercise.tsx`: a genuinely animated expanding/contracting orb
    synced to 4-7-8 / box timing.

11. **Exam & Result modes** — `src/pages/ExamMode.tsx` (stripped, grounding, no ranks),
    `src/pages/ResultMode.tsx` (pre-result reassurance, unseal self-letter, post-result
    branch with visible helplines). Auto-suggested when phase matches.

12. **Settings + polish** — `src/pages/Settings.tsx`: language, sharing (default off),
    **export JSON**, **delete everything**, "clear this device / sign out". Then responsive
    + dark-mode + empty-state polish, and `plan.md` + README in repo root.

## Execution — parallel agents (to avoid file conflicts)
**Stage A — Foundation (I build directly, sequential):** all *shared* files so parallel
agents have stable contracts to import. Configs (done) + test setup (vitest config, deps:
`framer-motion`, `vitest`, `@testing-library/react`, `jsdom`, `vitest-axe`), `index.css`
tokens, `main.tsx`, `App.tsx` router (routes pre-wired to expected page paths), `lib/*`
(storage+types, i18n, seed, phase, triggers, interventions, insights), shared primitives
(`Card`/`Button`/`Chip`/`SectionTitle`/`AmbientBackground`), `Layout.tsx`, `CrisisModal.tsx`.
Then `npm install` once. Foundation logic ships with its own tests.

**Stage B — Fan out (parallel Agent calls, single message):** each agent owns a disjoint set
of leaf files, imports only from Stage A, writes its own tests, runs no install/build:
- Agent 1: `pages/Onboarding.tsx` (+ test)
- Agent 2: `pages/Today.tsx` + `components/MoodPicker.tsx` (+ tests)
- Agent 3: `pages/Journal.tsx` (+ test)
- Agent 4: `pages/Patterns.tsx` (+ test)
- Agent 5: `pages/Toolkit.tsx` + `components/BreathingExercise.tsx` (+ tests)
- Agent 6: `pages/ExamMode.tsx` + `pages/ResultMode.tsx` (+ tests)
- Agent 7: `pages/Settings.tsx` (+ test)
Each agent prompt includes the exact import contracts, design tokens/primitives, i18n usage,
and the a11y + test checklist above.

**Stage C — Integrate (I do it):** `npm run build` + `npm test`, fix any contract drift,
responsive/dark-mode/empty-state polish pass, add repo `plan.md` + README.

## Files (new, representative)
- `src/main.tsx`, `src/App.tsx`, `src/index.css`
- `src/lib/{storage,i18n,seed,phase,triggers,interventions,insights}.ts`
- `src/components/{Layout,CrisisModal,MoodPicker,Card,BreathingExercise}.tsx`
- `src/pages/{Onboarding,Today,Journal,Patterns,Toolkit,ExamMode,ResultMode,Settings}.tsx`

## Verification
- `npm install` succeeds; `npm run dev` serves with no console/TS errors.
- Onboard a profile → land on Today → log a mood → see a phase/mood-appropriate Right-Now
  suggestion → write + "let go" of a journal entry (confirm it is NOT persisted) → Keep one
  (confirm it persists across reload).
- Toggle seed data: Patterns shows a populated mood river + trigger map; reset clears it.
- Set `examDate` near today → app surfaces Exam Mode; set `resultDate` to today → Result Mode
  unseals the self-letter.
- Switch language EN↔HI → key surfaces + nudge copy change.
- **Visual/motion check:** route transitions, card entrance stagger, mood-select spring,
  breathing-orb animation, and animated mood river all render smoothly; `prefers-reduced-motion`
  disables them gracefully; light + dark mode both look polished.
- Settings → export downloads JSON; delete-all clears `localStorage` and returns to onboarding.
- `npm run build` (`tsc -b && vite build`) passes.

## Notes / cut-lines if time runs short
- i18n covers key surfaces + all nudge/prompt copy, not every label.
- Peer "Together" wall is deferred (moderation risk, low demo value).
- No ML: intervention picker is transparent rules — also the safer choice for this domain.
