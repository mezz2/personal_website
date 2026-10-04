import type { Metadata } from "next";
import Link from "next/link";
import { Kicker } from "@/components/ui";
import { getPosts } from "@/lib/blog";
import { blogStatusLabel } from "@/lib/hub-status";
import { formatPostDate } from "@/lib/post-meta";

export const metadata: Metadata = {
  title: "Blog",
  description: "Long-form notes.",
};

export default async function Blog() {
  const posts = await getPosts();

  return (
    <main className="max-w-[46rem] mx-auto px-6 sm:px-10 pt-14 pb-24">
      <Kicker>Words / 01</Kicker>
      <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(34px,5vw,52px)] leading-[1.1] m-0 mt-3 text-[var(--ink)]">
        Blog
      </h1>
      <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--ink-muted)] m-0 mt-1 mb-11">
        Long-form notes live here.
      </p>

      {posts.length === 0 ? (
        <p className="font-[family-name:var(--font-mono)] text-[12px] tracking-[var(--ls-label)] text-[var(--ink-ghost)] m-0 border-t border-[var(--line)] pt-6">
          {blogStatusLabel(0)}
        </p>
      ) : (
        <ol className="list-none m-0 p-0 border-b border-[var(--line)]">
          {posts.map((post) => (
            <li key={post.slug} className="border-t border-[var(--line)]">
              <Link
                href={`/blog/${post.slug}`}
                className="group block py-7 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
              >
                <span className="flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] tracking-[var(--ls-label)] text-[var(--ink-faint)]">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  {post.draft ? (
                    <span className="rounded-[var(--radius-pill)] border border-[var(--line-strong)] px-2 py-px text-[10px]">
                      Draft
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block font-[family-name:var(--font-serif)] text-[clamp(24px,3vw,28px)] leading-[1.2] text-[var(--ink)] transition-colors group-hover:text-[var(--blue)]">
                  {post.title}
                </span>
                {post.summary ? (
                  <span className="mt-2 block font-[family-name:var(--font-serif)] text-[17px] leading-[1.6] text-[var(--ink-body)]">
                    {post.summary}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
