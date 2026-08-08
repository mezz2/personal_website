@AGENTS.md

# Riley Meredith — Project Context

## What this is

A personal site for Riley Meredith (GitHub: mezz2) at rileymezz.com. Paper landing page, section hubs (Projects, Words, Someday, About), and destinations (Hoops Lab, Books, Blog).

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + design tokens in `styles/tokens/`
- **Type:** Newsreader (serif headings + reading) + JetBrains Mono (labels/UI)
- **Ground:** Paper (`#f4f1ea`) site-wide. Single accent: blue `#3f78bd`.
- **Exception:** Hoops Lab arcade hero/footer keep near-black court + orange + Press Start 2P.

## Design system

Source of truth: the Riley Meredith Design System (Paper + blue consolidation).

| Token | Value |
|---|---|
| Paper ground | `#f4f1ea` |
| Ink | `#171717` |
| Accent | `#3f78bd` (blue) |
| Cards | white, warm hairline, 10px radius |
| Labels | JetBrains Mono, sentence case, `~0.06em` tracking |

Orange (`#f97316`) and Press Start 2P survive **only** inside the Hoops Lab arcade hero/footer.

**Casing:** sentence case everywhere. No ALL-CAPS labels, no `//` section prefixes, no emoji.

UI primitives live in `components/ui/` (Button, Badge, Tag, Kicker, Card, TextLink, StatusDot, MetaTile).

## File structure

```
app/
  layout.tsx — Newsreader + JetBrains Mono + Press Start 2P
  page.tsx — landing
  globals.css — tokens + motif/hero animations
  (interior)/ — navbar shell + hubs/destinations

components/
  ui/ — design-system primitives
  navbar.tsx, landing/*, basketball-hero.tsx, projects-section.tsx
  shelf-row.tsx, book-detail-panel.tsx

styles/tokens/ — colors, typography, spacing, effects
```

## Conventions

- No comments in code unless the WHY is non-obvious.
- No `console.log` left in production code.
- Prefer editing existing files over creating new ones.
- New surfaces follow Paper + blue; do not reintroduce orange outside the Hoops hero.
- Canvas sprites in `basketball-hero.tsx` use `fillRect` pixel blocks; animation loop uses refs, not state.
