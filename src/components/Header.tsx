"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/rig", label: "The Rig" },
  { href: "/collection", label: "The Collection" },
  { href: "/synth", label: "The Synth" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(26, 22, 18, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #3a3632",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <Link href="/rig" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22, color: "#c4973c" }}>◎</span>
          <span
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#e8e0d4",
              letterSpacing: -0.5,
            }}
          >
            Vinyl Room
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  background: active ? "#2a2420" : "transparent",
                  color: active ? "#c4973c" : "#8a7e72",
                  border: active ? "1px solid #3a3632" : "1px solid transparent",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: active ? 600 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
