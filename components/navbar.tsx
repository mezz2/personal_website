import Link from "next/link";

const linkCls =
  "font-mono text-gray-400 text-sm tracking-widest font-normal hover:text-white transition-colors";

const dropdownItemCls =
  "font-mono text-gray-400 text-sm tracking-widest font-normal hover:text-white transition-colors px-4 py-2 whitespace-nowrap block";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-8 px-6 py-4">
      <Link
        href="/"
        className="font-mono text-white font-bold text-sm tracking-[0.25em] hover:text-orange-400 transition-colors"
      >
        RILEY MEREDITH
      </Link>

      <Link href="/about" className={linkCls}>
        ABOUT
      </Link>

      {/* Projects dropdown */}
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

      {/* Writing dropdown */}
      <div className="group relative">
        <span className={`${linkCls} cursor-default flex items-center gap-1`}>
          WRITING
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
    </nav>
  );
}
