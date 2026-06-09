'use client';

import { useRef } from 'react';
import type { Book } from '@/data/books';

interface Props {
  label: string;
  books: Book[];
  onSelect: (book: Book) => void;
}

const SHELF_STYLE = {
  backgroundImage: [
    'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.06) 50px, rgba(0,0,0,0.06) 51px)',
    'repeating-linear-gradient(180deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 5px)',
    'linear-gradient(180deg, #ca8a04 0%, #b45309 20%, #92400e 55%, #78350f 80%, #451a03 100%)',
  ].join(', '),
};

export default function ShelfRow({ label, books, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  return (
    <div className="mb-16">
      <p className="font-mono text-orange-400 text-xs tracking-[0.3em] mb-6">{label}</p>

      <div className="group/shelf relative">
        {/* Left fade + arrow */}
        <div className="absolute left-0 top-0 bottom-4 w-16 z-10 flex items-center justify-start pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
          <button
            onClick={() => scroll('left')}
            className="relative pointer-events-auto hidden sm:block opacity-0 group-hover/shelf:opacity-100 transition-opacity duration-200 font-mono text-gray-500 hover:text-orange-400 text-lg pl-2 transition-colors"
          >
            ‹
          </button>
        </div>

        {/* Scrollable book row */}
        <div
          ref={scrollRef}
          className="flex items-end gap-[3px] overflow-x-auto scrollbar-hide px-14"
        >
          {books.map((book) => (
            <BookSpine key={book.id} book={book} onSelect={onSelect} />
          ))}
          {books.length === 0 && (
            <p className="font-mono text-gray-700 text-xs tracking-widest pb-2">
              // NOTHING HERE YET
            </p>
          )}
        </div>

        {/* Right fade + arrow */}
        <div className="absolute right-0 top-0 bottom-4 w-16 z-10 flex items-center justify-end pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
          <button
            onClick={() => scroll('right')}
            className="relative pointer-events-auto hidden sm:block opacity-0 group-hover/shelf:opacity-100 transition-opacity duration-200 font-mono text-gray-500 hover:text-orange-400 text-lg pr-2 transition-colors"
          >
            ›
          </button>
        </div>

        {/* Oak wood shelf */}
        <div className="h-5 rounded-sm shadow-lg" style={SHELF_STYLE} />

        {/* Shelf shadow */}
        <div className="h-3 bg-gradient-to-b from-black/50 to-transparent" />
      </div>
    </div>
  );
}

function BookSpine({ book, onSelect }: { book: Book; onSelect: (b: Book) => void }) {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;

  return (
    <div className="book-item shadow-md" onClick={() => onSelect(book)} title={book.title}>
      {/* Cover image — always rendered, visible once book expands */}
      <img
        src={coverUrl}
        alt={book.title}
        className="book-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Spine overlay — fades out on hover */}
      <div className="spine-overlay" style={{ background: book.spineColor }}>
        <span
          className="font-mono text-white/75 text-[8px] tracking-wider overflow-hidden"
          style={{
            writingMode: 'vertical-rl',
            maxHeight: '90%',
            overflow: 'hidden',
          }}
        >
          {book.title}
        </span>
      </div>
    </div>
  );
}
