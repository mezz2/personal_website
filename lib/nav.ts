export type NavActive =
  | "home"
  | "projects"
  | "words"
  | "someday"
  | "about";

export function resolveNavActive(pathname: string): NavActive | null {
  if (pathname === "/") return "home";
  if (pathname === "/projects" || pathname.startsWith("/hoops-lab")) {
    return "projects";
  }
  if (
    pathname === "/words" ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/books")
  ) {
    return "words";
  }
  if (pathname === "/someday") return "someday";
  if (pathname === "/about") return "about";
  return null;
}
