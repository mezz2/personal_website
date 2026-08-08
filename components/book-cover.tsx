interface Props {
  title: string;
  author: string;
  coverUrl: string;
  color: string;
  style?: React.CSSProperties;
}

export default function BookCover({
  title,
  author,
  coverUrl,
  color,
  style,
}: Props) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#0d0b09",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "13% 12%",
          boxSizing: "border-box",
          boxShadow: "var(--shadow-media)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            fontSize: "clamp(13px,2vw,22px)",
            lineHeight: 1.12,
            color: "rgba(255,247,235,.97)",
            letterSpacing: ".005em",
            textShadow: "0 1px 8px rgba(0,0,0,.35)",
          }}
        >
          {title}
        </div>
        <div>
          <div
            style={{
              width: 24,
              height: 2,
              background: "rgba(255,247,235,.5)",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(8px,1vw,10px)",
              letterSpacing: "var(--ls-label)",
              color: "rgba(255,247,235,.62)",
            }}
          >
            {author}
          </div>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl}
        alt={title}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
