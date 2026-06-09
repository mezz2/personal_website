'use client';

import Link from "next/link";
import { useState } from "react";

const overlayLinkCls =
  "font-mono text-gray-400 text-lg tracking-widest hover:text-white transition-colors py-3 block";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [wordsOpen, setWordsOpen] = useState(false);

  const close = () => {
    setMenuOpen(false);
    setProjectsOpen(false);
    setWordsOpen(false);
  };

  const linkCls =
    "font-mono text-gray-400 text-sm tracking-widest font-normal hover:text-white transition-colors";

  const dropdownItemCls =
    "font-mono text-gray-400 text-sm tracking-widest font-normal hover:text-white transition-colors px-4 py-2 whitespace-nowrap block";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-8 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <Link
          href="/"
          onClick={close}
          className="font-mono text-white font-bold text-sm tracking-[0.25em] hover:text-orange-400 transition-colors"
        >
          RILEY MEREDITH
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/about" className={linkCls}>
            ABOUT
          </Link>

          <div className="group relative">
            <span className={`${linkCls} cursor-default flex items-center gap-1`}>
              PROJECTS
              <svg className="w-2.5 h-2.5 opacity-50" viewBox="0 0 10 6" fill="currentColor">
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </span>
            <div className="absolute top-full left-0 pt-3 hidden group-hover:block">
              <div className="border border-white/10 bg-[#0a0a0a] py-1 flex flex-col">
                <Link href="/hoops-lab" className={dropdownItemCls}>
                  HOOPS LAB
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative">
            <span className={`${linkCls} cursor-default flex items-center gap-1`}>
              WORDS
              <svg className="w-2.5 h-2.5 opacity-50" viewBox="0 0 10 6" fill="currentColor">
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </span>
            <div className="absolute top-full left-0 pt-3 hidden group-hover:block">
              <div className="border border-white/10 bg-[#0a0a0a] py-1 flex flex-col">
                <Link href="/blog" className={dropdownItemCls}>
                  BLOG
                </Link>
                <Link href="/books" className={dropdownItemCls}>
                  BOOKS
                </Link>
              </div>
            </div>
          </div>

          <Link href="/someday" className={linkCls}>
            SOMEDAY
          </Link>

          <a
            href="https://github.com/mezz2"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            GITHUB
          </a>
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="sm:hidden ml-auto font-mono text-gray-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col px-8 pt-24 pb-12 transition-opacity duration-300 sm:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Link href="/about" onClick={close} className={overlayLinkCls}>
          ABOUT
        </Link>

        {/* PROJECTS accordion */}
        <div>
          <button
            className="font-mono text-gray-400 text-lg tracking-widest hover:text-white transition-colors py-3 flex items-center gap-2 w-full text-left"
            onClick={() => setProjectsOpen((v) => !v)}
          >
            PROJECTS
            <svg
              className={`w-3 h-3 opacity-50 transition-transform duration-200 ${projectsOpen ? "rotate-180" : ""}`}
              viewBox="0 0 10 6"
              fill="currentColor"
            >
              <path d="M0 0l5 6 5-6z" />
            </svg>
          </button>
          {projectsOpen && (
            <div className="pl-4 flex flex-col border-l border-white/10 mb-1">
              <Link href="/hoops-lab" onClick={close} className="font-mono text-gray-500 text-base tracking-widest hover:text-white transition-colors py-2 block">
                HOOPS LAB
              </Link>
            </div>
          )}
        </div>

        {/* WORDS accordion */}
        <div>
          <button
            className="font-mono text-gray-400 text-lg tracking-widest hover:text-white transition-colors py-3 flex items-center gap-2 w-full text-left"
            onClick={() => setWordsOpen((v) => !v)}
          >
            WORDS
            <svg
              className={`w-3 h-3 opacity-50 transition-transform duration-200 ${wordsOpen ? "rotate-180" : ""}`}
              viewBox="0 0 10 6"
              fill="currentColor"
            >
              <path d="M0 0l5 6 5-6z" />
            </svg>
          </button>
          {wordsOpen && (
            <div className="pl-4 flex flex-col border-l border-white/10 mb-1">
              <Link href="/blog" onClick={close} className="font-mono text-gray-500 text-base tracking-widest hover:text-white transition-colors py-2 block">
                BLOG
              </Link>
              <Link href="/books" onClick={close} className="font-mono text-gray-500 text-base tracking-widest hover:text-white transition-colors py-2 block">
                BOOKS
              </Link>
            </div>
          )}
        </div>

        <Link href="/someday" onClick={close} className={overlayLinkCls}>
          SOMEDAY
        </Link>

        <a
          href="https://github.com/mezz2"
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
          className={overlayLinkCls}
        >
          GITHUB
        </a>
      </div>
    </>
  );
}
