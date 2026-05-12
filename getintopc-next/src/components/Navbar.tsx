'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: '🏠 Home' },
  { href: '/category/windows', label: '💻 Windows' },
  { href: '/category/mac', label: '🍎 Mac' },
  { href: '/category/android', label: '📱 Android' },
  { href: '/category/games', label: '🎮 Games' },
  { href: '/category/graphics', label: '🎨 Graphics' },
  { href: '/category/multimedia', label: '🎬 Multimedia' },
  { href: '/category/security', label: '🛡 Security' },
  { href: '/vlogs', label: '🎥 Vlogs' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[#e84545] shadow-xl" style={{ background: '#0a0a1e' }}>
      {/* TOP BAR */}
      <div className="max-w-[1200px] mx-auto px-5 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-black text-xl whitespace-nowrap text-white">
          <span className="w-9 h-9 bg-[#e84545] rounded-lg flex items-center justify-center text-white font-black text-lg">G</span>
          Get<span className="text-[#e84545]">Into</span>PC
        </Link>

        <form
          className="flex flex-1 max-w-xl"
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Search software, games, tools..."
            className="flex-1 px-3 py-2 text-sm rounded-l border border-[#2a2a4a] border-r-0 outline-none"
            style={{ background: '#1c1c35', color: '#f0f0f0' }}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#e84545] hover:bg-[#c73333] text-white rounded-r text-sm transition-colors"
          >
            🔍
          </button>
        </form>

        <div className="hidden md:flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-[#2a2a4a] rounded text-[#a0a0b8] hover:border-[#e84545] hover:text-[#e84545] transition-colors">
            🔔 Subscribe
          </button>
          <button className="px-3 py-1.5 text-xs border border-[#2a2a4a] rounded text-[#a0a0b8] hover:border-[#e84545] hover:text-[#e84545] transition-colors">
            👤 Login
          </button>
        </div>

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(v => !v)}
        >
          ☰
        </button>
      </div>

      {/* NAV BAR */}
      <nav className="bg-[#e84545]">
        <ul className={`max-w-[1200px] mx-auto px-5 overflow-x-auto scrollbar-hide flex-nowrap ${menuOpen ? 'flex flex-col md:flex-row' : 'hidden md:flex'}`}>
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white whitespace-nowrap transition-colors hover:bg-black/25 ${
                  (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                    ? 'bg-black/25'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
