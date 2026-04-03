import { GEAR } from "@/data/gear";

const SIGNAL_CHAIN = ["◎ Turntable", "→", "◈ Amplifier", "→", "◉ Speakers", "+", "◫ Sub"];

export const metadata = {
  title: "The Rig | Vinyl Room",
};

export default function RigPage() {
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
          The Rig
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16,
            color: "#8a7e72",
            marginTop: 8,
          }}
        >
          Signal chain: vinyl groove → phono cartridge → amplifier → speakers + sub
        </p>
      </div>

      {/* Signal Chain Visual */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 48,
          flexWrap: "wrap",
          padding: "20px 0",
        }}
      >
        {SIGNAL_CHAIN.map((item, i) =>
          item === "→" || item === "+" ? (
            <span key={i} style={{ color: "#c4973c", fontSize: 20, fontWeight: 300 }}>
              {item}
            </span>
          ) : (
            <span
              key={i}
              style={{
                background: "#2a2420",
                border: "1px solid #3a3632",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                color: "#e8e0d4",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          )
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {GEAR.map((g, i) => (
          <div
            key={i}
            style={{
              background: "#221e1a",
              borderRadius: 12,
              padding: 24,
              border: "1px solid #3a3632",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                fontSize: 36,
                opacity: 0.15,
                color: g.color,
              }}
            >
              {g.icon}
            </div>
            <div
              style={{
                fontSize: 11,
                color: g.color,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 8,
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              {g.role}
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#e8e0d4",
                fontWeight: 700,
                marginBottom: 10,
                fontFamily: "var(--font-playfair), serif",
                lineHeight: 1.3,
              }}
            >
              {g.name}
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#8a7e72",
                lineHeight: 1.6,
                margin: 0,
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              {g.desc}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 48,
          background: "#221e1a",
          borderRadius: 12,
          padding: 24,
          border: "1px solid #3a3632",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 20,
            color: "#e8e0d4",
            margin: "0 0 12px",
            fontWeight: 700,
          }}
        >
          Why This Combo Works
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "#8a7e72",
            lineHeight: 1.7,
            margin: 0,
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          The AT-LP120XBT feeds a clean phono signal into the Denon PMA-600NE&apos;s built-in phono
          stage, which amplifies it with 70 watts of warm, detailed power. The KEF LS50 Metas —
          perched at ear height on matched S2 stands — reproduce everything from the midrange vocals
          to shimmering highs with pinpoint imaging thanks to their concentric Uni-Q driver. The REL
          T/5x fills in the low end that bookshelf speakers naturally roll off, using REL&apos;s
          signature high-level connection to seamlessly extend the LS50s&apos; voice rather than
          adding a separate &quot;subwoofer sound.&quot; The Crosley Nashville stand keeps everything
          within arm&apos;s reach — turntable on top, amp in the shelf, vinyl below. It&apos;s a
          system where every piece was chosen to complement the others.
        </p>
      </div>
    </div>
  );
}
