import type { Metadata } from "next";
import BasketballHero from "@/components/basketball-hero";
import ProjectsSection from "@/components/projects-section";

export const metadata: Metadata = {
  title: "Hoops Lab",
  description: "Building data science skills through a passion for the NBA.",
};

export default function HoopsLab() {
  return (
    <main>
      <BasketballHero />
      <ProjectsSection />
    </main>
  );
}
