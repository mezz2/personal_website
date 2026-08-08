import Link from "next/link";
import type { CSSProperties, ComponentProps } from "react";

type TextLinkProps = {
  href: string;
  arrow?: boolean;
  muted?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: ComponentProps<"a">["onClick"];
};

export function TextLink({
  children,
  href,
  arrow = false,
  muted = false,
  style,
  className,
  onClick,
}: TextLinkProps) {
  const external = href.startsWith("http");
  const classes = [
    "inline-flex items-center gap-[0.4rem] font-[family-name:var(--font-mono)] text-[12px] tracking-[var(--ls-label)] no-underline pb-[3px] border-b border-[var(--ink)] transition-colors duration-200",
    muted
      ? "text-[var(--ink-muted)]"
      : "text-[var(--ink)] hover:text-[var(--blue)] hover:border-[var(--blue)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        {arrow ? <span aria-hidden>→</span> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} style={style} onClick={onClick}>
      {children}
      {arrow ? <span aria-hidden>→</span> : null}
    </Link>
  );
}
