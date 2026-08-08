export function AboutMotif() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 130"
      preserveAspectRatio="xMidYMid meet"
      className="max-h-[180px]"
      aria-hidden
    >
      <g className="landing-spin origin-[100px_66px]">
        <g stroke="oklch(0.58 0.11 245)" strokeWidth="2.5">
          <line className="landing-ln" x1="100" y1="66" x2="30" y2="22" />
          <line className="landing-ln" x1="100" y1="66" x2="172" y2="30" />
          <line className="landing-ln" x1="100" y1="66" x2="112" y2="116" />
        </g>
        <circle
          className="landing-nd origin-[30px_22px]"
          cx="30"
          cy="22"
          r="6"
          fill="oklch(0.58 0.11 245)"
        />
        <circle
          className="landing-nd landing-nd-delay-1 origin-[172px_30px]"
          cx="172"
          cy="30"
          r="6"
          fill="oklch(0.58 0.11 245)"
        />
        <circle
          className="landing-nd landing-nd-delay-2 origin-[112px_116px]"
          cx="112"
          cy="116"
          r="6"
          fill="oklch(0.58 0.11 245)"
        />
      </g>
      <circle cx="100" cy="66" r="12" fill="oklch(0.58 0.11 245)" />
    </svg>
  );
}

export function ProjectsMotif() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 130"
      preserveAspectRatio="xMidYMid meet"
      className="max-h-[180px]"
      aria-hidden
    >
      <g fill="oklch(0.58 0.11 245)">
        <rect
          className="landing-boxcycle"
          x="66"
          y="86"
          width="68"
          height="26"
          rx="4"
        />
        <rect
          className="landing-boxcycle landing-box-delay-1 landing-b2"
          x="66"
          y="54"
          width="68"
          height="26"
          rx="4"
        />
        <rect
          className="landing-boxcycle landing-box-delay-2 landing-b1"
          x="66"
          y="22"
          width="68"
          height="26"
          rx="4"
        />
      </g>
    </svg>
  );
}

export function WordsMotif() {
  const bars = [
    { width: "94%", delay: "0s" },
    { width: "76%", delay: "0.85s" },
    { width: "88%", delay: "1.7s" },
    { width: "52%", delay: "2.55s", caret: true },
  ] as const;

  return (
    <div
      className="flex flex-1 flex-col justify-center gap-[13px] px-0.5 py-1.5 min-h-0"
      aria-hidden
    >
      {bars.map((bar) =>
        "caret" in bar && bar.caret ? (
          <div key={bar.width} className="flex items-center gap-1.5">
            <div
              className="relative h-[9px] overflow-hidden rounded-[5px] bg-black/16"
              style={{ width: bar.width }}
            >
              <div
                className="landing-readline absolute inset-0 w-0 bg-[oklch(0.58_0.11_245)]"
                style={{ animationDelay: bar.delay }}
              />
            </div>
            <div className="landing-blink h-[22px] w-[3px] bg-[oklch(0.58_0.11_245)]" />
          </div>
        ) : (
          <div
            key={bar.width}
            className="relative h-[9px] overflow-hidden rounded-[5px] bg-black/16"
            style={{ width: bar.width }}
          >
            <div
              className="landing-readline absolute inset-0 w-0 bg-[oklch(0.58_0.11_245)]"
              style={{ animationDelay: bar.delay }}
            />
          </div>
        ),
      )}
    </div>
  );
}

export function SomedayMotif() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 130"
      preserveAspectRatio="xMidYMid meet"
      className="max-h-[180px]"
      aria-hidden
    >
      <path
        d="M22 112 Q104 104 168 30"
        fill="none"
        stroke="oklch(0.58 0.11 245)"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        opacity="0.5"
      />
      <path
        className="landing-starpulse origin-[168px_30px]"
        d="M168 16 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"
        fill="oklch(0.6 0.11 245)"
      />
      <circle
        className="landing-travel"
        r="6.5"
        fill="oklch(0.6 0.11 245)"
      />
    </svg>
  );
}
