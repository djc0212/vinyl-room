export const metadata = {
  title: "The Video | Vinyl Room",
};

export default function VideoPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 36,
            color: "#e8e0d4",
            margin: 0,
            fontWeight: 700,
          }}
        >
          The Video
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16,
            color: "#8a7e72",
            marginTop: 8,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          A song written and recorded using only analog synthesizers, paired with
          visuals entirely created by AI.
        </p>
      </div>

      {/* Video Player */}
      <div
        style={{
          background: "#221e1a",
          border: "1px solid #3a3632",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%", // 16:9 aspect ratio
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/q-J9k_ujObc"
            title="Analog Synthesizer Song — AI-Generated Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>

        {/* Caption bar */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #3a3632",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ color: "#c4973c", fontSize: 18 }}>♫</span>
          <span
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13,
              color: "#8a7e72",
            }}
          >
            Analog synths × AI visuals
          </span>
        </div>
      </div>
    </div>
  );
}
