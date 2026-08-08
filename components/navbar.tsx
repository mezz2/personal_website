"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { resolveNavActive, type NavActive } from "@/lib/nav";

const LINKS: { id: NavActive; href: string; label: string }[] = [
  { id: "home", href: "/", label: "Riley Meredith" },
  { id: "projects", href: "/projects", label: "Projects" },
  { id: "words", href: "/words", label: "Words" },
  { id: "someday", href: "/someday", label: "Someday" },
  { id: "about", href: "/about", label: "About" },
];

function linkClass(active: boolean) {
  return [
    "font-[family-name:var(--font-mono)] text-[12px] tracking-[0.08em] transition-colors duration-200",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]",
    active
      ? "text-[var(--ink)]"
      : "text-[rgba(0,0,0,0.28)] hover:text-[var(--warm)]",
  ].join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const active = resolveNavActive(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center gap-8 px-6 py-4 bg-[rgba(244,241,234,0.88)] backdrop-blur-[8px] border-b border-[rgba(0,0,0,0.12)]">
        <div className="hidden sm:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={linkClass(active === link.id)}
              aria-current={active === link.id ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          onClick={close}
          className={`sm:hidden font-[family-name:var(--font-mono)] text-[13px] tracking-[0.05em] font-medium ${linkClass(active === "home")}`}
          aria-current={active === "home" ? "page" : undefined}
        >
          Riley Meredith
        </Link>

        <button
          type="button"
          className="sm:hidden ml-auto font-[family-name:var(--font-mono)] text-[rgba(0,0,0,0.45)] hover:text-[var(--warm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 bg-[var(--paper)] flex flex-col px-8 pt-24 pb-12 gap-2 transition-opacity duration-300 sm:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            onClick={close}
            className={`${linkClass(active === link.id)} text-lg py-3`}
            aria-current={active === link.id ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
