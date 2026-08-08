import Link from "next/link";
import type { CSSProperties, HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  rail?: boolean;
  hover?: boolean;
  href?: string;
};

export function Card({
  children,
  rail = false,
  hover = true,
  href,
  style,
  className,
  ...rest
}: CardProps) {
  const classes = [
    "relative block overflow-hidden bg-[var(--surface-card)] border border-[var(--line-warm)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] text-inherit no-underline",
    "transition-[transform,box-shadow,border-color] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
    hover
      ? "hover:-translate-y-1 hover:shadow-[var(--shadow-card-lift)] hover:border-[var(--blue-line)]"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {rail ? (
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-1 bg-[image:var(--rail-accent)]"
          style={{ background: "var(--rail-accent)" }}
        />
      ) : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} style={style as CSSProperties}>
        {content}
      </Link>
    );
  }

  return (
    <div className={classes} style={style as CSSProperties} {...rest}>
      {content}
    </div>
  );
}
