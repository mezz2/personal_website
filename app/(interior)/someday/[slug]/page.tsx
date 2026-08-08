import Link from "next/link";
import { notFound } from "next/navigation";
import { somedayItems } from "@/data/someday";

export async function generateStaticParams() {
  return somedayItems.map((item) => ({ slug: item.slug }));
}

export default async function SomedayItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = somedayItems.find((i) => i.slug === slug);

  if (!item) notFound();

  return (
    <main className="min-h-screen px-6 pt-16 pb-20 max-w-3xl mx-auto bg-[#0a0a0a] text-[#f3f4f6]">
      <Link
        href="/someday"
        className="font-mono text-gray-600 text-xs tracking-widest hover:text-gray-400 transition-colors mb-12 block"
      >
        ← SOMEDAY SHELF
      </Link>

      <div
        className="rounded-2xl p-6 sm:p-10 mb-10 border border-white/5"
        style={{ backgroundColor: item.color }}
      >
        <h1 className="font-mono font-bold text-white tracking-widest text-xl leading-snug">
          {item.title}
        </h1>
        {item.description && (
          <p className="font-mono text-white/50 text-sm tracking-wide mt-3 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      <p className="font-mono text-gray-600 text-xs tracking-widest">
        {"// more to come"}
      </p>
    </main>
  );
}
