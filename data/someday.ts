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
    title: "A place to call home",
    description: "Find the right house. Make it mine.",
    size: "large",
    color: "#2d4a6e",
  },
  {
    slug: "catio",
    title: "Build a catio",
    description: "An outdoor enclosure so the cat can touch grass safely.",
    size: "tall",
    color: "#24507b",
  },
  {
    slug: "athletic-adventures",
    title: "Do hard things",
    description: "Dunk a basketball. Run a marathon. Pick one.",
    size: "wide",
    color: "#3f78bd",
  },
  {
    slug: "cooking-experiments",
    title: "Cook something weird",
    description: "Ferment things. Make stock from scratch. Attempt dumplings.",
    size: "small",
    color: "#2d6b6b",
  },
  {
    slug: "placeholder-a",
    title: "???",
    description: "Something I haven't thought of yet.",
    size: "small",
    color: "#4a3a6b",
  },
  {
    slug: "placeholder-b",
    title: "More to come",
    size: "small",
    color: "#2f5f4a",
  },
];
