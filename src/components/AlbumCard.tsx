"use client";

import { useState } from "react";
import type { Album } from "@/data/albums";
import { AlbumArt } from "./AlbumArt";
import { ServiceBadge } from "./ServiceBadge";

interface AlbumCardProps {
  data: Album;
  onClick: (album: Album) => void;
}

export function AlbumCard({ data, onClick }: AlbumCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(data)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: hovered ? "#2a2420" : "#221e1a",
        borderRadius: 10,
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.4)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        border: "1px solid #3a3632",
      }}
    >
      <AlbumArt
        link={data.link}
        service={data.service}
        artist={data.artist}
        album={data.album}
      />
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            fontSize: 11,
            color: "#c4973c",
            fontWeight: 600,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 4,
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          {data.artist}
        </div>
        <div
          style={{
            fontSize: 15,
            color: "#e8e0d4",
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: 8,
            fontFamily: "var(--font-playfair), serif",
          }}
        >
          {data.album}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: "#8a7e72" }}>
            {data.year}
            {data.length ? ` · ${data.length}` : ""}
          </span>
          <ServiceBadge service={data.service} />
        </div>
      </div>
    </div>
  );
}
