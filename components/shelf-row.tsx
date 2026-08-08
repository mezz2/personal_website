"use client";

import { useRef } from "react";
import type { Book } from "@/data/books";

interface Props {
  label: string;
  books: Book[];
  onSelect: (book: Book) => void;
}

export default function ShelfRow({ label, books, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 280 : -280,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-11">
      <p className="font-[family-name:var(--font-mono)] text-[12px] tracking-[var(--ls-label)] text-[var(--blue-deep)] m-0 mb-[18px]">
        {label}
      </p>

      <div className="group/shelf relative">
        <div className="absolute left-0 top-0 bottom-4 w-12 z-10 flex items-center justify-start pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--paper)] to-transparent" />
          <button
            type="button"
            onClick={() => scroll("left")}
            className="relative pointer-events-auto hidden sm:block opacity-0 group-hover/shelf:opacity-100 transition-opacity duration-200 font-[family-name:var(--font-mono)] text-[var(--ink-faint)] hover:text-[var(--blue)] text-lg pl-1"
            aria-label="Scroll left"
          >
            ‹
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex items-end gap-[3px] overflow-x-auto scrollbar-hide px-10 pb-0.5"
        >
          {books.map((book) => (
            <BookSpine key={book.id} book={book} onSelect={onSelect} />
          ))}
          {books.length === 0 ? (
            <p className="font-[family-name:var(--font-mono)] text-[var(--ink-ghost)] text-xs tracking-[var(--ls-label)] pb-2">
              Nothing here yet
            </p>
          ) : null}
        </div>

        <div className="absolute right-0 top-0 bottom-4 w-12 z-10 flex items-center justify-end pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--paper)] to-transparent" />
          <button
            type="button"
            onClick={() => scroll("right")}
            className="relative pointer-events-auto hidden sm:block opacity-0 group-hover/shelf:opacity-100 transition-opacity duration-200 font-[family-name:var(--font-mono)] text-[var(--ink-faint)] hover:text-[var(--blue)] text-lg pr-1"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>

        <div
          className="h-[18px] rounded-sm"
          style={{
            background:
              "linear-gradient(180deg,#c99a5b 0%,#a9732f 45%,#7c4e1c 100%)",
            boxShadow: "0 6px 12px -6px rgba(0,0,0,.4)",
          }}
        />
        <div className="h-2.5 bg-gradient-to-b from-black/20 to-transparent" />
      </div>
    </div>
  );
}

function BookSpine({
  book,
  onSelect,
}: {
  book: Book;
  onSelect: (b: Book) => void;
}) {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;

  return (
    <div
      className="book-item"
      onClick={() => onSelect(book)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(book);
        }
      }}
      role="button"
      tabIndex={0}
      title={book.title}
    >
      <img
        src={coverUrl}
        alt={book.title}
        className="book-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="spine-overlay" style={{ background: book.spineColor }}>
        <span
          className="font-[family-name:var(--font-mono)] text-white/75 text-[8px] tracking-wider overflow-hidden"
          style={{
            writingMode: "vertical-rl",
            maxHeight: "90%",
            overflow: "hidden",
          }}
        >
          {book.title}
        </span>
      </div>
    </div>
  );
}
