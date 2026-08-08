import Link from "next/link";
import { notFound } from "next/navigation";
import { somedayItems } from "@/data/someday";
import { Kicker } from "@/components/ui";

export async function generateStaticParams() {
  return somedayItems.map((item) => ({ slug: item.slug }));
}

export default async function SomedayItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = somedayItems.find((i) => i.slug === slug);

  if (!item) notFound();

  return (
    <main className="min-h-screen px-6 pt-14 pb-24 max-w-3xl mx-auto">
      <Link
        href="/someday"
        className="font-[family-name:var(--font-mono)] text-[12px] tracking-[var(--ls-label)] text-[var(--ink-muted)] hover:text-[var(--blue)] transition-colors mb-10 inline-block"
      >
        ← Someday
      </Link>

      <div
        className="rounded-[var(--radius-xl)] p-6 sm:p-10 mb-10 border border-black/[0.06]"
        style={{ backgroundColor: item.color }}
      >
        <h1 className="font-[family-name:var(--font-serif)] font-medium text-white text-[clamp(28px,4vw,40px)] leading-snug m-0">
          {item.title}
        </h1>
        {item.description ? (
          <p className="font-[family-name:var(--font-mono)] text-white/60 text-sm mt-3 leading-relaxed m-0">
            {item.description}
          </p>
        ) : null}
      </div>

      <Kicker tone="muted">More to come</Kicker>
    </main>
  );
}
