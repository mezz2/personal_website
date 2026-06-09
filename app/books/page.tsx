'use client';

import { useState } from 'react';
import { books, type Book } from '@/data/books';
import ShelfRow from '@/components/shelf-row';
import BookDetailPanel from '@/components/book-detail-panel';

const reading = books.filter((b) => b.status === 'reading');
const finished = books.filter((b) => b.status === 'finished');
const want = books.filter((b) => b.status === 'want');
const featured = books.filter((b) => b.featured);

export default function BooksPage() {
  const [selected, setSelected] = useState<Book | null>(null);

  return (
    <>
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-orange-400 text-xs tracking-[0.3em] mb-3">
              // READING LIST
            </p>
            <p className="font-mono text-gray-400 text-sm tracking-widest">
              What I'm reading, what I've read, what's next.
            </p>
          </div>

          <ShelfRow label="// CURRENTLY READING" books={reading} onSelect={setSelected} />
          <ShelfRow label="// FINISHED" books={finished} onSelect={setSelected} />
          <ShelfRow label="// WANT TO READ" books={want} onSelect={setSelected} />
          <ShelfRow label="// FEATURED — BOOKS THAT SHAPED ME" books={featured} onSelect={setSelected} />
        </div>
      </main>

      <BookDetailPanel book={selected} onClose={() => setSelected(null)} />
    </>
  );
}
