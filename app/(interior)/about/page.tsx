import { Kicker } from "@/components/ui";

export default function About() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-3.5 px-10 py-16">
      <Kicker>About</Kicker>
      <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(40px,6vw,64px)] m-0 text-[var(--ink)] text-center">
        Riley Meredith
      </h1>
      <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--ink-muted)] m-0">
        Coming soon.
      </p>
    </main>
  );
}
