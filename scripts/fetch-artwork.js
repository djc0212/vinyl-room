const fs = require("fs");
const path = require("path");

const ALBUMS = [
  { artist: "Air", album: "Moon Safari", link: "https://open.spotify.com/album/206GTDefY2qRMQxYXmfb0a", service: "spotify" },
  { artist: "Arcade Fire", album: "Reflektor", link: "https://open.spotify.com/album/2brwuyGZ2lLqWnBX6U4MQT", service: "spotify" },
  { artist: "The Band", album: "Music from Big Pink", link: "https://open.spotify.com/album/0ky5kdvfPxSmSpj03hpSAE", service: "spotify" },
  { artist: "Jon Batiste", album: "Big Money", link: "https://open.spotify.com/album/7qYbLlvM7qPAz4XAWnXDC3", service: "spotify" },
  { artist: "The Beach Boys", album: "Pet Sounds", link: "https://open.spotify.com/album/2CNEkSE8TADXRT2AzcEt1b", service: "spotify" },
  { artist: "Beach House", album: "Teen Dream", link: "https://open.spotify.com/album/51AxfjN2gEt5qeJqPY5w0e", service: "spotify" },
  { artist: "The Beatles", album: "Abbey Road", link: "https://open.spotify.com/album/0ETFjACtuP2ADo6LFhL6HN", service: "spotify" },
  { artist: "Beck", album: "Morning Phase", link: "https://open.spotify.com/album/2Qx7dgA5VjX8JDQaXVxzHu", service: "spotify" },
  { artist: "Billy Strings", album: "Highway Prayers", link: "https://open.spotify.com/album/6ARzD9YEt9vx2rz7X3NDlo", service: "spotify" },
  { artist: "Bon Iver", album: "Sable, Fable", link: "https://open.spotify.com/album/3L3UjpXtom6T0Plt1j6l1T", service: "spotify" },
  { artist: "David Bowie", album: "Hunky Dory", link: "https://open.spotify.com/album/6fQElzBNTiEMGdIeY0hy5l", service: "spotify" },
  { artist: "Leon Bridges", album: "Leon", link: "https://open.spotify.com/album/6mHNMtHrXIdUWWuZD9njsG", service: "spotify" },
  { artist: "Phil Cook", album: "All These Years", link: "https://open.spotify.com/album/07mX9PM93vinRC50I2jNSb", service: "spotify" },
  { artist: "Phil Cook", album: "Appalachia Borealis", link: "https://open.spotify.com/album/3cAjAnLW6B0D7jqSctRzft", service: "spotify" },
  { artist: "Daft Punk", album: "Discovery", link: "https://open.spotify.com/album/2noRn2Aes5aoNVsU6iWThc", service: "spotify" },
  { artist: "Daft Punk", album: "Human After All", link: "https://open.spotify.com/album/1A2GTWGtFfWp7KSQTwWOyo", service: "spotify" },
  { artist: "Daft Punk", album: "Random Access Memories", link: "https://open.spotify.com/album/4m2880jivSbbyEGAKfITCa", service: "spotify" },
  { artist: "Mac DeMarco", album: "Guitar", link: "https://open.spotify.com/album/2T7O7QJnesN3l3iPX1NAZY", service: "spotify" },
  { artist: "Dijon", album: "Baby", link: "https://open.spotify.com/album/4hJngABBSMHCRiRNmJBseN", service: "spotify" },
  { artist: "Bob Dylan", album: "Blood on the Tracks", link: "https://open.spotify.com/album/6EJqL8cjMhuxfELCJKvliC", service: "spotify" },
  { artist: "Fleet Foxes", album: "A Very Lonely Solstice", link: "https://open.spotify.com/album/14OWlEMSCSk1wjJOMqTE1C", service: "spotify" },
  { artist: "Fleet Foxes", album: "Fleet Foxes", link: "https://open.spotify.com/album/5GRnydamKvIeG46dycID6v", service: "spotify" },
  { artist: "Neal Francis", album: "Return to Zero", link: "https://open.spotify.com/album/6pxtMGjYCnwXLMhdT2wNmC", service: "spotify" },
  { artist: "Fruit Bats", album: "Baby Man", link: "https://open.spotify.com/album/2kGBfxZidSaTd4W9g7wth9", service: "spotify" },
  { artist: "Geese", album: "Projector", link: "https://open.spotify.com/album/4QKo1QYCHqp5mCHLmONR08", service: "spotify" },
  { artist: "Geese", album: "3D Country", link: "https://open.spotify.com/album/2QLHKLI7AfZJKFbmqpHvPG", service: "spotify" },
  { artist: "Geese", album: "Getting Killed", link: "https://open.spotify.com/album/5xJFDHTVnKRGeWBuPER3dA", service: "spotify" },
  { artist: "Geese", album: "Live at Third Man Records", link: null, service: "physical" },
  { artist: "Gorillaz", album: "Demon Days", link: "https://open.spotify.com/album/0bUTHlWbkSQysoM3VsWldT", service: "spotify" },
  { artist: "Gorillaz", album: "The Mountain", link: "https://open.spotify.com/album/1RvJmGd47lKS4XMXs9j8hD", service: "spotify" },
  { artist: "Guerilla Toss", album: "You're Weird Now", link: "https://open.spotify.com/album/2bWX90TcII0BEC1Mw3EvkB", service: "spotify" },
  { artist: "HAIM", album: "I Quit", link: "https://open.spotify.com/album/38bPOXWjPgVPwRJEEC76Em", service: "spotify" },
  { artist: "Iron and Wine", album: "Light Verse", link: "https://open.spotify.com/album/7DwFKCMuLcWb9FdAanIcnL", service: "spotify" },
  { artist: "Johnny Blue Skies", album: "Mutiny After Midnight", link: null, service: "physical" },
  { artist: "Justice", album: "Hyperdrama", link: "https://open.spotify.com/album/7JHdSMpqXHLMGwKPUHmJMg", service: "spotify" },
  { artist: "King Gizzard & the Lizard Wizard", album: "Polygondwanaland", link: "https://music.apple.com/us/album/polygondwanaland/1519057404", service: "apple" },
  { artist: "King Gizzard & the Lizard Wizard", album: "Butterfly 3000", link: "https://music.apple.com/us/album/butterfly-3000/1569279719", service: "apple" },
  { artist: "King Gizzard & the Lizard Wizard", album: "Phantom Island", link: "https://music.apple.com/us/album/phantom-island/1796292217", service: "apple" },
  { artist: "Kraftwerk", album: "Trans Europa Express", link: "https://open.spotify.com/album/0Naxgmbna3HjVIKp1tMSXj", service: "spotify" },
  { artist: "Ray LaMontagne", album: "God Willin' & The Creek Don't Rise", link: "https://open.spotify.com/album/7IKmHiJFPbeOriyjWaMjyD", service: "spotify" },
  { artist: "Led Zeppelin", album: "Led Zeppelin II", link: "https://open.spotify.com/album/70lQYZtypdCALtFVlQAcvx", service: "spotify" },
  { artist: "MJ Lenderman", album: "Manning Fireworks", link: "https://open.spotify.com/album/64MJMVKQiZuJTjYhOExHiJ", service: "spotify" },
  { artist: "John Lennon & Yoko Ono", album: "Double Fantasy", link: "https://open.spotify.com/album/6r6ycbkMCAgeRaDaQy2MhS", service: "spotify" },
  { artist: "John Lennon", album: "Imagine", link: "https://open.spotify.com/album/0xzaemKucrJpYhyl7TltAk", service: "spotify" },
  { artist: "John Lennon", album: "Plastic Ono Band", link: "https://open.spotify.com/album/3Q7wjMiFJARkmcENUJAgSS", service: "spotify" },
  { artist: "Dua Lipa", album: "Radical Optimism", link: "https://open.spotify.com/album/1WMVvswNzB9i2UMh7LR3PH", service: "spotify" },
  { artist: "Cass McCombs", album: "Interior Live Oak", link: "https://open.spotify.com/album/3fjJLpBKvMGN4GPedKcb80", service: "spotify" },
  { artist: "Mdou Moctar", album: "Afrique Victime", link: "https://open.spotify.com/album/589mFwMnMOOx3grgKMRMgO", service: "spotify" },
  { artist: "Mk.gee", album: "Two Star & the Dream Police", link: "https://open.spotify.com/album/7M842M2Mn5RvEFY3JkA3kq", service: "spotify" },
  { artist: "My Morning Jacket", album: "The Waterfall", link: "https://open.spotify.com/album/0yN0LhPjapVaLZWHkmrzKr", service: "spotify" },
  { artist: "Parcels", album: "Loved", link: "https://open.spotify.com/album/6P1FncAjBWwSwpqLVwIvIT", service: "spotify" },
  { artist: "Phish", album: "Joy", link: "https://open.spotify.com/album/0z8hHMVP6JVFo7dwAaVE4m", service: "spotify" },
  { artist: "Phish", album: "New Year's Eve 1993 Live at Worcester Centrum", link: "https://open.spotify.com/album/4Dab1U3rfk19nz4002LmFR", service: "spotify" },
  { artist: "Pink Floyd", album: "The Dark Side of the Moon", link: "https://open.spotify.com/album/2WT1pbYjLJciAR26yMebkH", service: "spotify" },
  { artist: "Pink Floyd", album: "Wish You Were Here", link: "https://open.spotify.com/album/0bCAjiUamIFqKJsekOYuRw", service: "spotify" },
  { artist: "Radiohead", album: "OK Computer", link: "https://open.spotify.com/album/6dVIqQ8qmQ5GBnJ9shOYGE", service: "spotify" },
  { artist: "Radiohead", album: "In Rainbows", link: "https://open.spotify.com/album/5vkqYmiPBYLaalcmjujWxK", service: "spotify" },
  { artist: "Rage Against the Machine", album: "Rage Against the Machine", link: "https://open.spotify.com/album/4LaRYkzbNYnTbPYRaiCYkP", service: "spotify" },
  { artist: "Red Hot Chili Peppers", album: "Blood Sugar Sex Magik", link: "https://open.spotify.com/album/30Perjew8HyGkdSmqguYyg", service: "spotify" },
  { artist: "Smashing Pumpkins", album: "Gish", link: "https://open.spotify.com/album/1M4V4JbNab2VoSBaULU3WL", service: "spotify" },
  { artist: "The Smile", album: "Cutouts", link: "https://open.spotify.com/album/45bBsEOgBRRIektMY2rxrz", service: "spotify" },
  { artist: "Taylor Swift", album: "Midnights", link: "https://open.spotify.com/album/151w1FgRZfnKZA9FEcg9Z3", service: "spotify" },
  { artist: "Talking Heads", album: "Remain in Light", link: "https://open.spotify.com/album/4FR8Z2SuIBGOcJR9RjJFUi", service: "spotify" },
  { artist: "Tame Impala", album: "Currents", link: "https://open.spotify.com/album/79dL7FLiJFOO0EoehUHQBv", service: "spotify" },
  { artist: "Tame Impala", album: "Deadbeat", link: "https://open.spotify.com/album/3YK9gFSQBOX5NJUhPIzWF8", service: "spotify" },
  { artist: "Wednesday", album: "Bleeds", link: "https://open.spotify.com/album/5FoZJQwPo0zGi0AUbqIRbj", service: "spotify" },
  { artist: "Jesse Welles", album: "Middle", link: "https://open.spotify.com/album/0dxzw5leVIuZpacYG3k6Xx", service: "spotify" },
  { artist: "The Velvet Underground", album: "The Velvet Underground & Nico", link: "https://open.spotify.com/album/4xwx0x7k6c5VuThz5qVqmV", service: "spotify" },
  { artist: "Wand", album: "Laughing Matter", link: "https://open.spotify.com/album/3VwJE3VbHDVGr8bEchRVqo", service: "spotify" },
  { artist: "White Denim", album: "D", link: "https://open.spotify.com/album/6HbDvF5B4fsSb3bIgMhRrN", service: "spotify" },
  { artist: "Wilco", album: "Sky Blue Sky", link: "https://open.spotify.com/album/6YnGxGk9v6LDYoeoMPPDq3", service: "spotify" },
  { artist: "Cameron Winter", album: "Heavy Metal", link: "https://open.spotify.com/album/4DIsYjr8LU6hy9rp5JlJlG", service: "spotify" },
  { artist: "Stevie Wonder", album: "Talking Book", link: "https://open.spotify.com/album/1mFbd0xKPmkXMaRlyelIZv", service: "spotify" },
  { artist: "Various Artists (Warchild)", album: "Help(2)", link: "https://open.spotify.com/album/2VVKd2wqHEkoREf8T5LFca", service: "spotify" },
];

const DELAY_MS = 500;
const OUTPUT_PATH = path.join(__dirname, "..", "public", "album-art-cache.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Spotify oEmbed ---
async function fetchSpotifyArt(url) {
  const res = await fetch(
    `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.thumbnail_url || null;
}

// --- Apple Music lookup by ID from URL ---
async function fetchAppleArt(url) {
  const match = url.match(/album\/[^/]+\/(\d+)/);
  if (!match) return null;
  const res = await fetch(
    `https://itunes.apple.com/lookup?id=${match[1]}&entity=album`
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.results?.[0]?.artworkUrl100) {
    return data.results[0].artworkUrl100.replace("100x100", "600x600");
  }
  return null;
}

// --- Deezer fallback (open API, no auth, works for nearly everything) ---
async function fetchDeezerArt(artist, album) {
  const term = `${artist} ${album}`;
  const res = await fetch(
    `https://api.deezer.com/search/album?q=${encodeURIComponent(term)}&limit=5`
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.data?.length) return null;

  // Try to match artist name
  const artistLower = artist.toLowerCase().replace(/^the /, "");
  for (const r of data.data) {
    const rArtist = (r.artist?.name || "").toLowerCase().replace(/^the /, "");
    if (rArtist.includes(artistLower) || artistLower.includes(rArtist)) {
      return r.cover_xl || null;
    }
  }

  return null;
}

async function main() {
  // Load existing cache if present (allows incremental runs)
  let cache = {};
  try {
    if (fs.existsSync(OUTPUT_PATH)) {
      cache = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
      console.log(`Loaded existing cache with ${Object.keys(cache).length} entries\n`);
    }
  } catch {
    // Start fresh
  }

  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const album of ALBUMS) {
    const key = `${album.artist} - ${album.album}`;

    // Skip if already cached
    if (cache[key]) {
      skipped++;
      continue;
    }

    // Skip albums with no link
    if (!album.link) {
      console.log(`  SKIP (no link): ${key}`);
      skipped++;
      continue;
    }

    let artUrl = null;

    try {
      // Step 1: Try the native API (Spotify oEmbed or Apple lookup)
      if (album.service === "spotify") {
        artUrl = await fetchSpotifyArt(album.link);
      } else if (album.service === "apple") {
        artUrl = await fetchAppleArt(album.link);
      }

      // Step 2: If that failed, fall back to Deezer
      if (!artUrl) {
        await sleep(DELAY_MS);
        artUrl = await fetchDeezerArt(album.artist, album.album);
        if (artUrl) {
          console.log(`  OK (Deezer fallback): ${key}`);
        }
      } else {
        console.log(`  OK: ${key}`);
      }
    } catch (err) {
      console.log(`  ERROR: ${key} — ${err.message}`);
    }

    if (artUrl) {
      cache[key] = artUrl;
      fetched++;
    } else {
      failed++;
      console.log(`  FAIL: ${key}`);
    }

    await sleep(DELAY_MS);
  }

  // Ensure public/ exists
  const publicDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cache, null, 2));

  console.log(`\nDone!`);
  console.log(`  Fetched: ${fetched}`);
  console.log(`  Skipped (cached/no link): ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total in cache: ${Object.keys(cache).length}`);
  console.log(`  Written to: ${OUTPUT_PATH}`);
}

main();
