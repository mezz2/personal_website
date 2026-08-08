import Link from "next/link";
import { somedayItems, type CardSize } from "@/data/someday";
import { Kicker } from "@/components/ui";

const sizeClasses: Record<CardSize, string> = {
  small: "col-span-1 row-span-1",
  wide: "col-span-1 sm:col-span-2 row-span-1",
  tall: "col-span-1 row-span-1 sm:row-span-2",
  large: "col-span-1 sm:col-span-2 row-span-1 sm:row-span-2",
};

export default function SomedayPage() {
  return (
    <main className="min-h-screen px-6 pt-14 pb-24 max-w-[64rem] mx-auto">
      <Kicker>The someday shelf</Kicker>
      <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(34px,5vw,52px)] leading-[1.1] m-0 mt-3 text-[var(--ink)]">
        Someday
      </h1>
      <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--ink-muted)] m-0 mt-1 mb-9">
        Things I want to build, make, or survive one day.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[150px] gap-3.5 grid-flow-dense">
        {somedayItems.map((item) => (
          <Link
            key={item.slug}
            href={`/someday/${item.slug}`}
            className={`group relative rounded-[var(--radius-xl)] overflow-hidden flex flex-col justify-end p-5 border border-black/[0.06] hover:border-[var(--blue-line)] transition-all duration-300 hover:-translate-y-0.5 ${sizeClasses[item.size ?? "small"]}`}
            style={{ backgroundColor: item.color }}
          >
            <div className="relative z-10">
              <h2 className="font-[family-name:var(--font-serif)] font-medium text-white text-xl leading-snug m-0">
                {item.title}
              </h2>
              {item.description ? (
                <p className="font-[family-name:var(--font-mono)] text-white/60 text-[11px] mt-1.5 leading-relaxed m-0">
                  {item.description}
                </p>
              ) : null}
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="font-[family-name:var(--font-mono)] text-white/50 text-[10px] tracking-[var(--ls-label)]">
                Open →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
