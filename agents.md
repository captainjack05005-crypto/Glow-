# AGENTS

## Project Overview

Static beauty salon marketing website. Three files do all the work — no framework, no build step, no dependencies.

## Key Files

| Path | Purpose |
|------|---------|
| `index.html` | All markup; 10 sections from hero to footer |
| `css/styles.css` | All styles using CSS custom properties |
| `js/main.js` | All interactivity as an IIFE with named init functions |
| `netlify.toml` | Publish directory set to repo root (`.`) |

## Architecture

Pure static site. No bundler, no Node.js runtime, no SSR.

**HTML** — semantic sections (`<section id="…">`), landmark roles, `aria-label` on icon buttons.

**CSS** — design tokens in `:root`, mobile-first responsive via `@media (max-width: …)` breakpoints at 1024 / 768 / 480 px. Animations use `transform` and `opacity` only (GPU-friendly). Reveal classes (`.reveal-up`, `.reveal-left`, `.reveal-right`) start invisible; JavaScript adds `.revealed` via IntersectionObserver.

**JS** — single IIFE, one named `init*` function per feature. No global state. Features:
- `initLoader` — hides loader overlay on `window.load`
- `initNavbar` — adds `.scrolled` class past 60 px scroll
- `initMobileNav` — hamburger toggle for `<768 px`
- `initScrollReveal` — IntersectionObserver for reveal classes
- `initTestimonialSlider` — CSS `translateX` slider with auto-play + touch swipe
- `initScrollTop` — shows/hides scroll-to-top button
- `initSmoothScroll` — intercepts `<a href="#…">` clicks
- `initActiveNav` — highlights active nav link by section visibility
- `initBookingForm` — per-field validation + simulated async submission
- `initHeroParallax` — subtle scroll parallax on hero background-position
- `initGalleryLightbox` — click-to-enlarge overlay created dynamically

## Coding Conventions

- No comments unless the reason is non-obvious
- CSS class names follow BEM: `.block__element--modifier`
- JS uses `const`/`let`, no `var`; DOM queries are cached at function scope
- Images sourced from Unsplash (reliable CDN); query param `?w=N&q=80` controls size
- Fonts loaded via Google Fonts with `display=swap`

## Non-Obvious Decisions

- The `.loader` is hidden via CSS transition rather than `display:none` to allow the fade-out animation to complete before `visibility:hidden` kicks in.
- Hero reveal animations are triggered by `initLoader` (after load) rather than IntersectionObserver because the hero is always in viewport on first paint.
- `netlify.toml` uses `publish = "."` so Netlify serves `index.html` at the site root without a build step.
