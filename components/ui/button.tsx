import type { CSSProperties, HTMLAttributes } from "react";

const VARIANTS = {
  primary: {
    background: "var(--blue)",
    color: "#fff",
    border: "1px solid var(--blue)",
  },
  secondary: {
    background: "transparent",
    color: "var(--blue-deep)",
    border: "1px solid var(--blue-line)",
  },
  ghost: {
    background: "transparent",
    color: "var(--ink)",
    border: "1px solid var(--line)",
  },
} as const;

const SIZES = {
  sm: { padding: "0.5rem 0.85rem", fontSize: "11px" },
  md: { padding: "0.65rem 0.95rem", fontSize: "12px" },
  lg: { padding: "0.8rem 1.2rem", fontSize: "13px" },
} as const;

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

type ButtonProps = HTMLAttributes<HTMLElement> & {
  variant?: Variant;
  size?: Size;
  href?: string;
  as?: "button" | "a" | "span";
  disabled?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  as,
  disabled = false,
  style,
  className,
  ...rest
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const Comp = href ? "a" : (as ?? "button");

  return (
    <Comp
      href={href}
      disabled={Comp === "button" ? disabled : undefined}
      aria-disabled={disabled || undefined}
      className={["ds-btn", `ds-btn--${variant}`, className]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          letterSpacing: "var(--ls-label)",
          lineHeight: 1,
          textDecoration: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          borderRadius: "var(--radius-xs)",
          transition:
            "background var(--dur) ease, color var(--dur) ease, border-color var(--dur) ease",
          ...v,
          ...s,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Comp>
  );
}
