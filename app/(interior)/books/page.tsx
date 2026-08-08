"use client";

import { useCallback, useState } from "react";
import { books, type Book } from "@/data/books";
import BookDetailPanel from "@/components/book-detail-panel";
import ShelfRow from "@/components/shelf-row";
import { Kicker } from "@/components/ui";

interface ShelfConfig {
  label: string;
  books: Book[];
}

const SHELVES: ShelfConfig[] = [
  {
    label: "Reading now",
    books: books.filter((b) => b.status === "reading"),
  },
  {
    label: "Finished",
    books: books.filter((b) => b.status === "finished"),
  },
  {
    label: "Want to read",
    books: books.filter((b) => b.status === "want"),
  },
];

export default function BooksPage() {
  const [selected, setSelected] = useState<Book | null>(null);

  const open = useCallback((book: Book) => setSelected(book), []);
  const close = useCallback(() => setSelected(null), []);

  return (
    <>
      <main className="px-6 sm:px-10 pb-24 pt-14 max-w-[62rem] mx-auto">
        <Kicker>The shelf</Kicker>
        <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(34px,5vw,52px)] leading-[1.1] m-0 mt-3 text-[var(--ink)]">
          Books
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--ink-muted)] m-0 mt-1 mb-11">
          Whatever I&apos;m reading, have read, or keep meaning to get to.
        </p>

        {SHELVES.map((shelf) => (
          <ShelfRow
            key={shelf.label}
            label={shelf.label}
            books={shelf.books}
            onSelect={open}
          />
        ))}
      </main>

      <BookDetailPanel book={selected} onClose={close} />
    </>
  );
}
