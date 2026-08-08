import type { CSSProperties, HTMLAttributes } from "react";

type KickerProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "accent" | "muted";
  rule?: boolean;
};

export function Kicker({
  children,
  tone = "accent",
  rule = true,
  style,
  ...rest
}: KickerProps) {
  const color = tone === "accent" ? "var(--blue-deep)" : "var(--ink-ghost)";
  const ruleColor = tone === "accent" ? "var(--blue)" : "var(--ink-ghost)";
  return (
    <div
      style={
        {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "var(--ls-label)",
          color,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {rule ? (
        <span
          aria-hidden
          style={{
            width: 26,
            height: 2,
            background: ruleColor,
            display: "inline-block",
            flex: "0 0 auto",
          }}
        />
      ) : null}
      {children}
    </div>
  );
}
