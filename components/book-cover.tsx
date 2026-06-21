interface Props {
  title: string;
  author: string;
  coverUrl: string;
  color: string;
  style?: React.CSSProperties;
}

export default function BookCover({ title, author, coverUrl, color, style }: Props) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0d0b09', ...style }}>
      {/* Branded fallback — always underneath */}
      <div style={{
        position: 'absolute', inset: 0,
        background: color,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '13% 12%', boxSizing: 'border-box',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.10), inset 0 0 70px rgba(0,0,0,.42)',
      }}>
        <div style={{
          fontFamily: 'var(--font-newsreader), Georgia, serif',
          fontWeight: 500,
          fontSize: 'clamp(13px,2vw,22px)',
          lineHeight: 1.12,
          color: 'rgba(255,247,235,.97)',
          letterSpacing: '.005em',
          textShadow: '0 1px 8px rgba(0,0,0,.35)',
        }}>
          {title}
        </div>
        <div>
          <div style={{ width: 24, height: 2, background: 'rgba(255,247,235,.5)', marginBottom: 8 }} />
          <div style={{
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: 'clamp(8px,1vw,10px)',
            letterSpacing: '.13em',
            textTransform: 'uppercase',
            color: 'rgba(255,247,235,.62)',
          }}>
            {author}
          </div>
        </div>
      </div>

      {/* Real cover — hides on error to reveal fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl}
        alt={title}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
