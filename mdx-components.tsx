import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const heading2 =
  "font-[family-name:var(--font-serif)] font-normal text-[28px] leading-[1.2] tracking-[-0.005em] text-[var(--ink)] mt-12 mb-4";
const prose =
  "font-[family-name:var(--font-serif)] text-[18px] leading-[1.75] text-[var(--ink-body)]";

function PostLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const className =
    "text-[var(--blue-deep)] underline decoration-[var(--blue-line)] underline-offset-[3px] transition-colors hover:decoration-[var(--blue)]";
  if (href.startsWith("/")) {
    return <Link href={href} className={className} {...props} />;
  }
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      />
    );
  }
  return <a href={href} className={className} {...props} />;
}

const components = {
  h1: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className={heading2} {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className={heading2} {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="font-[family-name:var(--font-serif)] font-medium text-[21px] leading-[1.3] text-[var(--ink)] mt-9 mb-3"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className={`${prose} m-0 mb-5`} {...props} />
  ),
  a: PostLink,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-[var(--ink)]" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={`${prose} m-0 mb-5 list-disc pl-6 marker:text-[var(--blue)]`}
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={`${prose} m-0 mb-5 list-decimal pl-6 marker:font-[family-name:var(--font-mono)] marker:text-[14px] marker:text-[var(--blue)]`}
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="mb-1.5 pl-1 [&>p]:mb-2" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-8 mx-0 border-l-2 border-[var(--blue)] pl-5 [&>p]:text-[21px] [&>p]:leading-[1.55] [&>p]:text-[var(--ink)] [&>p]:italic [&>p:last-child]:mb-0"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-12 border-0 border-t border-[var(--line-warm-soft)]" />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="font-[family-name:var(--font-mono)] text-[0.82em] text-[var(--ink)] bg-[var(--surface-sunken)] rounded-[var(--radius-sm)] px-1.5 py-0.5"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-7 overflow-x-auto rounded-[var(--radius-lg)] bg-[var(--surface-feature)] p-5 font-[family-name:var(--font-mono)] text-[13px] leading-[1.65] text-[var(--on-dark)] [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[13px] [&_code]:text-inherit"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 overflow-x-auto">
      <table
        className="w-full border-collapse font-[family-name:var(--font-serif)] text-[16px]"
        {...props}
      />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-[var(--line-strong)] py-2 pr-5 text-left font-[family-name:var(--font-mono)] text-[11px] font-semibold tracking-[var(--ls-label)] text-[var(--ink-muted)]"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="border-b border-[var(--line)] py-2.5 pr-5 text-[var(--ink-body)]"
      {...props}
    />
  ),
  img: ({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) => (
    // Post images have unknown dimensions, which next/image requires.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      className="my-8 h-auto w-full rounded-[var(--radius-lg)]"
      {...props}
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
