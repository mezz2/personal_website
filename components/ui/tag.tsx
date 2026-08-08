import type { CSSProperties, HTMLAttributes } from "react";

const TONES = {
  neutral: {
    color: "var(--ink-muted)",
    background: "transparent",
    border: "1px solid var(--line)",
  },
  soft: {
    color: "var(--ink-muted)",
    background: "var(--paper-deep)",
    border: "1px solid var(--line-warm)",
  },
  accent: {
    color: "var(--blue-deep)",
    background: "var(--blue-soft)",
    border: "1px solid var(--blue-line)",
  },
} as const;

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof TONES;
};

export function Tag({
  children,
  tone = "neutral",
  style,
  ...rest
}: TagProps) {
  return (
    <span
      style={
        {
          display: "inline-flex",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "var(--ls-label)",
          padding: "0.2rem 0.5rem",
          borderRadius: "var(--radius-sm)",
          whiteSpace: "nowrap",
          ...TONES[tone],
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </span>
  );
}
