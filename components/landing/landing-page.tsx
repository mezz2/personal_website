import Link from "next/link";
import {
  AboutMotif,
  ProjectsMotif,
  SomedayMotif,
  WordsMotif,
} from "./motifs";

const TILES = [
  { href: "/about", label: "About", Motif: AboutMotif, react: "about" as const },
  {
    href: "/projects",
    label: "Projects",
    Motif: ProjectsMotif,
    react: "projects" as const,
  },
  { href: "/words", label: "Words", Motif: WordsMotif, react: "none" as const },
  {
    href: "/someday",
    label: "Someday",
    Motif: SomedayMotif,
    react: "none" as const,
  },
];

export default function LandingPage() {
  return (
    <main className="landing-shell min-h-screen grid grid-cols-1 min-[900px]:grid-cols-[1.05fr_1fr]">
      <section className="flex flex-col justify-between px-[52px] py-[56px] max-[900px]:px-8 max-[900px]:py-10 border-b min-[900px]:border-b-0 min-[900px]:border-r border-[var(--line)]">
        <span className="font-[family-name:var(--font-mono)] text-[13px] tracking-[0.05em] text-[var(--ink)]">
          Riley Meredith
        </span>
        <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(30px,3.6vw,44px)] leading-[1.24] m-0 max-w-[11ch] text-balance text-[var(--ink)]">
          A young <span className="whitespace-nowrap">20-something</span>{" "}
          navigating AI, personal&nbsp;finance, and&nbsp;entrepreneurship.
        </h1>
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-black/35">
          rileymezz.com
        </span>
      </section>

      <nav
        aria-label="Sections"
        className="grid grid-cols-2 max-[560px]:grid-cols-1 gap-px bg-black/10 min-h-[50vh] min-[900px]:min-h-0"
      >
        {TILES.map(({ href, label, Motif, react }) => (
          <Link
            key={href}
            href={href}
            className={`landing-tile group flex flex-col bg-[var(--paper)] text-[var(--ink)] no-underline px-[26px] py-6 transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--blue)] ${
              react === "about"
                ? "landing-tile-about"
                : react === "projects"
                  ? "landing-tile-projects"
                  : ""
            }`}
          >
            <div className="flex flex-1 items-center justify-center min-h-0">
              <Motif />
            </div>
            <span className="font-[family-name:var(--font-serif)] text-[30px] mt-1.5">
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
