import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Button, Kicker, Tag } from "@/components/ui";
import { projectsCapacityLabel } from "@/lib/hub-status";

export const metadata: Metadata = {
  title: "Projects",
  description: "Labs I'm building in public.",
};

const HOOPS = {
  n: "01",
  name: "Hoops Lab",
  href: "/hoops-lab",
  stack: ["Next", "Python", "NBA API"],
  blurb:
    "Shot quality, lineup work, draft projection — a practice ground for data science with real NBA data.",
  question: "How do you get better at data science by caring about basketball?",
};

export default function ProjectsHubPage() {
  return (
    <main className="px-6 pb-28 pt-14 max-w-[72rem] mx-auto">
      <Kicker>Projects</Kicker>
      <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(30px,4.2vw,40px)] leading-[1.2] m-0 mt-3.5 max-w-[14ch] text-[var(--ink)]">
        Labs I&apos;m building in public.
      </h1>

      <div className="grid grid-cols-1 min-[700px]:grid-cols-2 gap-4 mt-9">
        <Link
          href={HOOPS.href}
          className="group flex flex-col min-h-[420px] overflow-hidden border border-[var(--line)] bg-[var(--surface-card)] transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--blue-line)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
        >
          <div
            className="relative min-h-[180px] overflow-hidden border-b border-[var(--line)] bg-[var(--surface-sunken)]"
            aria-hidden
          >
            <div
              className="absolute inset-x-0 top-0 z-[2] h-[3px]"
              style={{ background: "var(--rail-accent)" }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative w-[55%] aspect-[1.05] border-2 border-[var(--blue-line)]">
                <div className="absolute left-1/2 top-[58%] w-[30%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--blue-line)]" />
                <div className="absolute bottom-[10%] left-1/2 h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-[var(--blue)] shadow-[0_0_14px_rgba(63,120,189,0.5)]" />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-[0.7rem] px-[1.35rem] pt-5 pb-6">
            <div className="flex items-center justify-between gap-2">
              <Badge status="live">Live</Badge>
              <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[var(--ls-label)] text-black/35">
                {HOOPS.n}
              </span>
            </div>
            <h2 className="m-0 font-[family-name:var(--font-serif)] text-[26px] font-normal text-[var(--ink)]">
              {HOOPS.name}
            </h2>
            <p className="m-0 border-l-2 border-[var(--blue)] pl-[0.85rem] font-[family-name:var(--font-serif)] text-base leading-[1.45] text-[var(--ink)]">
              {HOOPS.question}
            </p>
            <p className="m-0 font-[family-name:var(--font-mono)] text-[13px] leading-[1.6] text-black/45">
              {HOOPS.blurb}
            </p>
            <div className="flex flex-wrap gap-[0.35rem]">
              {HOOPS.stack.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <Button as="span" style={{ marginTop: 2, alignSelf: "flex-start" }}>
              Enter lab →
            </Button>
          </div>
        </Link>

        <p className="col-span-full mt-1 border-t border-[var(--line)] pt-4 font-[family-name:var(--font-mono)] text-[11px] tracking-[var(--ls-label)] text-black/35">
          {projectsCapacityLabel(1)}
        </p>
      </div>
    </main>
  );
}
