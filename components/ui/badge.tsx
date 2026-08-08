import type { CSSProperties, HTMLAttributes } from "react";
import { StatusDot } from "./status-dot";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status?: "live" | "idle";
  showDot?: boolean;
};

export function Badge({
  children,
  status = "live",
  showDot = true,
  style,
  ...rest
}: BadgeProps) {
  const live = status === "live";
  return (
    <span
      style={
        {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "var(--ls-label)",
          padding: live ? "0.28rem 0.6rem" : "0.24rem 0.6rem",
          borderRadius: "var(--radius-pill)",
          whiteSpace: "nowrap",
          color: live ? "#fff" : "var(--ink-faint)",
          background: live ? "var(--blue)" : "transparent",
          border: live
            ? "1px solid var(--blue)"
            : "1px solid var(--line-strong)",
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {showDot ? (
        <StatusDot
          status={status}
          style={live ? { background: "#fff" } : undefined}
        />
      ) : null}
      {children}
    </span>
  );
}
