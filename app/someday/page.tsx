import Link from "next/link";
import { somedayItems, type CardSize } from "@/data/someday";

const sizeClasses: Record<CardSize, string> = {
  small: "col-span-1 row-span-1",
  wide: "col-span-1 sm:col-span-2 row-span-1",
  tall: "col-span-1 row-span-1 sm:row-span-2",
  large: "col-span-1 sm:col-span-2 row-span-1 sm:row-span-2",
};

export default function SomedayPage() {
  return (
    <main className="min-h-screen px-6 pt-28 pb-20 max-w-5xl mx-auto">
      <div className="mb-12">
        <p className="font-mono text-orange-400 text-xs tracking-[0.3em] mb-3">
          // SOMEDAY SHELF
        </p>
        <p className="font-mono text-gray-400 text-sm tracking-widest">
          Things I want to build, make, or survive one day.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[200px] gap-4 grid-flow-dense">
        {somedayItems.map((item) => (
          <Link
            key={item.slug}
            href={`/someday/${item.slug}`}
            className={`group relative rounded-2xl overflow-hidden flex flex-col justify-end p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] ${sizeClasses[item.size ?? "small"]}`}
            style={{ backgroundColor: item.color }}
          >
            <div className="relative z-10">
              <h2 className="font-mono font-bold text-white tracking-widest text-sm leading-snug mb-1">
                {item.title}
              </h2>
              {item.description && (
                <p className="font-mono text-white/50 text-xs tracking-wide leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="font-mono text-white/40 text-[10px] tracking-widest">
                OPEN →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
