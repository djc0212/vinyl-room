"use client";

import type { Album } from "@/data/albums";
import { AlbumArt } from "./AlbumArt";
import { ServiceBadge } from "./ServiceBadge";

interface AlbumModalProps {
  data: Album | null;
  onClose: () => void;
}

export function AlbumModal({ data, onClose }: AlbumModalProps) {
  if (!data) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1e1a16",
          borderRadius: 16,
          maxWidth: 500,
          width: "100%",
          overflow: "hidden",
          border: "1px solid #3a3632",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: 20,
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: 140, minWidth: 140 }}>
            <AlbumArt
              link={data.link}
              service={data.service}
              artist={data.artist}
              album={data.album}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                color: "#c4973c",
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 4,
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              {data.artist}
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#e8e0d4",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 8,
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              {data.album}
            </div>
            <div style={{ fontSize: 13, color: "#8a7e72", marginBottom: 12 }}>
              {data.year}
              {data.length ? ` · ${data.length}` : ""}
            </div>
            <ServiceBadge service={data.service} />
          </div>
        </div>
        <div style={{ padding: "0 20px 20px" }}>
          <p
            style={{
              fontSize: 15,
              color: "#b8b0a4",
              lineHeight: 1.7,
              margin: 0,
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          >
            {data.bio}
          </p>
          {data.link && (
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 16,
                padding: "10px 20px",
                borderRadius: 25,
                background: data.service === "spotify" ? "#1DB954" : "#fc3c44",
                color: "#fff",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-dm-sans), sans-serif",
                transition: "opacity 0.2s",
              }}
            >
              {data.service === "spotify"
                ? "Play on Spotify"
                : "Play on Apple Music"}{" "}
              ↗
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: "#8a7e72",
            fontSize: 24,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
