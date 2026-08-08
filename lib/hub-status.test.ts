import { describe, expect, it } from "vitest";
import {
  blogStatusLabel,
  booksStatusLabel,
  projectsCapacityLabel,
} from "./hub-status";

describe("blogStatusLabel", () => {
  it("uses the empty Blog copy when nothing is published", () => {
    expect(blogStatusLabel(0)).toBe("Nothing published yet");
  });

  it("uses a singular or plural post count when filled", () => {
    expect(blogStatusLabel(1)).toBe("1 post");
    expect(blogStatusLabel(3)).toBe("3 posts");
  });
});

describe("booksStatusLabel", () => {
  it("formats the shelf inventory count", () => {
    expect(booksStatusLabel(12)).toBe("12 on the shelf");
    expect(booksStatusLabel(1)).toBe("1 on the shelf");
  });
});

describe("projectsCapacityLabel", () => {
  it("formats the live capacity rule line", () => {
    expect(projectsCapacityLabel(1)).toBe("1 LIVE · ROOM FOR MORE");
    expect(projectsCapacityLabel(3)).toBe("3 LIVE · ROOM FOR MORE");
  });
});
