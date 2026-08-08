import type { Metadata } from "next";
import Link from "next/link";
import { books } from "@/data/books";
import { blogStatusLabel, booksStatusLabel } from "@/lib/hub-status";

export const metadata: Metadata = {
  title: "Words",
  description: "Long-form notes and the bookshelf.",
};

const BLOG_POST_COUNT = 0;
const SPINES = [
  { height: 78, color: "#2d4a6e", delay: "0s" },
  { height: 96, color: "#6b2737", delay: "0.75s" },
  { height: 72, color: "#4a5a2d", delay: "1.5s" },
  { height: 90, color: "#c1450f", delay: "2.25s" },
  { height: 84, color: "#2d6b6b", delay: "3s" },
];

export default function WordsHubPage() {
  const blogEmpty = BLOG_POST_COUNT <= 0;
  const shelfCount = books.length;

  return (
    <main>
      <h1 className="sr-only">Words</h1>
      <section className="grid min-h-[calc(100vh-57px)] grid-cols-1 min-[800px]:grid-cols-2">
        <Link
          href="/blog"
          className="group flex min-h-[calc(100vh-57px)] flex-col justify-between border-b border-black/12 px-[clamp(28px,4vw,52px)] py-[clamp(40px,6vw,72px)] transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ink)] min-[800px]:min-h-[calc(100vh-57px)] min-[800px]:border-b-0 min-[800px]:border-r"
        >
          <div>
            <p className="mb-3 flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-black/28 before:block before:h-px before:w-4 before:bg-current">
              Words / 01
            </p>
            <h2 className="m-0 font-[family-name:var(--font-newsreader)] text-[clamp(56px,9vw,104px)] font-normal leading-[0.9] tracking-[-0.02em] text-[var(--ink)]">
              Blog
            </h2>
            <p className="mt-4 max-w-[28ch] font-[family-name:var(--font-mono)] text-[13px] leading-[1.55] text-black/45">
              Long-form notes live here.
            </p>
            <p className="mt-[0.9rem] flex items-center gap-[0.65rem] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-black/28">
              <span
                className={`h-[7px] w-[7px] shrink-0 rounded-full ${
                  blogEmpty ? "bg-[var(--warm)]" : "bg-[oklch(0.58_0.11_245)]"
                }`}
              />
              {blogStatusLabel(BLOG_POST_COUNT)}
            </p>
          </div>

          <div className="flex min-h-[150px] flex-col justify-end pt-8">
            <div className="flex items-end gap-1.5" aria-hidden>
              <div
                className={`flex w-[min(220px,70%)] flex-col gap-2.5 ${
                  blogEmpty ? "hub-bars-empty" : ""
                }`}
              >
                <div className="hub-readline relative h-[10px] overflow-hidden rounded-[5px] bg-black/14" />
                <div className="hub-readline relative h-[10px] overflow-hidden rounded-[5px] bg-black/14" />
                <div className="hub-readline relative h-[10px] overflow-hidden rounded-[5px] bg-black/14" />
                <div className="hub-readline relative h-[10px] overflow-hidden rounded-[5px] bg-black/14" />
              </div>
              {blogEmpty ? <span className="hub-caret" /> : null}
            </div>
            <span className="mt-5 inline-flex border-b border-[var(--ink)] pb-[3px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.12em] transition-colors group-hover:border-[oklch(0.58_0.11_245)] group-hover:text-[oklch(0.58_0.11_245)]">
              Enter blog →
            </span>
          </div>
        </Link>

        <Link
          href="/books"
          className="group flex min-h-[calc(100vh-57px)] flex-col justify-between px-[clamp(28px,4vw,52px)] py-[clamp(40px,6vw,72px)] transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ink)]"
        >
          <div>
            <p className="mb-3 flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-black/28 before:block before:h-px before:w-4 before:bg-current">
              Words / 02
            </p>
            <h2 className="m-0 font-[family-name:var(--font-newsreader)] text-[clamp(56px,9vw,104px)] font-normal leading-[0.9] tracking-[-0.02em] text-[var(--ink)]">
              Books
            </h2>
            <p className="mt-4 max-w-[28ch] font-[family-name:var(--font-mono)] text-[13px] leading-[1.55] text-black/45">
              Whatever I&apos;m reading, have read, or keep meaning to get to.
            </p>
            <p className="mt-[0.9rem] flex items-center gap-[0.65rem] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-black/28">
              <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[oklch(0.58_0.11_245)]" />
              {booksStatusLabel(shelfCount)}
            </p>
          </div>

          <div className="flex min-h-[150px] flex-col justify-end pt-8">
            <div className="flex h-[110px] items-end gap-[7px]" aria-hidden>
              {SPINES.map((spine) => (
                <div
                  key={spine.color + spine.height}
                  className="hub-spine"
                  style={{
                    height: spine.height,
                    background: spine.color,
                    animationDelay: spine.delay,
                  }}
                />
              ))}
            </div>
            <span className="mt-5 inline-flex border-b border-[var(--ink)] pb-[3px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.12em] transition-colors group-hover:border-[oklch(0.58_0.11_245)] group-hover:text-[oklch(0.58_0.11_245)]">
              Open shelf →
            </span>
          </div>
        </Link>
      </section>
    </main>
  );
}
