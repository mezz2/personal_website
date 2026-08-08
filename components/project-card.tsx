import { Card, Tag } from "@/components/ui";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  href: string;
}

export default function ProjectCard({
  title,
  description,
  tags,
  href,
}: ProjectCardProps) {
  return (
    <Card href={href} rail className="p-5">
      <div className="flex flex-col gap-3 h-full min-h-[160px]">
        <h3 className="font-[family-name:var(--font-serif)] text-lg font-normal text-[var(--ink-deep)] leading-snug m-0">
          {title}
        </h3>
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)] leading-relaxed flex-1 m-0">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Card>
  );
}
