
export default function BasketballHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Arena background */}
      <img
        src="/arena-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      />

      {/* Centered overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 bg-black/60 px-6 sm:px-12 py-8 -translate-y-8">

          {/* Title */}
          <h1
            className="text-white text-3xl sm:text-4xl lg:text-6xl text-center leading-tight"
            style={{
              fontFamily: "var(--font-press-start)",
              textShadow:
                "2px 0 #f97316, -2px 0 #f97316, 0 2px #f97316, 0 -2px #f97316," +
                "2px 2px #f97316, -2px 2px #f97316, 2px -2px #f97316, -2px -2px #f97316",
            }}
          >
            HOOPS LAB
          </h1>

          {/* Subtitle */}
          <p
            className="text-orange-400 text-center leading-loose"
            style={{
              fontFamily: "var(--font-press-start)",
              fontSize: "0.75rem",
            }}
          >
            Building data science skills through
            <br />
            my passion for the NBA
          </p>

          {/* GitHub button — pixel-art 2-step inward staircase corners */}
          <a
            href="https://github.com/mezz2"
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-orange-400 hover:text-black transition-colors duration-150 group"
            style={{
              fontFamily: "var(--font-press-start)",
              fontSize: "0.75rem",
              padding: "1rem 2.5rem",
              display: "inline-block",
            }}
          >
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
              preserveAspectRatio="none"
              viewBox="0 0 200 50"
            >
              {/*
                2-step inward staircase at each corner (S=6 units):
                top-left:     right→up→right→up
                top-right:    down→right→down→right
                bottom-right: left→down→left→down
                bottom-left:  up→left→up→left
              */}
              <polygon
                points="
                  12,0 188,0
                  188,6 194,6 194,12
                  200,12 200,38
                  194,38 194,44 188,44
                  188,50 12,50
                  12,44 6,44 6,38
                  0,38 0,12
                  6,12 6,6 12,6
                "
                fill="transparent"
                className="group-hover:fill-orange-500 transition-colors duration-150"
                stroke="#f97316"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="relative">GITHUB / MEZZ2</span>
          </a>

        </div>
      </div>
    </section>
  );
}
