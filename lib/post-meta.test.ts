import { describe, expect, it } from "vitest";
import {
  formatPostDate,
  isPostVisible,
  parsePostMeta,
  sortPostsNewestFirst,
} from "./post-meta";

describe("parsePostMeta", () => {
  it("accepts a title and ISO date, with optional summary and draft", () => {
    expect(
      parsePostMeta("first-post", {
        title: "First post",
        date: "2026-10-04",
        summary: "Hello.",
        draft: true,
      }),
    ).toEqual({
      title: "First post",
      date: "2026-10-04",
      summary: "Hello.",
      draft: true,
    });
  });

  it("names the file when metadata is missing or malformed", () => {
    expect(() => parsePostMeta("first-post", undefined)).toThrow(
      "content/blog/first-post.mdx",
    );
    expect(() => parsePostMeta("first-post", { date: "2026-10-04" })).toThrow(
      "metadata.title is missing",
    );
    expect(() =>
      parsePostMeta("first-post", { title: "Hi", date: "4 Oct 2026" }),
    ).toThrow("metadata.date");
    expect(() =>
      parsePostMeta("first-post", { title: "Hi", date: "2026-13-40" }),
    ).toThrow("metadata.date");
  });

  it("rejects file names that would make awkward URLs", () => {
    expect(() =>
      parsePostMeta("My Post", { title: "Hi", date: "2026-10-04" }),
    ).toThrow("lowercase words joined by hyphens");
  });
});

describe("isPostVisible", () => {
  it("hides drafts only in production", () => {
    const draft = { title: "Draft", date: "2026-10-04", draft: true };
    expect(isPostVisible(draft, true)).toBe(false);
    expect(isPostVisible(draft, false)).toBe(true);
    expect(isPostVisible({ title: "Live", date: "2026-10-04" }, true)).toBe(
      true,
    );
  });
});

describe("sortPostsNewestFirst", () => {
  it("orders by date descending, then title", () => {
    const sorted = sortPostsNewestFirst([
      { title: "B", date: "2026-01-02" },
      { title: "C", date: "2026-03-01" },
      { title: "A", date: "2026-01-02" },
    ]);
    expect(sorted.map((p) => p.title)).toEqual(["C", "A", "B"]);
  });
});

describe("formatPostDate", () => {
  it("formats dates day-first without timezone drift", () => {
    expect(formatPostDate("2026-10-04")).toBe("4 October 2026");
    expect(formatPostDate("2026-01-01")).toBe("1 January 2026");
  });
});
