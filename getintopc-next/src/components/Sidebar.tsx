'use client';

import Link from 'next/link';
import Image from 'next/image';
import { softwareList } from '@/data/software';

const CATEGORIES = [
  { label: '💻 Windows', href: '/category/windows', count: 4218 },
  { label: '🍎 Mac', href: '/category/mac', count: 1340 },
  { label: '📱 Android', href: '/category/android', count: 2105 },
  { label: '🎮 Games', href: '/category/games', count: 1876 },
  { label: '🎨 Graphics', href: '/category/graphics', count: 892 },
  { label: '🎬 Multimedia', href: '/category/multimedia', count: 634 },
  { label: '🛡 Security', href: '/category/security', count: 418 },
  { label: '🎥 Vlogs', href: '/vlogs', count: 245 },
];

const TAGS = ['Adobe', 'Crack', 'Windows 11', 'Free Download', 'Games', 'Autodesk', 'Microsoft', 'Full Version', 'Security', 'Mac', 'Android', 'IDM'];

export default function Sidebar() {
  const popular = softwareList.slice(0, 4);

  return (
    <aside className="flex flex-col gap-5">
      {/* Search */}
      <div className="rounded border border-[#2a2a4a] overflow-hidden" style={{ background: '#111124' }}>
        <div className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#f0f0f0] border-b-2 border-[#e84545] flex items-center gap-2" style={{ background: '#13132b' }}>
          🔍 Search
        </div>
        <div className="p-3.5">
          <form className="flex" onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search software..."
              className="flex-1 px-3 py-2 text-xs rounded-l border border-[#2a2a4a] border-r-0 outline-none"
              style={{ background: '#1a1a35', color: '#f0f0f0' }}
            />
            <button type="submit" className="px-3 bg-[#e84545] text-white rounded-r text-sm">🔍</button>
          </form>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded border border-[#2a2a4a] overflow-hidden" style={{ background: '#111124' }}>
        <div className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#f0f0f0] border-b-2 border-[#e84545]" style={{ background: '#13132b' }}>
          📁 Categories
        </div>
        <ul>
          {CATEGORIES.map(c => (
            <li key={c.href} className="border-b border-[#2a2a4a] last:border-0">
              <Link href={c.href} className="flex items-center justify-between px-3.5 py-2.5 text-xs text-[#a0a0b8] hover:bg-[#1a1a35] hover:text-[#e84545] hover:pl-5 transition-all">
                <span>{c.label}</span>
                <span className="bg-[#1e1e3a] text-[#666680] text-[11px] px-2 py-0.5 rounded-full">{c.count.toLocaleString()}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Ad Banner */}
      <div className="rounded border border-[#3d1a6e] p-5 text-center" style={{ background: 'linear-gradient(135deg,#1a0a2e,#2a1040)' }}>
        <h4 className="text-sm font-bold text-[#f5a623] mb-1.5">🔥 VPN Deal – 82% OFF</h4>
        <p className="text-xs text-[#a0a0b8] mb-3">Protect your downloads with the fastest VPN. Only $2.99/month!</p>
        <a href="#" className="inline-block bg-[#f5a623] text-black text-xs font-bold px-4 py-2 rounded">GET DEAL →</a>
      </div>

      {/* Popular Today */}
      <div className="rounded border border-[#2a2a4a] overflow-hidden" style={{ background: '#111124' }}>
        <div className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#f0f0f0] border-b-2 border-[#e84545]" style={{ background: '#13132b' }}>
          🔥 Popular Today
        </div>
        <div className="p-3.5 flex flex-col divide-y divide-[#2a2a4a]">
          {popular.map(sw => (
            <div key={sw.slug} className="flex gap-2.5 py-2.5 first:pt-0 last:pb-0">
              <div className="w-16 h-12 flex-shrink-0 rounded overflow-hidden relative" style={{ background: '#1a1a35' }}>
                <Image src={sw.image} alt={sw.title} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/software/${sw.slug}`} className="block text-xs font-semibold text-[#f0f0f0] line-clamp-2 leading-snug hover:text-[#e84545]">
                  {sw.title}
                </Link>
                <span className="text-[11px] text-[#666680]">👁 {(sw.views / 1000).toFixed(0)}K views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="rounded border border-[#2a2a4a] overflow-hidden" style={{ background: '#111124' }}>
        <div className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#f0f0f0] border-b-2 border-[#e84545]" style={{ background: '#13132b' }}>
          🏷 Popular Tags
        </div>
        <div className="p-3.5 flex flex-wrap gap-1.5">
          {TAGS.map(tag => (
            <a key={tag} href="#" className="bg-[#1e1e3a] border border-[#2a2a4a] text-xs text-[#a0a0b8] px-2.5 py-1 rounded hover:bg-[#e84545] hover:border-[#e84545] hover:text-white transition-all">
              {tag}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
