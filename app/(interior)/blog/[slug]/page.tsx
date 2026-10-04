import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, loadPost } from "@/lib/blog";
import { formatPostDate } from "@/lib/post-meta";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadPost(slug);
  return {
    title: meta.title,
    description: meta.summary,
    openGraph: { type: "article", publishedTime: meta.date },
  };
}

const backLink =
  "font-[family-name:var(--font-mono)] text-[12px] tracking-[var(--ls-label)] text-[var(--ink-muted)] hover:text-[var(--blue)] transition-colors";

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const { meta, Content } = await loadPost(slug);

  return (
    <main className="max-w-[700px] mx-auto px-7 pt-14 pb-[clamp(80px,10vw,140px)]">
      <Link href="/blog" className={`${backLink} inline-block mb-10`}>
        ← Blog
      </Link>

      <article>
        <header className="mb-10">
          <p className="m-0 flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[var(--ls-label)] text-[var(--ink-faint)]">
            <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
            {meta.draft ? (
              <span className="rounded-[var(--radius-pill)] border border-[var(--line-strong)] px-2 py-px text-[10px]">
                Draft — hidden on the live site
              </span>
            ) : null}
          </p>
          <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(34px,5.5vw,50px)] leading-[1.1] tracking-[-0.01em] m-0 mt-3 text-[var(--ink)] text-balance">
            {meta.title}
          </h1>
        </header>

        <Content />
      </article>

      <div className="mt-14 pt-7 border-t border-[var(--line-warm)]">
        <Link href="/blog" className={backLink}>
          ← All posts
        </Link>
      </div>
    </main>
  );
}
