import type { CSSProperties, HTMLAttributes } from "react";

type MetaTileProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string;
};

export function MetaTile({ label, value, style, ...rest }: MetaTileProps) {
  return (
    <div
      style={
        {
          background: "var(--surface-card)",
          border: "1px solid var(--line-warm)",
          borderRadius: "var(--radius-md)",
          padding: "12px 14px",
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "var(--ls-label-wide)",
          color: "var(--ink-ghost)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--ink-deep)",
          marginTop: "5px",
        }}
      >
        {value}
      </div>
    </div>
  );
}
