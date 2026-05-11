export type CardSize = "small" | "wide" | "tall" | "large";

export interface SomedayItem {
  slug: string;
  title: string;
  description?: string;
  size?: CardSize;
  color: string;
}

export const somedayItems: SomedayItem[] = [
  {
    slug: "new-house",
    title: "A PLACE TO CALL HOME",
    description: "Find the right house. Make it mine.",
    size: "large",
    color: "#2d4a6e",
  },
  {
    slug: "catio",
    title: "BUILD A CATIO",
    description: "An outdoor enclosure so the cat can touch grass safely.",
    size: "tall",
    color: "#6b3a2a",
  },
  {
    slug: "athletic-adventures",
    title: "DO HARD THINGS",
    description: "Dunk a basketball. Run a marathon. Pick one.",
    size: "wide",
    color: "#5a4520",
  },
  {
    slug: "cooking-experiments",
    title: "COOK SOMETHING WEIRD",
    description: "Ferment things. Make stock from scratch. Attempt dumplings.",
    size: "small",
    color: "#2a4a35",
  },
  {
    slug: "placeholder-a",
    title: "???",
    description: "Something I haven't thought of yet.",
    size: "small",
    color: "#4a2d5a",
  },
  {
    slug: "placeholder-b",
    title: "MORE TO COME.",
    size: "small",
    color: "#1a2535",
  },
];
