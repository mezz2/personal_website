export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <span className="font-mono text-white font-bold text-sm tracking-[0.25em]">
        HOOPS LAB
      </span>
      <a
        href="https://github.com/mezz2"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-xs text-gray-500 hover:text-orange-400 transition-colors tracking-widest"
      >
        GITHUB
      </a>
    </nav>
  );
}
