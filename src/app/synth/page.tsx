"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const GOLD = "#F5A623";
const GOLD_D = "#D4880A";

// ═══════════════════════════════════════════════
// DEFAULT PATCH STATE
// ═══════════════════════════════════════════════
const mkPatch = (overrides: Record<string, unknown> = {}) => ({
  name: "Init", description: "", artist: "", album: "", tips: "",
  tune: 0, glide: 0, glideOn: false, oscMod: false, modMix: 5,
  srcOsc3: true, srcNoise: false, osc3Ctrl: true, decayOn: true,
  osc1Range: 3, osc1Wf: 4, osc1Freq: 0,
  osc2Range: 3, osc2Wf: 4, osc2Freq: 0, osc2Sync: false,
  osc3Range: 3, osc3Wf: 4, osc3Freq: 0,
  v1: 7, s1: true, v2: 0, s2: false, v3: 0, s3: false,
  ext: 0, sExt: false, nse: 0, sNse: false, nWht: true,
  cut: 5, emp: 0, ctr: 0, fMod: false, kb1: false, kb2: false,
  fA: 1, fD: 4, fS: 10,
  lA: 1, lD: 4, lS: 10,
  vol: 5, main: true, a440: false,
  nO1: "", nO2: "", nO3: "", nCut: "", nEmp: "", nCtr: "",
  ...overrides,
});

type Patch = ReturnType<typeof mkPatch>;

const RANGES = ["LO", "32'", "16'", "8'", "4'", "2'"];
const WF_SYM = ["\u25B3", "\u25BF", "\u25C1", "//", "\u25A1", "\u25AF"];
const WF_NAM = ["Triangle", "Shark", "RevSaw", "Sawtooth", "Square", "Wide Pls"];

// ═══════════════════════════════════════════════
// PRESETS
// ═══════════════════════════════════════════════
const PRESETS: Patch[] = [
  mkPatch({ name: "Tom Sawyer", artist: "Rush", album: "Moving Pictures, 1981",
    description: "Geddy Lee's oscillator-sync lead. Synced Osc 2 creates searing harmonically complex scream.",
    tips: "Legato C4-C6. Pitch wheel bends. Filter envelope spit at attack is critical.",
    tune: 0, glide: 0.5, glideOn: true, oscMod: true, modMix: 3, srcOsc3: true, osc3Ctrl: false, decayOn: true,
    osc1Range: 3, osc1Wf: 4, osc1Freq: 0, osc2Range: 3, osc2Wf: 5, osc2Freq: 0, osc2Sync: true,
    osc3Range: 0, osc3Wf: 1, osc3Freq: 0.3,
    v1: 8, s1: true, v2: 7, s2: true, v3: 0, s3: false,
    cut: 1.5, emp: 4, ctr: 6, fA: 1, fD: 4, fS: 5, kb1: true,
    lA: 1, lD: 4, lS: 7, vol: 7,
    nO1: "8' Sawtooth — rich harmonic foundation for sync",
    nO2: "8' Square SYNC ON — metallic harmonics",
    nO3: "LO Triangle 5.5Hz vibrato LFO. Kbd OFF",
    nCut: "3.5kHz — lets sync harmonics through", nEmp: "Moderate nasal honk", nCtr: "Significant sweep per note" }),
  mkPatch({ name: "Shine On You Crazy Diamond", artist: "Pink Floyd", album: "Wish You Were Here, 1975",
    description: "Haunting ethereal lead. Detuned sawtooths with shimmering chorus and gentle vibrato.",
    tips: "Slow deliberate notes C3-C5. Portamento glides essential.",
    glide: 3.5, glideOn: true, oscMod: true, modMix: 3, osc3Ctrl: false,
    osc1Range: 3, osc1Wf: 4, osc1Freq: 0, osc2Range: 3, osc2Wf: 4, osc2Freq: 0.2,
    osc3Range: 0, osc3Wf: 1, osc3Freq: 0.2,
    v1: 8, s1: true, v2: 7, s2: true,
    cut: 0.5, emp: 2.5, ctr: 3.5, kb1: true, kb2: true, fA: 1, fD: 4, fS: 7,
    lA: 2, lD: 4, lS: 8, vol: 6.5,
    nO1: "8' Sawtooth — warm rich fundamental", nO2: "8' Sawtooth +7 cents — chorus shimmer",
    nO3: "LO Triangle 5Hz vibrato. Kbd OFF",
    nCut: "2kHz warm but present", nEmp: "Gentle vocal peak", nCtr: "Moderate bloom" }),
  mkPatch({ name: "Boogie On Reggae Woman", artist: "Stevie Wonder", album: "Fulfillingness' First Finale, 1974",
    description: "Funky rubbery Moog bass with vocal wah from filter envelope.",
    tips: "Bouncy staccato C2-C3. Short notes let filter decay breathe.",
    glide: 2.5, glideOn: true, osc3Ctrl: true,
    osc1Range: 2, osc1Wf: 4, osc2Range: 2, osc2Wf: 5, osc2Freq: 0.1,
    osc3Range: 1, osc3Wf: 4, osc3Freq: 0,
    v1: 8, s1: true, v2: 6, s2: true, v3: 4.5, s3: true,
    cut: -1.5, emp: 4, ctr: 6, kb1: true, fA: 1, fD: 4, fS: 2,
    lA: 1, lD: 4, lS: 3.5, vol: 7.5,
    nO1: "16' Sawtooth — thick primary bass", nO2: "16' Square +3 cents — warmth",
    nO3: "32' Sawtooth sub-octave. Kbd ON",
    nCut: "600Hz — low start", nEmp: "Moderate wah quality", nCtr: "High dramatic bloom" }),
  mkPatch({ name: "Living for the City", artist: "Stevie Wonder", album: "Innervisions, 1973",
    description: "Bright punchy Moog lead with tight filter envelope for percussive spit.",
    tips: "Precise rhythmic staccato C3-C4. Mechanical and driving.",
    glide: 0.5, glideOn: true, osc3Ctrl: true,
    osc1Range: 3, osc1Wf: 4, osc2Range: 3, osc2Wf: 5, osc2Freq: 0.15,
    osc3Range: 2, osc3Wf: 5,
    v1: 8, s1: true, v2: 6, s2: true, v3: 4, s3: true,
    cut: 0, emp: 3.5, ctr: 5.5, kb1: true, fA: 1, fD: 3, fS: 3.5,
    lA: 1, lD: 3, lS: 5.5, vol: 7,
    nO1: "8' Sawtooth — bright lead", nO2: "8' Square +5 cents — hollow width",
    nO3: "16' Square octave-down. Kbd ON",
    nCut: "1.5kHz", nEmp: "Mild-moderate", nCtr: "High percussive snap" }),
  mkPatch({ name: "La Femme d'Argent", artist: "Air", album: "Moon Safari, 1998",
    description: "Dreamy liquid lead. Long portamento, warm filter, slow LFO.",
    tips: "Slow spacious melodies C3-C5. Glide is essential.",
    glide: 5.5, glideOn: true, oscMod: true, modMix: 3.5, osc3Ctrl: false,
    osc1Range: 3, osc1Wf: 4, osc2Range: 3, osc2Wf: 4, osc2Freq: 0.25,
    osc3Range: 0, osc3Wf: 1, osc3Freq: -0.5,
    v1: 7.5, s1: true, v2: 7.5, s2: true, nse: 0.5, sNse: true, nWht: false,
    cut: 0, emp: 2, ctr: 3, fMod: true, kb1: true, fA: 2, fD: 4, fS: 7,
    lA: 2, lD: 4, lS: 8, vol: 6,
    nO1: "8' Sawtooth — golden warmth", nO2: "8' Sawtooth +8 cents — dreamy chorus",
    nO3: "LO Triangle 3Hz — slow breathing LFO",
    nCut: "1.5kHz warm", nEmp: "Low smooth", nCtr: "Moderate opening" }),
  mkPatch({ name: "Nuthin' but a 'G' Thang", artist: "Dr. Dre ft. Snoop Dogg", album: "The Chronic, 1992",
    description: "Iconic West Coast G-funk melody. Whiny nasal lead.",
    tips: "Legato C4-C5 behind the beat. Pitch bends for swagger.",
    glide: 1.5, glideOn: true, oscMod: true, modMix: 3, osc3Ctrl: false,
    osc1Range: 3, osc1Wf: 4, osc2Range: 3, osc2Wf: 4, osc2Freq: 0.12,
    osc3Range: 0, osc3Wf: 1, osc3Freq: 0.3,
    v1: 8, s1: true, v2: 5, s2: true,
    cut: 2, emp: 4.5, ctr: 3, kb1: true, kb2: true, fA: 1, fD: 3, fS: 6.5,
    lA: 1, lD: 3, lS: 7.5, vol: 7,
    nO1: "8' Sawtooth — bright whiny quality", nO2: "8' Sawtooth +4 cents width",
    nO3: "LO Triangle 5Hz vibrato",
    nCut: "5kHz bright", nEmp: "Moderate-high whiny G-funk", nCtr: "Light brightness" }),
  mkPatch({ name: "Lucky Man", artist: "Emerson, Lake & Palmer", album: "ELP, 1970",
    description: "Pioneering bright soaring solo. Singing voice through analog circuitry.",
    tips: "Maximum expression with wide pitch bends. Legato C3-C5.",
    glide: 2, glideOn: true, oscMod: true, modMix: 3.5, osc3Ctrl: false,
    osc1Range: 3, osc1Wf: 4, osc2Range: 3, osc2Wf: 4, osc2Freq: 0.2,
    osc3Range: 0, osc3Wf: 1, osc3Freq: 0.5,
    v1: 8, s1: true, v2: 7, s2: true,
    cut: 2.5, emp: 3, ctr: 3.5, kb1: true, kb2: true, fA: 1, fD: 3, fS: 7,
    lA: 1, lD: 3, lS: 8, vol: 7,
    nO1: "8' Sawtooth — bright open Moog voice", nO2: "8' Sawtooth +7 cents chorus",
    nO3: "LO Triangle 6Hz — faster vibrato urgency",
    nCut: "6kHz very bright", nEmp: "Mild vocal peak", nCtr: "Moderate bloom" }),
  mkPatch({ name: "Welcome to the Machine", artist: "Pink Floyd", album: "Wish You Were Here, 1975",
    description: "Massive menacing synth. Dark evolving industrial.",
    tips: "Slow lines, long glide. C2-C4 for menace. Wide pitch swoops.",
    glide: 5, glideOn: true, oscMod: true, modMix: 4, osc3Ctrl: false,
    osc1Range: 2, osc1Wf: 4, osc2Range: 2, osc2Wf: 4, osc2Freq: 0.35,
    osc3Range: 0, osc3Wf: 1, osc3Freq: -0.8,
    v1: 8, s1: true, v2: 8, s2: true, nse: 1, sNse: true,
    cut: -1.5, emp: 5.5, ctr: 5, fMod: true, kb1: true, fA: 2, fD: 4, fS: 4,
    lA: 2, lD: 4, lS: 7, vol: 7.5,
    nO1: "16' Sawtooth — dark menacing", nO2: "16' Sawtooth +12 cents unsettling",
    nO3: "LO Triangle 2.5Hz ominous sweep",
    nCut: "600Hz dark LFO sweep", nEmp: "Medium-high growl", nCtr: "Moderate evolving" }),
  mkPatch({ name: "The Less I Know the Better", artist: "Tame Impala", album: "Currents, 2015",
    description: "Rubbery bouncy bass with plucky elastic filter envelope.",
    tips: "Funky patterns C1-C3. Behind the beat. Occasional slides.",
    glide: 2, glideOn: true, osc3Ctrl: true,
    osc1Range: 2, osc1Wf: 4, osc2Range: 2, osc2Wf: 1, osc2Freq: 0.08,
    osc3Range: 1, osc3Wf: 1,
    v1: 7, s1: true, v2: 6, s2: true, v3: 5, s3: true,
    cut: -2, emp: 3.5, ctr: 5, kb1: true, fA: 1, fD: 3, fS: 3,
    lA: 1, lD: 4, lS: 5, vol: 7.5,
    nO1: "16' Sawtooth — warm round bass", nO2: "16' Triangle +2 cents smooth body",
    nO3: "32' Triangle sub-octave. Kbd ON",
    nCut: "450Hz warm", nEmp: "Mild-moderate boing", nCtr: "Moderate-high bounce" }),
];

// ═══════════════════════════════════════════════
// KNOWLEDGE BASE
// ═══════════════════════════════════════════════
const KB = [
  { keys:["filter","cutoff","emphasis","resonance","sweep","envelope","contour","frequency","ladder"],
    a:`**Minimoog Ladder Filter (24dB/octave Low-Pass)**\n\nThe Moog ladder filter is the soul of the Minimoog.\n\n**Cutoff Frequency** (0-10): Where the filter begins cutting. Lower = darker, higher = brighter.\n\n**Emphasis** (0-10): Boosts frequencies at cutoff. 0-3 subtle, 4-6 vocal/nasal, 7-9 aggressive, 10 self-oscillation.\n\n**Amount of Contour** (0-10): How much the filter envelope sweeps cutoff per note. Essential for bass "bow-wow" and lead "spit."\n\n**Pro tip:** Low cutoff + high contour + moderate emphasis = classic Moog bass. High cutoff + low contour + high emphasis = screaming acid lead.` },
  { keys:["oscillator","osc","waveform","sawtooth","square","triangle","range","detune","sync"],
    a:`**Minimoog Oscillators**\n\nThree oscillators each with Range and Waveform:\n\n**Range:** LO, 32', 16', 8', 4', 2'. LO = sub-audio LFO. 8' = standard pitch.\n\n**Waveforms:** Triangle (pure), Sawtooth (rich, classic Moog), Square (hollow), Wide Pulse (nasal).\n\n**Detuning** Osc 2 against Osc 1: +2-5 cents = warmth, +5-10 = shimmer, +10-15 = dramatic beating.\n\n**Oscillator Sync**: Forces Osc 2 to restart at Osc 1's rate. Creates metallic, screaming harmonics.\n\n**Osc 3 dual role**: Normal oscillator (Kbd ON) or LFO (Kbd OFF, Range LO).` },
  { keys:["bass","sub","low","bottom","deep","thump","funk"],
    a:`**Programming Moog Bass**\n\n**Oscillators:** Osc 1: 16' Saw, Osc 2: 16' Square +3-5 cents, Osc 3: 32' Triangle sub-octave (Kbd ON)\n\n**Filter:** Cutoff 2-4, Emphasis 3-5, Contour 5-7, Atk 0, Dec 3-5, Sus 1-3\n\n**Variants:** Funky rubber (high contour, short sustain), Deep sub (low cutoff, triangles), Acid (very low cutoff, HIGH emphasis)` },
  { keys:["lead","solo","melody","singing","soaring","bright"],
    a:`**Programming Moog Leads**\n\n**Setup:** Osc 1: 8' Saw, Osc 2: 8' Saw detuned +5-10 cents, Osc 3: LO Triangle for vibrato\n\n**Filter:** Cutoff 5-8, Emphasis 2-4, Contour 2-4\n\n**Loudness:** Atk 0-1, Dec 4-5, Sus 7-9\n\n**Glide:** 1-4 for expressiveness. Osc Mod ON for vibrato.` },
  { keys:["pad","ambient","drone","evolving","space","cosmic"],
    a:`**Pads & Drones**\n\n**Setup:** Osc 1+2: 8' Saw, detuned +8-15 cents. Osc 3: LO Triangle slow LFO for filter sweep.\n\n**Filter:** Cutoff 4-5, Emphasis 1-3, Filter Mod ON. Slow attack.\n\n**Add:** Pink noise at 0.5-1.5 for breathiness. Long glide (4-7).` },
  { keys:["modulation","lfo","vibrato","tremolo","mod"],
    a:`**Modulation**\n\nOsc 3 as LFO: Range LO, Kbd OFF, Triangle for smooth.\n\n**Osc Mod ON**: Pitch vibrato. **Filter Mod ON**: Cutoff modulation.\n\n**Rates:** 1-2Hz slow evolving, 3-4Hz dreamy, 5-6Hz standard vibrato, 7-8Hz fast intense.` },
  { keys:["glide","portamento","slide","legato"],
    a:`**Glide (Portamento)**\n\n0 = instant, 1-2 = subtle legato, 3-4 = classic Moog, 5-7 = dramatic swooping, 8-10 = sci-fi.` },
  { keys:["envelope","attack","decay","sustain","contour"],
    a:`**Envelopes**\n\n**Filter Envelope** shapes brightness. **Loudness Contour** shapes volume.\n\n**Recipes:** Plucky bass: A0 D4 S2. Sustained lead: A0 D4 S8. Pad swell: A4-6 S8-10. Percussive stab: A0 D2 S0.` },
];

function searchKB(query: string) {
  const q = query.toLowerCase();
  const scored = KB.map(e => {
    let score = 0;
    for (const k of e.keys) { if (q.includes(k)) score += 2; k.split(" ").forEach(w => { if (w.length > 2 && q.includes(w)) score++; }); }
    return { ...e, score };
  }).filter(e => e.score > 0).sort((a, b) => b.score - a.score);
  return scored[0] || null;
}

// ═══════════════════════════════════════════════
// INTERACTIVE KNOB (drag to change)
// ═══════════════════════════════════════════════
function DragKnob({ value = 5, onChange, size = 52, label, min = 0, max = 10, ticks = 11, detents, showVal }: {
  value?: number; onChange?: (v: number) => void; size?: number; label?: string;
  min?: number; max?: number; ticks?: number; detents?: string[]; showVal?: boolean;
}) {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!onChange) return;
    e.preventDefault(); e.stopPropagation();
    const startY = e.clientY, startVal = value;
    const range = detents ? detents.length - 1 : max - min;
    const onMove = (ev: PointerEvent) => {
      const dy = startY - ev.clientY;
      let nv = startVal + (dy / 100) * range;
      if (detents) nv = Math.round(Math.max(0, Math.min(detents.length - 1, nv)));
      else nv = Math.round(Math.max(min, Math.min(max, nv)) * 10) / 10;
      onChange(nv);
    };
    const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const pct = detents ? value / (detents.length - 1) : (value - min) / (max - min);
  const ang = -135 + pct * 270, r = size / 2;
  const pa = (ang - 90) * Math.PI / 180;
  const uid = useRef("k" + Math.random().toString(36).slice(2, 7)).current;

  const tickArr: React.ReactNode[] = [];
  const numT = detents ? detents.length : ticks;
  for (let i = 0; i < numT; i++) {
    const tp = i / (numT - 1), ta = (-135 + tp * 270) * Math.PI / 180;
    tickArr.push(
      <g key={i}>
        <line x1={r + (r - 2) * Math.cos(ta - Math.PI / 2)} y1={r + (r - 2) * Math.sin(ta - Math.PI / 2)}
          x2={r + (r - 6) * Math.cos(ta - Math.PI / 2)} y2={r + (r - 6) * Math.sin(ta - Math.PI / 2)}
          stroke="#AAA" strokeWidth={i % (numT > 7 ? 5 : 1) === 0 ? 1.2 : 0.5} />
        {detents && <text x={r + (r + (numT > 6 ? 7 : 5)) * Math.cos(ta - Math.PI / 2)} y={r + (r + (numT > 6 ? 7 : 5)) * Math.sin(ta - Math.PI / 2)}
          fill={i === value ? "#FFF" : "#666"} fontSize={numT > 6 ? 3.8 : 5} textAnchor="middle" dominantBaseline="middle" fontWeight={i === value ? "bold" : "normal"}>{detents[i]}</text>}
        {!detents && (() => {
          const labelVal = Math.round((min + i * (max - min) / (numT - 1)) * 10) / 10;
          const step = numT <= 6 ? 1 : numT <= 11 ? 2 : 3;
          if (i % step !== 0) return null;
          return <text x={r + (r + 5) * Math.cos(ta - Math.PI / 2)} y={r + (r + 5) * Math.sin(ta - Math.PI / 2)}
            fill="#999" fontSize={4.5} textAnchor="middle" dominantBaseline="middle">{Number.isInteger(labelVal) ? labelVal : labelVal.toFixed(1)}</text>;
        })()}
      </g>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      {label && <div style={{ fontSize: 7, color: "#CCC", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", lineHeight: 1.1, fontWeight: 600, maxWidth: size + 24 }}>{label}</div>}
      <svg width={size + 14} height={size + 14} viewBox={`-7 -7 ${size + 14} ${size + 14}`}
        style={{ cursor: onChange ? "ns-resize" : "default", touchAction: "none" }} onPointerDown={handlePointerDown}>
        <defs>
          <radialGradient id={uid + "b"} cx="50%" cy="45%"><stop offset="0%" stopColor="#2a2a2a" /><stop offset="100%" stopColor="#050505" /></radialGradient>
          <radialGradient id={uid + "c"} cx="35%" cy="30%"><stop offset="0%" stopColor="#e0e0e0" /><stop offset="35%" stopColor="#c0c0c0" /><stop offset="70%" stopColor="#999" /><stop offset="100%" stopColor="#777" /></radialGradient>
        </defs>
        {tickArr}
        <circle cx={r} cy={r} r={r - 5} fill={`url(#${uid}b)`} stroke="#333" strokeWidth={0.6} />
        <circle cx={r} cy={r} r={r * 0.42} fill={`url(#${uid}c)`} />
        <line x1={r} y1={r} x2={r + (r * 0.38) * Math.cos(pa)} y2={r + (r * 0.38) * Math.sin(pa)} stroke="#222" strokeWidth={1.8} strokeLinecap="round" />
        <circle cx={r} cy={r} r={1.2} fill="#666" />
      </svg>
      {showVal && <div style={{ fontSize: 6.5, color: GOLD, fontWeight: 700, textAlign: "center" }}>{detents ? detents[value] : value.toFixed(1)}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ROTARY SELECTOR (Range / Waveform)
// ═══════════════════════════════════════════════
function RotSel({ value, opts, labels, size = 56, onChange }: {
  value: number; opts: string[]; labels?: string[]; size?: number; onChange?: (v: number) => void;
}) {
  const idx = Math.max(0, Math.min(Math.round(value), opts.length - 1));
  const pct = idx / (opts.length - 1), ang = -135 + pct * 270, r = size / 2, pa = (ang - 90) * Math.PI / 180;
  const uid = useRef("rs" + Math.random().toString(36).slice(2, 7)).current;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!onChange) return;
    e.preventDefault(); e.stopPropagation();
    const startY = e.clientY, startVal = idx;
    const onMove = (ev: PointerEvent) => {
      const dy = startY - ev.clientY;
      const nv = Math.round(Math.max(0, Math.min(opts.length - 1, startVal + dy / 40)));
      onChange(nv);
    };
    const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <svg width={size + 22} height={size + 22} viewBox={`-11 -11 ${size + 22} ${size + 22}`}
        style={{ cursor: onChange ? "ns-resize" : "default", touchAction: "none" }} onPointerDown={handlePointerDown}>
        <defs><radialGradient id={uid} cx="45%" cy="40%"><stop offset="0%" stopColor="#333" /><stop offset="60%" stopColor="#1a1a1a" /><stop offset="100%" stopColor="#0a0a0a" /></radialGradient></defs>
        {opts.map((o, i) => { const tp = i / (opts.length - 1), ta = (-135 + tp * 270) * Math.PI / 180, lR = r + 8;
          return (<g key={i}><line x1={r + (r - 3) * Math.cos(ta - Math.PI / 2)} y1={r + (r - 3) * Math.sin(ta - Math.PI / 2)} x2={r + (r - 7) * Math.cos(ta - Math.PI / 2)} y2={r + (r - 7) * Math.sin(ta - Math.PI / 2)} stroke={i === idx ? "#FFF" : "#666"} strokeWidth={1.2} />
            <text x={r + lR * Math.cos(ta - Math.PI / 2)} y={r + lR * Math.sin(ta - Math.PI / 2)} fill={i === idx ? "#FFF" : "#555"} fontSize={5.5} textAnchor="middle" dominantBaseline="middle" fontWeight={i === idx ? "bold" : "normal"}>{o}</text></g>); })}
        <circle cx={r} cy={r} r={r - 8} fill={`url(#${uid})`} stroke="#444" strokeWidth={0.8} />
        <line x1={r} y1={r} x2={r + (r - 10) * Math.cos(pa)} y2={r + (r - 10) * Math.sin(pa)} stroke="#EEE" strokeWidth={2} strokeLinecap="round" />
        <circle cx={r} cy={r} r={2} fill="#555" />
      </svg>
      {labels && <div style={{ fontSize: 5.5, color: GOLD, fontWeight: 700 }}>{labels[idx] || ""}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════
// SWITCHES
// ═══════════════════════════════════════════════
function OrangeSw({ on, onChange, label }: { on: boolean; onChange?: (v: boolean) => void; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      {label && <div style={{ fontSize: 6, color: on ? "#FF6B35" : "#777", textTransform: "uppercase", letterSpacing: 0.3, textAlign: "center", lineHeight: 1.05, fontWeight: 700, maxWidth: 48 }}>{label}</div>}
      <div onClick={() => onChange && onChange(!on)} style={{ width: 22, height: 13, borderRadius: 2.5, background: on ? "linear-gradient(180deg,#FF7040,#CC4400)" : "linear-gradient(180deg,#3a3a3a,#1a1a1a)", border: `1px solid ${on ? "#FF9060" : "#444"}`, cursor: onChange ? "pointer" : "default" }} />
      <div style={{ fontSize: 5, color: on ? "#FF6B35" : "#555", fontWeight: 600 }}>ON</div>
    </div>
  );
}

function BlueSw({ on, onChange, label }: { on: boolean; onChange?: (v: boolean) => void; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
      <div onClick={() => onChange && onChange(!on)} style={{ width: 10, height: 18, borderRadius: 2, background: "#151515", border: "1px solid #444", display: "flex", flexDirection: "column", justifyContent: on ? "flex-start" : "flex-end", padding: 1.5, cursor: onChange ? "pointer" : "default" }}>
        <div style={{ width: 7, height: 7, borderRadius: 1.5, background: on ? "linear-gradient(180deg,#7EC8E3,#4A99BB)" : "linear-gradient(180deg,#444,#2a2a2a)" }} />
      </div>
      {label && <div style={{ fontSize: 4.5, color: on ? "#7EC8E3" : "#444", fontWeight: 600 }}>{label}</div>}
    </div>
  );
}

function BlackSw({ pos, onChange, labelL, labelR }: { pos: string; onChange?: (v: string) => void; labelL: string; labelR: string }) {
  const isR = pos === "right";
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      <span style={{ fontSize: 4.5, color: !isR ? "#CCC" : "#555", fontWeight: !isR ? 700 : 400 }}>{labelL}</span>
      <div onClick={() => onChange && onChange(isR ? "left" : "right")} style={{ width: 18, height: 10, borderRadius: 2, background: "#111", border: "1px solid #444", display: "flex", alignItems: "center", padding: "0 2px", justifyContent: isR ? "flex-end" : "flex-start", cursor: onChange ? "pointer" : "default" }}>
        <div style={{ width: 7, height: 7, borderRadius: 1, background: "linear-gradient(180deg,#555,#333)" }} />
      </div>
      <span style={{ fontSize: 4.5, color: isR ? "#CCC" : "#555", fontWeight: isR ? 700 : 400 }}>{labelR}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PANEL
// ═══════════════════════════════════════════════
const AD_DETENTS = ["M-SEC.", "10", "200", "600", "1", "5", "10", "SEC."];

function Panel({ p, onChange }: { p: Patch; onChange?: (p: Patch) => void }) {
  const set = (k: string, v: unknown) => onChange && onChange({ ...p, [k]: v });
  return (
    <div style={{ background: "linear-gradient(180deg,#7B6040 0%,#5C4228 4%,#4A3420 7%)", padding: "4px 0 0", overflowX: "auto" }}>
      <div style={{ background: "linear-gradient(180deg,#2e2e2e 0%,#242424 40%,#1c1c1c 100%)", minWidth: 960, display: "flex", margin: "0 4px", borderTop: "2px solid #3e3e3e" }}>

        {/* CONTROLLERS */}
        <div style={{ flex: "0 0 130px", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, padding: "10px 6px 6px" }}>
            <DragKnob value={p.tune} onChange={v => set("tune", v)} label="Tune" size={42} min={-2} max={2} ticks={5} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 6 }}>
              <DragKnob value={p.glide} onChange={v => set("glide", v)} label="Glide" size={40} />
              <DragKnob value={p.modMix} onChange={v => set("modMix", v)} label="Modulation Mix" size={40} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 6 }}>
              <BlackSw pos={p.srcOsc3 ? "left" : "right"} onChange={pos => set("srcOsc3", pos === "left")} labelL="Osc.3" labelR="Flt EG" />
              <BlackSw pos={p.srcNoise ? "right" : "left"} onChange={pos => set("srcNoise", pos === "right")} labelL="Noise" labelR="LFO" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><div style={{ fontSize: 6, color: "#999", fontWeight: 600 }}>GLIDE</div><BlueSw on={p.glideOn} onChange={v => set("glideOn", v)} label="ON" /></div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><div style={{ fontSize: 6, color: "#999", fontWeight: 600 }}>DECAY</div><BlueSw on={p.decayOn} onChange={v => set("decayOn", v)} label="ON" /></div>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "3px 0 4px", borderTop: "1px solid #3a3a3a", background: "#1a1a1a" }}><span style={{ fontSize: 8, color: "#CCC", letterSpacing: 2.5, fontWeight: 600 }}>CONTROLLERS</span></div>
        </div>

        {/* OSC MOD + OSC 3 CTRL */}
        <div style={{ flex: "0 0 28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingTop: 14, paddingBottom: 24, borderLeft: "1px solid #555", borderRight: "1px solid #555", background: "linear-gradient(90deg, #242424 0%, #282828 50%, #242424 100%)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 5.5, color: "#CCC", textTransform: "uppercase", letterSpacing: 0.3, textAlign: "center", lineHeight: 1.1, fontWeight: 700, marginBottom: 3 }}>Osc<br/>Mod</div>
            <OrangeSw on={p.oscMod} onChange={v => set("oscMod", v)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 5.5, color: "#CCC", textTransform: "uppercase", letterSpacing: 0.3, textAlign: "center", lineHeight: 1.1, fontWeight: 700, marginBottom: 3 }}>Osc.3<br/>Ctrl</div>
            <OrangeSw on={!p.osc3Ctrl} onChange={v => set("osc3Ctrl", !v)} />
          </div>
        </div>

        {/* OSCILLATOR BANK */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, padding: "6px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4, paddingBottom: 3, borderBottom: "1px solid #2a2a2a" }}>
              <div style={{ width: 80, textAlign: "center", fontSize: 6, color: "#AAA", letterSpacing: 1.5, fontWeight: 700 }}>RANGE</div><div style={{ flex: 1 }} />
              <div style={{ width: 55, textAlign: "center", fontSize: 6, color: "#AAA", fontWeight: 500 }}>FREQ</div><div style={{ flex: 1 }} />
              <div style={{ width: 80, textAlign: "center", fontSize: 6, color: "#AAA", letterSpacing: 1.5, fontWeight: 700 }}>WAVEFORM</div>
            </div>
            {([1, 2, 3] as const).map(n => {
              const rKey = `osc${n}Range` as keyof Patch;
              const wKey = `osc${n}Wf` as keyof Patch;
              const fKey = `osc${n}Freq` as keyof Patch;
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: n < 3 ? 3 : 0, paddingBottom: n < 3 ? 4 : 0, borderBottom: n < 3 ? "1px solid #222" : "none" }}>
                  <RotSel value={p[rKey] as number} opts={RANGES} size={52} onChange={v => set(rKey, v)} />
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 6.5, color: "#DDD", fontWeight: 600 }}>OSC-{n}</div>
                    <div style={{ fontSize: 6.5, color: GOLD, fontWeight: 700 }}>{(p[fKey] as number).toFixed(1)}</div>
                  </div>
                  <DragKnob value={p[fKey] as number} onChange={v => set(fKey, v)} size={36} min={-7} max={7} ticks={15} />
                  <RotSel value={(p[wKey] as number) - 1} opts={WF_SYM} labels={WF_NAM} size={52} onChange={v => set(wKey, v + 1)} />
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", padding: "3px 0 4px", borderTop: "1px solid #3a3a3a", background: "#1a1a1a" }}><span style={{ fontSize: 8, color: "#CCC", letterSpacing: 2.5, fontWeight: 600 }}>OSCILLATOR BANK</span></div>
        </div>

        {/* MIXER */}
        <div style={{ flex: "0 0 108px", borderLeft: "1px solid #333", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, padding: "6px 5px" }}>
            <div style={{ fontSize: 6, color: "#AAA", letterSpacing: 1.5, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>VOLUME</div>
            {([
              [p.v1, p.s1, "1", "v1", "s1"],
              [p.v2, p.s2, "2", "v2", "s2"],
              [p.v3, p.s3, "3", "v3", "s3"],
            ] as const).map(([vol, sw, num, vk, sk]) =>
              <div key={num} style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 2 }}>
                <DragKnob value={vol as number} onChange={v => set(vk, v)} size={30} ticks={6} />
                <BlueSw on={sw as boolean} onChange={v => set(sk, v)} />
                <div style={{ fontSize: 6, color: "#AAA" }}>{num}</div>
              </div>)}
            <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: 3, marginTop: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
                <DragKnob value={p.ext} onChange={v => set("ext", v)} size={24} label="Ext In Vol" ticks={6} />
                <BlueSw on={p.sExt} onChange={v => set("sExt", v)} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <DragKnob value={p.nse} onChange={v => set("nse", v)} size={24} label="Noise Vol" ticks={6} />
                <BlueSw on={p.sNse} onChange={v => set("sNse", v)} />
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <BlueSw on={p.nWht} onChange={() => { set("nWht", true); }} label="W" />
                  <BlueSw on={!p.nWht} onChange={() => { set("nWht", false); }} label="P" />
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "3px 0 4px", borderTop: "1px solid #3a3a3a", background: "#1a1a1a" }}><span style={{ fontSize: 8, color: "#CCC", letterSpacing: 2.5, fontWeight: 600 }}>MIXER</span></div>
        </div>

        {/* FILTER MOD + KBD CTRL */}
        <div style={{ flex: "0 0 30px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 10, gap: 8, borderLeft: "1px solid #555", borderRight: "1px solid #555", background: "linear-gradient(90deg, #242424 0%, #282828 50%, #242424 100%)" }}>
          <div style={{ fontSize: 5.5, color: "#CCC", textTransform: "uppercase", letterSpacing: 0.3, textAlign: "center", lineHeight: 1.1, fontWeight: 700, marginBottom: 1 }}>Filter<br/>Mod</div>
          <OrangeSw on={p.fMod} onChange={v => set("fMod", v)} />
          <div style={{ fontSize: 5.5, color: "#CCC", textTransform: "uppercase", letterSpacing: 0.3, textAlign: "center", lineHeight: 1.1, fontWeight: 700, marginTop: 4 }}>Kbd<br/>Ctrl</div>
          <OrangeSw on={p.kb1} onChange={v => set("kb1", v)} label="1" />
          <OrangeSw on={p.kb2} onChange={v => set("kb2", v)} label="2" />
        </div>

        {/* MODIFIERS */}
        <div style={{ flex: "1 1 280px", borderRight: "1px solid #333", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, padding: "6px 8px" }}>
            <div style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: 4, marginBottom: 4 }}>
              <div style={{ fontSize: 7, color: "#CCC", letterSpacing: 2, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>FILTER</div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ textAlign: "center" }}><DragKnob value={p.cut} onChange={v => set("cut", v)} label="Cutoff Frequency" size={46} min={-5} max={5} showVal /></div>
                <div style={{ textAlign: "center" }}><DragKnob value={p.emp} onChange={v => set("emp", v)} label="Emphasis" size={46} showVal /></div>
                <div style={{ textAlign: "center" }}><DragKnob value={p.ctr} onChange={v => set("ctr", v)} label="Amount of Contour" size={46} showVal /></div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 4, borderTop: "1px solid #222" }}>
                <div style={{ textAlign: "center" }}>
                  <DragKnob value={p.fA} onChange={v => set("fA", v)} label="Attack Time" size={36} detents={AD_DETENTS} />
                  <div style={{ display: "flex", justifyContent: "space-between", width: 44, margin: "1px auto 0" }}>
                    <span style={{ fontSize: 4, color: "#666" }}>M-SEC.</span>
                    <span style={{ fontSize: 4, color: "#666" }}>SEC.</span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <DragKnob value={p.fD} onChange={v => set("fD", v)} label="Decay Time" size={36} detents={AD_DETENTS} />
                  <div style={{ display: "flex", justifyContent: "space-between", width: 44, margin: "1px auto 0" }}>
                    <span style={{ fontSize: 4, color: "#666" }}>M-SEC.</span>
                    <span style={{ fontSize: 4, color: "#666" }}>SEC.</span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}><DragKnob value={p.fS} onChange={v => set("fS", v)} label="Sustain Level" size={34} showVal /></div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 7, color: "#CCC", letterSpacing: 1.5, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>LOUDNESS CONTOUR</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                <div style={{ textAlign: "center" }}>
                  <DragKnob value={p.lA} onChange={v => set("lA", v)} label="Attack Time" size={36} detents={AD_DETENTS} />
                  <div style={{ display: "flex", justifyContent: "space-between", width: 44, margin: "1px auto 0" }}>
                    <span style={{ fontSize: 4, color: "#666" }}>M-SEC.</span>
                    <span style={{ fontSize: 4, color: "#666" }}>SEC.</span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <DragKnob value={p.lD} onChange={v => set("lD", v)} label="Decay Time" size={36} detents={AD_DETENTS} />
                  <div style={{ display: "flex", justifyContent: "space-between", width: 44, margin: "1px auto 0" }}>
                    <span style={{ fontSize: 4, color: "#666" }}>M-SEC.</span>
                    <span style={{ fontSize: 4, color: "#666" }}>SEC.</span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}><DragKnob value={p.lS} onChange={v => set("lS", v)} label="Sustain Level" size={34} showVal /></div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "3px 0 4px", borderTop: "1px solid #3a3a3a", background: "#1a1a1a" }}><span style={{ fontSize: 8, color: "#CCC", letterSpacing: 2.5, fontWeight: 600 }}>MODIFIERS</span></div>
        </div>

        {/* OUTPUT */}
        <div style={{ flex: "0 0 68px", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <BlueSw on={p.main} onChange={v => set("main", v)} label="MAIN" />
            <DragKnob value={p.vol} onChange={v => set("vol", v)} label="Volume" size={40} showVal />
            <BlueSw on={p.a440} onChange={v => set("a440", v)} label="A-440" />
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#E33", boxShadow: "0 0 5px #E33" }} />
              <span style={{ fontSize: 5, color: "#E33", fontWeight: 700 }}>PWR</span>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "3px 0 4px", borderTop: "1px solid #3a3a3a", background: "#1a1a1a" }}><span style={{ fontSize: 8, color: "#CCC", letterSpacing: 2.5, fontWeight: 600 }}>OUTPUT</span></div>
        </div>
      </div>
      <div style={{ height: 18, background: "linear-gradient(180deg,#4A3420,#5C4228 50%,#7B6040 100%)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 12px" }}>
        <div style={{ fontSize: 7, color: "#2a2015", letterSpacing: 2, fontWeight: 700, fontStyle: "italic" }}>moog minimoog</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// FORMAT AI TEXT
// ═══════════════════════════════════════════════
function formatAI(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${GOLD}">$1</strong>`)
    .replace(/`(.*?)`/g, `<code style="background:rgba(245,166,35,0.1);padding:1px 5px;border-radius:3px;font-size:0.78rem;color:#D4A050">$1</code>`)
    .replace(/\n\n/g, '</p><p style="margin:6px 0">')
    .replace(/\n- /g, '<br/>\u2022 ')
    .replace(/\n/g, '<br/>');
}

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════
interface Msg {
  role: "system" | "user" | "ai";
  text: string;
  patch?: Patch;
  patchName?: string;
}

export default function SynthPage() {
  const [si, setSi] = useState(0);
  const [tab, setTab] = useState("preset");
  const [patch, setPatch] = useState<Patch>({ ...PRESETS[0] });
  const [customPresets, setCustomPresets] = useState<Patch[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "system", text: "Ask me to recreate a patch from any recording that features the Minimoog Model D, or describe a sound you want to create. I'll research the recording and generate accurate panel settings you can load directly." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSave, setShowSave] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const selectPreset = (i: number) => {
    setSi(i);
    setPatch({ ...PRESETS[i] });
    setTab("preset");
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  const selectCustom = (i: number) => {
    setPatch({ ...customPresets[i] });
    setTab("custom");
  };

  const savePatch = () => {
    if (!saveName.trim()) return;
    setCustomPresets(prev => [...prev, { ...patch, name: saveName.trim() }]);
    setSaveName(""); setShowSave(false);
  };

  const has = (q: string, words: string[]) => words.some(w => q.includes(w));

  const SYSTEM_PROMPT = `You are a Minimoog Model D patch designer and historian. You have encyclopedic knowledge of this synthesizer, its architecture, and recordings that feature it.

You have TWO primary capabilities:

1. **RECORDING RESEARCH**: When asked about a specific song, artist, or recording, provide historically accurate Minimoog Model D patch settings. Research the actual synth parts — specify which part of the song uses the Minimoog (bass line, lead, pad, etc.), what the player's known technique was, and design the most accurate patch possible. If the Minimoog was NOT used on a recording, say so honestly and suggest what synth was actually used. Only provide a patch if a Moog-family synth was plausibly used.

2. **SOUND DESIGN**: When someone describes a sound they want to create, design a patch from scratch. Be creative and precise. Explain your sound design choices.

For BOTH capabilities, when generating a patch include a JSON block in \`\`\`json...\`\`\` with these EXACT parameter names and ranges:

name(string), artist(string or ""), album(string or ""), description(string), tips(string — playing technique, register, articulation),
tune(-2 to +2, 0=center), glide(0-10), glideOn(bool), oscMod(bool), modMix(0-10, 5=center), srcOsc3(bool), srcNoise(bool), osc3Ctrl(bool — true=keyboard tracking ON), decayOn(bool),
osc1Range/osc2Range/osc3Range(integer 0-5: 0=LO, 1=32', 2=16', 3=8', 4=4', 5=2'),
osc1Wf/osc2Wf/osc3Wf(integer 1-6: 1=Triangle, 2=Shark/RampDown, 3=ReverseSaw, 4=Sawtooth, 5=Square, 6=WidePulse),
osc1Freq/osc2Freq/osc3Freq(number -7 to +7, 0=center — represents fine-tune detune in semitones),
osc2Sync(bool),
v1/v2/v3(number 0-10 — mixer volume), s1/s2/s3(bool — mixer on/off),
ext(0-10), sExt(bool), nse(0-10), sNse(bool), nWht(bool — true=white noise, false=pink),
cut(number -5 to +5 — filter cutoff frequency), emp(number 0-10 — emphasis/resonance), ctr(number 0-10 — amount of contour),
fMod(bool — filter modulation), kb1/kb2(bool — keyboard control 1 & 2),
fA/fD(integer 0-7 — detented positions: 0=M-SEC.(instant), 1=10ms, 2=200ms, 3=600ms, 4=1s, 5=5s, 6=10s, 7=SEC.(max)),
fS(number 0-10 — filter sustain level),
lA/lD(integer 0-7 — same detent scale as fA/fD), lS(number 0-10 — loudness sustain level),
vol(number 0-10), main(bool), a440(bool),
nO1/nO2/nO3(string — short note about each oscillator's role in the patch),
nCut(string — note about cutoff setting), nEmp(string — note about emphasis), nCtr(string — note about contour amount)

Be precise with values. Every parameter must be included in the JSON.`;

  const chatHistory = useRef<Array<{ role: string; content: string }>>([]);

  const send = async (overrideText?: string) => {
    const t = (overrideText || input).trim();
    if (!t || loading) return;
    if (!overrideText) setInput("");
    setLoading(true);
    setMsgs(m => [...m, { role: "user", text: t }]);

    const kbResult = searchKB(t);
    const isPatchReq = has(t.toLowerCase(), ["make", "create", "build", "give", "want", "need", "design", "craft", "generate", "patch", "sound", "what did", "how did", "used on", "settings for", "recreate"]);
    const hasSoundWords = has(t.toLowerCase(), ["bass", "lead", "pad", "stab", "pluck", "drone", "acid", "fat", "warm", "dark", "bright", "funky", "ethereal"]);
    const isRecordingQ = has(t.toLowerCase(), ["song", "track", "album", "recording", "played on", "used on", "stevie", "pink floyd", "rush", "kraftwerk", "parliament", "bernie", "keith emerson", "rick wakeman", "jan hammer", "herbie hancock", "chick corea", "sun ra", "gary numan", "giorgio moroder", "daft punk", "tame impala"]);

    if (kbResult && !isPatchReq && !hasSoundWords && !isRecordingQ) {
      setTimeout(() => {
        setMsgs(m => [...m, { role: "ai", text: kbResult.a }]);
        setLoading(false);
      }, 300);
      return;
    }

    chatHistory.current.push({ role: "user", content: t });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: chatHistory.current,
        }),
      });
      const data = await res.json();
      const text = data.content?.filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n") || "Error processing request.";
      const jm = text.match(/```json\s*([\s\S]*?)```/);
      let newPatch: Patch | null = null;
      let patchName = "";
      if (jm) {
        try {
          const parsed = JSON.parse(jm[1]);
          newPatch = mkPatch(parsed);
          patchName = newPatch.name || "Custom";
        } catch { /* ignore parse errors */ }
      }
      const cleanText = text.replace(/```json[\s\S]*?```/g, "").trim();

      chatHistory.current.push({ role: "assistant", content: cleanText });

      setMsgs(m => [...m, { role: "ai", text: cleanText, patch: newPatch ?? undefined, patchName }]);
    } catch {
      setMsgs(m => [...m, { role: "ai", text: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const loadChatPatch = (p: Patch) => {
    setPatch(p);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  const saveChatPatch = (p: Patch) => {
    setCustomPresets(prev => [...prev, p]);
  };

  const quicks = [
    "What Minimoog patch did Stevie Wonder use on Superstition?",
    "Recreate the Moog bass from Parliament's Flashlight",
    "What settings did Rick Wakeman use for Yes leads?",
    "Design a fat detuned unison bass",
    "Create a screaming acid lead with high resonance",
    "Build a warm dreamy space pad with slow LFO",
  ];

  return (
    <div style={{ fontFamily: "'Helvetica Neue',system-ui,sans-serif", color: "#DDD" }}>
      {/* Header */}
      <div style={{ padding: "20px 16px 8px", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: GOLD, fontWeight: 700, marginBottom: 4 }}>PATCH DESIGNER</div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 900, color: "#F5E6C8", margin: 0 }}>Minimoog Model D</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "0 12px 10px" }}>
        {([["preset", `Sound Bank (${PRESETS.length})`], ["chat", "Patch Designer \u26A1"]] as const).map(([id, lb]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: tab === id ? "#1e1a14" : "#141312", border: `1px solid ${tab === id ? "#F5A62350" : "#222"}`, borderRadius: 6, padding: "7px 18px", cursor: "pointer", fontSize: 10, fontWeight: 700, color: tab === id ? GOLD : "#666" }}>{lb}</button>
        ))}
      </div>

      {/* Preset list */}
      {tab === "preset" && (
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 12px 10px" }}>
          {PRESETS.map((pr, i) => {
            const a = i === si;
            return (
              <button key={i} onClick={() => selectPreset(i)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: a ? "#1e1a14" : "#141312", border: `1px solid ${a ? "#F5A62345" : "#1e1e1e"}`, borderRadius: 6, padding: "6px 12px", cursor: "pointer", textAlign: "left", marginBottom: 2 }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: a ? `linear-gradient(135deg,${GOLD},${GOLD_D})` : "#201c14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: a ? "#111" : "#555", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: a ? "#F5E6C8" : "#999", fontWeight: 700 }}>{pr.name}</div>
                  <div style={{ fontSize: 7.5, color: a ? "#B09050" : "#555" }}>{pr.artist}{pr.album ? ` \u2014 ${pr.album}` : ""}</div>
                </div>
                {a && <div style={{ width: 4, height: 4, borderRadius: 2, background: GOLD }} />}
              </button>
            );
          })}
          {customPresets.length > 0 && (
            <>
              <div style={{ fontSize: 8, color: "#555", letterSpacing: 2, fontWeight: 700, margin: "10px 0 4px", textTransform: "uppercase" }}>Custom Patches</div>
              {customPresets.map((pr, i) => (
                <button key={"c" + i} onClick={() => selectCustom(i)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "#141312", border: "1px solid #1e1e1e", borderRadius: 6, padding: "6px 12px", cursor: "pointer", textAlign: "left", marginBottom: 2 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: "#201c14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#555", flexShrink: 0 }}>{"\u2605"}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: "#999", fontWeight: 700 }}>{pr.name}</div></div>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Patch info */}
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 12px 6px" }}>
        <div style={{ background: "#171513", border: "1px solid #F5A62318", borderRadius: 6, padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 7, color: GOLD, letterSpacing: 2, fontWeight: 700, marginBottom: 2 }}>ACTIVE PATCH</div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: 14, color: "#F5E6C8", fontWeight: 700, margin: "0 0 3px" }}>
                {patch.name}
                {patch.artist && <span style={{ fontWeight: 400, fontSize: 11, color: "#998" }}>{` \u2014 ${patch.artist}`}</span>}
              </h2>
              {patch.description && <div style={{ fontSize: 9, color: "#887", lineHeight: 1.35, marginBottom: 4 }}>{patch.description}</div>}
              {patch.tips && <div style={{ padding: "3px 7px", background: "#F5A62306", borderLeft: `2px solid ${GOLD}30`, borderRadius: 2, fontSize: 8.5, color: "#B09050", lineHeight: 1.3 }}><b style={{ color: GOLD }}>TIPS: </b>{patch.tips}</div>}
            </div>
            <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
              {!showSave ? (
                <button onClick={() => setShowSave(true)} style={{ padding: "4px 10px", fontSize: 9, background: "#222", color: "#888", border: "1px solid #444", borderRadius: 3, cursor: "pointer", fontWeight: 600 }}>Save</button>
              ) : (
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Patch name" style={{ padding: "3px 6px", fontSize: 9, background: "#111", color: "#ddd", border: "1px solid #444", borderRadius: 3, width: 100, outline: "none" }} />
                  <button onClick={savePatch} style={{ padding: "4px 8px", fontSize: 9, background: GOLD_D, color: "#111", border: "none", borderRadius: 3, cursor: "pointer", fontWeight: 700 }}>{"\u2713"}</button>
                  <button onClick={() => setShowSave(false)} style={{ padding: "4px 8px", fontSize: 9, background: "#333", color: "#888", border: "none", borderRadius: 3, cursor: "pointer" }}>{"\u2717"}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Panel */}
      <div ref={panelRef}><Panel p={patch} onChange={setPatch} /></div>

      {/* Oscillator & Filter notes */}
      {(patch.nO1 || patch.nCut) && (
        <div style={{ maxWidth: 660, margin: "8px auto 0", padding: "0 12px 8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {([["OSC 1", patch.nO1], ["OSC 2", patch.nO2], ["OSC 3", patch.nO3]] as const).filter(([, n]) => n).map(([lbl, note], i) =>
              <div key={i} style={{ background: "#151311", borderRadius: 4, padding: 6, borderLeft: "2px solid #FF8C4230" }}>
                <div style={{ fontSize: 6, color: "#FF8C42", fontWeight: 700, marginBottom: 1 }}>{lbl}</div>
                <div style={{ fontSize: 5.5, color: "#887755", lineHeight: 1.2, fontStyle: "italic" }}>{note}</div>
              </div>)}
            {patch.nCut && (
              <div style={{ background: "#151311", borderRadius: 4, padding: 6, borderLeft: "2px solid #E85D7530" }}>
                <div style={{ fontSize: 6, color: "#E85D75", fontWeight: 700, marginBottom: 1 }}>FILTER</div>
                <div style={{ fontSize: 5.5, color: "#998", lineHeight: 1.2 }}>
                  <b style={{ color: "#AAA" }}>Cut: </b>{patch.nCut}<br />
                  <b style={{ color: "#AAA" }}>Emp: </b>{patch.nEmp}<br />
                  <b style={{ color: "#AAA" }}>Ctr: </b>{patch.nCtr}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHAT */}
      <div style={{ maxWidth: 660, margin: "10px auto 0", padding: "0 12px 24px" }}>
        <div style={{ background: "#110f0a", border: "1px solid #F5A62315", borderRadius: 12, display: "flex", flexDirection: "column", height: 440, overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#14110c,#1a1508)", padding: "12px 16px", borderBottom: "1px solid #F5A62315", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},${GOLD_D})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#111", fontWeight: 900 }}>M</div>
            <div><div style={{ fontSize: "0.78rem", color: "#F5E6C8", fontWeight: 700 }}>Patch Designer {"\u26A1"}</div><div style={{ fontSize: "0.6rem", color: "#665" }}>Sound design + recording research (Claude API + web search)</div></div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i}>
                <div style={{
                  padding: m.role === "system" ? "6px 10px" : "10px 14px", borderRadius: 10, fontSize: m.role === "system" ? "0.7rem" : "0.82rem", lineHeight: 1.65,
                  ...(m.role === "user" ? { maxWidth: "85%", background: "#1a1408", color: "#D0C0A0", marginLeft: "auto", border: "1px solid #F5A62320", borderBottomRightRadius: 3 }
                    : m.role === "ai" ? { maxWidth: "100%", background: "#161108", color: "#B0A080", border: "1px solid #F5A62310", borderBottomLeftRadius: 3 }
                      : { maxWidth: "100%", background: "transparent", color: "#554", textAlign: "center" as const, fontStyle: "italic" })
                }} dangerouslySetInnerHTML={{ __html: m.role === "ai" ? formatAI(m.text) : m.text }} />
                {m.patch && (
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button onClick={() => loadChatPatch(m.patch!)} style={{ padding: "5px 14px", fontSize: 10, background: `linear-gradient(135deg,${GOLD},${GOLD_D})`, color: "#111", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700, letterSpacing: 0.5 }}>{"\u25B6"} Load: {m.patchName}</button>
                    <button onClick={() => saveChatPatch(m.patch!)} style={{ padding: "5px 14px", fontSize: 10, background: "#222", color: "#999", border: "1px solid #444", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>{"\u2605"} Save to Bank</button>
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ color: "#665", fontSize: "0.75rem", fontStyle: "italic" }}>Researching & designing patch...</div>}
            <div ref={chatEnd} />
          </div>
          {msgs.length <= 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "0 12px 8px", background: "#0d0b08" }}>
              {quicks.map((q, i) => <button key={i} onClick={() => send(q)} style={{ background: "#1a1508", border: "1px solid #F5A62315", borderRadius: 16, padding: "4px 11px", fontSize: "0.66rem", color: "#887", cursor: "pointer" }}>{q}</button>)}
            </div>
          )}
          <div style={{ padding: "10px 12px", borderTop: "1px solid #F5A62315", display: "flex", gap: 8, background: "#0d0b08", flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(); } }} placeholder="'Superstition bass' or 'warm detuned lead with slow filter'..." style={{ flex: 1, background: "#14110c", border: "1px solid #F5A62320", borderRadius: 8, padding: "9px 13px", color: "#DDD", fontSize: "0.8rem", outline: "none" }} />
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width: 38, height: 38, background: `linear-gradient(135deg,${GOLD},${GOLD_D})`, border: "none", borderRadius: 8, cursor: "pointer", color: "#111", fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!input.trim() || loading) ? 0.4 : 1, flexShrink: 0 }}>{"\u27A4"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
