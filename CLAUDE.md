@AGENTS.md

# Hoops Lab — Project Context

## What this is

A personal data science website for Riley Meredith (GitHub: mezz2). The first and currently only page is **Hoops Lab** — a project hub for practising data science techniques using NBA data. It is the starting point of a larger personal website that will grow over time.

The goal of Hoops Lab is educational: Riley uses real NBA datasets to build data science intuition across topics like player valuation, shot quality modelling, lineup optimisation, draft projection, and play clustering.

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Font:** Geist Mono (monospace throughout — no sans-serif)
- **Dark mode only.** No light mode. Background is `#0a0a0a`.

## Design system

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Foreground / text | `#f3f4f6` |
| Muted text | `gray-400` / `gray-500` / `gray-600` |
| Accent (primary) | `orange-400` (`#fb923c`) |
| Player jersey | `#3B82F6` (blue) |
| Ball | `#F97316` (orange) |

All UI text uses `font-mono`. Headings use `tracking-widest` or `tracking-[0.3em]`. Borders use `border-white/10` or `border-orange-400/50`. Interactive elements use `hover:text-orange-400` or `hover:bg-orange-400 hover:text-black`.

## File structure

```
app/
  layout.tsx          — root layout: Geist Mono font, Navbar, dark bg
  page.tsx            — composes BasketballHero + ProjectsSection
  globals.css         — dark-only CSS variables

components/
  navbar.tsx          — fixed top bar: "HOOPS LAB" left, GitHub link right
  basketball-hero.tsx — full-viewport canvas ASCII animation (see below)
  projects-section.tsx — about blurb + 3-col project card grid
  project-card.tsx    — individual project card with title, description, tags
```

## Hero animation (`basketball-hero.tsx`)

A canvas-based ASCII pixel-art animation. All sprites are rendered with `fillText("█", ...)` in Courier New on an HTML5 canvas element. Character cells are square (`ch = cw`).

**Animation loop (phases):**
1. `catch_pause` — player holds ball at waist (ARM_DOWN)
2. `wind_up` — arm raises through 3 states: ARM_DOWN → ARM_WIND → ARM_RAISED
3. `shooting` — ball arcs across screen toward hoop (~1900ms)
4. `at_hoop` — ball either swishes through net or bounces off rim (~250ms)
5. `falling` — ball falls with gravity to the trampoline contact point (~680ms)
6. `returning` — ball bounces off trampoline, then two floor bounces, then to player hand (~2500ms)

**55% swish rate**, decided at the start of each `catch_pause`. On a miss, ball kicks off the front rim and falls to the trampoline. On a swish, net pixels wave horizontally.

**Sprites:**
- `BODY` — static player body (head, jersey, shorts, legs, shoes). Eyes are baked into BODY at `[2,3]` and `[3,3]` as dark pixels — never move with the arm.
- `ARM_RAISED / ARM_WIND / ARM_DOWN` — three arm states; arm always originates from the shoulder at col 5, row 4-5, never from the head.
- `HOOP_BODY + NET` — backboard (white), rim (red), net (gray), pole. Net rendered separately for wave effect.
- `TRAMP_SURFACE + TRAMP_SUPPORT` — `/`-shaped trampoline below-left of hoop. Surface compresses and springs back on ball impact; supports are always fixed.

**Returning trajectory (multi-bounce):**
- T=0 → T1 (0.33): trampoline → first floor bounce (big arc)
- T1 → T2 (0.64): floor → second floor bounce (medium arc)
- T2 → 1.0: floor → player hand (small arc)

## Content

**GitHub:** https://github.com/mezz2

**Tagline:** "Building data science skills through my passion for the NBA"

**Project cards** are currently placeholders. As Riley builds real projects, each card should link to the relevant GitHub repo and reflect the actual tools used. Tags use the `font-mono text-[10px]` pill style.

**Section headings** use the `// ABOUT` and `// PROJECTS` comment style in orange-400.

## Conventions

- No comments in code unless the WHY is non-obvious.
- No `console.log` left in production code.
- Prefer editing existing files over creating new ones.
- Do not add light mode support — this site is intentionally dark-only.
- Do not change the monospace-everywhere design — it is intentional.
- When adding new pages or sections, follow the existing card/border aesthetic: `border border-white/10`, `bg-white/[0.02]`, orange accent on hover.
- New canvas sprites should use `█` (full block) characters for pixel-art consistency.
- The animation loop in `basketball-hero.tsx` uses refs (not state) for all mutable values to avoid React re-render overhead inside `requestAnimationFrame`.
