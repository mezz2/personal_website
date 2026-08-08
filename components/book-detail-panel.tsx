"use client";

import { useEffect } from "react";
import type { Book } from "@/data/books";
import { Badge } from "@/components/ui";

interface Props {
  book: Book | null;
  onClose: () => void;
}

function statusLabel(status: Book["status"]): string {
  if (status === "reading") return "Reading now";
  if (status === "finished") return "Finished";
  return "Want to read";
}

export default function BookDetailPanel({ book, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = book ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [book]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[55] bg-[rgba(23,23,23,0.28)] transition-opacity duration-300 ${
          book
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed z-[60] bg-[var(--surface-card)] flex flex-col border-[var(--line-warm)] shadow-[var(--shadow-panel)] transition-transform duration-300 ease-out
          bottom-0 left-0 right-0 h-[85vh] rounded-t-[var(--radius-xl)] border-t
          sm:top-0 sm:bottom-auto sm:left-auto sm:right-0 sm:h-full sm:w-[340px] sm:rounded-none sm:border-t-0 sm:border-l
          ${
            book
              ? "translate-y-0 sm:translate-y-0 sm:translate-x-0"
              : "translate-y-full sm:translate-y-0 sm:translate-x-full"
          }`}
      >
        {book ? <PanelContent book={book} onClose={onClose} /> : null}
      </aside>
    </>
  );
}

function PanelContent({ book, onClose }: { book: Book; onClose: () => void }) {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div
        className="relative w-full aspect-[2/3] flex-shrink-0 overflow-hidden flex items-end p-[22px]"
        style={{
          background: book.spineColor,
          boxShadow: "var(--shadow-media)",
        }}
      >
        <img
          src={coverUrl}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="relative z-[1] font-[family-name:var(--font-serif)] text-[26px] font-medium leading-[1.12] text-[rgba(255,247,235,0.97)] [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">
          {book.title}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-[2] font-[family-name:var(--font-mono)] text-[11px] tracking-[var(--ls-label)] text-white/85 bg-black/35 px-2 py-1 rounded-[var(--radius-xs)] hover:bg-black/50 transition-colors"
        >
          ✕ Close
        </button>
      </div>

      <div className="p-[26px] flex flex-col gap-[18px] flex-1">
        <Badge status={book.status === "want" ? "idle" : "live"}>
          {statusLabel(book.status)}
        </Badge>

        <p className="m-0 font-[family-name:var(--font-mono)] text-[13px] tracking-[var(--ls-label)] text-[var(--ink-muted)]">
          {book.author}
        </p>

        {book.rating !== undefined ? (
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-base ${
                  i < book.rating!
                    ? "text-[var(--blue)]"
                    : "text-black/12"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        ) : null}

        {book.notes ? (
          <p className="m-0 font-[family-name:var(--font-serif)] text-[15px] leading-[1.6] text-[var(--ink-body)]">
            {book.notes}
          </p>
        ) : (
          <p className="m-0 font-[family-name:var(--font-serif)] text-[15px] leading-[1.6] italic text-[var(--ink-muted)]">
            Haven&apos;t written anything down yet — just opened it.
          </p>
        )}

        {book.dateFinished ? (
          <p className="m-0 font-[family-name:var(--font-mono)] text-[11px] tracking-[var(--ls-label)] text-[var(--ink-faint)]">
            Finished{" "}
            {new Date(book.dateFinished + "T00:00:00").toLocaleDateString(
              "en-US",
              { month: "long", year: "numeric" },
            )}
          </p>
        ) : null}

        {book.blogPostUrl ? (
          <a
            href={book.blogPostUrl}
            className="mt-auto font-[family-name:var(--font-mono)] text-[12px] tracking-[var(--ls-label)] text-[var(--ink)] border-b border-[var(--ink)] pb-[3px] self-start hover:text-[var(--blue)] hover:border-[var(--blue)] transition-colors"
          >
            Read my thoughts →
          </a>
        ) : null}
      </div>
    </div>
  );
}
