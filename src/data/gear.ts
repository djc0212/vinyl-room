export interface GearItem {
  name: string;
  role: string;
  desc: string;
  color: string;
  icon: string;
}

export const GEAR: GearItem[] = [
  { name: "Audio-Technica AT-LP120XBT", role: "Turntable", desc: "Direct-drive turntable with Bluetooth and USB output. The AT-LP120X series is the gold standard for serious vinyl beginners and seasoned collectors alike — built like a tank with audiophile-grade tracking.", color: "#c4973c", icon: "◎" },
  { name: "Denon PMA-600NE", role: "Integrated Amplifier", desc: "Stereo integrated amp with a built-in phono stage, 70W per channel. The PMA-600NE delivers warm, detailed power — enough to make the LS50 Metas sing without breaking a sweat.", color: "#6b8cae", icon: "◈" },
  { name: "KEF LS50 Meta (Royal Blue)", role: "Bookshelf Speakers", desc: "KEF's legendary concentric Uni-Q driver with Metamaterial Absorption Technology. These speakers image like a hologram — pinpoint stereo separation that puts you in the room with the musicians.", color: "#2b5797", icon: "◉" },
  { name: "KEF S2 Floor Stands", role: "Speaker Stands", desc: "Purpose-built stands that position the LS50 Metas at optimal ear height and provide isolation from floor vibrations. Matched in Royal Blue for a seamless visual pairing.", color: "#2b5797", icon: "▏" },
  { name: "REL T/5x", role: "Subwoofer", desc: "REL's high-level connection integrates the T/5x seamlessly with the main speakers — it doesn't just add bass, it extends the LS50 Metas' natural voice downward without muddying the midrange.", color: "#3a3632", icon: "◫" },
  { name: "Crosley Nashville Stand", role: "Record Console", desc: "Mid-century modern walnut stand with vinyl storage below and gear shelf above. Holds the turntable, amp, and a healthy chunk of the collection within arm's reach.", color: "#6b4226", icon: "▤" },
];
