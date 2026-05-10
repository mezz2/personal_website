@AGENTS.md

# Hoops Lab — Project Context

## What this is

A personal data science website for Riley Meredith (GitHub: mezz2). The first and currently only page is **Hoops Lab** — a project hub for practising data science techniques using NBA data. It is the starting point of a larger personal website that will grow over time.

The goal of Hoops Lab is educational: Riley uses real NBA datasets to build data science intuition across topics like player valuation, shot quality modelling, lineup optimisation, draft projection, and play clustering.

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Font:** Geist Mono (monospace throughout — no sans-serif)
- **Dark mode only.** No light mode. Background is `#0a0a0a`. **Exception:** the hero canvas (`basketball-hero.tsx`) uses a bright Hoop Land arcade palette — this is intentional and should not be darkened.

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

A canvas-based pixel-art animation. All sprites are rendered with `fillRect` blocks (18px cells). Hoop Land arcade aesthetic: bright hardwood court, dark arena ceiling, tiered bleachers with crowd silhouettes in blue/orange.

**Animation loop (phases):**
1. `catch_pause` — shooter holds ball (ARM_DOWN), rebounder idles
2. `wind_up` — shooter arm raises: ARM_DOWN → ARM_WIND → ARM_UP
3. `shooting` — ball arcs toward hoop (~1800ms)
4. `at_hoop` — swish through net or kick off rim (~300ms)
5. `falling` — ball falls toward rebounder (~680ms)
6. `rb_catch` — rebounder catches overhead (~280ms)
7. `rb_dribble` — rebounder dribbles 1–2 times (~480–960ms)
8. `rb_pass` — rebounder winds up and chest-passes left (~380ms)
9. `ball_return` — ball arcs back to shooter hand (~650ms)

**55% swish rate**, decided at the start of each `catch_pause`. Net pixels wave on swish. Ball has full squash & stretch: stretches in arc, squashes on floor contact. Shooter has anticipation dip before wind-up.

**Sprites:**
- `BODY` — shared chibi body (big head ~40% of height, sleeveless blue jersey, stubby limbs). Symmetric, used for both players.
- `S_ARM_DOWN / S_ARM_WIND / S_ARM_UP` — shooter arm states (extend RIGHT).
- `R_ARM_IDLE / R_ARM_UP / R_ARM_DRIB / R_ARM_PASS` — rebounder arm states (extend LEFT via negative col offsets).
- `HOOP_BODY + NET` — backboard, rim, net, pole. Net rendered separately for wave effect.

**No trampoline.** Ball return is handled by the rebounder character.

## Content

**GitHub:** https://github.com/mezz2

**Tagline:** "Building data science skills through my passion for the NBA"

**Project cards** are currently placeholders. As Riley builds real projects, each card should link to the relevant GitHub repo and reflect the actual tools used. Tags use the `font-mono text-[10px]` pill style.

**Section headings** use the `// ABOUT` and `// PROJECTS` comment style in orange-400.

## Conventions

- No comments in code unless the WHY is non-obvious.
- No `console.log` left in production code.
- Prefer editing existing files over creating new ones.
- Do not change the monospace-everywhere design — it is intentional.
- When adding new pages or sections, follow the existing card/border aesthetic: `border border-white/10`, `bg-white/[0.02]`, orange accent on hover.
- New canvas sprites use `fillRect` pixel blocks (not `fillText`). Sprites are `[col, row, color][]` arrays.
- The animation loop in `basketball-hero.tsx` uses refs (not state) for all mutable values to avoid React re-render overhead inside `requestAnimationFrame`.
