import { ALBUMS } from "@/data/albums";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #3a3632",
        padding: "24px 20px",
        textAlign: "center",
        marginTop: 40,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: "#5a5450",
          margin: 0,
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        {ALBUMS.length} records · KEF LS50 Meta · Denon PMA-600NE · Audio-Technica AT-LP120XBT · REL T/5x
      </p>
    </footer>
  );
}
