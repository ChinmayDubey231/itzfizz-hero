# Welcome Itzfizz — Scroll-Driven Hero

A scroll-driven hero section built with **Next.js (App Router), React, Tailwind CSS v4 and GSAP ScrollTrigger**, inspired by [this reference](https://paraschaturvedi.github.io/car-scroll-animation).

A car parked at the edge of the road drives across the hero as you scroll. A green trail paints behind it and reveals the letter-spaced headline **W E L C O M E &nbsp; I T Z F I Z Z**, and each impact metric lights up as the car passes over it. Scroll back up and everything reverses.

**Live demo:** `https://<your-username>.github.io/<repo-name>/`

## Features

| Requirement | How it's done |
| --- | --- |
| Hero fills the first screen | A `300svh` section with a `sticky` `100svh` stage — native CSS sticky, so no pin-spacer reflow |
| Letter-spaced headline + metrics below | `HeadlineLetters` (one span per letter) on the road, four `StatCard`s underneath |
| Load animation | One GSAP timeline: top bar → road expands → letters rise in a stagger → car rolls in → stat cards rise one by one while their numbers count up |
| Scroll-tied motion | A single scrubbed timeline maps scroll progress (0 → 1) to the car's position, trail reveal and progress bar — no autoplay |
| Easing / interpolation | `scrub: 1.1` makes the motion glide after the scrollbar instead of snapping; card fills use `power2.inOut` |
| Transform-only animation | Car, trail, headline reveal, card lift/fill and progress bar all animate `transform` (`x`, `scaleX`, `scaleY`, `rotation`) |
| No reflow on scroll | All geometry is read in function-based values that ScrollTrigger re-evaluates only on refresh (load / resize). Nothing reads layout in a scroll callback |

### Details worth noting

- **Mask reveal without `clip-path`.** The trail is an `overflow: hidden` layer that slides right while its inner content slides left by the same amount — two opposing translations, so the solid headline appears to be "painted" in place while staying entirely on the compositor.
- **Cards are coupled to the car.** Each card's ScrollTrigger start is computed from the scroll position where the car's centre crosses the card's centre (in reading order on the stacked mobile grid).
- **Motion feel.** Speed lines and a slight yaw are driven by the car's per-frame displacement (read from GSAP's transform cache) through `gsap.quickTo`, so they fade as the scrub settles.
- **No flash before hydration.** An inline script adds a `js` class before first paint; intro elements stay hidden until GSAP takes over. Without JavaScript the page renders fully visible.
- **Accessibility.** Real `<h1>` for the headline (the animated letter layers are `aria-hidden`), and `prefers-reduced-motion` skips the intro and decorative motion while keeping the scroll interaction.
- **Original artwork.** The car is a hand-drawn inline SVG — no third-party image assets.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3 + ScrollTrigger · `@gsap/react` (`useGSAP` for automatic cleanup)

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
```

## Deploy to GitHub Pages

1. Push this project to a GitHub repository on the `main` branch.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds the static export and deploys it on every push to `main`. It sets the base path to `/<repo-name>` automatically.

## Project structure

```
app/
  layout.tsx          fonts, metadata, pre-paint `js` class
  page.tsx            hero + outro
  globals.css         Tailwind theme tokens, road/speed-line styles
components/
  HeroScroll.tsx      layout + all GSAP logic (intro, scroll timeline, card triggers)
  HeadlineLetters.tsx letter-split headline (rendered as muted + solid layers)
  StatCard.tsx        metric card with fill layer
  CarTopView.tsx      inline SVG car
  Outro.tsx           section after the hero
lib/
  content.ts          headline words and stats data
```
