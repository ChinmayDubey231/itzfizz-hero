import { HEADLINE_WORDS } from "@/lib/content";

/**
 * The letter-spaced headline, one span per letter so GSAP can stagger them.
 * Rendered twice in the hero (muted layer + solid layer revealed by the trail),
 * so it is aria-hidden; the <h1> carries the accessible label.
 */
export default function HeadlineLetters({ variant }: { variant: "muted" | "solid" }) {
  return (
    <div
      aria-hidden
      className={`flex flex-col items-center justify-center gap-y-[0.18em] font-display font-extrabold leading-none md:flex-row md:gap-x-[0.9em] ${
        variant === "muted" ? "headline-muted" : "headline-solid"
      }`}
    >
      {HEADLINE_WORDS.map((word) => (
        <span key={word} className="flex gap-x-[0.2em] md:gap-x-[0.28em]">
          {word.split("").map((char, i) => (
            <span key={i} data-letter className="inline-block will-change-transform">
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
