import { describe, expect, it } from "vitest";
import { resolveNavActive } from "./nav";

describe("resolveNavActive", () => {
  it("marks brand active only on exact home", () => {
    expect(resolveNavActive("/")).toBe("home");
  });

  it("marks Projects for the hub and Hoops Lab destination", () => {
    expect(resolveNavActive("/projects")).toBe("projects");
    expect(resolveNavActive("/hoops-lab")).toBe("projects");
  });

  it("marks Words for the hub, Blog, and Books destinations", () => {
    expect(resolveNavActive("/words")).toBe("words");
    expect(resolveNavActive("/blog")).toBe("words");
    expect(resolveNavActive("/books")).toBe("words");
  });

  it("marks Someday and About by exact path only", () => {
    expect(resolveNavActive("/someday")).toBe("someday");
    expect(resolveNavActive("/someday/learn-piano")).toBeNull();
    expect(resolveNavActive("/about")).toBe("about");
  });

  it("returns null for unknown paths", () => {
    expect(resolveNavActive("/not-a-route")).toBeNull();
  });
});

