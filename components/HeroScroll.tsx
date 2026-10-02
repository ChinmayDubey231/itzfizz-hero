"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import CarTopView from "@/components/CarTopView";
import HeadlineLetters from "@/components/HeadlineLetters";
import StatCard from "@/components/StatCard";
import { HEADLINE_WORDS, STATS } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** How much of the car is hidden off the left edge while parked (0–1). */
const PARKED_HIDDEN = 0.78;
/** Seconds the scroll-linked motion takes to catch up with the scrollbar (interpolation). */
const SCRUB_SMOOTHING = 1.1;
const LETTER_COUNT = HEADLINE_WORDS.join("").length;

export default function HeroScroll() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const one = (sel: string) => q(sel)[0] as HTMLElement;

      const road = one("[data-road]");
      const carTrack = one("[data-car-track]");
      const car = one("[data-car]");
      const mask = one("[data-mask]");
      const maskInner = one("[data-mask-inner]");
      const speedLines = one("[data-speed]");
      const progress = one("[data-progress]");
      const letters = q("[data-letter]");
      const cards = q("[data-stat]");

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      ScrollTrigger.config({ ignoreMobileResize: true });

      /* ------------------------------------------------------------------
       * Geometry. These are only read when ScrollTrigger refreshes (load,
       * resize) — never inside a scroll handler — so scrolling causes no
       * layout reads or reflows.
       * ---------------------------------------------------------------- */
      const roadW = () => road.clientWidth;
      const carW = () => carTrack.offsetWidth;
      // Cached copy for the per-frame speed calculation below (updated on refresh).
      let carWidth = carW();
      const carStart = () => -carW() * PARKED_HIDDEN;
      const carEnd = () => roadW() + carW() * 0.05; // fully off the right edge
      // The trail (and the solid headline) is revealed up to the car's centre.
      const revealStart = () => carStart() + carW() / 2;
      const revealEnd = () => carEnd() + carW() / 2;

      /* ------------------------------------------------------------------
       * 1. Scroll-driven timeline — progress 0→1 maps to the section's
       *    scroll distance. `scrub` adds eased interpolation so the car
       *    glides after the scrollbar instead of snapping to it.
       *    Everything animated here is a transform.
       * ---------------------------------------------------------------- */
      const drive = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: reduceMotion ? true : SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
          onRefresh: () => {
            carWidth = carW();
          },
        },
      });

      drive
        .fromTo(carTrack, { x: carStart }, { x: carEnd }, 0)
        // Mask reveal using two opposing translations (no clip-path repaint):
        // the mask slides right while its content slides back left by the same amount.
        .fromTo(mask, { x: () => revealStart() - roadW() }, { x: () => revealEnd() - roadW() }, 0)
        .fromTo(maskInner, { x: () => roadW() - revealStart() }, { x: () => roadW() - revealEnd() }, 0)
        .fromTo(progress, { scaleX: 0 }, { scaleX: 1 }, 0);

      /* ------------------------------------------------------------------
       * 2. Stat cards light up as the car drives past them. Each card gets
       *    its own scrubbed trigger whose start is computed from where the
       *    car's centre crosses the card's centre (recomputed on refresh).
       * ---------------------------------------------------------------- */
      const scrollLength = () => section.offsetHeight - window.innerHeight;
      const cardsInOneRow = () => cards.every((c) => c.offsetTop === cards[0].offsetTop);
      // Horizontal position (px within the road) that triggers card i.
      const cardTriggerX = (i: number) => {
        if (cardsInOneRow()) {
          const r = cards[i].getBoundingClientRect();
          return r.left + r.width / 2 - road.getBoundingClientRect().left;
        }
        // Stacked grid (mobile): light cards up in reading order instead.
        return ((i + 0.5) / cards.length) * roadW();
      };
      const scrollAtReveal = (x: number) =>
        gsap.utils.clamp(0, 1, (x - revealStart()) / (revealEnd() - revealStart())) * scrollLength();

      cards.forEach((card, i) => {
        const window_ = () => scrollLength() * 0.06;
        gsap
          .timeline({
            defaults: { ease: "power2.inOut", duration: 1 },
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${scrollAtReveal(cardTriggerX(i)) - window_()} top`,
              end: () => `top+=${scrollAtReveal(cardTriggerX(i)) + window_()} top`,
              scrub: reduceMotion ? true : 0.6,
              invalidateOnRefresh: true,
            },
          })
          .to(card.querySelector("[data-stat-fill]"), { scaleY: 1 }, 0)
          .to(card.querySelector("[data-stat-body]"), { y: -10 }, 0)
          .to(card.querySelector("[data-stat-text]"), { color: "#111111" }, 0);
      });

      /* ------------------------------------------------------------------
       * 3. Motion feel: speed lines and a hint of yaw derived from how far
       *    the car moved this frame (read from GSAP's own cache, not the DOM).
       * ---------------------------------------------------------------- */
      if (!reduceMotion) {
        const setStreak = gsap.quickTo(speedLines, "scaleX", { duration: 0.35, ease: "power3" });
        const setYaw = gsap.quickTo(car, "rotation", { duration: 0.6, ease: "power3" });
        let lastX = gsap.getProperty(carTrack, "x") as number;

        drive.eventCallback("onUpdate", () => {
          const x = gsap.getProperty(carTrack, "x") as number;
          const speed = gsap.utils.clamp(-1, 1, (x - lastX) / (carWidth * 0.12));
          lastX = x;
          // Lines trail behind the direction of travel (negative scale flips them).
          setStreak(-speed);
          setYaw(speed * 2.5);
        });
      }

      /* ------------------------------------------------------------------
       * 4. Load intro — time-based, plays once.
       * ---------------------------------------------------------------- */
      const introTargets = q("[data-intro]");

      if (reduceMotion) {
        gsap.set(introTargets, { autoAlpha: 1 });
      } else {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });

        intro
          .fromTo(
            q("[data-topbar] [data-intro]"),
            { autoAlpha: 0, y: -14 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
          )
          .fromTo(one("[data-eyebrow]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
          .fromTo(
            road,
            { autoAlpha: 0, scaleY: 0.2 },
            { autoAlpha: 1, scaleY: 1, duration: 1.1, ease: "expo.out" },
            0.15,
          )
          // Muted + solid copies are staggered in lockstep (index modulo letter count).
          .fromTo(
            letters,
            { autoAlpha: 0, yPercent: 70, rotationX: -80, transformPerspective: 600 },
            {
              autoAlpha: 1,
              yPercent: 0,
              rotationX: 0,
              duration: 1.1,
              ease: "power4.out",
              stagger: (i) => (i % LETTER_COUNT) * 0.045,
            },
            0.35,
          )
          .fromTo(car, { x: () => -carW() * 0.9 }, { x: 0, duration: 1.6, ease: "power3.out" }, 0.5)
          .fromTo(
            cards,
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.14 },
            0.95,
          );

        // Numbers count up as their card arrives.
        q("[data-stat-value]").forEach((el, i) => {
          const counter = { value: 0 };
          const target = Number(el.dataset.target);
          intro.to(
            counter,
            {
              value: target,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = String(Math.round(counter.value));
              },
            },
            0.95 + i * 0.14,
          );
        });
      }

      // Web fonts change text metrics — recalculate trigger positions once they're in.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[300svh]" aria-labelledby="hero-title">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* Top bar */}
        <header
          data-topbar
          className="flex items-center justify-between px-5 pt-5 text-[11px] font-semibold tracking-[0.3em] sm:px-10 sm:pt-7"
        >
          <span data-intro className="font-display text-sm tracking-[0.25em]">
            ITZFIZZ
          </span>
          <div data-intro className="flex items-center gap-3 text-white/60">
            <span className="hidden sm:inline">SCROLL TO DRIVE</span>
            <span className="relative h-px w-16 overflow-hidden bg-white/15 sm:w-24">
              <span
                data-progress
                className="absolute inset-0 origin-left scale-x-0 bg-trail will-change-transform"
              />
            </span>
          </div>
        </header>

        {/* Headline on the road */}
        <div className="flex flex-1 flex-col justify-center gap-5 sm:gap-7">
          <p
            data-eyebrow
            data-intro
            className="text-center text-[11px] font-semibold tracking-[0.35em] text-white/55"
          >
            OUR IMPACT, IN MOTION
          </p>

          <h1 id="hero-title" className="sr-only">
            Welcome Itzfizz
          </h1>

          <div
            data-road
            data-intro
            className="relative h-[clamp(9.5rem,28vh,17rem)] w-full overflow-hidden border-y border-white/10 bg-asphalt text-[min(9vw,5.5vh)] md:text-[min(4.6vw,10vh)]"
          >
            <span aria-hidden className="road-lane absolute inset-x-0 top-[10%] h-px" />
            <span aria-hidden className="road-lane absolute inset-x-0 bottom-[10%] h-px" />

            {/* Layer 1 — muted headline, always visible */}
            <div className="absolute inset-0 flex items-center justify-center">
              <HeadlineLetters variant="muted" />
            </div>

            {/* Layer 2 — green trail + solid headline, revealed up to the car */}
            <div data-mask aria-hidden className="absolute inset-0 overflow-hidden bg-trail will-change-transform">
              <div data-mask-inner className="absolute inset-0 flex items-center justify-center will-change-transform">
                <HeadlineLetters variant="solid" />
              </div>
            </div>

            {/* Layer 3 — the car (track = scroll position, car = intro + yaw) */}
            <div data-car-track className="absolute inset-y-0 left-0 flex items-center will-change-transform">
              <div data-car className="relative h-[52%] will-change-transform md:h-[70%]">
                <span
                  data-speed
                  aria-hidden
                  className="speed-lines absolute left-1/2 top-[18%] h-[64%] w-[130%] origin-left scale-x-0"
                />
                <CarTopView className="relative h-full w-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Impact metrics */}
        <ul className="grid grid-cols-2 gap-3 px-5 pb-5 pt-6 sm:gap-4 sm:px-10 sm:pb-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
