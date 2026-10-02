export const HEADLINE_WORDS = ["WELCOME", "ITZFIZZ"] as const;

export type Stat = {
  value: number;
  label: string;
  trend: "up" | "down";
  /** Colour the card fills with once the car drives past it. */
  accent: string;
};

export const STATS: Stat[] = [
  { value: 58, label: "Increase in pick-up point use", trend: "up", accent: "#def54f" },
  { value: 23, label: "Decrease in customer phone calls", trend: "down", accent: "#6ac9ff" },
  { value: 27, label: "Increase in pick-up point use", trend: "up", accent: "#f4f1ea" },
  { value: 40, label: "Decrease in customer phone calls", trend: "down", accent: "#fa7328" },
];
