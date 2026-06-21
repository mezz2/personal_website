"use client";

import { useEffect, useMemo, useRef } from "react";

function s(str: string): React.CSSProperties {
  const o: Record<string, string> = {};
  for (const decl of str.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const k = decl.slice(0, i).trim();
    const v = decl.slice(i + 1).trim();
    if (!k) continue;
    o[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return o as React.CSSProperties;
}

type Meta = { k: string; v: string };
type Project = {
  n: string; title: string; tag: string; status: string; live: boolean;
  question: string; desc: string; meta: Meta[]; links: { label: string; soon: boolean }[];
};

const PROJECTS: Project[] = [
  { n: "01", title: "Shot Quality Model", tag: "xFG", status: "In Progress", live: true,
    question: "How much better or worse is a player shooting than expected, given shot difficulty?",
    desc: "An expected field goal (xFG) model that accounts for shot distance, zone, type, game context and defender distance. Output: a calibrated probability for every shot, plus a leaderboard of over- and under-performing shooters.",
    meta: [{ k: "Model", v: "Logistic → Gradient Boosting" }, { k: "Metric", v: "Log loss + calibration curve" }, { k: "Target", v: "4 weeks to v1" }],
    links: [{ label: "Notebook", soon: false }, { label: "Write-up", soon: true }] },
  { n: "02", title: "Game Prediction Engine", tag: "", status: "Planned", live: false,
    question: "Can we predict game outcomes better than Vegas using team-level efficiency metrics?",
    desc: "Builds directly on the xFG model — team shot quality becomes an input feature. Explores how much pregame data (pace, offensive / defensive rating, rest days, travel) predicts the final score.",
    meta: [{ k: "Builds on", v: "01 · Shot Quality" }, { k: "Inputs", v: "Pace, ORtg/DRtg, rest, travel" }],
    links: [{ label: "Details", soon: true }] },
  { n: "03", title: "Trade Value Predictor", tag: "", status: "Planned", live: false,
    question: "What is a player actually worth in a trade, quantitatively?",
    desc: "Combines on-court production (informed by the shot-quality work), contract data, age curves and positional scarcity into a single tradeable value score. Inspired by Basketball-Reference WAR — but built from scratch.",
    meta: [{ k: "Builds on", v: "01 · 03 production signal" }, { k: "Approach", v: "WAR-style, from scratch" }],
    links: [{ label: "Details", soon: true }] },
  { n: "04", title: "Play-by-Play Clustering", tag: "", status: "Planned", live: false,
    question: "What types of possessions actually exist, and which teams and players run them most?",
    desc: "Unsupervised clustering on play-by-play sequences to surface possession archetypes — pick-and-roll, isolation, transition. Feeds naturally into both trade value and game prediction.",
    meta: [{ k: "Method", v: "Unsupervised clustering" }, { k: "Feeds", v: "02 · 03" }],
    links: [{ label: "Details", soon: true }] },
  { n: "05", title: "Draft Class Projection", tag: "", status: "Planned", live: false,
    question: "Which college and international prospects translate to NBA production, and why?",
    desc: "Historical draft-class analysis plus a projection model. The capstone — it requires the full data infrastructure built across projects 1 through 4.",
    meta: [{ k: "Requires", v: "Infra from 01–04" }, { k: "Type", v: "Projection model" }],
    links: [{ label: "Details", soon: true }] },
];

const BACKLOG = [
  "Binary shot prediction (made / missed) as a standalone classification benchmark",
  "Player shot-selection ranking — who takes the highest-quality shots, regardless of outcome?",
  "Does shot quality predict future performance? (regression to the mean)",
  "Game-context effects on shooting — how does pressure change shot quality?",
];

function badgeStyle(live: boolean): React.CSSProperties {
  return live
    ? { fontFamily: "var(--font-plex-mono),monospace", fontSize: "11px", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", background: "#c1450f", padding: "5px 10px", borderRadius: "40px", display: "inline-flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }
    : { fontFamily: "var(--font-plex-mono),monospace", fontSize: "11px", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8478", background: "transparent", border: "1px solid #cfc6b3", padding: "4px 10px", borderRadius: "40px", display: "inline-flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" };
}

function buildHexes() {
  const bx = 250, by = 415;
  const hash = (x: number, y: number) => { const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return v - Math.floor(v); };
  const hexes: { x: number; y: number; r: number; v: number; delay: number }[] = [];
  let row = 0;
  for (let gy = 165; gy <= 452; gy += 20, row++) {
    const ox = row % 2 ? 11 : 0;
    for (let gx = 18; gx <= 482; gx += 23) {
      const x = gx + ox, y = gy;
      if (x < 14 || x > 486) continue;
      const dx = x - bx, dy = y - by, d = Math.sqrt(dx * dx + dy * dy);
      if (d > 248) continue;
      let f;
      if (d < 40) f = 1; else if (Math.abs(d - 232) < 24) f = 0.92; else if (d < 118) f = 0.5; else f = 0.28;
      f *= 0.55 + 0.45 * hash(x, y);
      if (f < 0.13) continue;
      const r = 3.2 + f * 8.6;
      let v = hash(x * 0.7, y * 1.31) * 2 - 1;
      if (d < 40) v += 0.55; else if (d > 66 && d < 150) v -= 0.5; else if (Math.abs(d - 232) < 26) v += 0.22;
      v = Math.max(-1, Math.min(1, v));
      hexes.push({ x, y, r, v, delay: d / 248 });
    }
  }
  return hexes;
}
function divColor(v: number) {
  const hot = [226, 59, 46], mid = [244, 239, 230], cold = [47, 111, 176];
  let c: number[];
  if (v >= 0) { const t = v; c = hot.map((h, i) => Math.round(mid[i] + (h - mid[i]) * t)); }
  else { const t = -v; c = cold.map((h, i) => Math.round(mid[i] + (h - mid[i]) * t)); }
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function hexPath(cx: number, cy: number, r: number) {
  let p = "";
  for (let i = 0; i < 6; i++) { const a = (Math.PI / 180) * (60 * i - 30); p += (i ? " " : "") + (cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1); }
  return p;
}

function ShotChart() {
  const hexes = useMemo(() => buildHexes(), []);
  const cs = "#cabfa6";
  return (
    <svg viewBox="0 0 500 476" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect x={8} y={8} width={484} height={460} fill="none" stroke={cs} strokeWidth={2} />
      <rect x={190} y={295} width={120} height={165} fill="none" stroke={cs} strokeWidth={2} />
      <circle cx={250} cy={295} r={48} fill="none" stroke={cs} strokeWidth={2} />
      <circle cx={250} cy={413} r={9} fill="none" stroke={cs} strokeWidth={2} />
      <line x1={218} y1={423} x2={282} y2={423} stroke={cs} strokeWidth={2} />
      <path d="M 22 460 L 22 352 A 232 232 0 0 0 478 352 L 478 460" fill="none" stroke={cs} strokeWidth={2} />
      <path d="M 210 413 A 40 40 0 0 0 290 413" fill="none" stroke={cs} strokeWidth={1.5} />
      {hexes.map((hx, i) => (
        <polygon key={i} points={hexPath(hx.x, hx.y, hx.r)} fill={divColor(hx.v)} stroke="rgba(40,30,10,.10)" strokeWidth={0.5} />
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
    els.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(28px)"; });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { const el = en.target as HTMLElement; el.style.opacity = "1"; el.style.transform = "none"; io.unobserve(el); }
      }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const featured = PROJECTS[0];
  const rest = PROJECTS.slice(1);

  return (
    <main ref={rootRef} id="projects" style={s("position:relative;background:linear-gradient(180deg,#faf6ee 0%,#f3ead9 100%);padding:clamp(72px,11vw,140px) clamp(20px,5vw,64px) clamp(60px,9vw,110px);font-family:var(--font-plex-sans),sans-serif")}>
      <div style={s("position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#f97316,#c1450f)")} />
      <div style={s("max-width:1180px;margin:0 auto")}>

        <div data-reveal style={s("transition:opacity .7s ease,transform .7s ease;max-width:780px")}>
          <div style={s("display:flex;align-items:center;gap:10px;font-family:var(--font-plex-mono),monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#b4471f;font-weight:600")}>
            <span style={s("width:26px;height:2px;background:#b4471f;display:inline-block")} />The work
          </div>
          <h2 style={s("font-family:var(--font-anton),sans-serif;font-weight:400;font-size:clamp(44px,8vw,86px);line-height:.92;margin:16px 0 0;color:#16140f;letter-spacing:.01em")}>FIVE PROJECTS,<br />ONE DATA STACK.</h2>
          <p style={s("font-size:clamp(15px,1.8vw,18px);line-height:1.6;color:#4a463d;margin:22px 0 0;text-wrap:pretty")}>Each project builds on the last &mdash; shot quality feeds game prediction, which feeds trade value. Start with the foundation and watch the stack compound.</p>
        </div>

        {/* featured project + shot chart */}
        <div data-reveal style={s("transition:opacity .7s ease,transform .7s ease;display:flex;gap:clamp(32px,5vw,64px);flex-wrap:wrap;align-items:flex-start;margin-top:clamp(44px,6vw,76px)")}>
          <div style={s("flex:1 1 380px;min-width:300px")}>
            <div style={s("display:flex;align-items:flex-start;gap:clamp(14px,2vw,20px);flex-wrap:wrap")}>
              <span style={s("font-family:var(--font-anton),sans-serif;font-size:clamp(46px,7vw,72px);line-height:.78;color:#e7d9bd")}>01</span>
              <div>
                <div style={s("display:flex;align-items:baseline;gap:10px;flex-wrap:wrap")}>
                  <h3 style={s("font-family:var(--font-anton),sans-serif;font-weight:400;font-size:clamp(30px,4.2vw,48px);line-height:1.06;margin:0;color:#16140f;letter-spacing:.01em")}>{featured.title}</h3>
                  <span style={s("font-family:var(--font-plex-mono),monospace;font-size:14px;font-weight:600;color:#c1450f;background:#f7e9d6;padding:4px 9px;border-radius:4px")}>{featured.tag}</span>
                </div>
                <div style={s("margin-top:14px")}>
                  <span style={badgeStyle(featured.live)}><span style={s("width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block")} />{featured.status}</span>
                </div>
              </div>
            </div>
            <p style={s("font-size:clamp(18px,2.2vw,23px);line-height:1.45;color:#16140f;font-weight:500;margin:24px 0 0;border-left:3px solid #f97316;padding-left:16px;text-wrap:pretty")}>{featured.question}</p>
            <p style={s("font-size:16px;line-height:1.65;color:#4a463d;margin:18px 0 0;max-width:540px;text-wrap:pretty")}>{featured.desc}</p>
            <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:26px")}>
              {featured.meta.map((m) => (
                <div key={m.k} style={s("background:#fff;border:1px solid #e8dfcc;border-radius:6px;padding:12px 14px")}>
                  <div style={s("font-family:var(--font-plex-mono),monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#a89e8a")}>{m.k}</div>
                  <div style={s("font-family:var(--font-plex-sans),sans-serif;font-size:14px;font-weight:600;color:#16140f;margin-top:5px")}>{m.v}</div>
                </div>
              ))}
            </div>
            <div style={s("display:flex;gap:16px;flex-wrap:wrap;margin-top:22px;align-items:center")}>
              {featured.links.map((l) => l.soon ? (
                <span key={l.label} style={s("font-family:var(--font-plex-mono),monospace;font-size:13px;color:#a89e8a")}>{l.label} &middot; coming soon</span>
              ) : (
                <span key={l.label} style={s("font-family:var(--font-plex-mono),monospace;font-size:13px;font-weight:600;color:#c1450f;border-bottom:2px solid #c1450f;padding-bottom:2px")}>{l.label} &rarr;</span>
              ))}
            </div>
          </div>

          <div style={s("flex:1 1 380px;min-width:300px")}>
            <div style={s("background:#fff;border:1px solid #ece3d0;border-radius:10px;padding:clamp(20px,3vw,32px);box-shadow:0 18px 44px -30px rgba(80,60,20,.55)")}>
              <div style={s("display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap")}>
                <div style={s("font-family:var(--font-anton),sans-serif;font-size:20px;color:#16140f;letter-spacing:.03em")}>SHOT CHART</div>
                <div style={s("font-family:var(--font-plex-mono),monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#a89e8a;text-align:right")}>FG% vs league avg<br />by location</div>
              </div>
              <div data-reveal style={s("margin-top:14px;transform-origin:50% 100%;transition:opacity .85s ease .12s,transform .85s ease .12s")}><ShotChart /></div>
              <div style={s("display:flex;align-items:center;gap:8px;justify-content:center;margin-top:10px;font-family:var(--font-plex-mono),monospace;font-size:10px;color:#8a8478")}>
                <span>COLD</span><span style={s("width:130px;height:8px;border-radius:4px;background:linear-gradient(90deg,#2f6fb0,#f4efe6,#e23b2e);display:inline-block")} /><span>HOT</span>
              </div>
              <div style={s("font-family:var(--font-plex-mono),monospace;font-size:10px;color:#c0b290;margin-top:12px;text-align:center;letter-spacing:.04em")}>Illustrative &mdash; live model output coming soon</div>
            </div>
          </div>
        </div>

        {/* roadmap divider */}
        <div style={s("display:flex;align-items:center;gap:14px;margin-top:clamp(44px,5.5vw,72px)")}>
          <span style={s("font-family:var(--font-plex-mono),monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#a89e8a;font-weight:600;white-space:nowrap")}>The roadmap &middot; 02&ndash;05</span>
          <span style={s("flex:1;height:1px;background:#ddd2bd;display:inline-block")} />
        </div>

        {/* roadmap cards */}
        <div style={s("display:flex;flex-direction:column;gap:clamp(18px,2.5vw,26px);margin-top:clamp(22px,3vw,32px)")}>
          {rest.map((p) => (
            <div key={p.n} data-reveal className="hl-card" style={s("background:#fff;border:1px solid #ece3d0;border-radius:10px;padding:clamp(24px,3.5vw,40px);display:flex;gap:clamp(18px,3vw,40px);flex-wrap:wrap;box-shadow:0 14px 36px -32px rgba(80,60,20,.5)")}>
              <div style={s("flex:0 0 auto;font-family:var(--font-anton),sans-serif;font-size:clamp(44px,6vw,72px);line-height:.78;color:#e7d9bd")}>{p.n}</div>
              <div style={s("flex:1 1 360px;min-width:240px")}>
                <div style={s("display:flex;align-items:center;gap:12px;flex-wrap:wrap")}>
                  <h3 style={s("font-family:var(--font-anton),sans-serif;font-weight:400;font-size:clamp(26px,3.4vw,40px);line-height:1.06;margin:0;color:#16140f;letter-spacing:.01em")}>{p.title}</h3>
                  <span style={badgeStyle(p.live)}><span style={s("width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block")} />{p.status}</span>
                </div>
                <p style={s("font-size:clamp(16px,1.9vw,20px);line-height:1.45;color:#16140f;font-weight:500;margin:16px 0 0;border-left:3px solid #f97316;padding-left:14px;text-wrap:pretty")}>{p.question}</p>
                <p style={s("font-size:15px;line-height:1.6;color:#4a463d;margin:14px 0 0;max-width:640px;text-wrap:pretty")}>{p.desc}</p>
                <div style={s("display:flex;gap:10px;flex-wrap:wrap;margin-top:18px")}>
                  {p.meta.map((m) => (
                    <div key={m.k} style={s("font-family:var(--font-plex-mono),monospace;font-size:12px;color:#6a6456;background:#f3ebdb;border:1px solid #ece3d0;border-radius:40px;padding:6px 13px")}><span style={s("color:#a89e8a")}>{m.k}</span> &nbsp;{m.v}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* backlog */}
        <div data-reveal style={s("transition:opacity .7s ease,transform .7s ease;margin-top:clamp(48px,7vw,92px);background:#16140f;border-radius:14px;padding:clamp(30px,4.5vw,54px);color:#f3ead9")}>
          <div style={s("display:flex;align-items:center;gap:10px;font-family:var(--font-plex-mono),monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#fb8c2e;font-weight:600")}>
            <span style={s("width:26px;height:2px;background:#fb8c2e;display:inline-block")} />Backlog
          </div>
          <h3 style={s("font-family:var(--font-anton),sans-serif;font-weight:400;font-size:clamp(28px,4.4vw,46px);line-height:1;margin:16px 0 0;letter-spacing:.01em")}>OTHER QUESTIONS WORTH CHASING</h3>
          <p style={s("font-size:15px;line-height:1.6;color:#bdb4a0;margin:16px 0 0;max-width:660px;text-wrap:pretty")}>Pulled out during planning &mdash; they didn&rsquo;t fit neatly into the five projects, but they&rsquo;re too good to lose.</p>
          <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:28px")}>
            {BACKLOG.map((q, i) => (
              <div key={i} style={s("display:flex;gap:13px;align-items:flex-start;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:16px 18px")}>
                <span style={s("font-family:var(--font-press-start),monospace;font-size:9px;color:#fb8c2e;margin-top:3px")}>&#9654;</span>
                <span style={s("font-size:14px;line-height:1.5;color:#e8e0d0;text-wrap:pretty")}>{q}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* footer */}
      <footer style={s("background:#0a0a10;color:#6b6b7a;padding:clamp(48px,7vw,80px) clamp(20px,5vw,64px);text-align:center;margin:clamp(60px,9vw,110px) calc(-1 * clamp(20px,5vw,64px)) calc(-1 * clamp(60px,9vw,110px))")}>
        <div style={s("font-family:var(--font-press-start),monospace;font-size:clamp(16px,3vw,24px);color:#fb8c2e;text-shadow:2px 2px 0 #7a2e0a;line-height:1.3")}>HOOPS LAB</div>
        <p style={s("font-family:var(--font-plex-mono),monospace;font-size:13px;color:#8a8aa0;margin:22px 0 0;letter-spacing:.04em")}>Building in public &mdash; one model at a time.</p>
        <div style={s("display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin-top:26px")}>
          <a className="hl-footer-link" href="https://github.com/mezz2" target="_blank" rel="noopener noreferrer" style={s("font-family:var(--font-plex-mono),monospace;font-size:13px;color:#fb8c2e;text-decoration:none;border:1px solid rgba(249,115,22,.4);border-radius:3px;padding:10px 18px")}>github / mezz2</a>
        </div>
        <div style={s("font-family:var(--font-press-start),monospace;font-size:8px;color:#3a3a4a;margin-top:34px;letter-spacing:.1em")}>&#169; 2026 MEZZ2 &middot; INSERT COIN TO CONTINUE</div>
      </footer>
    </main>
  );
}
