import type { Stat } from "@/lib/content";

/**
 * One impact metric. Layers:
 *  - [data-stat]        outer wrapper, animated in by the load intro
 *  - [data-stat-body]   lifts when the car passes (scroll)
 *  - [data-stat-fill]   accent colour, grows from the bottom with scaleY (scroll)
 */
export default function StatCard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <li data-stat data-intro className="list-none">
      <div
        data-stat-body
        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-panel p-4 will-change-transform sm:p-5 lg:p-6"
      >
        <span
          data-stat-fill
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0"
          style={{ backgroundColor: stat.accent }}
        />
        <div data-stat-text className="relative flex h-full flex-col justify-between gap-3 text-[#f4f1ea]">
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] opacity-60">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden>{stat.trend === "up" ? "↑" : "↓"}</span>
          </div>
          <p className="font-display text-[2.1rem] font-bold leading-none tracking-tight sm:text-5xl lg:text-6xl">
            <span data-stat-value data-target={stat.value}>
              {stat.value}
            </span>
            %
          </p>
          <p className="max-w-[18ch] text-[13px] font-medium leading-snug opacity-75 sm:text-sm">
            {stat.label}
          </p>
        </div>
      </div>
    </li>
  );
}
