interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  href: string;
}

export default function ProjectCard({ title, description, tags, href }: ProjectCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-white/10 bg-white/[0.02] p-5 hover:border-orange-400/50 hover:bg-white/[0.04] transition-all duration-200"
    >
      <div className="flex flex-col gap-3 h-full min-h-[160px]">
        <h3 className="font-mono text-sm font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
          {title}
        </h3>
        <p className="font-mono text-xs text-gray-500 leading-relaxed flex-1">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] text-gray-600 border border-white/10 px-2 py-0.5 tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
