"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ════════════════════════════════════════════════════════════════════
   PROPHET-5 REV 4 — Digital Interface
   Faithful recreation of the Sequential Prophet-5 Rev 4 (2020 reissue)
   ═══════════════════════════════════════════════════════════════════ */

const CREAM = "#D4C695";
const CREAM_DIM = "#9A8C5E";
const RED_LED = "#FF2D20";
const YEL_LED = "#FFB800";
const PANEL_BLACK = "#100F0D";
const WALNUT_LIGHT = "#7A4A2C";
const WALNUT_DARK = "#3D2410";

/* ─── Default patch state ─────────────────────────────────────────── */
const INIT_PATCH = {
  pmFiltEnv: 0, pmOscB: 0,
  pmDestFreqA: false, pmDestPwA: false, pmDestFilter: false,
  lfoInit: 0, lfoFreq: 5,
  lfoSaw: false, lfoTri: true, lfoSq: false,
  wmSrcMix: 0,
  wmDestFreqA: false, wmDestFreqB: false, wmDestPwA: false, wmDestPwB: false, wmDestFilter: false,
  oaFreq: 5, oaSaw: true, oaPulse: false, oaPw: 5, oaSync: false,
  obFreq: 5, obFine: 5, obSaw: true, obTri: false, obPulse: false,
  obPw: 5, obLo: false, obKb: true,
  mxOscA: 7, mxOscB: 0, mxNoise: 0,
  fRev: 1,
  fCut: 5, fRes: 0, fEnv: 0,
  fKb: 0,
  feA: 0, feD: 3, feS: 5, feR: 1,
  aeA: 0, aeD: 3, aeS: 8, aeR: 2,
  vintage: 4,
  masterTune: 0,
  a440: false,
  velFilt: false, velAmp: false,
  atFilt: false, atLfo: false,
  unison: false, glideRate: 0, presetMode: true,
  volume: 6, releaseHold: 0,
};

type Patch = typeof INIT_PATCH & {
  id?: string;
  name?: string;
  artist?: string;
  album?: string;
  year?: number;
  description?: string;
  tips?: string;
  group?: number;
  bank?: number;
  prgm?: number;
  isFactory?: boolean;
  dirty?: boolean;
};

const meta = (
  id: string, name: string, artist: string, album: string, year: number,
  description: string, tips: string, group: number, bank: number, prgm: number
) => ({ id, name, artist, album, year, description, tips, group, bank, prgm, isFactory: true });

/* ─── Factory Presets ────────────────────────────────────────────── */
const FACTORY: Patch[] = [
  {
    ...INIT_PATCH,
    ...meta("in-the-air", "In the Air Tonight", "Phil Collins", "Face Value", 1981,
      "Ethereal pad with brooding tension. Phil Collins' debut solo album leans heavily on the Prophet-5 — this is one of his most recognizable patches. Slow filter envelope creates the signature swelling atmosphere before the famous gated drum break.",
      "Sustained chords C2-C4. Let the swell breathe before the drums hit.", 1, 1, 1),
    lfoInit: 2, lfoFreq: 2.5,
    wmDestFilter: true,
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 7, obKb: true,
    mxOscA: 7, mxOscB: 7, mxNoise: 1,
    fCut: 3.5, fRes: 2, fEnv: 4, fKb: 1,
    feA: 3, feD: 7, feS: 6, feR: 6,
    aeA: 4, aeD: 7, aeS: 8, aeR: 6,
    volume: 6,
  },
  {
    ...INIT_PATCH,
    ...meta("ghosts", "Ghosts", "Japan", "Tin Drum", 1982,
      "Ryuichi Sakamoto and Richard Barbieri's Prophet-5 anchored Japan's most atmospheric record. Restrained filter, breathing PWM, slow envelopes — David Sylvian's voice floating over a sparse synth landscape.",
      "Single sustained tones with space. Less is more here.", 1, 1, 2),
    lfoInit: 3, lfoFreq: 2.5,
    wmDestPwA: true, wmDestPwB: true, wmSrcMix: -2,
    oaSaw: false, oaPulse: true, oaPw: 4,
    obSaw: false, obTri: true, obFine: 6, obKb: true,
    mxOscA: 7, mxOscB: 6,
    fCut: 4, fRes: 3, fEnv: 4, fKb: 1,
    feA: 2, feD: 5, feS: 6, feR: 4,
    aeA: 2, aeD: 6, aeS: 8, aeR: 5,
    volume: 6,
  },
  {
    ...INIT_PATCH,
    ...meta("i-cant-go", "I Can't Go For That", "Hall & Oates", "Private Eyes", 1981,
      "Lush chorused chord pad — the soft swelling part that opens the track. Daryl Hall sketched the song in one evening at Electric Lady, with the Prophet-5 carrying the primary chord work. Michael Jackson later admitted he lifted the bassline for 'Billie Jean'.",
      "Sustained block chords with subtle attack. Run through chorus for the full effect.", 1, 1, 3),
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 6, obKb: true,
    mxOscA: 7, mxOscB: 7,
    fCut: 4.5, fRes: 1.5, fEnv: 2, fKb: 1,
    feA: 2.5, feD: 6, feS: 8, feR: 5,
    aeA: 3, aeD: 6, aeS: 9, aeR: 5,
    volume: 6.5,
  },
  {
    ...INIT_PATCH,
    ...meta("like-a-virgin", "Like a Virgin", "Madonna", "Like a Virgin", 1984,
      "Robert Sabino's Prophet-5 keyboards drove Nile Rodgers' production at the Power Station. Bright, glossy '80s pop synth with PWM movement — sitting alongside Bernard Edwards' bassline that rolled like the one on Billie Jean.",
      "Bright chord stabs and short melodic lines C3-C5.", 1, 1, 4),
    lfoInit: 1.5, lfoFreq: 3,
    wmDestPwA: true, wmDestPwB: true, wmSrcMix: -2,
    oaSaw: false, oaPulse: true, oaPw: 4,
    obSaw: false, obPulse: true, obFine: 6, obPw: 6, obKb: true,
    mxOscA: 7, mxOscB: 6,
    fCut: 6.5, fRes: 1, fEnv: 4, fKb: 1,
    feA: 0.5, feD: 3, feS: 6, feR: 3,
    aeA: 0.5, aeD: 3, aeS: 8, aeR: 3,
    volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("naive-melody", "This Must Be the Place", "Talking Heads", "Speaking in Tongues", 1983,
      "Three Prophet-5s on this one track: Jerry Harrison plays the bouncy ostinato bassline on the first, Wally Badarou adds stabs on the second, and David Byrne plays melodic glissandos on the third. They swapped instruments to capture a 'naive' feel.",
      "Single-note ostinato bassline, eighth notes, C2-G3.", 1, 1, 5),
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 4, obKb: true,
    mxOscA: 8, mxOscB: 4,
    fCut: 5, fRes: 2.5, fEnv: 4, fKb: 1,
    feA: 0, feD: 2.5, feS: 4, feR: 2,
    aeA: 0, aeD: 3, aeS: 6, aeR: 2,
    volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("burning-house", "Burning Down the House", "Talking Heads", "Speaking in Tongues", 1983,
      "Wally Badarou's iconic Prophet-5 lead, run through a Roland T-Wah for that sucking quality David Byrne loved. Funky percussive monophonic-feeling lead with Poly-Mod-driven pitch character.",
      "Funky melodic lead lines, mid-register. Use the mod wheel for filter movement.", 1, 1, 6),
    pmFiltEnv: 2, pmDestFreqA: true,
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 6, obKb: true,
    mxOscA: 9, mxOscB: 5,
    fCut: 4.5, fRes: 4.5, fEnv: 6, fKb: 2,
    feA: 0, feD: 2.5, feS: 3, feR: 2,
    aeA: 0, aeD: 4, aeS: 6, aeR: 2,
    glideRate: 1, volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("giorgio", "Giorgio by Moroder", "Daft Punk", "Random Access Memories", 2013,
      "Daft Punk captured the famous arpeggio in the early Henson Studio sessions, layering it via MIDI through a Prophet-5, Jupiter-6, Juno-106 and CS-80. This is the Prophet-5 contribution: percussive pulse with heavy resonance, Moroder-style.",
      "Tight 16th-note arpeggios in minor keys. Resonance is key.", 1, 1, 7),
    oaSaw: false, oaPulse: true, oaPw: 5,
    obSaw: false, obPulse: true, obFine: 4, obKb: true,
    mxOscA: 8, mxOscB: 4,
    fCut: 3.5, fRes: 5, fEnv: 5, fKb: 1,
    feA: 0, feD: 2, feS: 2, feR: 2,
    aeA: 0, aeD: 2.5, aeS: 4, aeR: 2,
    glideRate: 0.5, volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("run-like-hell", "Run Like Hell", "Pink Floyd", "The Wall", 1979,
      "Richard Wright used the Prophet-5 exclusively on The Wall — this is from his solo in the middle of 'Run Like Hell'. Bright analog lead with Poly-Mod giving the envelope its bite.",
      "Lead lines with bend and aftertouch. Wright loved Poly-Mod expressively.", 1, 1, 8),
    pmFiltEnv: 3, pmDestFreqA: true,
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 7, obKb: true,
    mxOscA: 8, mxOscB: 7,
    fCut: 6.5, fRes: 2.5, fEnv: 5, fKb: 2,
    feA: 0, feD: 3.5, feS: 5, feR: 3,
    aeA: 0, aeD: 3.5, aeS: 8, aeR: 3.5,
    volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("thriller", "Thriller", "Michael Jackson", "Thriller", 1982,
      "Anthony Marinelli programmed the Prophet-5 for the song's iconic intro — layered with a Jupiter-8 in the verse pads. Dark, menacing, percussive. (Note: the famous bass on this track is actually an ARP 2600, not the Prophet.)",
      "Sharp staccato stabs C2-C4. Resonance gives the eerie quality.", 1, 2, 1),
    pmFiltEnv: 2, pmDestFreqA: true,
    oaSaw: true, oaPulse: false,
    obSaw: false, obPulse: true, obFine: 5, obKb: true,
    mxOscA: 8, mxOscB: 6, mxNoise: 1,
    fCut: 3, fRes: 5, fEnv: 7, fKb: 1,
    feA: 0, feD: 3, feS: 1, feR: 2,
    aeA: 0, aeD: 4, aeS: 2, aeR: 2,
    volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("lets-go", "Let's Go", "The Cars", "Candy-O", 1979,
      "Greg Hawkes (one of the Prophet-5's biggest champions) used the factory '32 Sync II' patch on this one. Oscillator A synced to Oscillator B for the metallic shimmer that defined the song's signature lead line.",
      "Punchy lead lines with sync sweep. Modulate Osc B frequency for harmonic motion.", 1, 2, 2),
    oaSaw: true, oaPulse: false, oaSync: true,
    obSaw: true, obFreq: 7, obFine: 5.5, obKb: true,
    mxOscA: 8, mxOscB: 6,
    fCut: 6.5, fRes: 2.5, fEnv: 5, fKb: 2,
    feA: 0, feD: 3, feS: 5, feR: 3,
    aeA: 0, aeD: 3.5, aeS: 7, aeR: 2,
    volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("halloween", "Halloween Theme", "John Carpenter", "Halloween II Soundtrack", 1981,
      "Carpenter and Alan Howarth used the Prophet-5 and Prophet-10 throughout their horror scores — first on Escape From New York, then Halloween II and III. This is the iconic 5/4 piano-like minor stab that has terrified audiences for 40+ years.",
      "Repeating 5/4 minor figure. Short percussive notes, no sustain.", 1, 2, 3),
    oaSaw: true, oaPulse: true, oaPw: 4,
    obSaw: false, obTri: true, obFine: 5, obKb: true,
    mxOscA: 8, mxOscB: 4,
    fCut: 6, fRes: 3, fEnv: 4, fKb: 2,
    feA: 0, feD: 3.5, feS: 2, feR: 3,
    aeA: 0, aeD: 4, aeS: 2.5, aeR: 3,
    vintage: 2, volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("endors-toi", "Endors Toi", "Tame Impala", "Lonerism", 2012,
      "Kevin Parker's Sequential Pro One — the Prophet-5's monophonic 1-osc-per-voice sibling — appears on every song of Lonerism. He calls it his favorite synth: 'It sounded like crying in outer space.' Detuned saws with heavy portamento, wide-open filter.",
      "Mono lead lines with smooth glide. Lean into the unison detuning.", 1, 2, 4),
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 7, obKb: true,
    mxOscA: 9, mxOscB: 8,
    fCut: 7, fRes: 1, fEnv: 2, fKb: 2,
    feA: 0, feD: 4, feS: 8, feR: 4,
    aeA: 0, aeD: 4, aeS: 9, aeR: 4,
    unison: true, glideRate: 3, volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("jump", "Jump", "Van Halen", "1984", 1984,
      "Eddie's iconic synth-led rock anthem. Originally an Oberheim OB-X (studio) and OB-Xa (live tour), but the detuned-saw brass stab translates beautifully to the Prophet-5's similar 5-voice analog architecture. Power chords through a punchy filter envelope.",
      "Power chords C3-C5, short staccato attack. Run through chorus and a short delay.", 1, 2, 5),
    pmFiltEnv: 4, pmDestFilter: true,
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 6, obKb: true,
    mxOscA: 8, mxOscB: 7,
    fCut: 6, fRes: 3, fEnv: 6, fKb: 2,
    feA: 0, feD: 4, feS: 6, feR: 3,
    aeA: 0, aeD: 5, aeS: 8, aeR: 3,
    volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("take-on-me", "Take On Me", "a-ha", "Hunting High and Low", 1985,
      "Originally a layered patch on Roland Juno-60, Yamaha DX7 (E.BASS 1), and PPG Wave 2.3 in producer Alan Tarney's studio. The MTV video famously shows a Prophet-5 — and the sync-led lead character does translate well to the P5's voice.",
      "Fast arpeggiated runs C4-C6. Sync's harmonic content sings.", 1, 2, 6),
    pmFiltEnv: 3, pmDestFreqA: true,
    oaSaw: true, oaPulse: false, oaSync: true,
    obSaw: true, obFreq: 7, obFine: 6, obKb: true,
    mxOscA: 8, mxOscB: 6,
    fCut: 7.5, fRes: 2, fEnv: 4, fKb: 2,
    feA: 0, feD: 3, feS: 5, feR: 2,
    aeA: 0, aeD: 4, aeS: 7, aeR: 2,
    volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("hungry-wolf", "Hungry Like the Wolf", "Duran Duran", "Rio", 1982,
      "Originally Nick Rhodes' Roland Jupiter-8 with arpeggiator, layered over a TR-808. The bright detuned-saw character is well within the Prophet-5's range — this is a faithful Prophet-5 recreation of that propulsive new-wave arp.",
      "Repeating arp pattern with the synth's arpeggiator engaged.", 1, 2, 7),
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 6, obKb: true,
    mxOscA: 8, mxOscB: 7,
    fCut: 5.5, fRes: 3, fEnv: 5.5, fKb: 1,
    feA: 0, feD: 3.5, feS: 4, feR: 3,
    aeA: 0, aeD: 4, aeS: 7, aeR: 3,
    volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("shanghai", "Shanghai", "King Gizzard & The Lizard Wizard", "Butterfly 3000", 2021,
      "Smooth bass groove with airy flute-like Mellotron coloring — Stu Mackenzie's most synth-forward Gizzard era. Originally on King Gizz's bespoke modular setup; this Prophet-5 patch captures the warm, mellow chord-and-lead character.",
      "Smooth chord progression with a doubled lead line on top.", 1, 2, 8),
    oaSaw: true, oaPulse: false,
    obSaw: false, obTri: true, obFine: 5.5, obKb: true,
    mxOscA: 8, mxOscB: 6,
    fCut: 5.5, fRes: 1, fEnv: 2, fKb: 1,
    feA: 1, feD: 4, feS: 7, feR: 4,
    aeA: 0.5, aeD: 4, aeS: 8, aeR: 4,
    vintage: 3, volume: 6.5,
  },
  {
    ...INIT_PATCH,
    ...meta("catching-smoke", "Catching Smoke", "King Gizzard & The Lizard Wizard", "Butterfly 3000", 2021,
      "Multitude of chirping synths floating over thunderous bass riffs. The most maximalist synth track on Butterfly 3000 — distorted electronica with constant filter movement. Programmed here with LFO-driven filter sweep and Poly-Mod accents.",
      "Layered synth lines with mod wheel filter sweeps.", 1, 3, 1),
    pmFiltEnv: 2, pmDestFilter: true,
    lfoInit: 2, lfoFreq: 4, lfoTri: true,
    wmDestFilter: true, wmSrcMix: -2,
    oaSaw: true, oaPulse: false,
    obSaw: true, obFine: 6.5, obKb: true,
    mxOscA: 8, mxOscB: 7, mxNoise: 0.5,
    fCut: 6, fRes: 3, fEnv: 5, fKb: 1,
    feA: 0, feD: 3, feS: 5, feR: 3,
    aeA: 0, aeD: 4, aeS: 7, aeR: 3,
    vintage: 2, volume: 7,
  },
  {
    ...INIT_PATCH,
    ...meta("interior-people", "Interior People", "King Gizzard & The Lizard Wizard", "Butterfly 3000", 2021,
      "The closest King Gizz have come to modern pop — Joey Walker's only solo mix credit on the album, and arguably the polished standout. Layered synthesizers create something greater than the sum of their parts. PWM-rich pulse pad voicing here.",
      "Block chords with subtle PWM movement and harmonized vocals on top.", 1, 3, 2),
    lfoInit: 2, lfoFreq: 3, lfoTri: true,
    wmDestPwA: true, wmDestPwB: true, wmSrcMix: -2,
    oaSaw: false, oaPulse: true, oaPw: 4,
    obSaw: false, obPulse: true, obFine: 5.5, obPw: 6, obKb: true,
    mxOscA: 7, mxOscB: 7,
    fCut: 6.5, fRes: 1.5, fEnv: 2, fKb: 1,
    feA: 0.5, feD: 4, feS: 6, feR: 4,
    aeA: 0.5, aeD: 4, aeS: 8, aeR: 4,
    volume: 6.5,
  },
];

/* ════════════════════════════════════════════════════════════════════
   INTERACTIVE CONTROLS
   ═══════════════════════════════════════════════════════════════════ */

type DragKnobProps = {
  value: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  label?: string;
  sublabels?: string[];
  showValue?: boolean;
  symmetric?: boolean;
  defaultValue?: number;
  disabled?: boolean;
  uid?: string;
};

function DragKnob({
  value, onChange,
  min = 0, max = 10, step = 0.1,
  size = 44,
  label, sublabels,
  showValue = false,
  symmetric = false,
  defaultValue,
  disabled = false,
  uid,
}: DragKnobProps) {
  const id = useMemo(() => uid || "k" + Math.random().toString(36).slice(2, 8), [uid]);
  const knobRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{ startY: number; startVal: number; shift: boolean } | null>(null);

  const pct = (value - min) / (max - min);
  const angle = -135 + pct * 270;
  const r = size / 2;
  const pa = (angle - 90) * Math.PI / 180;

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { startY: e.clientY, startVal: value, shift: e.shiftKey };
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dy = drag.current.startY - e.clientY;
    const sensitivity = (e.shiftKey ? 0.4 : 1.5) * (max - min) / 200;
    let next = drag.current.startVal + dy * sensitivity;
    next = Math.max(min, Math.min(max, next));
    if (step) next = Math.round(next / step) * step;
    if (symmetric && Math.abs(next) < 0.15) next = 0;
    onChange?.(Number(next.toFixed(2)));
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    drag.current = null;
  };
  const onDoubleClick = () => {
    if (disabled) return;
    onChange?.(defaultValue ?? (symmetric ? 0 : (min + max) / 2));
  };

  const numTicks = 11;
  const ticks: React.ReactElement[] = [];
  for (let i = 0; i < numTicks; i++) {
    const tp = i / (numTicks - 1);
    const ta = (-135 + tp * 270 - 90) * Math.PI / 180;
    const major = i === 0 || i === numTicks - 1 || i === Math.floor((numTicks - 1) / 2);
    const tx1 = r + (r + 1) * Math.cos(ta);
    const ty1 = r + (r + 1) * Math.sin(ta);
    const tx2 = r + (r + (major ? 5 : 3.5)) * Math.cos(ta);
    const ty2 = r + (r + (major ? 5 : 3.5)) * Math.sin(ta);
    ticks.push(<line key={`t${i}`} x1={tx1} y1={ty1} x2={tx2} y2={ty2}
      stroke={CREAM_DIM} strokeWidth={major ? 0.8 : 0.5} />);
  }

  const labelEls: React.ReactElement[] = [];
  if (sublabels) {
    sublabels.forEach((sl, i) => {
      const tp = i / (sublabels.length - 1);
      const ta = (-135 + tp * 270 - 90) * Math.PI / 180;
      const lr = r + 11;
      labelEls.push(
        <text key={`l${i}`} x={r + lr * Math.cos(ta)} y={r + lr * Math.sin(ta) + 0.5}
          fill={sl === "" ? "transparent" : CREAM} fontSize={6.5}
          textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "'Barlow Condensed', 'Helvetica Neue', sans-serif", fontWeight: 600 }}>
          {sl}
        </text>
      );
    });
  } else {
    [0, 5, 10].forEach((n) => {
      const tp = (n - min) / (max - min);
      if (tp < 0 || tp > 1) return;
      const ta = (-135 + tp * 270 - 90) * Math.PI / 180;
      const lr = r + 11;
      labelEls.push(
        <text key={`l${n}`} x={r + lr * Math.cos(ta)} y={r + lr * Math.sin(ta) + 0.5}
          fill={CREAM} fontSize={6.5}
          textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "'Barlow Condensed', 'Helvetica Neue', sans-serif", fontWeight: 600 }}>
          {n}
        </text>
      );
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, userSelect: "none" }}>
      <svg width={size + 28} height={size + 28} viewBox={`-14 -14 ${size + 28} ${size + 28}`}
        style={{ cursor: disabled ? "not-allowed" : "ns-resize", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        ref={knobRef}>
        <defs>
          <radialGradient id={`kbody-${id}`} cx="38%" cy="32%">
            <stop offset="0%" stopColor="#2a2622" />
            <stop offset="50%" stopColor="#1a1814" />
            <stop offset="100%" stopColor="#08070a" />
          </radialGradient>
          <radialGradient id={`kcap-${id}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#e0dcd0" />
            <stop offset="40%" stopColor="#a8a49a" />
            <stop offset="100%" stopColor="#5a5650" />
          </radialGradient>
        </defs>
        {ticks}
        {labelEls}
        <circle cx={r} cy={r} r={r - 1} fill={`url(#kbody-${id})`} stroke="#0a0907" strokeWidth={0.5} />
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          return (
            <line key={`k${i}`} x1={r + (r - 4) * Math.cos(a)} y1={r + (r - 4) * Math.sin(a)}
              x2={r + (r - 1.5) * Math.cos(a)} y2={r + (r - 1.5) * Math.sin(a)}
              stroke="#080705" strokeWidth={0.4} opacity={0.7} />
          );
        })}
        <circle cx={r} cy={r} r={r * 0.62} fill={`url(#kcap-${id})`} stroke="#3a3833" strokeWidth={0.4} />
        <line x1={r + r * 0.55 * Math.cos(pa)} y1={r + r * 0.55 * Math.sin(pa)}
          x2={r + (r - 2.5) * Math.cos(pa)} y2={r + (r - 2.5) * Math.sin(pa)}
          stroke="#f5efe0" strokeWidth={1.6} strokeLinecap="round" />
        <circle cx={r - r * 0.15} cy={r - r * 0.18} r={r * 0.1} fill="#f0ece0" opacity={0.3} />
      </svg>
      {showValue && (
        <div style={{ fontSize: 7, color: "#E8A948", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginTop: -2 }}>
          {symmetric && value > 0 ? "+" : ""}{Number(value).toFixed(value === Math.floor(value) ? 0 : 1)}
        </div>
      )}
      {label && (
        <div style={{
          fontSize: 7, color: CREAM, textTransform: "uppercase", letterSpacing: 1,
          textAlign: "center", lineHeight: 1.05, fontWeight: 600, marginTop: 1,
          fontFamily: "'Barlow Condensed', 'Helvetica Neue', sans-serif",
        }}>{label}</div>
      )}
    </div>
  );
}

type RockerProps = {
  on: boolean;
  onClick?: () => void;
  label?: string;
  sublabel?: string;
  ledColor?: string;
  disabled?: boolean;
  w?: number;
  h?: number;
};

function RockerSwitch({ on, onClick, label, sublabel, ledColor = RED_LED, disabled = false, w = 18, h = 24 }: RockerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, userSelect: "none" }}>
      <div
        onClick={() => !disabled && onClick?.()}
        style={{
          width: w, height: h, borderRadius: 1.5,
          background: "linear-gradient(180deg,#1a1815 0%,#0a0907 50%,#000 100%)",
          border: "0.5px solid #2a2825",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
          padding: "2px 0",
          cursor: disabled ? "default" : "pointer",
          position: "relative", overflow: "hidden",
        }}>
        <div style={{
          width: 3, height: 3, borderRadius: "50%",
          background: on ? ledColor : "#3a0a08",
          boxShadow: on ? `0 0 4px ${ledColor}, 0 0 1px ${ledColor}` : "none",
        }} />
        <div style={{
          width: w - 3, height: 4,
          background: "linear-gradient(180deg,#9a9690 0%,#5a5650 50%,#2a2724 100%)",
          borderTop: "0.5px solid #b0aca0",
          marginBottom: 2,
        }} />
      </div>
      {label && (
        <div style={{
          fontSize: 6.5, color: CREAM, textTransform: "uppercase", letterSpacing: 0.6,
          textAlign: "center", lineHeight: 1, fontWeight: 600,
          fontFamily: "'Barlow Condensed', 'Helvetica Neue', sans-serif",
          maxWidth: w + 32,
        }}>
          {label}
        </div>
      )}
      {sublabel && (
        <div style={{
          fontSize: 5.5, color: CREAM_DIM, textTransform: "uppercase", letterSpacing: 0.4,
          textAlign: "center", lineHeight: 1, marginTop: -1,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>{sublabel}</div>
      )}
    </div>
  );
}

type DualLedProps = {
  value: number;
  onClick?: () => void;
  options: [string, string];
  label?: string;
  disabled?: boolean;
};

function DualLedToggle({ value, onClick, options, label, disabled = false }: DualLedProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, userSelect: "none" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 1 }}>
        {options.map((o, i) => (
          <span key={i} style={{
            fontSize: 6, color: value === i ? CREAM : CREAM_DIM,
            fontWeight: value === i ? 700 : 500,
            fontFamily: "'Barlow Condensed', 'Helvetica Neue', sans-serif",
            letterSpacing: 0.5,
          }}>{o}</span>
        ))}
      </div>
      <div
        onClick={() => !disabled && onClick?.()}
        style={{
          width: 22, height: 22, borderRadius: 1.5,
          background: "linear-gradient(180deg,#1a1815 0%,#0a0907 50%,#000 100%)",
          border: "0.5px solid #2a2825",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
          padding: "2px 0",
          cursor: disabled ? "default" : "pointer",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.5)",
        }}>
        <div style={{ display: "flex", gap: 2 }}>
          <div style={{
            width: 3, height: 3, borderRadius: "50%",
            background: value === 0 ? RED_LED : "#3a0a08",
            boxShadow: value === 0 ? `0 0 4px ${RED_LED}` : "none",
          }} />
          <div style={{
            width: 3, height: 3, borderRadius: "50%",
            background: value === 1 ? YEL_LED : "#3a3008",
            boxShadow: value === 1 ? `0 0 4px ${YEL_LED}` : "none",
          }} />
        </div>
        <div style={{
          width: 18, height: 4,
          background: "linear-gradient(180deg,#9a9690 0%,#5a5650 50%,#2a2724 100%)",
          borderTop: "0.5px solid #b0aca0",
          marginBottom: 1,
        }} />
      </div>
      {label && (
        <div style={{
          fontSize: 6.5, color: CREAM, textTransform: "uppercase", letterSpacing: 0.6,
          textAlign: "center", lineHeight: 1, fontWeight: 600,
          fontFamily: "'Barlow Condensed', 'Helvetica Neue', sans-serif",
        }}>{label}</div>
      )}
    </div>
  );
}

type ProgButtonProps = {
  on: boolean;
  onClick?: () => void;
  label?: string;
  sublabel?: string;
  isRecord?: boolean;
  disabled?: boolean;
};

function ProgButton({ on, onClick, label, sublabel, isRecord = false, disabled = false }: ProgButtonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, userSelect: "none" }}>
      {sublabel && (
        <div style={{
          fontSize: 5.5, color: CREAM_DIM, textAlign: "center", lineHeight: 1,
          letterSpacing: 0.3, marginBottom: 0,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>{sublabel}</div>
      )}
      <div
        onClick={() => !disabled && onClick?.()}
        style={{
          width: 22, height: 22, borderRadius: 1.5,
          background: isRecord
            ? "linear-gradient(180deg,#d83830 0%,#a01810 60%,#700808 100%)"
            : "linear-gradient(180deg,#b8b4ad 0%,#888480 50%,#605c58 100%)",
          border: isRecord ? "0.5px solid #5a0808" : "0.5px solid #4a4844",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          paddingTop: 3,
          cursor: disabled ? "default" : "pointer",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.5)",
        }}>
        <div style={{
          width: 3, height: 3, borderRadius: "50%",
          background: on ? RED_LED : "#3a0a08",
          boxShadow: on ? `0 0 5px ${RED_LED}, 0 0 1.5px ${RED_LED}` : "none",
        }} />
      </div>
      {label && (
        <div style={{
          fontSize: 6.5, color: CREAM, textTransform: "uppercase", letterSpacing: 0.5,
          textAlign: "center", lineHeight: 1, fontWeight: 600, marginTop: 1,
          fontFamily: "'Barlow Condensed', 'Helvetica Neue', sans-serif",
          maxWidth: 50,
        }}>{label}</div>
      )}
    </div>
  );
}

type WaveShape = "saw" | "saw2" | "triangle" | "pulse";

function WaveGlyph({ shape, size = 14, color = CREAM }: { shape: WaveShape; size?: number; color?: string }) {
  const d: Record<WaveShape, string> = {
    saw: "M2,12 L2,2 L11,12 Z M11,12 L11,2 L20,12 Z",
    saw2: "M2,12 L11,2 L11,12 L20,2 L20,12",
    triangle: "M2,12 L7,2 L12,12 L17,2 L22,12",
    pulse: "M2,12 L2,2 L11,2 L11,12 L20,12 L20,2",
  };
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 22 14">
      <path d={d[shape] || d.saw} stroke={color} strokeWidth={1.4} fill="none" strokeLinejoin="round" />
    </svg>
  );
}

function Section({ title, children, style }: { title?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "relative",
      border: `0.7px solid ${CREAM_DIM}`,
      borderRadius: 6,
      padding: "10px 8px 6px",
      ...style,
    }}>
      {title && (
        <div style={{
          position: "absolute", top: -5, left: 0, right: 0,
          display: "flex", justifyContent: "center", pointerEvents: "none",
        }}>
          <span style={{
            background: PANEL_BLACK, padding: "0 6px",
            fontSize: 7.5, color: CREAM, letterSpacing: 2.5, fontWeight: 700,
            textTransform: "uppercase",
            fontFamily: "'Barlow Condensed', 'Helvetica Neue', sans-serif",
          }}>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}

function GroupCaption({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute", bottom: -3, left: 0, right: 0,
      display: "flex", justifyContent: "center", pointerEvents: "none", ...style,
    }}>
      <span style={{
        background: PANEL_BLACK, padding: "0 5px",
        fontSize: 6, color: CREAM, letterSpacing: 1.2, fontWeight: 600,
        fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase",
      }}>{children}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PANEL SECTIONS
   ═══════════════════════════════════════════════════════════════════ */

type SectionPropsBase = { p: Patch; set: (changes: Partial<Patch>) => void; locked?: boolean };

function PolyMod({ p, set }: SectionPropsBase) {
  return (
    <Section title="POLY-MOD" style={{ height: 86, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", paddingLeft: 4, paddingRight: 4 }}>
        <div style={{ display: "flex", gap: 4, position: "relative" }}>
          <DragKnob value={p.pmFiltEnv} onChange={v => set({ pmFiltEnv: v })} size={32} />
          <DragKnob value={p.pmOscB} onChange={v => set({ pmOscB: v })} size={32} />
        </div>
        <div style={{ position: "absolute", left: 8, bottom: 14, fontSize: 5.5, color: CREAM, letterSpacing: 0.5, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>FILT ENV</div>
        <div style={{ position: "absolute", left: 50, bottom: 14, fontSize: 5.5, color: CREAM, letterSpacing: 0.5, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>OSC B</div>
        <GroupCaption>SOURCE AMOUNT</GroupCaption>
        <div style={{ display: "flex", gap: 6 }}>
          <RockerSwitch on={p.pmDestFreqA} onClick={() => set({ pmDestFreqA: !p.pmDestFreqA })} label="FREQ A" />
          <RockerSwitch on={p.pmDestPwA} onClick={() => set({ pmDestPwA: !p.pmDestPwA })} label="PW A" />
          <RockerSwitch on={p.pmDestFilter} onClick={() => set({ pmDestFilter: !p.pmDestFilter })} label="FILTER" />
        </div>
      </div>
    </Section>
  );
}

function LFO({ p, set }: SectionPropsBase) {
  return (
    <Section title="LFO" style={{ height: 80, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", paddingLeft: 4, paddingRight: 4 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <DragKnob value={p.lfoInit} onChange={v => set({ lfoInit: v })} size={32} label="INITIAL AMOUNT" />
          <DragKnob value={p.lfoFreq} onChange={v => set({ lfoFreq: v })} size={32} label="FREQUENCY" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <WaveGlyph shape="saw2" size={11} />
            <WaveGlyph shape="triangle" size={11} />
            <WaveGlyph shape="pulse" size={11} />
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <RockerSwitch on={p.lfoSaw} onClick={() => set({ lfoSaw: !p.lfoSaw })} w={14} h={20} />
            <RockerSwitch on={p.lfoTri} onClick={() => set({ lfoTri: !p.lfoTri })} w={14} h={20} />
            <RockerSwitch on={p.lfoSq} onClick={() => set({ lfoSq: !p.lfoSq })} w={14} h={20} />
          </div>
          <div style={{ fontSize: 6, color: CREAM, letterSpacing: 1.2, marginTop: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>SHAPE</div>
        </div>
      </div>
    </Section>
  );
}

function WheelMod({ p, set }: SectionPropsBase) {
  return (
    <Section title="WHEEL-MOD" style={{ height: 78, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", height: "100%", paddingLeft: 4, paddingRight: 4, gap: 6 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <DragKnob
            value={p.wmSrcMix}
            onChange={v => set({ wmSrcMix: v })}
            min={-5} max={5} symmetric
            sublabels={["5", "3", "1", "0", "1", "3", "5"]}
            size={28}
            defaultValue={0}
          />
          <div style={{ display: "flex", gap: 18, fontSize: 5.5, color: CREAM, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, marginTop: -2, letterSpacing: 0.4 }}>
            <span>LFO</span><span>NOISE</span>
          </div>
          <div style={{ fontSize: 6, color: CREAM, letterSpacing: 1, marginTop: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>SOURCE MIX</div>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-start", paddingTop: 4 }}>
          <RockerSwitch on={p.wmDestFreqA} onClick={() => set({ wmDestFreqA: !p.wmDestFreqA })} label="FREQ A" />
          <RockerSwitch on={p.wmDestFreqB} onClick={() => set({ wmDestFreqB: !p.wmDestFreqB })} label="FREQ B" />
          <RockerSwitch on={p.wmDestPwA} onClick={() => set({ wmDestPwA: !p.wmDestPwA })} label="PW A" />
          <RockerSwitch on={p.wmDestPwB} onClick={() => set({ wmDestPwB: !p.wmDestPwB })} label="PW B" />
          <RockerSwitch on={p.wmDestFilter} onClick={() => set({ wmDestFilter: !p.wmDestFilter })} label="FILTER" />
        </div>
      </div>
      <GroupCaption style={{ right: -120, left: "auto", bottom: -3 }}>DESTINATION</GroupCaption>
    </Section>
  );
}

function OscillatorA({ p, set }: SectionPropsBase) {
  return (
    <Section title="OSCILLATOR A" style={{ height: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: "100%", padding: "0 4px" }}>
        <DragKnob value={p.oaFreq} onChange={v => set({ oaFreq: v })} size={36} label="FREQUENCY" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <WaveGlyph shape="saw2" size={11} />
            <WaveGlyph shape="pulse" size={11} />
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <RockerSwitch on={p.oaSaw} onClick={() => set({ oaSaw: !p.oaSaw })} w={14} h={20} />
            <RockerSwitch on={p.oaPulse} onClick={() => set({ oaPulse: !p.oaPulse })} w={14} h={20} />
          </div>
          <div style={{ fontSize: 6, color: CREAM, letterSpacing: 1, marginTop: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>SHAPE</div>
        </div>
        <DragKnob value={p.oaPw} onChange={v => set({ oaPw: v })} size={36} label="PULSE WIDTH" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <RockerSwitch on={p.oaSync} onClick={() => set({ oaSync: !p.oaSync })} label="SYNC" />
        </div>
      </div>
    </Section>
  );
}

function OscillatorB({ p, set }: SectionPropsBase) {
  return (
    <Section title="OSCILLATOR B" style={{ height: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, height: "100%", padding: "0 4px" }}>
        <DragKnob value={p.obFreq} onChange={v => set({ obFreq: v })} size={34} label="FREQUENCY" />
        <DragKnob value={p.obFine} onChange={v => set({ obFine: v })} size={34} label="FINE" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <div style={{ display: "flex", gap: 3 }}>
            <WaveGlyph shape="saw2" size={11} />
            <WaveGlyph shape="triangle" size={11} />
            <WaveGlyph shape="pulse" size={11} />
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            <RockerSwitch on={p.obSaw} onClick={() => set({ obSaw: !p.obSaw })} w={14} h={20} />
            <RockerSwitch on={p.obTri} onClick={() => set({ obTri: !p.obTri })} w={14} h={20} />
            <RockerSwitch on={p.obPulse} onClick={() => set({ obPulse: !p.obPulse })} w={14} h={20} />
          </div>
          <div style={{ fontSize: 6, color: CREAM, letterSpacing: 1, marginTop: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>SHAPE</div>
        </div>
        <DragKnob value={p.obPw} onChange={v => set({ obPw: v })} size={34} label="PULSE WIDTH" />
        <RockerSwitch on={p.obLo} onClick={() => set({ obLo: !p.obLo })} label="LO FREQ" />
        <RockerSwitch on={p.obKb} onClick={() => set({ obKb: !p.obKb })} label="KEYBOARD" />
      </div>
    </Section>
  );
}

function Mixer({ p, set }: SectionPropsBase) {
  return (
    <Section title="MIXER" style={{ height: 80 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: 4, height: "100%", padding: "0 6px" }}>
        <DragKnob value={p.mxOscA} onChange={v => set({ mxOscA: v })} size={34} label="OSC A" />
        <DragKnob value={p.mxOscB} onChange={v => set({ mxOscB: v })} size={34} label="OSC B" />
        <DragKnob value={p.mxNoise} onChange={v => set({ mxNoise: v })} size={34} label="NOISE" />
      </div>
    </Section>
  );
}

function FilterTop({ p, set }: SectionPropsBase) {
  return (
    <Section title="FILTER" style={{ height: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, height: "100%", padding: "0 4px" }}>
        <DualLedToggle value={p.fRev} onClick={() => set({ fRev: p.fRev === 0 ? 1 : 0 })}
          options={["1/2", "3"]} label="REV" />
        <DragKnob value={p.fCut} onChange={v => set({ fCut: v })} size={36} label="CUTOFF" />
        <DragKnob value={p.fRes} onChange={v => set({ fRes: v })} size={36} label="RESONANCE" />
        <DragKnob value={p.fEnv} onChange={v => set({ fEnv: v })} size={36} label="ENVELOPE AMOUNT" />
        <DualLedToggle value={p.fKb === 2 ? 1 : 0} onClick={() => set({ fKb: p.fKb === 0 ? 1 : p.fKb === 1 ? 2 : 0 })}
          options={["HALF", "FULL"]} label="KEYBOARD" />
      </div>
    </Section>
  );
}

function FilterEnvelope({ p, set }: SectionPropsBase) {
  return (
    <div style={{
      border: `0.7px solid ${CREAM_DIM}`,
      borderTop: "none",
      borderRadius: "0 0 6px 6px",
      padding: "8px 8px 6px",
      height: 80,
      borderTopLeftRadius: 0, borderTopRightRadius: 0,
      marginTop: -1,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: 4, height: "100%" }}>
        <DragKnob value={p.feA} onChange={v => set({ feA: v })} size={32} label="ATTACK" />
        <DragKnob value={p.feD} onChange={v => set({ feD: v })} size={32} label="DECAY" />
        <DragKnob value={p.feS} onChange={v => set({ feS: v })} size={32} label="SUSTAIN" />
        <DragKnob value={p.feR} onChange={v => set({ feR: v })} size={32} label="RELEASE" />
      </div>
    </div>
  );
}

function Vintage({ p, set }: SectionPropsBase) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: 4 }}>
      <DragKnob
        value={p.vintage}
        onChange={v => set({ vintage: Math.round(Math.max(1, Math.min(4, v))) })}
        min={1} max={4} step={1}
        sublabels={["1", "", "", "", "2", "", "", "", "3", "", "", "", "4"].slice(0, 11)}
        size={28}
        showValue
      />
      <div style={{ fontSize: 7, color: CREAM, letterSpacing: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>VINTAGE</div>
    </div>
  );
}

function Amplifier({ p, set }: SectionPropsBase) {
  return (
    <Section title="AMPLIFIER" style={{ height: 80 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: 4, height: "100%", padding: "0 4px" }}>
        <DragKnob value={p.aeA} onChange={v => set({ aeA: v })} size={32} label="ATTACK" />
        <DragKnob value={p.aeD} onChange={v => set({ aeD: v })} size={32} label="DECAY" />
        <DragKnob value={p.aeS} onChange={v => set({ aeS: v })} size={32} label="SUSTAIN" />
        <DragKnob value={p.aeR} onChange={v => set({ aeR: v })} size={32} label="RELEASE" />
      </div>
    </Section>
  );
}

function MasterCluster({ p, set }: SectionPropsBase) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 4 }}>
      <DragKnob
        value={p.masterTune} onChange={v => set({ masterTune: v })}
        min={-5} max={5} symmetric size={32} label="MASTER TUNE"
        sublabels={["5","4","3","2","1","0","1","2","3","4","5"]}
        defaultValue={0}
      />
      <RockerSwitch on={p.a440} onClick={() => set({ a440: !p.a440 })} label="A440" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <div style={{ display: "flex", gap: 3 }}>
          <span style={{ fontSize: 5.5, color: p.velFilt ? CREAM : CREAM_DIM, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: 0.4 }}>FILT</span>
          <span style={{ fontSize: 5.5, color: p.velAmp ? CREAM : CREAM_DIM, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: 0.4 }}>AMP</span>
        </div>
        <div onClick={() => {
          if (!p.velFilt && !p.velAmp) set({ velFilt: true, velAmp: false });
          else if (p.velFilt && !p.velAmp) set({ velFilt: false, velAmp: true });
          else if (!p.velFilt && p.velAmp) set({ velFilt: true, velAmp: true });
          else set({ velFilt: false, velAmp: false });
        }} style={{
          width: 22, height: 22, borderRadius: 1.5,
          background: "linear-gradient(180deg,#1a1815,#0a0907 50%,#000)",
          border: "0.5px solid #2a2825",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
          padding: "2px 0", cursor: "pointer",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", gap: 2 }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: p.velFilt ? RED_LED : "#3a0a08", boxShadow: p.velFilt ? `0 0 4px ${RED_LED}` : "none" }} />
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: p.velAmp ? YEL_LED : "#3a3008", boxShadow: p.velAmp ? `0 0 4px ${YEL_LED}` : "none" }} />
          </div>
          <div style={{ width: 18, height: 4, background: "linear-gradient(180deg,#9a9690,#5a5650 50%,#2a2724)", borderTop: "0.5px solid #b0aca0", marginBottom: 1 }} />
        </div>
        <div style={{ fontSize: 6.5, color: CREAM, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: 0.6 }}>VELOCITY</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <div style={{ display: "flex", gap: 3 }}>
          <span style={{ fontSize: 5.5, color: p.atFilt ? CREAM : CREAM_DIM, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: 0.4 }}>FILT</span>
          <span style={{ fontSize: 5.5, color: p.atLfo ? CREAM : CREAM_DIM, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: 0.4 }}>LFO</span>
        </div>
        <div onClick={() => {
          if (!p.atFilt && !p.atLfo) set({ atFilt: true, atLfo: false });
          else if (p.atFilt && !p.atLfo) set({ atFilt: false, atLfo: true });
          else if (!p.atFilt && p.atLfo) set({ atFilt: true, atLfo: true });
          else set({ atFilt: false, atLfo: false });
        }} style={{
          width: 22, height: 22, borderRadius: 1.5,
          background: "linear-gradient(180deg,#1a1815,#0a0907 50%,#000)",
          border: "0.5px solid #2a2825",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
          padding: "2px 0", cursor: "pointer",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", gap: 2 }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: p.atFilt ? RED_LED : "#3a0a08", boxShadow: p.atFilt ? `0 0 4px ${RED_LED}` : "none" }} />
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: p.atLfo ? YEL_LED : "#3a3008", boxShadow: p.atLfo ? `0 0 4px ${YEL_LED}` : "none" }} />
          </div>
          <div style={{ width: 18, height: 4, background: "linear-gradient(180deg,#9a9690,#5a5650 50%,#2a2724)", borderTop: "0.5px solid #b0aca0", marginBottom: 1 }} />
        </div>
        <div style={{ fontSize: 6.5, color: CREAM, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: 0.6 }}>AFTERTOUCH</div>
      </div>
    </div>
  );
}

function GlideUnison({ p, set }: SectionPropsBase) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px" }}>
      <DragKnob value={p.glideRate} onChange={v => set({ glideRate: v })} size={32} label="GLIDE RATE" />
      <RockerSwitch on={p.unison} onClick={() => set({ unison: !p.unison })} label="UNISON" />
    </div>
  );
}

function OutputCluster({ p, set }: SectionPropsBase) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "4px 6px", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <RockerSwitch on={p.releaseHold === 1} onClick={() => set({ releaseHold: p.releaseHold === 0 ? 1 : 0 })} label="RELEASE" sublabel="HOLD" />
        <DragKnob value={p.volume} onChange={v => set({ volume: v })} size={34} label="VOLUME" />
        <ProgButton on={false} onClick={() => {}} label="TUNE" />
      </div>
    </div>
  );
}

function LedDisplay({ value }: { value: string }) {
  return (
    <div style={{
      background: "linear-gradient(180deg,#1a0000,#0a0000)",
      border: "1px solid #2a0000",
      borderRadius: 3,
      padding: "4px 10px",
      boxShadow: "inset 0 0 8px rgba(255,40,40,0.1), inset 0 1px 1px rgba(0,0,0,0.8)",
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono','Geist Mono','Courier New',monospace",
        fontSize: 18, color: "#FF2D20", fontWeight: 700, letterSpacing: 4,
        textShadow: "0 0 6px #FF2D20, 0 0 2px #FF2D20",
      }}>{String(value).padStart(3, "0")}</span>
    </div>
  );
}

type ProgrammerProps = SectionPropsBase & {
  group: string; bank: string; prgm: string;
  onProgramSelect: (n: number) => void;
  onFactoryToggle: () => void;
  onRecord: () => void;
  recording: boolean;
  factoryMode: boolean;
};

function Programmer({ p, set, group, bank, prgm, onProgramSelect, onFactoryToggle, onRecord, recording, factoryMode }: ProgrammerProps) {
  const programs = [1, 2, 3, 4, 5, 6, 7, 8];
  const sublabels = ["Pot Mode", "Release", "Pedal Mode", "Alt Tuning", "Vel Response", "AT Response", "Pgm Dump", "Local Ctrl"];
  const upperLabels = ["Transpose", "MIDI Channel", "Param Xmit", "Param Rcv", "MIDI Control", "MIDI SysEx", "MIDI Out", ""];
  const prgmNum = Number(prgm) || 1;
  return (
    <Section title="PROGRAMMER" style={{ height: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, height: "100%", padding: "0 4px" }}>
        <ProgButton on={p.presetMode} onClick={() => set({ presetMode: !p.presetMode })} label="PRESET" />
        <ProgButton on={recording} onClick={onRecord} label="RECORD" isRecord />
        <ProgButton on={factoryMode} onClick={onFactoryToggle} label="FACTORY" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: 5.5, color: CREAM_DIM, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 0.5 }}>Dec/-</span>
          <ProgButton on={false} onClick={() => onProgramSelect(prgmNum > 1 ? prgmNum - 1 : 8)} label="GROUP" sublabel="SELECT" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: 5.5, color: CREAM_DIM, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 0.5 }}>Inc/+</span>
          <ProgButton on={false} onClick={() => onProgramSelect(prgmNum < 8 ? prgmNum + 1 : 1)} label="BANK" sublabel="SELECT" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <LedDisplay value={`${group}${bank}${prgm}`} />
          <div style={{ fontSize: 5.5, color: CREAM_DIM, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 0.5, fontWeight: 600, marginTop: 1 }}>GROUP|BANK|PRGM</div>
        </div>
        <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
          {programs.map((n, i) => (
            <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              {upperLabels[i] && <span style={{ fontSize: 5, color: CREAM_DIM, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 0.3, lineHeight: 1 }}>{upperLabels[i]}</span>}
              <ProgButton on={prgmNum === n} onClick={() => onProgramSelect(n)} label={String(n)} sublabel={sublabels[i]} />
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, marginLeft: 2 }}>
            <span style={{ fontSize: 5, color: CREAM_DIM, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 0.3 }}>Local Ctrl</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 1.5,
                background: "linear-gradient(180deg,#b8b4ad,#888480 50%,#605c58)",
                border: "0.5px solid #4a4844", display: "flex", alignItems: "flex-start", justifyContent: "center",
                paddingTop: 3, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.5)",
              }}>
                <div style={{ display: "flex", gap: 1.5 }}>
                  <div style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: RED_LED, boxShadow: `0 0 3px ${RED_LED}` }} />
                  <div style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: YEL_LED, boxShadow: `0 0 3px ${YEL_LED}` }} />
                </div>
              </div>
              <span style={{ fontSize: 6.5, color: CREAM, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 0.5, fontWeight: 600 }}>GLOBALS</span>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: -4, right: 80, background: PANEL_BLACK, padding: "0 5px", fontSize: 6, color: CREAM, letterSpacing: 1.2, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, textTransform: "uppercase" }}>PROGRAM SELECT</div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FULL PANEL COMPOSITION
   ═══════════════════════════════════════════════════════════════════ */

type ProphetPanelProps = {
  patch: Patch;
  update: (changes: Partial<Patch>) => void;
  locked?: boolean;
  group: string; bank: string; prgm: string;
  onProgramSelect: (n: number) => void;
  factoryMode: boolean;
  onFactoryToggle: () => void;
  recording: boolean;
  onRecord: () => void;
};

function ProphetPanel({ patch, update, locked, group, bank, prgm, onProgramSelect, factoryMode, onFactoryToggle, recording, onRecord }: ProphetPanelProps) {
  const set = useCallback((changes: Partial<Patch>) => {
    if (locked) return;
    update(changes);
  }, [update, locked]);

  return (
    <div style={{
      background: `linear-gradient(180deg,${WALNUT_LIGHT} 0%,${WALNUT_DARK} 5%,${WALNUT_DARK} 92%,${WALNUT_LIGHT} 100%)`,
      padding: "16px 18px 28px",
      borderRadius: 6,
      boxShadow: "0 16px 50px rgba(0,0,0,0.55), inset 0 0 24px rgba(0,0,0,0.5)",
      position: "relative",
      overflowX: "auto",
    }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 6, pointerEvents: "none",
        background: "repeating-linear-gradient(90deg,transparent 0,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px),radial-gradient(ellipse at 30% 50%,rgba(255,150,80,0.05),transparent 70%),radial-gradient(ellipse at 75% 30%,rgba(180,90,40,0.04),transparent 60%)",
        mixBlendMode: "overlay",
      }} />

      <div style={{
        background: `linear-gradient(180deg,${PANEL_BLACK} 0%,#0a0a08 100%)`,
        minWidth: 1280,
        padding: "12px 14px",
        position: "relative",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 6px rgba(0,0,0,0.6)",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.025),transparent 60%)",
          mixBlendMode: "overlay",
        }} />

        <div style={{ position: "relative", width: "100%", minHeight: 248 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 218 }}>
            <PolyMod p={patch} set={set} />
            <div style={{ marginTop: 4 }}>
              <LFO p={patch} set={set} />
            </div>
            <div style={{ marginTop: 4 }}>
              <WheelMod p={patch} set={set} />
            </div>
          </div>

          <div style={{ position: "absolute", left: 230, top: 0, width: 240 }}>
            <OscillatorA p={patch} set={set} />
          </div>

          <div style={{ position: "absolute", left: 230, top: 90, width: 360 }}>
            <OscillatorB p={patch} set={set} />
          </div>

          <div style={{ position: "absolute", left: 480, top: 0, width: 158 }}>
            <Mixer p={patch} set={set} />
          </div>

          <div style={{ position: "absolute", left: 600, top: 100, width: 60 }}>
            <Vintage p={patch} set={set} />
          </div>

          <div style={{ position: "absolute", left: 670, top: 0, width: 290 }}>
            <FilterTop p={patch} set={set} />
            <FilterEnvelope p={patch} set={set} />
          </div>

          <div style={{ position: "absolute", left: 980, top: 0, width: 280 }}>
            <MasterCluster p={patch} set={set} />
          </div>

          <div style={{ position: "absolute", left: 980, top: 90, width: 280 }}>
            <Amplifier p={patch} set={set} />
          </div>

          <div style={{ position: "absolute", left: 230, top: 178, width: 110 }}>
            <GlideUnison p={patch} set={set} />
          </div>

          <div style={{ position: "absolute", left: 350, top: 178, width: 620 }}>
            <Programmer
              p={patch} set={set}
              group={group} bank={bank} prgm={prgm}
              onProgramSelect={onProgramSelect}
              onFactoryToggle={onFactoryToggle}
              factoryMode={factoryMode}
              recording={recording}
              onRecord={onRecord}
            />
          </div>

          <div style={{ position: "absolute", left: 980, top: 178, width: 280 }}>
            <OutputCluster p={patch} set={set} />
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", right: 36, bottom: 8,
        background: "linear-gradient(135deg,#c8c4ba 0%,#9c9890 50%,#6c6862 100%)",
        padding: "4px 14px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.5)",
        borderRadius: 1,
      }}>
        <span style={{
          fontFamily: "Georgia,'Times New Roman',serif",
          fontSize: 13, color: "#1a1410", letterSpacing: 0.5, fontWeight: 700,
          fontStyle: "italic",
        }}>prophet&nbsp;~&nbsp;5</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PATCH INFO + SAVE MODAL + SOUND BANK
   ═══════════════════════════════════════════════════════════════════ */

function PatchInfo({ patch }: { patch: Patch }) {
  const isFactory = patch.isFactory;
  const oaShape = patch.oaSaw && patch.oaPulse ? "Saw+Pulse" : patch.oaSaw ? "Sawtooth" : patch.oaPulse ? "Pulse" : "Off";
  const obShapes = [patch.obSaw && "Saw", patch.obTri && "Tri", patch.obPulse && "Pulse"].filter(Boolean).join("+") || "Off";
  const fineCents = Math.round((patch.obFine - 5) * 14);
  const polyMod = (patch.pmFiltEnv > 0 || patch.pmOscB > 0)
    ? `${patch.pmFiltEnv > 0 ? `FiltEnv ${patch.pmFiltEnv.toFixed(1)}` : ""}${patch.pmFiltEnv > 0 && patch.pmOscB > 0 ? " · " : ""}${patch.pmOscB > 0 ? `OscB ${patch.pmOscB.toFixed(1)}` : ""}${patch.pmDestFreqA ? " → FreqA" : ""}${patch.pmDestPwA ? " → PwA" : ""}${patch.pmDestFilter ? " → Filter" : ""}`
    : "Inactive";
  const filterChar = patch.fCut > 6.5 ? "Bright" : patch.fCut > 4.5 ? "Open" : patch.fCut > 2.5 ? "Warm" : "Dark";

  return (
    <div style={{
      background: "linear-gradient(180deg,#1a1612 0%,#15110d 100%)",
      border: "1px solid rgba(232,169,72,0.18)",
      borderRadius: 8, padding: "14px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 8, color: "#E8A948", letterSpacing: 3, fontWeight: 700, marginBottom: 3, fontFamily: "'Barlow Condensed','Helvetica Neue',sans-serif" }}>
            {isFactory ? "FACTORY PATCH" : "USER PATCH"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif", fontSize: 24, color: "#F5E6C8", fontWeight: 600, lineHeight: 1.05, letterSpacing: -0.3 }}>
            {patch.name}
            {patch.artist && <span style={{ fontWeight: 400, fontStyle: "italic", fontSize: 17, color: "#A89868" }}> — {patch.artist}</span>}
          </h2>
          {patch.album && (
            <div style={{ fontSize: 11, color: "#7a7060", marginTop: 2, fontStyle: "italic" }}>
              {patch.album}{patch.year ? `, ${patch.year}` : ""}
            </div>
          )}
        </div>
      </div>
      {patch.description && (
        <p style={{ fontSize: 12.5, color: "#B0A580", lineHeight: 1.55, marginTop: 8 }}>{patch.description}</p>
      )}
      {patch.tips && (
        <div style={{
          marginTop: 10, padding: "7px 11px",
          background: "rgba(232,169,72,0.05)", borderLeft: "2px solid rgba(232,169,72,0.4)",
          borderRadius: 3, fontSize: 11.5, color: "#C0B080", lineHeight: 1.5,
        }}>
          <b style={{ color: "#E8A948", letterSpacing: 1, fontSize: 9 }}>PERFORMANCE TIPS &nbsp;</b>{patch.tips}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 10 }}>
        <div style={{ background: "#16130f", borderLeft: "2px solid rgba(232,169,72,0.5)", padding: "6px 8px", borderRadius: 3 }}>
          <div style={{ fontSize: 8, color: "#E8A948", fontWeight: 700, letterSpacing: 0.8 }}>OSC A</div>
          <div style={{ fontSize: 10, color: "#A89868", marginTop: 1 }}>{oaShape}{patch.oaSync ? " · SYNC" : ""}</div>
        </div>
        <div style={{ background: "#16130f", borderLeft: "2px solid rgba(232,169,72,0.5)", padding: "6px 8px", borderRadius: 3 }}>
          <div style={{ fontSize: 8, color: "#E8A948", fontWeight: 700, letterSpacing: 0.8 }}>OSC B</div>
          <div style={{ fontSize: 10, color: "#A89868", marginTop: 1 }}>{obShapes}{fineCents !== 0 ? ` · ${fineCents > 0 ? "+" : ""}${fineCents}¢` : ""}{patch.obLo ? " · LO" : ""}</div>
        </div>
        <div style={{ background: "#16130f", borderLeft: "2px solid rgba(232,90,60,0.5)", padding: "6px 8px", borderRadius: 3 }}>
          <div style={{ fontSize: 8, color: "#E85A3C", fontWeight: 700, letterSpacing: 0.8 }}>FILTER</div>
          <div style={{ fontSize: 10, color: "#A89868", marginTop: 1 }}>
            {patch.fRev === 0 ? "Rev1/2" : "Rev3"} · {filterChar} · Res {patch.fRes.toFixed(1)}
          </div>
        </div>
        <div style={{ background: "#16130f", borderLeft: "2px solid rgba(107,142,232,0.5)", padding: "6px 8px", borderRadius: 3 }}>
          <div style={{ fontSize: 8, color: "#6B8EE8", fontWeight: 700, letterSpacing: 0.8 }}>POLY-MOD</div>
          <div style={{ fontSize: 10, color: "#A89868", marginTop: 1, lineHeight: 1.3 }}>{polyMod}</div>
        </div>
      </div>
    </div>
  );
}

function SaveModal({ open, defaultName, onCancel, onSave }: { open: boolean; defaultName?: string; onCancel: () => void; onSave: (n: string) => void }) {
  const [name, setName] = useState(defaultName || "");
  useEffect(() => { setName(defaultName || ""); }, [defaultName, open]);
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#1a1612", border: "1px solid rgba(232,169,72,0.2)",
        borderRadius: 8, padding: 20, minWidth: 380, maxWidth: "90vw",
      }}>
        <div style={{ fontSize: 8, color: "#E8A948", letterSpacing: 2.5, fontWeight: 700, marginBottom: 6, fontFamily: "'Barlow Condensed',sans-serif" }}>SAVE TO BANK</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F5E6C8", fontWeight: 600, marginBottom: 12 }}>Name your patch</h3>
        <input
          autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && name.trim()) onSave(name.trim()); if (e.key === "Escape") onCancel(); }}
          placeholder="e.g. Warm Saw Bass"
          style={{
            width: "100%", background: "#0e0c09", border: "1px solid rgba(232,169,72,0.25)",
            borderRadius: 4, padding: "9px 12px", color: "#F5E6C8", fontSize: 13,
            outline: "none", fontFamily: "inherit",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
          <button onClick={onCancel} style={{
            background: "transparent", border: "1px solid #4a4438", borderRadius: 4,
            padding: "7px 16px", color: "#998870", fontSize: 11, cursor: "pointer", fontWeight: 600, letterSpacing: 0.5,
          }}>Cancel</button>
          <button onClick={() => name.trim() && onSave(name.trim())} disabled={!name.trim()} style={{
            background: name.trim() ? "linear-gradient(135deg,#E8A948,#C4882A)" : "#332e24",
            border: "none", borderRadius: 4, padding: "7px 18px",
            color: name.trim() ? "#1a1410" : "#665c44", fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
            cursor: name.trim() ? "pointer" : "not-allowed", textTransform: "uppercase",
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}

type SoundBankProps = {
  patches: Patch[];
  currentId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
};

function SoundBank({ patches, currentId, onSelect, onDelete, onNew }: SoundBankProps) {
  const factories = patches.filter(p => p.isFactory);
  const customs = patches.filter(p => !p.isFactory);
  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontSize: 8.5, color: "#E8A948", letterSpacing: 3, fontWeight: 700,
          margin: "4px 4px 6px", fontFamily: "'Barlow Condensed',sans-serif",
        }}>FACTORY · ICONIC RECORDINGS</div>
        {factories.map((p, i) => {
          const active = p.id === currentId;
          return (
            <button key={p.id} onClick={() => p.id && onSelect(p.id)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              background: active ? "linear-gradient(90deg,rgba(232,169,72,0.12),rgba(232,169,72,0.04))" : "#141210",
              border: `1px solid ${active ? "rgba(232,169,72,0.4)" : "rgba(232,169,72,0.06)"}`,
              borderRadius: 5, padding: "8px 14px", cursor: "pointer", textAlign: "left",
              marginBottom: 3, transition: "all 0.15s",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: active ? "linear-gradient(135deg,#E8A948,#C4882A)" : "#251f15",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 800,
                color: active ? "#1a1410" : "#665c44",
                fontFamily: "'JetBrains Mono',monospace",
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: active ? "#F5E6C8" : "#bba888", fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 0.2 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 9.5, color: active ? "#B09060" : "#665c44", marginTop: 1, fontStyle: "italic" }}>
                  {p.artist} · {p.album}{p.year ? `, ${p.year}` : ""}
                </div>
              </div>
              {active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#E8A948", boxShadow: "0 0 6px #E8A948" }} />}
            </button>
          );
        })}
      </div>
      <div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          margin: "10px 4px 6px",
        }}>
          <div style={{ fontSize: 8.5, color: "#E8A948", letterSpacing: 3, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif" }}>
            USER BANK {customs.length > 0 ? `· ${customs.length}` : ""}
          </div>
          <button onClick={onNew} style={{
            background: "transparent", border: "1px solid rgba(232,169,72,0.3)", borderRadius: 3,
            padding: "3px 9px", fontSize: 9, color: "#E8A948", cursor: "pointer", fontWeight: 600, letterSpacing: 0.5,
          }}>+ NEW</button>
        </div>
        {customs.length === 0 && (
          <div style={{
            padding: "16px 14px", textAlign: "center", borderRadius: 5,
            border: "1px dashed rgba(232,169,72,0.18)", color: "#665c44",
            fontSize: 11, fontStyle: "italic",
          }}>
            Dial in the panel and hit <b style={{ color: "#9a8050", fontStyle: "normal" }}>RECORD</b> to save your first patch.
          </div>
        )}
        {customs.map((p, i) => {
          const active = p.id === currentId;
          return (
            <div key={p.id} style={{ display: "flex", marginBottom: 3 }}>
              <button onClick={() => p.id && onSelect(p.id)} style={{
                display: "flex", alignItems: "center", gap: 12, flex: 1,
                background: active ? "linear-gradient(90deg,rgba(232,169,72,0.12),rgba(232,169,72,0.04))" : "#141210",
                border: `1px solid ${active ? "rgba(232,169,72,0.4)" : "rgba(232,169,72,0.06)"}`,
                borderRight: "none", borderRadius: "5px 0 0 5px",
                padding: "8px 14px", cursor: "pointer", textAlign: "left",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: active ? "linear-gradient(135deg,#E8A948,#C4882A)" : "#251f15",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: active ? "#1a1410" : "#665c44", fontFamily: "'JetBrains Mono',monospace",
                  flexShrink: 0,
                }}>U{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: active ? "#F5E6C8" : "#bba888", fontWeight: 600, fontFamily: "'Cormorant Garamond',serif" }}>
                    {p.name}
                  </div>
                  {p.description && (
                    <div style={{ fontSize: 9.5, color: active ? "#B09060" : "#665c44", marginTop: 1, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.description}
                    </div>
                  )}
                </div>
              </button>
              <button onClick={() => p.id && onDelete(p.id)} title="Delete" style={{
                background: "#141210", border: "1px solid rgba(232,169,72,0.06)",
                borderLeft: "none", borderRadius: "0 5px 5px 0",
                padding: "0 12px", cursor: "pointer", color: "#665c44", fontSize: 13,
              }}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PATCH LAB — Live Claude API chat (via /api/chat proxy)
   ═══════════════════════════════════════════════════════════════════ */

const CHAT_SYSTEM = `You are an expert on the Sequential Prophet-5 Rev 4, an analog polyphonic synthesizer reissued by Sequential in 2020 (faithful to the original 1978-1984 Prophet-5 Rev 1/2/3).

KEY ARCHITECTURE:
- 5-voice polyphonic, 2 oscillators per voice + noise
- Oscillator A: saw or pulse (or both), pulse width, sync to Osc B
- Oscillator B: saw, triangle, or pulse (or any combo), fine tune, low-frequency mode, keyboard tracking
- Mixer: Osc A, Osc B, Noise levels into the filter
- Filter: 24 dB/oct lowpass — Rev 1/2 (SSI 2140) or Rev 3 (Curtis CEM3320), with cutoff/resonance/envelope amount, half/full keyboard tracking, REV switch to invert envelope
- Filter Envelope (ADSR) and Amplifier Envelope (ADSR) — both 0-10 scale
- Poly-Mod: per-voice modulation. Sources are Filter Envelope and Oscillator B; destinations are Osc A frequency, Osc A pulse width, and filter cutoff. Enables FM-like timbres and sync sweeps.
- LFO with shapes (saw, triangle, square — multi-select), Initial Amount (always-on) and Frequency knobs
- Wheel-Mod: mod wheel modulation. Source Mix blends LFO and Noise (-5 to +5, 0 = balanced). Destinations: Osc A/B freq, Osc A/B pulse width, filter.
- Vintage knob (1-4): adds inter-voice variability for analog "drift" character
- Unison + Glide: monophonic stacking + portamento

You respond ONLY in valid JSON — no markdown fences, no preamble, no commentary outside the JSON object. Schema:

{
  "prose": "markdown-formatted response 2-5 sentences. Use **bold** for key terms. If you generated a patch, briefly explain the design choices.",
  "patch": <patch object> OR null
}

GENERATE A PATCH ONLY IF the user describes a sound or asks for one (e.g. "make a fat bass", "warm pad", "Take On Me lead", "something dark and resonant"). Otherwise set patch to null.

PATCH SCHEMA (all numeric values are floats unless noted; ALL FIELDS REQUIRED if generating a patch):
{
  "patchName": "1-30 char name",
  "description": "1-2 sentence description of the sound",
  "tips": "1-sentence playing tip",
  "pmFiltEnv": 0-10, "pmOscB": 0-10,
  "pmDestFreqA": bool, "pmDestPwA": bool, "pmDestFilter": bool,
  "lfoInit": 0-10, "lfoFreq": 0-10,
  "lfoSaw": bool, "lfoTri": bool, "lfoSq": bool,
  "wmSrcMix": -5 to +5,
  "wmDestFreqA": bool, "wmDestFreqB": bool, "wmDestPwA": bool, "wmDestPwB": bool, "wmDestFilter": bool,
  "oaFreq": 0-10, "oaSaw": bool, "oaPulse": bool, "oaPw": 0-10, "oaSync": bool,
  "obFreq": 0-10, "obFine": 0-10, "obSaw": bool, "obTri": bool, "obPulse": bool, "obPw": 0-10, "obLo": bool, "obKb": bool,
  "mxOscA": 0-10, "mxOscB": 0-10, "mxNoise": 0-10,
  "fRev": 0 or 1 (0=Rev1/2 SSI filter, 1=Rev3 Curtis filter), "fCut": 0-10, "fRes": 0-10, "fEnv": 0-10, "fKb": 0/1/2 (off/half/full),
  "feA": 0-10, "feD": 0-10, "feS": 0-10, "feR": 0-10,
  "aeA": 0-10, "aeD": 0-10, "aeS": 0-10, "aeR": 0-10,
  "vintage": 1-4, "masterTune": -5 to +5,
  "unison": bool, "glideRate": 0-10, "volume": 0-10
}

Programming guidance:
- Bass: short A, medium D, low S; oA saw, oB saw +5-15 cents, fCut 3-5, fRes 3-5, fEnv 5-7
- Lead: oA saw, oB saw detuned, fCut 5-7, sometimes sync. Brighter env amount. Unison if "fat".
- Pad: long A & R, both oscs detuned, fCut 4-5, fRes 1-3. PWM via Wheel-Mod for movement.
- Brass: both saw, fast attack, high env amount, fCut 5-7
- Stab: very short envelopes everywhere, high env amount, percussive
- For sync sounds: oaSync=true, set oA Freq lower, oB Freq higher to act as sync target
- For PWM: use pulse waves and route LFO via Wheel-Mod to PW A/B (set wmDestPwA/B true, lfoTri true, lfoFreq 3-5)`;

type ChatMsg = { role: "user" | "assistant"; content: string };

async function callClaude(messages: ChatMsg[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: CHAT_SYSTEM,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const text = data.content?.filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("") || "";
  const clean = text.replace(/```json\s*/gi, "").replace(/```\s*$/g, "").trim();
  return JSON.parse(clean);
}

function formatProse(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#E8A948">$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(232,169,72,0.1);padding:1px 5px;border-radius:3px;font-size:0.78rem;color:#D4A050">$1</code>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/\n- /g, '<br/>• ')
    .replace(/\n(\d+)\. /g, '<br/>$1. ')
    .replace(/\n/g, '<br/>');
}

type LabMsg = { role: "system" | "user" | "ai" | "error"; text: string };

function PatchLab({ onApplyPatch }: { onApplyPatch: (p: Patch) => void }) {
  const [msgs, setMsgs] = useState<LabMsg[]>([
    { role: "system", text: "Welcome to the Patch Lab. Ask about Prophet-5 architecture and sound design, or describe any sound and I'll dial it in on the panel above." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement | null>(null);
  const turns = useRef<ChatMsg[]>([]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const send = useCallback(async (text: string) => {
    const t = (text || "").trim();
    if (!t || loading) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text: t }]);
    setLoading(true);

    turns.current.push({ role: "user", content: t });

    try {
      const result = await callClaude(turns.current);
      const proseText = result.prose || "Hmm, I didn't get a response. Try rephrasing?";
      turns.current.push({ role: "assistant", content: JSON.stringify(result) });

      let proseFinal = proseText;
      if (result.patch) {
        proseFinal = `**Generated: ${result.patch.patchName}**\n\n${proseText}\n\n_Panel updated above. Hit RECORD to save to your bank._`;
        onApplyPatch({
          ...INIT_PATCH,
          ...result.patch,
          id: `lab-${Date.now()}`,
          name: result.patch.patchName,
          isFactory: false,
        });
      }

      setMsgs(m => [...m, { role: "ai", text: proseFinal }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      setMsgs(m => [...m, { role: "error", text: `Couldn't reach Claude — ${msg}. Try again in a moment.` }]);
    } finally {
      setLoading(false);
    }
  }, [loading, onApplyPatch]);

  const quicks = [
    "How does Poly-Mod work?",
    "Fat detuned brass stab",
    "Ethereal PWM pad",
    "Dark acid bass",
    "Screaming sync lead",
    "Explain the Vintage knob",
  ];

  return (
    <div style={{
      background: "#100D08", border: "1px solid rgba(232,169,72,0.15)", borderRadius: 10,
      display: "flex", flexDirection: "column", height: 500, overflow: "hidden",
    }}>
      <div style={{
        background: "linear-gradient(135deg,#14110c,#1a1508)",
        padding: "12px 16px", borderBottom: "1px solid rgba(232,169,72,0.15)",
        display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg,#E8A948,#C4882A)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#1a1410", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace",
        }}>P5</div>
        <div>
          <div style={{ fontSize: 12, color: "#F5E6C8", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 0.3 }}>Patch Lab</div>
          <div style={{ fontSize: 9.5, color: "#665c44", marginTop: 1 }}>Sound design assistant · powered by Claude</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            padding: m.role === "system" ? "6px 10px" : "10px 14px",
            borderRadius: 10,
            fontSize: m.role === "system" ? 11 : 13,
            lineHeight: 1.6,
            ...(m.role === "user" ? {
              maxWidth: "85%", alignSelf: "flex-end",
              background: "#1a1408", color: "#D0C0A0",
              border: "1px solid rgba(232,169,72,0.2)", borderBottomRightRadius: 3,
            } : m.role === "ai" ? {
              maxWidth: "100%", alignSelf: "flex-start",
              background: "#161108", color: "#B5A580",
              border: "1px solid rgba(232,169,72,0.1)", borderBottomLeftRadius: 3,
            } : m.role === "error" ? {
              maxWidth: "100%", background: "rgba(232,90,60,0.06)", color: "#E89090",
              border: "1px solid rgba(232,90,60,0.2)",
            } : {
              maxWidth: "100%", background: "transparent", color: "#665c44",
              textAlign: "center", alignSelf: "center", fontStyle: "italic",
            })
          }} dangerouslySetInnerHTML={{ __html: m.role === "ai" ? formatProse(m.text) : m.role === "system" ? m.text : (m.text || "").replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8A948", animation: "pulse 1.4s ease-in-out infinite" }} />
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8A948", animation: "pulse 1.4s ease-in-out 0.2s infinite" }} />
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8A948", animation: "pulse 1.4s ease-in-out 0.4s infinite" }} />
          </div>
        )}
        <div ref={chatEnd} />
      </div>

      {msgs.length <= 1 && !loading && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "0 14px 10px", background: "#0d0b08" }}>
          {quicks.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{
              background: "#1a1508", border: "1px solid rgba(232,169,72,0.15)",
              borderRadius: 16, padding: "5px 11px", fontSize: 11, color: "#998870",
              cursor: "pointer",
            }}>{q}</button>
          ))}
        </div>
      )}

      <div style={{
        padding: "10px 12px", borderTop: "1px solid rgba(232,169,72,0.15)",
        display: "flex", gap: 8, background: "#0d0b08", flexShrink: 0,
      }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Describe a sound or ask anything about the Prophet-5..."
          disabled={loading}
          style={{
            flex: 1, background: "#14110c", border: "1px solid rgba(232,169,72,0.2)",
            borderRadius: 8, padding: "10px 14px", color: "#F5E6C8", fontSize: 13,
            outline: "none", fontFamily: "inherit",
          }}
        />
        <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{
          width: 40, height: 40, background: "linear-gradient(135deg,#E8A948,#C4882A)",
          border: "none", borderRadius: 8, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
          color: "#1a1410", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          opacity: input.trim() && !loading ? 1 : 0.4, flexShrink: 0,
        }}>➤</button>
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:0.3}40%{opacity:1}}`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function ProphetPage() {
  const [bank, setBank] = useState<Patch[]>(FACTORY);
  const [livePatch, setLivePatch] = useState<Patch>(FACTORY[0]);
  const [tab, setTab] = useState<"bank" | "lab">("bank");
  const [saveOpen, setSaveOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [factoryMode, setFactoryMode] = useState(true);

  const updateLive = useCallback((changes: Partial<Patch>) => {
    setLivePatch(prev => ({ ...prev, ...changes, dirty: true, isFactory: false, id: prev.id?.startsWith("custom") ? prev.id : `editing-${prev.id}` }));
  }, []);

  const loadPatch = useCallback((id: string) => {
    const p = bank.find(x => x.id === id);
    if (p) setLivePatch({ ...p, dirty: false });
  }, [bank]);

  const applyLabPatch = useCallback((patch: Patch) => {
    setLivePatch({ ...INIT_PATCH, ...patch, dirty: true });
  }, []);

  const handleSave = useCallback((name: string) => {
    const newPatch: Patch = {
      ...livePatch,
      id: `user-${Date.now()}`,
      name,
      isFactory: false,
      dirty: false,
      group: 2, bank: 1, prgm: bank.filter(p => !p.isFactory).length + 1,
    };
    setBank(prev => [...prev, newPatch]);
    setLivePatch(newPatch);
    setSaveOpen(false);
    setRecording(false);
  }, [livePatch, bank]);

  const handleDelete = useCallback((id: string) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this user patch?")) return;
    setBank(prev => prev.filter(p => p.id !== id));
    if (livePatch.id === id) setLivePatch(FACTORY[0]);
  }, [livePatch.id]);

  const handleRecord = useCallback(() => {
    setRecording(true);
    setSaveOpen(true);
  }, []);

  const handleProgramSelect = useCallback((n: number) => {
    const list = factoryMode ? bank.filter(p => p.isFactory) : bank.filter(p => !p.isFactory);
    if (list.length === 0) return;
    const target = list[Math.min(n - 1, list.length - 1)];
    if (target?.id) loadPatch(target.id);
  }, [bank, factoryMode, loadPatch]);

  const handleNew = useCallback(() => {
    setLivePatch({ ...INIT_PATCH, id: "new", name: "New Patch", isFactory: false });
    setTab("bank");
  }, []);

  const currentInList = useMemo(() => {
    const list = livePatch.isFactory ? bank.filter(p => p.isFactory) : bank.filter(p => !p.isFactory);
    return Math.max(0, list.findIndex(p => p.id === livePatch.id));
  }, [livePatch, bank]);
  const ledGroup = livePatch.dirty ? "0" : (livePatch.isFactory ? "1" : "2");
  const ledBank = livePatch.dirty ? "0" : String(Math.floor(currentInList / 8) + 1);
  const ledPrgm = livePatch.dirty ? "0" : String((currentInList % 8) + 1);

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top,#181410 0%,#0a0907 60%,#000 100%)",
      fontFamily: "'Inter','Helvetica Neue',system-ui,sans-serif",
      color: "#D5C8A8",
      paddingBottom: 32,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div style={{ padding: "26px 20px 14px", textAlign: "center", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          fontSize: 9.5, letterSpacing: 6, color: "#E8A948", fontWeight: 700, marginBottom: 6,
          fontFamily: "'Barlow Condensed',sans-serif",
        }}>SEQUENTIAL · CIRCA 2020</div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: 38, fontWeight: 600, color: "#F5E6C8",
          letterSpacing: -0.5, lineHeight: 1, margin: 0,
        }}>Prophet-5 <span style={{ fontStyle: "italic", color: "#E8A948" }}>Rev 4</span></h1>
        <div style={{
          fontSize: 10, color: "#665c44", marginTop: 6,
          fontStyle: "italic", letterSpacing: 0.5,
        }}>The original 5-voice polyphonic — faithful reissue with switchable filters &amp; modern enhancements</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "4px 12px 14px", maxWidth: 1280, margin: "0 auto" }}>
        {([
          ["bank", `Sound Bank · ${bank.length}`],
          ["lab", `Patch Lab${livePatch.dirty ? " ●" : ""}`],
        ] as const).map(([id, label]) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              background: active ? "linear-gradient(180deg,#1e1a14,#15110d)" : "#0c0a07",
              border: `1px solid ${active ? "rgba(232,169,72,0.4)" : "rgba(232,169,72,0.08)"}`,
              borderRadius: 6, padding: "9px 22px", cursor: "pointer",
              fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "'Barlow Condensed',sans-serif",
              color: active ? "#E8A948" : "#665c44", textTransform: "uppercase",
            }}>{label}</button>
          );
        })}
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 12px" }}>
        <PatchInfo patch={livePatch} />
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 12px" }}>
        <ProphetPanel
          patch={livePatch}
          update={updateLive}
          locked={false}
          group={ledGroup} bank={ledBank} prgm={ledPrgm}
          onProgramSelect={handleProgramSelect}
          factoryMode={factoryMode}
          onFactoryToggle={() => setFactoryMode(f => !f)}
          recording={recording}
          onRecord={handleRecord}
        />
      </div>

      <div style={{
        maxWidth: 1280, margin: "8px auto 0", padding: "0 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ fontSize: 10, color: "#554c38", fontStyle: "italic" }}>
          <b style={{ color: "#7a6e50" }}>Drag</b> knobs vertically · <b style={{ color: "#7a6e50" }}>Shift+drag</b> for fine · <b style={{ color: "#7a6e50" }}>Double-click</b> to reset
        </div>
        <div style={{ fontSize: 10, color: "#554c38", fontStyle: "italic" }}>
          Changes mark the patch <b style={{ color: "#E8A948" }}>●</b> dirty — RECORD to save
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "20px auto 0", padding: "0 16px" }}>
        {tab === "bank" && (
          <SoundBank
            patches={bank} currentId={livePatch.id}
            onSelect={loadPatch} onDelete={handleDelete} onNew={handleNew}
          />
        )}
        {tab === "lab" && (
          <PatchLab onApplyPatch={applyLabPatch} />
        )}
      </div>

      <SaveModal
        open={saveOpen}
        defaultName={livePatch.name?.startsWith("New") || livePatch.dirty ? `Custom ${new Date().toLocaleDateString()}` : livePatch.name}
        onCancel={() => { setSaveOpen(false); setRecording(false); }}
        onSave={handleSave}
      />

      <div style={{ textAlign: "center", padding: "30px 16px 8px", fontSize: 9, color: "#332e22", letterSpacing: 1 }}>
        DESIGNED FOR DAN · PROPHET-5 REV 4 EMULATION · NOT AFFILIATED WITH SEQUENTIAL LLC
      </div>
    </div>
  );
}
