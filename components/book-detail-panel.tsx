'use client';

import { useEffect } from 'react';
import type { Book } from '@/data/books';

interface Props {
  book: Book | null;
  onClose: () => void;
}

export default function BookDetailPanel({ book, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[55] transition-opacity duration-300 ${book ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel — bottom sheet on mobile, right drawer on sm+ */}
      <aside
        className={`fixed z-[60] bg-[#0f0f0f] flex flex-col transition-transform duration-300 ease-out
          bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl border-t border-white/10
          sm:top-0 sm:bottom-auto sm:left-auto sm:right-0 sm:h-full sm:w-80 sm:rounded-none sm:border-t-0 sm:border-l
          ${book ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}`}
      >
        {book && <PanelContent book={book} onClose={onClose} />}
      </aside>
    </>
  );
}

function PanelContent({ book, onClose }: { book: Book; onClose: () => void }) {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Cover image */}
      <div className="relative w-full aspect-[2/3] bg-[#111] flex-shrink-0 overflow-hidden">
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.style.background = book.spineColor;
            }
          }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-mono text-white/50 text-xs tracking-widest hover:text-white transition-colors bg-black/50 px-2 py-1"
        >
          ✕ CLOSE
        </button>
      </div>

      {/* Book info */}
      <div className="p-6 flex flex-col gap-5 flex-1">
        <div>
          <h2 className="font-mono text-white font-bold text-sm tracking-widest leading-snug mb-1">
            {book.title}
          </h2>
          <p className="font-mono text-gray-400 text-xs tracking-widest">{book.author}</p>
        </div>

        {book.rating !== undefined && (
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < book.rating! ? 'text-orange-400' : 'text-white/10'}`}
              >
                ★
              </span>
            ))}
          </div>
        )}

        {book.dateFinished && (
          <p className="font-mono text-gray-600 text-[10px] tracking-widest">
            FINISHED {new Date(book.dateFinished).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
          </p>
        )}

        {book.notes && (
          <p className="font-mono text-gray-400 text-xs tracking-wide leading-relaxed">
            {book.notes}
          </p>
        )}

        {book.blogPostUrl && (
          <a
            href={book.blogPostUrl}
            className="font-mono text-orange-400 text-xs tracking-widest hover:text-orange-300 transition-colors mt-auto"
          >
            READ MY THOUGHTS →
          </a>
        )}
      </div>
    </div>
  );
}
