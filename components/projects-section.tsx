import ProjectCard from "@/components/project-card";

const PROJECTS = [
  {
    title: "To-Do: Player Efficiency Analysis",
    description:
      "Exploring PER and advanced metrics to identify undervalued players across the league.",
    tags: ["Python", "pandas", "Seaborn"],
    href: "https://github.com/mezz2",
  },
  {
    title: "To-Do: Shot Quality Model",
    description:
      "Building an ML model to predict shot quality using player tracking and spatial data.",
    tags: ["Python", "scikit-learn", "XGBoost"],
    href: "https://github.com/mezz2",
  },
  {
    title: "To-Do: Game Prediction Engine",
    description:
      "Using historical game data to train a model that predicts outcomes based on team and player stats.",
    tags: ["Python", "scikit-learn", "logistic regression"],
    href: "https://github.com/mezz2",
  },
  {
    title: "To-Do: Trade Value Predictor",
    description:
      "Predicting player trade values using historical salary, age curves, and performance data.",
    tags: ["Python", "regression", "BRef scraping"],
    href: "https://github.com/mezz2",
  },
  {
    title: "To-Do: Play-by-Play Clustering",
    description:
      "Clustering play patterns with unsupervised learning to identify team offensive tendencies.",
    tags: ["Python", "k-means", "plotly"],
    href: "https://github.com/mezz2",
  },
  {
    title: "To-Do: Draft Class Projection",
    description:
      "Projecting NBA draft potential from college stats using historical comp analysis.",
    tags: ["Python", "pandas", "stats"],
    href: "https://github.com/mezz2",
  },
];

export default function ProjectsSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20">
      {/* About */}
      <div className="mb-16">
        <h2 className="font-mono text-xs font-bold text-orange-400 mb-4 tracking-[0.3em]">
          // ABOUT
        </h2>
        <p className="font-mono text-gray-400 text-sm leading-relaxed">
          A personal lab for applying data science techniques to NBA data. Each project
          explores a real analytical question — from player valuation to game strategy —
          using real-world data, statistical methods, and machine learning. The goal is
          reps: building intuition for data science through something I care about.
        </p>
      </div>

      {/* Projects grid */}
      <div>
        <h2 className="font-mono text-xs font-bold text-orange-400 mb-8 tracking-[0.3em]">
          // PROJECTS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
