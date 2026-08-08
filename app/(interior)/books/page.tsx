'use client';

import { useState, useEffect, useRef, useCallback, CSSProperties } from 'react';
import { books, type Book } from '@/data/books';
import BookCover from '@/components/book-cover';

// ── helpers ────────────────────────────────────────────────────────────────

function hashFactor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return 0.94 + ((h % 1000) / 1000) * 0.13;
}

const SPINE_AT = 6;

type DecorKind = 'frame' | 'plant' | 'legos' | 'stack' | 'mug' | 'orb';

interface ShelfConfig {
  label: string;
  books: Book[];
  decor: DecorKind[];
}

const SHELVES: ShelfConfig[] = [
  { label: 'RIGHT NOW',  books: books.filter((b) => b.status === 'reading'),                        decor: ['frame', 'plant'] },
  { label: 'SHAPED ME',  books: books.filter((b) => b.status === 'finished' && b.featured),         decor: ['stack', 'legos', 'orb'] },
  { label: 'FINISHED',   books: books.filter((b) => b.status === 'finished' && !b.featured),        decor: ['mug'] },
  { label: 'UP NEXT',    books: books.filter((b) => b.status === 'want'),                            decor: ['orb'] },
];

// ── sub-components ─────────────────────────────────────────────────────────

function Ribbon({ position }: { position: 'top-right' | 'top-center' }) {
  const style: CSSProperties = position === 'top-right'
    ? { position: 'absolute', top: -1, right: '17%', width: 11, height: 36, zIndex: 3 }
    : { position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 10, height: 30, zIndex: 3 };
  return (
    <div style={{
      ...style,
      background: 'linear-gradient(180deg, #fb8c2e, #b8410d)',
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
      boxShadow: '0 3px 5px rgba(0,0,0,.55)',
    }} />
  );
}

function FaceBook({ book, onClick }: { book: Book; onClick: () => void }) {
  const factor = hashFactor(book.id);
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flex: '0 0 auto', width: `calc(clamp(52px,12vw,138px) * ${factor.toFixed(3)})`, cursor: 'pointer' }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '2/3',
        borderRadius: '2px 3px 3px 2px',
        overflow: 'hidden',
        transformOrigin: 'bottom center',
        boxShadow: hovered
          ? '0 46px 52px -18px rgba(0,0,0,.82), 0 0 26px rgba(251,140,46,.18)'
          : '0 16px 22px -10px rgba(0,0,0,.92), 0 3px 7px rgba(0,0,0,.6)',
        transform: hovered ? 'translateY(-17px) rotate(-1.6deg)' : 'none',
        transition: 'transform .42s cubic-bezier(.22,.61,.36,1), box-shadow .42s',
      }}>
        <BookCover title={book.title} author={book.author} coverUrl={coverUrl} color={book.spineColor} />
        {/* left-edge shadow */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: 'linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,0))', pointerEvents: 'none', zIndex: 2 }} />
        {/* specular */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(106deg, rgba(255,255,255,0) 50%, rgba(255,205,140,.16))', pointerEvents: 'none', zIndex: 2 }} />
        {/* top/bottom gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,210,150,.1), rgba(0,0,0,0) 26%, rgba(0,0,0,.16))', pointerEvents: 'none', zIndex: 2 }} />
        {book.status === 'reading' && <Ribbon position="top-right" />}
      </div>
    </div>
  );
}

function SpineBook({ book, onClick }: { book: Book; onClick: () => void }) {
  const factor = hashFactor(book.id);
  const thick = 27 + Math.round(((factor - 0.94) / 0.13) * 18);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flex: '0 0 auto', width: thick, cursor: 'pointer' }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: `calc(clamp(150px,20vw,196px) * ${factor.toFixed(3)})`,
        borderRadius: '1px 2px 2px 1px',
        background: book.spineColor,
        overflow: 'hidden',
        transformOrigin: 'bottom center',
        boxShadow: hovered
          ? '0 42px 48px -18px rgba(0,0,0,.82), 0 0 24px rgba(251,140,46,.16)'
          : '0 16px 22px -10px rgba(0,0,0,.92), 0 3px 7px rgba(0,0,0,.6)',
        transform: hovered ? 'translateY(-14px) rotate(-1deg)' : 'none',
        transition: 'transform .42s cubic-bezier(.22,.61,.36,1), box-shadow .42s',
      }}>
        {/* left highlight */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%', background: 'linear-gradient(90deg, rgba(255,255,255,.12), rgba(255,255,255,0))', pointerEvents: 'none' }} />
        {/* right shadow */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '26%', background: 'linear-gradient(270deg, rgba(0,0,0,.42), rgba(0,0,0,0))', pointerEvents: 'none' }} />
        {/* top rule */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 11, height: 3, background: 'rgba(255,247,235,.3)' }} />
        {/* bottom double rule */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, height: 7, borderTop: '1px solid rgba(255,247,235,.28)', borderBottom: '1px solid rgba(255,247,235,.28)' }} />
        {/* title */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0 28px' }}>
          <span style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontFamily: 'var(--font-newsreader), Georgia, serif',
            fontWeight: 500,
            fontSize: 'clamp(10px,1.2vw,13px)',
            color: 'rgba(255,247,235,.94)',
            letterSpacing: '.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: '100%',
          }}>
            {book.title}
          </span>
        </div>
        {book.status === 'reading' && <Ribbon position="top-center" />}
      </div>
    </div>
  );
}

// ── trinkets ───────────────────────────────────────────────────────────────

function TrinketFrame() {
  return (
    <div style={{ flex: '0 0 auto', width: 58, height: 74, transform: 'rotate(-3deg)', transformOrigin: 'bottom center', filter: 'drop-shadow(0 11px 10px rgba(0,0,0,.6))' }}>
      <div style={{ width: '100%', height: '100%', border: '5px solid #6e4a24', borderRadius: 2, background: '#0e0a06', boxShadow: 'inset 0 0 0 1px rgba(255,210,150,.14)' }}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #d6a85a 0%, #9a5a3a 55%, #5a2f2a 100%)', opacity: .92 }} />
      </div>
    </div>
  );
}

function TrinketPlant() {
  return (
    <div style={{ flex: '0 0 auto', width: 46, height: 64, position: 'relative', filter: 'drop-shadow(0 10px 9px rgba(0,0,0,.55))' }}>
      <div style={{ position: 'absolute', left: '50%', bottom: 20, transform: 'translate(-50%,0) rotate(-20deg)', width: 13, height: 34, borderRadius: '50%', background: 'linear-gradient(180deg,#5b8a3a,#33602a)' }} />
      <div style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translate(-50%,0)', width: 14, height: 40, borderRadius: '50%', background: 'linear-gradient(180deg,#6aa043,#3a6b2e)' }} />
      <div style={{ position: 'absolute', left: '50%', bottom: 20, transform: 'translate(-50%,0) rotate(20deg)', width: 13, height: 34, borderRadius: '50%', background: 'linear-gradient(180deg,#5b8a3a,#33602a)' }} />
      <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', width: 32, height: 24, clipPath: 'polygon(13% 0,87% 0,100% 100%,0 100%)', background: 'linear-gradient(180deg,#b5683a,#7a3f20)', boxShadow: 'inset 0 2px 0 rgba(255,210,150,.22)' }} />
    </div>
  );
}

function TrinketLegos() {
  return (
    <div style={{ flex: '0 0 auto', width: 42, height: 52, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 5, filter: 'drop-shadow(0 9px 8px rgba(0,0,0,.5))' }}>
      <div style={{ position: 'relative', width: 34, height: 14, borderRadius: 2, background: '#d8a93a' }}>
        <div style={{ position: 'absolute', top: -4, left: 6, width: 9, height: 6, borderRadius: '50% 50% 30% 30%', background: '#d8a93a' }} />
        <div style={{ position: 'absolute', top: -4, right: 6, width: 9, height: 6, borderRadius: '50% 50% 30% 30%', background: '#d8a93a' }} />
      </div>
      <div style={{ width: 40, height: 14, borderRadius: 2, background: '#c1450f' }} />
      <div style={{ width: 36, height: 14, borderRadius: 2, background: '#2d6b6b' }} />
    </div>
  );
}

function TrinketStack() {
  return (
    <div style={{ flex: '0 0 auto', width: 64, height: 42, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 3, filter: 'drop-shadow(0 9px 8px rgba(0,0,0,.55))' }}>
      <div style={{ width: 54, height: 11, borderRadius: 1, background: '#4a5a2d', marginLeft: 7, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.13)' }} />
      <div style={{ width: 64, height: 12, borderRadius: 1, background: '#6b2737', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.1)' }} />
      <div style={{ width: 58, height: 11, borderRadius: 1, background: '#2d4a6e', marginLeft: 3, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.1)' }} />
    </div>
  );
}

function TrinketMug() {
  return (
    <div style={{ flex: '0 0 auto', width: 42, height: 42, position: 'relative', filter: 'drop-shadow(0 9px 8px rgba(0,0,0,.5))' }}>
      <div style={{ position: 'absolute', left: 3, bottom: 0, width: 28, height: 32, borderRadius: '4px 4px 7px 7px', background: 'linear-gradient(90deg,#b5683a 0%,#7a3f20 100%)' }} />
      <div style={{ position: 'absolute', left: 3, top: 10, width: 28, height: 6, borderRadius: '50%', background: '#5a2f18' }} />
      <div style={{ position: 'absolute', right: 1, top: 15, width: 13, height: 16, border: '4px solid #a05c34', borderLeft: 'none', borderRadius: '0 10px 10px 0' }} />
    </div>
  );
}

function TrinketOrb() {
  return (
    <div style={{ flex: '0 0 auto', width: 34, height: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', filter: 'drop-shadow(0 9px 8px rgba(0,0,0,.5))' }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #f0d9a0, #a07a34 70%, #6a4a18)' }} />
      <div style={{ width: 20, height: 9, borderRadius: 2, background: 'linear-gradient(180deg,#5a3a1c,#33200f)', marginTop: -1 }} />
    </div>
  );
}

function Trinket({ kind }: { kind: DecorKind }) {
  if (kind === 'frame') return <TrinketFrame />;
  if (kind === 'plant') return <TrinketPlant />;
  if (kind === 'legos') return <TrinketLegos />;
  if (kind === 'stack') return <TrinketStack />;
  if (kind === 'mug')   return <TrinketMug />;
  if (kind === 'orb')   return <TrinketOrb />;
  return null;
}

// ── shelf board ─────────────────────────────────────────────────────────────

function ShelfBoard({ label }: { label: string }) {
  return (
    <div style={{
      position: 'relative',
      height: 'clamp(16px,2vw,22px)',
      borderRadius: 1,
      background: 'linear-gradient(180deg, #8c6036 0%, #603e21 28%, #3c2513 70%, #1f1308 100%)',
      boxShadow: '0 24px 32px -14px rgba(0,0,0,.88), inset 0 2px 0 rgba(255,212,150,.24), inset 0 -3px 6px rgba(0,0,0,.6)',
    }}>
      <div style={{
        position: 'absolute',
        left: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'linear-gradient(180deg, #d4ac56, #8c6a2a)',
        color: '#2a1c08',
        fontFamily: 'var(--font-plex-mono), monospace',
        fontSize: 8.5,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.45)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
    </div>
  );
}

// ── shelf row ───────────────────────────────────────────────────────────────

function ShelfRow({ shelf, spineMode, onSelect }: {
  shelf: ShelfConfig;
  spineMode: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={{ position: 'relative', marginBottom: 'clamp(4px,0.8vw,10px)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 'clamp(9px,1.3vw,17px)',
        padding: 'clamp(20px,2.6vw,34px) clamp(8px,1.2vw,16px) 0',
        minHeight: 118,
      }}>
        {shelf.books.map((book) =>
          spineMode
            ? <SpineBook key={book.id} book={book} onClick={() => onSelect(book.id)} />
            : <FaceBook  key={book.id} book={book} onClick={() => onSelect(book.id)} />
        )}

        {/* trinkets — hidden on mobile via media query class */}
        <div data-decor="" style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'clamp(12px,1.8vw,22px)',
          marginLeft: 'clamp(18px,2.8vw,38px)',
          flex: '0 0 auto',
        }} className="books-decor">
          {shelf.decor.map((kind, i) => <Trinket key={i} kind={kind} />)}
        </div>
      </div>
      <ShelfBoard label={shelf.label} />
    </div>
  );
}

// ── pendant lamp ─────────────────────────────────────────────────────────────

function PendantLamp() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 'calc(50% + min(285px,33vw))',
      transform: 'translateX(-50%)',
      zIndex: 3,
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transformOrigin: 'top center',
        animation: 'books-sway 8.5s ease-in-out infinite',
      }}>
        {/* mount bracket */}
        <div style={{
          width: 18, height: 7,
          borderRadius: '0 0 4px 4px',
          background: 'linear-gradient(180deg, #3a2614, #160d06)',
          boxShadow: '0 2px 4px rgba(0,0,0,.6)',
        }} />
        {/* cord */}
        <div style={{
          width: 2,
          height: 'clamp(110px,15vw,188px)',
          background: 'linear-gradient(180deg, #2a1c0e, #14100a)',
        }} />
        {/* shade + bulb group */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* shade */}
          <div style={{
            width: 98, height: 46,
            clipPath: 'polygon(34% 0, 66% 0, 100% 100%, 0 100%)',
            background: 'linear-gradient(180deg, #c9a44b 0%, #9a6a26 56%, #6a4516 100%)',
            boxShadow: 'inset 0 3px 0 rgba(255,228,165,.55), 0 9px 15px -6px rgba(0,0,0,.72)',
          }} />
          {/* glow halo */}
          <div style={{
            width: 80, height: 9,
            borderRadius: '50%',
            marginTop: -3,
            background: 'radial-gradient(closest-side, rgba(255,214,150,.95), rgba(255,214,150,0))',
            filter: 'blur(2px)',
          }} />
          {/* bulb */}
          <div style={{
            width: 15, height: 15,
            borderRadius: '50%',
            marginTop: -9,
            background: 'radial-gradient(circle, #fff4d6, #ffca78)',
            boxShadow: '0 0 20px 7px rgba(255,200,120,.75)',
          }} />
          {/* light cone */}
          <div style={{
            position: 'absolute',
            top: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(300px,60vw,540px)',
            height: 'clamp(440px,82vw,600px)',
            clipPath: 'polygon(46% 0, 54% 0, 100% 100%, 0 100%)',
            background: 'linear-gradient(180deg, rgba(255,202,132,.24), rgba(255,202,132,0) 76%)',
            filter: 'blur(10px)',
            mixBlendMode: 'screen',
          }} />
        </div>
      </div>
    </div>
  );
}

// ── main page ────────────────────────────────────────────────────────────────

export default function BooksPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Responsive: track mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 600);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const open = useCallback((id: string) => {
    clearTimeout(openTimerRef.current);
    clearTimeout(closeTimerRef.current);
    setSelectedId(id);
    setVisible(false);
    document.body.style.overflow = 'hidden';
    openTimerRef.current = setTimeout(() => setVisible(true), 24);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setSelectedId(null);
      document.body.style.overflow = '';
    }, 360);
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  // Clean up body overflow on unmount
  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  const selectedBook = selectedId ? books.find((b) => b.id === selectedId) ?? null : null;

  return (
    <>
      <style>{`.books-decor { display: flex; } @media (max-width: 600px) { .books-decor { display: none !important; } }`}</style>

      {/* Room */}
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'radial-gradient(130% 92% at 50% -6%, #3a2a1a 0%, #1d140c 42%, #0c0805 100%)',
        overflow: 'hidden',
      }}>
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(125% 92% at 50% 38%, transparent 50%, rgba(0,0,0,.58) 100%)',
          boxShadow: 'inset 0 0 240px 60px rgba(0,0,0,.62)',
        }} />

        {/* Lamp */}
        <PendantLamp />

        {/* Dust motes */}
        <div style={{ position: 'absolute', left: '18%', top: '30%', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,210,150,.8)', pointerEvents: 'none', zIndex: 1, animation: 'books-mote 13s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', left: '46%', top: '54%', width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,210,150,.7)', pointerEvents: 'none', zIndex: 1, animation: 'books-mote 17s ease-in-out 3s infinite' }} />
        <div style={{ position: 'absolute', left: '72%', top: '36%', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,210,150,.7)', pointerEvents: 'none', zIndex: 1, animation: 'books-mote 15s ease-in-out 6s infinite' }} />
        <div style={{ position: 'absolute', left: '84%', top: '60%', width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,210,150,.6)', pointerEvents: 'none', zIndex: 1, animation: 'books-mote 19s ease-in-out 1.5s infinite' }} />

        {/* Content */}
        <section style={{
          position: 'relative', zIndex: 2,
          padding: 'clamp(72px,10vw,128px) clamp(20px,5vw,60px) clamp(84px,10vw,132px)',
        }}>
          <div style={{ maxWidth: 728, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ maxWidth: 700, marginBottom: 'clamp(40px,6vw,72px)' }}>
              <div style={{
                fontFamily: 'var(--font-plex-mono), monospace',
                fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase',
                color: '#fb8c2e', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 0,
              }}>
                <span style={{ width: 26, height: 2, background: 'currentColor', display: 'inline-block' }} />
                The shelf
              </div>
              <h1 style={{
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                fontWeight: 500,
                fontSize: 'clamp(46px,8.5vw,104px)',
                lineHeight: .98,
                color: '#f3ead9',
                margin: '18px 0 0',
                letterSpacing: '-.02em',
              }}>
                After hours.
              </h1>
              <p style={{
                fontFamily: 'var(--font-plex-sans), sans-serif',
                fontSize: 'clamp(16px,1.9vw,20px)',
                lineHeight: 1.6,
                color: '#c3b8a0',
                margin: '24px 0 0',
                maxWidth: 560,
              }}>
                Whatever I&rsquo;m reading, have read, or keep meaning to get to &mdash; gathered in one place.
                Take a book down to see what it left behind.
              </p>
            </div>

            {/* Bookcase outer frame */}
            <div style={{
              position: 'relative',
              padding: 'clamp(16px,2.4vw,26px)',
              borderRadius: 7,
              background: 'linear-gradient(180deg, #3f2a16 0%, #2c1c0e 55%, #23160a 100%)',
              boxShadow: '0 70px 130px -44px rgba(0,0,0,.92), 0 0 0 1px rgba(0,0,0,.5), inset 0 2px 0 rgba(255,205,135,.16), inset 2px 0 0 rgba(255,190,120,.07), inset -2px 0 0 rgba(0,0,0,.4)',
            }}>
              {/* Back panel */}
              <div style={{
                position: 'relative',
                borderRadius: 3,
                padding: 'clamp(6px,1vw,12px) clamp(14px,2vw,24px) clamp(2px,0.6vw,6px)',
                background: 'linear-gradient(180deg, #26160a 0%, #190e05 100%)',
                boxShadow: 'inset 0 0 90px rgba(0,0,0,.78), inset 0 3px 16px rgba(0,0,0,.7)',
                overflow: 'hidden',
              }}>
                {/* Plank pattern */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                  background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 86px, rgba(0,0,0,.22) 86px 88px)',
                }} />

                {/* Shelf rows */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {SHELVES.map((shelf) => {
                    const spineMode = isMobile || shelf.books.length >= SPINE_AT;
                    return (
                      <ShelfRow
                        key={shelf.label}
                        shelf={shelf}
                        spineMode={spineMode}
                        onSelect={open}
                      />
                    );
                  })}
                </div>

                {/* Top-glow inner overlay */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                  background: 'radial-gradient(72% 48% at 50% -8%, rgba(255,198,130,.16), rgba(255,198,130,0) 60%), linear-gradient(180deg, rgba(255,212,150,.07) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,.32) 100%)',
                }} />
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Detail overlay — rendered via the detail panel component */}
      {selectedBook && (
        <BookDetailOverlay book={selectedBook} visible={visible} onClose={close} />
      )}
    </>
  );
}

// ── detail overlay (inline to share BookCover) ────────────────────────────

function statusLabel(status: Book['status']): string {
  if (status === 'reading')  return 'Currently reading';
  if (status === 'finished') return 'Finished';
  return 'Want to read';
}

function BookDetailOverlay({ book, visible, onClose }: { book: Book; visible: boolean; onClose: () => void }) {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(14px,4vw,48px)',
        background: 'rgba(5,4,2,.8)',
        backdropFilter: 'blur(11px) saturate(118%)',
        WebkitBackdropFilter: 'blur(11px) saturate(118%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity .34s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(960px, 100%)',
          maxHeight: '88vh',
          overflowY: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          background: '#14110d',
          borderRadius: 14,
          boxShadow: '0 50px 130px -34px rgba(0,0,0,.78)',
          border: '1px solid rgba(251,140,46,.18)',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(.985)',
          opacity: visible ? 1 : 0,
          transition: 'transform .42s cubic-bezier(.22,.61,.36,1), opacity .34s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 4,
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase',
            color: '#f3ead9',
            background: 'rgba(0,0,0,.4)',
            border: '1px solid rgba(251,140,46,.3)',
            padding: '8px 13px',
            cursor: 'pointer',
            borderRadius: 5,
            backdropFilter: 'blur(6px)',
          }}
        >
          × Close
        </button>

        {/* Left: cover */}
        <div style={{
          flex: '0 0 clamp(220px,36%,340px)',
          aspectRatio: '2/3',
          background: '#0d0b09',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <BookCover
            title={book.title}
            author={book.author}
            coverUrl={coverUrl}
            color={book.spineColor}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* Right: content */}
        <div style={{
          flex: '1 1 360px',
          minWidth: 300,
          padding: 'clamp(28px,4vw,52px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase',
            color: '#fb8c2e', fontWeight: 600,
          }}>
            {statusLabel(book.status)}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-newsreader), Georgia, serif',
            fontWeight: 500,
            fontSize: 'clamp(30px,4.4vw,48px)',
            lineHeight: 1.04,
            color: '#f3ead9',
            margin: '12px 0 0',
            letterSpacing: '-.015em',
          }}>
            {book.title}
          </h2>

          <div style={{
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: 13, letterSpacing: '.07em', textTransform: 'uppercase',
            color: '#8a7f6c',
            marginTop: 12,
          }}>
            {book.author}
          </div>

          {book.rating !== undefined && (
            <div style={{ display: 'flex', gap: 3, marginTop: 18 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ fontSize: 19, color: i < book.rating! ? '#fb8c2e' : 'rgba(255,255,255,.14)' }}>★</span>
              ))}
            </div>
          )}

          {book.notes ? (
            <p style={{
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(20px,2.5vw,28px)',
              lineHeight: 1.5,
              color: '#f3ead9',
              margin: '26px 0 0',
              letterSpacing: '.003em',
            }}>
              &ldquo;{book.notes}&rdquo;
            </p>
          ) : (
            <p style={{
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(17px,2vw,21px)',
              lineHeight: 1.5,
              color: '#8a7f6c',
              margin: '26px 0 0',
            }}>
              Haven&rsquo;t written anything down yet &mdash; just opened it.
            </p>
          )}

          {book.dateFinished && (
            <div style={{
              fontFamily: 'var(--font-plex-mono), monospace',
              fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#8a7f6c',
              marginTop: 24,
            }}>
              Finished {new Date(book.dateFinished + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          )}

          {book.blogPostUrl && (
            <a
              href={book.blogPostUrl}
              style={{
                fontFamily: 'var(--font-plex-mono), monospace',
                fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase',
                color: '#fb8c2e',
                textDecoration: 'none',
                marginTop: 30,
                display: 'inline-block',
                borderBottom: '2px solid #fb8c2e',
                paddingBottom: 3,
                fontWeight: 600,
              }}
            >
              Read my thoughts →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
