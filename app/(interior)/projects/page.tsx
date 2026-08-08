import type { Metadata } from "next";
import Link from "next/link";
import { projectsCapacityLabel } from "@/lib/hub-status";

export const metadata: Metadata = {
  title: "Projects",
  description: "Labs I'm building in public.",
};

const HOOPS = {
  n: "01",
  name: "Hoops Lab",
  status: "LIVE" as const,
  href: "/hoops-lab",
  stack: ["Next", "Python", "NBA API"],
  blurb:
    "Shot quality, lineup work, draft projection — a practice ground for data science with real NBA data.",
  question: "How do you get better at data science by caring about basketball?",
};

export default function ProjectsHubPage() {
  return (
    <main className="px-6 pb-28 pt-14 max-w-[72rem] mx-auto">
      <p className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.18em] uppercase text-[var(--warm)] m-0 mb-3">
        Projects
      </p>
      <h1 className="font-[family-name:var(--font-newsreader)] font-normal text-[clamp(30px,4.2vw,40px)] leading-[1.2] m-0 max-w-[14ch] text-[var(--ink)]">
        Labs I&apos;m building in public.
      </h1>

      <div className="grid grid-cols-1 min-[700px]:grid-cols-2 gap-4 mt-9">
        <Link
          href={HOOPS.href}
          className="group flex flex-col min-h-[420px] overflow-hidden border border-black/12 bg-white transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-black/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
        >
          <div
            className="relative min-h-[180px] overflow-hidden border-b border-black/12 bg-[#efebe3]"
            aria-hidden
          >
            <div className="absolute inset-x-0 top-0 z-[2] h-[3px] bg-gradient-to-r from-[#f97316] to-[#c1450f]" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative w-[55%] aspect-[1.05] border-2 border-[rgba(193,69,15,0.35)]">
                <div className="absolute left-1/2 top-[58%] w-[30%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(59,130,246,0.4)]" />
                <div className="absolute bottom-[10%] left-1/2 h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-[#f97316] shadow-[0_0_14px_rgba(249,115,22,0.5)]" />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-[0.7rem] px-[1.35rem] pt-5 pb-6">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-[0.35rem] border border-[rgba(193,69,15,0.35)] bg-[rgba(193,69,15,0.06)] px-[0.55rem] py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--warm)] before:block before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--warm)]">
                {HOOPS.status}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] text-black/35">
                {HOOPS.n}
              </span>
            </div>
            <h2 className="m-0 font-[family-name:var(--font-newsreader)] text-[26px] font-normal text-[var(--ink)]">
              {HOOPS.name}
            </h2>
            <p className="m-0 border-l-2 border-[#f97316] pl-[0.85rem] font-[family-name:var(--font-newsreader)] text-base leading-[1.45] text-[var(--ink)]">
              {HOOPS.question}
            </p>
            <p className="m-0 font-[family-name:var(--font-mono)] text-[13px] leading-[1.6] text-black/45">
              {HOOPS.blurb}
            </p>
            <div className="flex flex-wrap gap-[0.35rem]">
              {HOOPS.stack.map((tag) => (
                <span
                  key={tag}
                  className="border border-black/12 px-2 py-[0.2rem] font-[family-name:var(--font-mono)] text-[10px] tracking-[0.08em] text-black/45"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="mt-[0.15rem] inline-block self-start bg-[var(--warm)] px-[0.95rem] py-[0.65rem] font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.12em] text-white">
              Enter lab →
            </span>
          </div>
        </Link>

        <p className="col-span-full mt-1 border-t border-black/12 pt-4 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-black/35">
          {projectsCapacityLabel(1)}
        </p>
      </div>
    </main>
  );
}
