"use client";

import { useState, useEffect, useRef } from "react";

interface AlbumArtProps {
  link: string | null;
  service: string;
  artist: string;
  album: string;
}

// Loaded once, shared across all AlbumArt instances
let artCache: Record<string, string> | null = null;
let cachePromise: Promise<Record<string, string>> | null = null;

function loadCache(): Promise<Record<string, string>> {
  if (artCache) return Promise.resolve(artCache);
  if (cachePromise) return cachePromise;
  cachePromise = fetch("/album-art-cache.json")
    .then((r) => r.json())
    .then((data) => {
      artCache = data;
      return data;
    })
    .catch(() => {
      artCache = {};
      return {};
    });
  return cachePromise;
}

export function AlbumArt({ link, service, artist, album }: AlbumArtProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const attempted = useRef(false);

  const cacheKey = `${artist} - ${album}`;

  useEffect(() => {
    if (attempted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !attempted.current) {
          attempted.current = true;
          loadCache().then((cache) => {
            if (cache[cacheKey]) {
              setImgUrl(cache[cacheKey]);
            }
          });
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [cacheKey]);

  const initials = artist
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showPlaceholder = !imgUrl || !imgLoaded;

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        aspectRatio: "1",
        borderRadius: 6,
        overflow: "hidden",
        background: "linear-gradient(135deg, #2a2420 0%, #1a1612 100%)",
        position: "relative",
      }}
    >
      {showPlaceholder && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 4,
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#c4973c44",
              fontFamily: "var(--font-playfair), serif",
            }}
          >
            {initials}
          </span>
          {service === "physical" && (
            <span
              style={{
                fontSize: 10,
                color: "#8a7e72",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Vinyl Only
            </span>
          )}
        </div>
      )}

      {imgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={`${album} by ${artist}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "relative",
            zIndex: 2,
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgUrl(null)}
        />
      )}
    </div>
  );
}
