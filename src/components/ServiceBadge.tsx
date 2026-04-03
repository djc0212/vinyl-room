interface ServiceBadgeProps {
  service: string;
}

export function ServiceBadge({ service }: ServiceBadgeProps) {
  if (service === "spotify") {
    return (
      <span
        style={{
          background: "#1DB954",
          color: "#fff",
          fontSize: 10,
          padding: "2px 8px",
          borderRadius: 20,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        SPOTIFY
      </span>
    );
  }
  if (service === "apple") {
    return (
      <span
        style={{
          background: "#fc3c44",
          color: "#fff",
          fontSize: 10,
          padding: "2px 8px",
          borderRadius: 20,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        APPLE MUSIC
      </span>
    );
  }
  return (
    <span
      style={{
        background: "#6b4226",
        color: "#e8e0d4",
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 20,
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      PHYSICAL ONLY
    </span>
  );
}
