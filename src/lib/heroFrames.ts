export const FRAME_COUNT = 169;

export const framePath = (n: number) =>
  `/hero-frames/frame_${String(n).padStart(4, "0")}.jpg`;

export type Beat = {
  id: string;
  show: number;
  hide: number;
  label: string;
  line: string;
  meta: string;
};

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.1,
    hide: 0.3,
    label: "01 — DESCENT",
    line: "The floor stops where the code begins.",
    meta: "ENTRY VECTOR // CONFIRMED",
  },
  {
    id: "b2",
    show: 0.35,
    hide: 0.55,
    label: "02 — SYNC",
    line: "Every layer answers to one architect.",
    meta: "FULL-STACK // REACT · SPRING · PEGA",
  },
  {
    id: "b3",
    show: 0.6,
    hide: 0.8,
    label: "03 — EMERGE",
    line: "What rises from the abyss is built, not found.",
    meta: "SHIP SEQUENCE // ARMED",
  },
];

export const HERO_TEXT_FADE_END = 0.08;
