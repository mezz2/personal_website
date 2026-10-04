import { readdirSync } from "node:fs";
import path from "node:path";
import type { MDXContent } from "mdx/types";
import {
  isPostVisible,
  parsePostMeta,
  sortPostsNewestFirst,
  type PostMeta,
  type PostSummary,
} from "./post-meta";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const isProduction = process.env.NODE_ENV === "production";

export async function loadPost(
  slug: string,
): Promise<{ meta: PostMeta; Content: MDXContent }> {
  const mod = (await import(`@/content/blog/${slug}.mdx`)) as {
    default: MDXContent;
    metadata?: unknown;
  };
  return { meta: parsePostMeta(slug, mod.metadata), Content: mod.default };
}

export async function getPosts(): Promise<PostSummary[]> {
  const slugs = readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));

  const posts = await Promise.all(
    slugs.map(async (slug) => ({ slug, ...(await loadPost(slug)).meta })),
  );

  return sortPostsNewestFirst(
    posts.filter((post) => isPostVisible(post, isProduction)),
  );
}
