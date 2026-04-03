"use client";

import { useState } from "react";
import { ALBUMS, type Album } from "@/data/albums";
import { AlbumCard } from "./AlbumCard";
import { AlbumModal } from "./AlbumModal";

const DECADES = ["All", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

function getDecade(year: number): string {
  return `${Math.floor(year / 10) * 10}s`;
}

export function CollectionView() {
  const [decade, setDecade] = useState("All");
  const [sort, setSort] = useState("artist");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Album | null>(null);

  const filtered = ALBUMS.filter(
    (a) => decade === "All" || getDecade(a.year) === decade
  )
    .filter((a) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        a.artist.toLowerCase().includes(s) || a.album.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      if (sort === "artist")
        return a.artist
          .replace(/^The /, "")
          .localeCompare(b.artist.replace(/^The /, ""));
      if (sort === "year") return a.year - b.year;
      if (sort === "year-desc") return b.year - a.year;
      if (sort === "album") return a.album.localeCompare(b.album);
      return 0;
    });

  const decadeCounts: Record<string, number> = {};
  ALBUMS.forEach((a) => {
    const d = getDecade(a.year);
    decadeCounts[d] = (decadeCounts[d] || 0) + 1;
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 36,
            color: "#e8e0d4",
            margin: 0,
            fontWeight: 700,
          }}
        >
          The Collection
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16,
            color: "#8a7e72",
            marginTop: 8,
          }}
        >
          {ALBUMS.length} records on the shelf
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search artists or albums..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "#2a2420",
            border: "1px solid #3a3632",
            borderRadius: 8,
            padding: "10px 16px",
            color: "#e8e0d4",
            fontSize: 14,
            outline: "none",
            fontFamily: "var(--font-dm-sans), sans-serif",
            width: 240,
          }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            background: "#2a2420",
            border: "1px solid #3a3632",
            borderRadius: 8,
            padding: "10px 12px",
            color: "#e8e0d4",
            fontSize: 13,
            outline: "none",
            fontFamily: "var(--font-dm-sans), sans-serif",
            cursor: "pointer",
          }}
        >
          <option value="artist">Sort: Artist A–Z</option>
          <option value="album">Sort: Album A–Z</option>
          <option value="year">Sort: Oldest First</option>
          <option value="year-desc">Sort: Newest First</option>
        </select>
      </div>

      {/* Decade Filter */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 32,
          justifyContent: "center",
        }}
      >
        {DECADES.map((d) => (
          <button
            key={d}
            onClick={() => setDecade(d)}
            style={{
              background: decade === d ? "#c4973c" : "#2a2420",
              color: decade === d ? "#1a1612" : "#8a7e72",
              border:
                decade === d
                  ? "1px solid #c4973c"
                  : "1px solid #3a3632",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: decade === d ? 700 : 500,
              transition: "all 0.2s ease",
            }}
          >
            {d === "All"
              ? `All (${ALBUMS.length})`
              : `${d} (${decadeCounts[d] || 0})`}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div
        style={{
          fontSize: 13,
          color: "#8a7e72",
          marginBottom: 16,
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        Showing {filtered.length} album{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Album Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((a) => (
          <AlbumCard
            key={`${a.artist}-${a.album}`}
            data={a}
            onClick={setSelected}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#8a7e72",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          No albums match your search. Try a different term or decade.
        </div>
      )}

      <AlbumModal data={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
