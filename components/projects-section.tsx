"use client";

import { useEffect, useMemo, useRef } from "react";
import { Badge, Card, Kicker, MetaTile, Tag, TextLink } from "@/components/ui";

type Meta = { k: string; v: string };
type Project = {
  n: string;
  title: string;
  tag: string;
  status: string;
  live: boolean;
  question: string;
  desc: string;
  meta: Meta[];
  links: { label: string; soon: boolean }[];
};

const PROJECTS: Project[] = [
  {
    n: "01",
    title: "Shot Quality Model",
    tag: "xFG",
    status: "In progress",
    live: true,
    question:
      "How much better or worse is a player shooting than expected, given shot difficulty?",
    desc: "An expected field-goal model that accounts for distance, zone, type, game context and defender distance — a calibrated probability for every shot, plus a leaderboard of over- and under-performing shooters.",
    meta: [
      { k: "Model", v: "Logistic → GBM" },
      { k: "Metric", v: "Log loss + calibration" },
      { k: "Target", v: "4 weeks to v1" },
    ],
    links: [
      { label: "Notebook", soon: false },
      { label: "Write-up", soon: true },
    ],
  },
  {
    n: "02",
    title: "Game Prediction Engine",
    tag: "",
    status: "Planned",
    live: false,
    question:
      "Can we predict game outcomes better than Vegas using team-level efficiency metrics?",
    desc: "Builds directly on the xFG model — team shot quality becomes an input feature. Explores how much pregame data (pace, offensive / defensive rating, rest days, travel) predicts the final score.",
    meta: [
      { k: "Builds on", v: "01 · Shot Quality" },
      { k: "Inputs", v: "Pace, ORtg/DRtg, rest, travel" },
    ],
    links: [{ label: "Details", soon: true }],
  },
  {
    n: "03",
    title: "Trade Value Predictor",
    tag: "",
    status: "Planned",
    live: false,
    question: "What is a player actually worth in a trade, quantitatively?",
    desc: "Combines on-court production (informed by the shot-quality work), contract data, age curves and positional scarcity into a single tradeable value score. Inspired by Basketball-Reference WAR — but built from scratch.",
    meta: [
      { k: "Builds on", v: "01 · production signal" },
      { k: "Approach", v: "WAR-style, from scratch" },
    ],
    links: [{ label: "Details", soon: true }],
  },
  {
    n: "04",
    title: "Play-by-Play Clustering",
    tag: "",
    status: "Planned",
    live: false,
    question:
      "What types of possessions actually exist, and which teams and players run them most?",
    desc: "Unsupervised clustering on play-by-play sequences to surface possession archetypes — pick-and-roll, isolation, transition. Feeds naturally into both trade value and game prediction.",
    meta: [
      { k: "Method", v: "Unsupervised clustering" },
      { k: "Feeds", v: "02 · 03" },
    ],
    links: [{ label: "Details", soon: true }],
  },
  {
    n: "05",
    title: "Draft Class Projection",
    tag: "",
    status: "Planned",
    live: false,
    question:
      "Which college and international prospects translate to NBA production, and why?",
    desc: "Historical draft-class analysis plus a projection model. The capstone — it requires the full data infrastructure built across projects 1 through 4.",
    meta: [
      { k: "Requires", v: "Infra from 01–04" },
      { k: "Type", v: "Projection model" },
    ],
    links: [{ label: "Details", soon: true }],
  },
];

const BACKLOG = [
  "Binary shot prediction as a standalone classification benchmark",
  "Who takes the highest-quality shots, regardless of outcome?",
  "Does shot quality predict future performance?",
  "How does game pressure change shot quality?",
];

function buildHexes() {
  const bx = 250,
    by = 415;
  const hash = (x: number, y: number) => {
    const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const hexes: { x: number; y: number; r: number; v: number }[] = [];
  let row = 0;
  for (let gy = 165; gy <= 452; gy += 20, row++) {
    const ox = row % 2 ? 11 : 0;
    for (let gx = 18; gx <= 482; gx += 23) {
      const x = gx + ox,
        y = gy;
      if (x < 14 || x > 486) continue;
      const dx = x - bx,
        dy = y - by,
        d = Math.sqrt(dx * dx + dy * dy);
      if (d > 248) continue;
      let f;
      if (d < 40) f = 1;
      else if (Math.abs(d - 232) < 24) f = 0.92;
      else if (d < 118) f = 0.5;
      else f = 0.28;
      f *= 0.55 + 0.45 * hash(x, y);
      if (f < 0.13) continue;
      const r = 3.2 + f * 8.6;
      let v = hash(x * 0.7, y * 1.31) * 2 - 1;
      if (d < 40) v += 0.55;
      else if (d > 66 && d < 150) v -= 0.5;
      else if (Math.abs(d - 232) < 26) v += 0.22;
      v = Math.max(-1, Math.min(1, v));
      hexes.push({ x, y, r, v });
    }
  }
  return hexes;
}

function divColor(v: number) {
  const hot = [226, 59, 46],
    mid = [244, 239, 230],
    cold = [47, 111, 176];
  let c: number[];
  if (v >= 0) {
    c = hot.map((h, i) => Math.round(mid[i] + (h - mid[i]) * v));
  } else {
    const t = -v;
    c = cold.map((h, i) => Math.round(mid[i] + (h - mid[i]) * t));
  }
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function hexPath(cx: number, cy: number, r: number) {
  let p = "";
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30);
    p +=
      (i ? " " : "") +
      (cx + r * Math.cos(a)).toFixed(1) +
      "," +
      (cy + r * Math.sin(a)).toFixed(1);
  }
  return p;
}

function ShotChart() {
  const hexes = useMemo(() => buildHexes(), []);
  const cs = "#cabfa6";
  return (
    <svg
      viewBox="0 0 500 476"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect
        x={8}
        y={8}
        width={484}
        height={460}
        fill="none"
        stroke={cs}
        strokeWidth={2}
      />
      <rect
        x={190}
        y={295}
        width={120}
        height={165}
        fill="none"
        stroke={cs}
        strokeWidth={2}
      />
      <circle cx={250} cy={295} r={48} fill="none" stroke={cs} strokeWidth={2} />
      <circle cx={250} cy={413} r={9} fill="none" stroke={cs} strokeWidth={2} />
      <line
        x1={218}
        y1={423}
        x2={282}
        y2={423}
        stroke={cs}
        strokeWidth={2}
      />
      <path
        d="M 22 460 L 22 352 A 232 232 0 0 0 478 352 L 478 460"
        fill="none"
        stroke={cs}
        strokeWidth={2}
      />
      <path
        d="M 210 413 A 40 40 0 0 0 290 413"
        fill="none"
        stroke={cs}
        strokeWidth={1.5}
      />
      {hexes.map((hx, i) => (
        <polygon
          key={i}
          points={hexPath(hx.x, hx.y, hx.r)}
          fill={divColor(hx.v)}
          stroke="rgba(40,30,10,.10)"
          strokeWidth={0.5}
        />
      ))}
    </svg>
  );
}

export default function ProjectsSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "none";
            io.unobserve(el);
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const featured = PROJECTS[0];
  const rest = PROJECTS.slice(1);

  return (
    <section
      ref={rootRef}
      id="projects"
      className="relative bg-gradient-to-b from-[var(--paper-warm)] to-[var(--paper-deep)] px-[var(--pad-gutter)] py-[var(--pad-section)] font-[family-name:var(--font-serif)]"
    >
      <div className="max-w-[var(--content-max)] mx-auto">
        <div
          data-reveal
          className="max-w-[var(--content-narrow)] transition-[opacity,transform] duration-700"
        >
          <Kicker>The work</Kicker>
          <h2 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(40px,6.5vw,72px)] leading-[1] m-0 mt-4 text-[var(--ink-deep)]">
            Five projects, one data stack.
          </h2>
          <p className="text-[clamp(15px,1.8vw,18px)] leading-[1.6] text-[var(--ink-body)] m-0 mt-5 text-pretty">
            Each project builds on the last — shot quality feeds game
            prediction, which feeds trade value. Start with the foundation and
            watch the stack compound.
          </p>
        </div>

        <div
          data-reveal
          className="flex gap-[clamp(32px,5vw,56px)] flex-wrap items-start mt-[clamp(44px,6vw,72px)] transition-[opacity,transform] duration-700"
        >
          <div className="flex-1 basis-[380px] min-w-[300px]">
            <div className="flex items-start gap-4 flex-wrap">
              <span className="font-[family-name:var(--font-serif)] text-[clamp(46px,7vw,64px)] leading-[0.8] text-[#e3d7bf]">
                01
              </span>
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h3 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(30px,4vw,44px)] leading-[1.06] m-0 text-[var(--ink-deep)]">
                    {featured.title}
                  </h3>
                  {featured.tag ? <Tag tone="accent">{featured.tag}</Tag> : null}
                </div>
                <div className="mt-3">
                  <Badge status="live">{featured.status}</Badge>
                </div>
              </div>
            </div>
            <p className="text-[clamp(18px,2.2vw,21px)] leading-[1.45] text-[var(--ink-deep)] m-0 mt-[22px] border-l-[3px] border-[var(--blue)] pl-4 text-pretty">
              {featured.question}
            </p>
            <p className="text-base leading-[1.65] text-[var(--ink-body)] m-0 mt-[18px] max-w-[540px] text-pretty">
              {featured.desc}
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 mt-6">
              {featured.meta.map((m) => (
                <MetaTile key={m.k} label={m.k} value={m.v} />
              ))}
            </div>
            <div className="flex gap-[18px] flex-wrap mt-[22px] items-center">
              {featured.links.map((l) =>
                l.soon ? (
                  <span
                    key={l.label}
                    className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--ink-ghost)]"
                  >
                    {l.label} · coming soon
                  </span>
                ) : (
                  <TextLink key={l.label} href="#" arrow>
                    {l.label}
                  </TextLink>
                ),
              )}
            </div>
          </div>

          <div className="flex-1 basis-[360px] min-w-[300px]">
            <Card hover={false}>
              <div className="p-[clamp(20px,3vw,30px)]">
                <div className="flex justify-between items-baseline gap-3 flex-wrap">
                  <div className="font-[family-name:var(--font-serif)] text-[22px] text-[var(--ink-deep)]">
                    Shot chart
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[var(--ls-label)] text-[var(--ink-ghost)] text-right">
                    FG% vs league avg
                    <br />
                    by location
                  </div>
                </div>
                <div
                  data-reveal
                  className="mt-3.5 transition-[opacity,transform] duration-[850ms]"
                >
                  <ShotChart />
                </div>
                <div className="flex items-center gap-2 justify-center mt-2.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-faint)]">
                  <span>Cold</span>
                  <span
                    className="w-[130px] h-2 rounded inline-block"
                    style={{
                      background:
                        "linear-gradient(90deg,var(--viz-cold),var(--viz-mid),var(--viz-hot))",
                    }}
                  />
                  <span>Hot</span>
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-ghost)] mt-3 text-center tracking-[0.04em]">
                  Illustrative — live model output coming soon
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex items-center gap-3.5 mt-[clamp(48px,6vw,72px)]">
          <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[var(--ls-label)] text-[var(--ink-ghost)] whitespace-nowrap">
            The roadmap · 02–05
          </span>
          <span className="flex-1 h-px bg-[var(--line-warm-soft)]" />
        </div>

        <div className="flex flex-col gap-[22px] mt-7">
          {rest.map((p) => (
            <Card key={p.n} className="hl-card">
              <div className="p-[clamp(24px,3.5vw,36px)] flex gap-8 flex-wrap">
                <div className="shrink-0 font-[family-name:var(--font-serif)] text-[clamp(44px,6vw,64px)] leading-[0.8] text-[#e3d7bf]">
                  {p.n}
                </div>
                <div className="flex-1 basis-[320px] min-w-[240px]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(26px,3.2vw,36px)] leading-[1.06] m-0 text-[var(--ink-deep)]">
                      {p.title}
                    </h3>
                    <Badge status="idle">{p.status}</Badge>
                  </div>
                  <p className="text-[clamp(16px,1.9vw,19px)] leading-[1.45] text-[var(--ink-deep)] m-0 mt-3.5 border-l-[3px] border-[var(--blue)] pl-3.5 text-pretty">
                    {p.question}
                  </p>
                  <p className="text-[15px] leading-[1.6] text-[var(--ink-body)] m-0 mt-3.5 max-w-[640px] text-pretty">
                    {p.desc}
                  </p>
                  <div className="flex gap-2.5 flex-wrap mt-4">
                    {p.meta.map((m) => (
                      <Tag key={m.k} tone="soft">
                        <span className="text-[var(--ink-ghost)]">{m.k}</span>
                        &nbsp;{m.v}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div
          data-reveal
          className="mt-[clamp(48px,7vw,90px)] bg-[var(--surface-feature)] rounded-[var(--radius-xl)] p-[clamp(30px,4.5vw,52px)] text-[var(--on-dark)] transition-[opacity,transform] duration-700"
        >
          <div className="inline-flex items-center gap-[0.6rem] font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[var(--ls-label)] text-[var(--blue)]">
            <span
              aria-hidden
              className="w-[26px] h-0.5 bg-[var(--blue)] shrink-0"
            />
            Backlog
          </div>
          <h3 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(28px,4.4vw,44px)] leading-none m-0 mt-3.5">
            Other questions worth chasing.
          </h3>
          <p className="text-[15px] leading-[1.6] text-[var(--on-dark-muted)] m-0 mt-4 max-w-[660px] text-pretty">
            Pulled out during planning — they didn&apos;t fit neatly into the
            five projects, but they&apos;re too good to lose.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5 mt-[26px]">
            {BACKLOG.map((q) => (
              <div
                key={q}
                className="flex gap-[13px] items-start bg-white/[0.04] border border-white/[0.08] rounded-lg px-[18px] py-4"
              >
                <span className="text-[var(--blue)] mt-0.5 text-xs">▶</span>
                <span className="font-[family-name:var(--font-serif)] text-[15px] leading-[1.5] text-[var(--on-dark)] text-pretty">
                  {q}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-[var(--hoops-court-night)] text-[#8a8aa0] px-6 py-[clamp(44px,6vw,72px)] text-center mt-[clamp(56px,8vw,100px)] -mx-[var(--pad-gutter)] -mb-[var(--pad-section)]">
        <div className="font-[family-name:var(--font-pixel)] text-[clamp(15px,3vw,22px)] text-[var(--hoops-orange)] [text-shadow:2px_2px_0_#7a2e0a]">
          HOOPS LAB
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[13px] text-[#8a8aa0] m-0 mt-5 tracking-[0.04em]">
          Building in public — one model at a time.
        </p>
        <a
          className="hl-footer-link inline-block mt-[22px] font-[family-name:var(--font-mono)] text-[13px] text-[var(--hoops-orange-lit)] no-underline border border-[rgba(249,115,22,0.4)] rounded-[3px] px-[18px] py-2.5"
          href="https://github.com/mezz2"
          target="_blank"
          rel="noopener noreferrer"
        >
          github / mezz2
        </a>
        <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#3a3a4a] mt-[34px] tracking-[0.1em]">
          © 2026 MEZZ2 · INSERT COIN TO CONTINUE
        </div>
      </footer>
    </section>
  );
}
