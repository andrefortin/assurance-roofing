# Assurance Roofing — Charlotte, NC

Single-page marketing website for Assurance Roofing, Charlotte's trusted residential roofing company.

**Live:** [assuranceroofingus.com](https://assuranceroofingus.com)

## Tech Stack

- **React 19** with Vite 8
- **Tailwind CSS v3** — Plus Jakarta Sans font
- **Zero runtime dependencies** beyond React/ReactDOM
- Deployed on **Vercel**

## Design System

| Token | Value |
|---|---|
| Primary | `#0D1B2A` (deep navy) |
| Accent | `#E8890C` (amber) |
| Background | `#F7F8FA` (cool gray) |
| Font | Plus Jakarta Sans (300–800) |
| Motion | `cubic-bezier(0.32,0.72,0,1)` |

## Site Sections

- **Hero** — Full-viewport with Ken Burns background, count-up stats bar
- **Social Proof** — GAF, Owens Corning, CertainTeed, BBB, Angi, Google badges
- **Services** — 6-card bento grid (Replacements, Claims, Repairs, Storm, Financing, Exteriors)
- **Process** — 4-step timeline with double-bezel photo card
- **Gallery** — 4 project cards with neighborhood badges
- **Testimonials** — 3 review cards with gradient avatars
- **Contact** — Full form with service dropdown, success state
- **FAQ** — Animated accordion (6 questions)
- **Bottom CTA** — Dark gradient card with phone CTA
- **Privacy Policy** (`#privacy`) — 8-section legal page
- **Terms of Service** (`#terms`) — 12-section legal page

## Architecture

Everything lives in a single `src/App.jsx` (1330 lines). No router library — hash-based navigation (`#privacy`, `#terms`) handles the three "pages." All components use the double-bezel pattern (nested `p-[5px]` shell + `rounded-[calc(…)]` core) for a machined-hardware aesthetic.

Custom hooks: `useReveal` (IntersectionObserver fade-in), `useCountUp` (animated stat counters).

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Deployment

Connected to Vercel via GitHub. Push to `main` triggers automatic deployment.

```bash
npx vercel --prod   # manual production deploy
```
