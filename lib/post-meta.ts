export type PostMeta = {
  title: string;
  date: string;
  summary?: string;
  draft?: boolean;
};

export type PostSummary = PostMeta & { slug: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parsePostMeta(slug: string, raw: unknown): PostMeta {
  const where = `content/blog/${slug}.mdx`;
  if (!SLUG.test(slug)) {
    throw new Error(
      `${where}: file names must be lowercase words joined by hyphens, e.g. my-first-post.mdx`,
    );
  }
  if (!raw || typeof raw !== "object") {
    throw new Error(`${where}: add \`export const metadata = { title, date }\` at the top`);
  }
  const { title, date, summary, draft } = raw as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim()) {
    throw new Error(`${where}: metadata.title is missing`);
  }
  if (
    typeof date !== "string" ||
    !ISO_DATE.test(date) ||
    Number.isNaN(Date.parse(`${date}T00:00:00Z`))
  ) {
    throw new Error(`${where}: metadata.date must look like "2026-10-04"`);
  }
  if (summary !== undefined && typeof summary !== "string") {
    throw new Error(`${where}: metadata.summary must be text`);
  }
  if (draft !== undefined && typeof draft !== "boolean") {
    throw new Error(`${where}: metadata.draft must be true or false`);
  }
  return { title, date, summary, draft };
}

export function isPostVisible(meta: PostMeta, isProduction: boolean): boolean {
  return !(meta.draft && isProduction);
}

export function sortPostsNewestFirst<T extends PostMeta>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
