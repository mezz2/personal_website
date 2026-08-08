import type { CSSProperties, HTMLAttributes } from "react";

type StatusDotProps = HTMLAttributes<HTMLSpanElement> & {
  status?: "live" | "idle";
  size?: number;
};

export function StatusDot({
  status = "live",
  size = 7,
  style,
  ...rest
}: StatusDotProps) {
  const color =
    status === "live" ? "var(--status-live)" : "var(--status-idle)";
  return (
    <span
      aria-hidden
      style={
        {
          display: "inline-block",
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          flex: "0 0 auto",
          ...style,
        } as CSSProperties
      }
      {...rest}
    />
  );
}
