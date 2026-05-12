'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { getVlogBySlug, vlogList } from '@/data/vlogs';
import VlogCard from '@/components/VlogCard';

const TIMESTAMPS = [
  { time: '0:00', label: 'Introduction' },
  { time: '0:45', label: 'Getting started' },
  { time: '2:10', label: 'Step-by-step walkthrough' },
  { time: '5:30', label: 'Key tips & tricks' },
  { time: '9:50', label: 'Testing & verification' },
  { time: '11:15', label: 'Common issues & fixes' },
];

const COMMENTS = [
  { user: 'TechMaster_PK', avatar: 'https://picsum.photos/seed/user1/50/50', text: 'This tutorial is amazing! Worked perfectly on Windows 11. Solved it in 12 minutes. Thank you!', likes: 142, time: '2 hours ago' },
  { user: 'DesignerPro99', avatar: 'https://picsum.photos/seed/user2/50/50', text: "I've been using GetIntoPC for years. Never had any issues. The download speed was great!", likes: 98, time: '5 hours ago' },
  { user: 'GraphicGeek2025', avatar: 'https://picsum.photos/seed/user5/50/50', text: 'Legend! This is the only site that worked without redirecting to shady pages. Subscribed!', likes: 215, time: '2 days ago' },
];

export default function VlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const vlog = getVlogBySlug(slug);
  if (!vlog) notFound();

  const [playing, setPlaying] = useState(false);
  const related = vlogList.filter(v => v.slug !== slug).slice(0, 3);
  const upNext = vlogList.filter(v => v.slug !== slug).slice(0, 5);

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6">
      <main>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#666680] mb-4">
          <Link href="/" className="text-[#a0a0b8] hover:text-[#e84545]">Home</Link>
          <span>›</span>
          <Link href="/vlogs" className="text-[#a0a0b8] hover:text-[#e84545]">Vlogs</Link>
          <span>›</span>
          <span className="text-[#666680] truncate max-w-[200px]">{vlog.title}</span>
        </div>

        {/* Player */}
        <div className="rounded border border-[#2a2a4a] overflow-hidden mb-5" style={{ background: '#1a1a35' }}>
          {/* Video */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: '#000' }}>
            {playing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a1e]">
                <p className="text-[#a0a0b8] text-sm">▶ Video Player Active — {vlog.title}</p>
              </div>
            ) : (
              <>
                <Image src={vlog.thumbnail} alt={vlog.title} fill className="object-cover" sizes="900px" />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer hover:bg-black/20 transition-colors"
                  onClick={() => setPlaying(true)}
                >
                  <div className="w-20 h-20 bg-[rgba(232,69,69,0.9)] rounded-full flex items-center justify-center text-white text-3xl border-4 border-white/30 hover:scale-110 transition-transform">
                    ▶
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Title & Stats */}
          <div className="px-5 py-4 border-b border-[#2a2a4a]">
            <h1 className="text-lg font-black text-[#f0f0f0] leading-tight mb-3">{vlog.title}</h1>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-4 text-xs text-[#666680]">
                <span>👁 {vlog.views.toLocaleString()} views</span>
                <span>📅 {vlog.date}</span>
                <span>⏱ {vlog.duration}</span>
              </div>
              <div className="flex gap-2">
                {[['👍 8.4K', true], ['👎 142', false], ['🔗 Share', false], ['💾 Save', false]].map(([label, active]) => (
                  <button key={label as string} className={`px-3 py-1.5 rounded border text-xs font-semibold flex items-center gap-1 transition-colors ${active ? 'bg-[#e84545] border-[#e84545] text-white' : 'border-[#2a2a4a] text-[#a0a0b8] hover:border-[#e84545] hover:text-[#e84545]'}`} style={{ background: active ? undefined : '#13132b' }}>
                    {label as string}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Channel */}
          <div className="flex items-center justify-between px-5 py-3 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#e84545] flex items-center justify-center font-black text-white text-lg flex-shrink-0">G</div>
              <div>
                <div className="text-sm font-bold text-[#f0f0f0]">GetIntoPC Official</div>
                <div className="text-xs text-[#666680]">85.2K subscribers • 245 videos</div>
              </div>
            </div>
            <button className="bg-[#e84545] hover:bg-[#c73333] text-white text-xs font-bold px-5 py-2 rounded transition-colors">🔔 Subscribe</button>
          </div>

          {/* Description */}
          <div className="px-5 py-4 border-t border-[#2a2a4a]">
            <p className="text-xs text-[#a0a0b8] leading-7 mb-4">{vlog.description}</p>

            {/* Timestamps */}
            <div className="rounded p-3" style={{ background: '#13132b' }}>
              <h4 className="text-xs font-bold text-[#f0f0f0] mb-3">⏱ Timestamps</h4>
              <div className="flex flex-col gap-1.5">
                {TIMESTAMPS.map(t => (
                  <div key={t.time} className="flex gap-2.5 text-xs">
                    <span className="text-[#e84545] font-bold cursor-pointer hover:underline w-10 flex-shrink-0">{t.time}</span>
                    <span className="text-[#a0a0b8]">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="rounded-lg border-2 border-[#e84545] p-5 text-center mb-5" style={{ background: 'linear-gradient(135deg,#1a2040,#0d1a35)' }}>
          <h3 className="text-base font-black text-white mb-1">⬇ Download the Software</h3>
          <p className="text-xs text-[#666680] mb-3">Direct link • No survey • No redirects</p>
          <Link href="/software/adobe-photoshop-2025" className="inline-flex items-center gap-2 bg-[#e84545] hover:bg-[#c73333] text-white text-sm font-bold px-6 py-2.5 rounded-md transition-colors">
            ⬇ Download Now
          </Link>
        </div>

        {/* Comments */}
        <div className="rounded border border-[#2a2a4a] p-5 mb-5" style={{ background: '#1a1a35' }}>
          <h2 className="text-sm font-bold text-[#f0f0f0] mb-5">💬 Comments (284)</h2>

          {/* Input */}
          <div className="flex gap-3 mb-6">
            <div className="w-9 h-9 rounded-full border-2 border-[#2a2a4a] flex items-center justify-center text-[#666680] flex-shrink-0" style={{ background: '#13132b' }}>👤</div>
            <div className="flex-1">
              <textarea
                placeholder="Add a comment..."
                rows={3}
                className="w-full rounded border border-[#2a2a4a] px-3 py-2 text-xs outline-none resize-none text-[#f0f0f0] placeholder-[#666680] focus:border-[#e84545]"
                style={{ background: '#13132b' }}
              />
              <div className="flex justify-end mt-2">
                <button className="bg-[#e84545] hover:bg-[#c73333] text-white text-xs font-bold px-4 py-2 rounded transition-colors">💬 Post</button>
              </div>
            </div>
          </div>

          {/* Comments list */}
          {COMMENTS.map(c => (
            <div key={c.user} className="flex gap-3 py-4 border-t border-[#2a2a4a]">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 relative">
                <Image src={c.avatar} alt={c.user} fill className="object-cover" sizes="36px" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#f0f0f0] mb-1">
                  {c.user} <span className="text-[#666680] font-normal">{c.time}</span>
                </div>
                <p className="text-xs text-[#a0a0b8] leading-6 mb-2">{c.text}</p>
                <div className="flex gap-3 text-xs text-[#666680]">
                  <button className="hover:text-[#e84545]">👍 {c.likes}</button>
                  <button className="hover:text-[#e84545]">👎</button>
                  <button className="hover:text-[#e84545]">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Related vlogs */}
        <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b-2 border-[#2a2a4a]">
          <div className="w-1 h-5 bg-[#e84545] rounded" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#f0f0f0]">🎥 Related Vlogs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map(v => <VlogCard key={v.slug} vlog={v} />)}
        </div>
      </main>

      {/* Sidebar — Up Next */}
      <aside className="flex flex-col gap-5">
        <div className="rounded border border-[#2a2a4a] overflow-hidden" style={{ background: '#111124' }}>
          <div className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#f0f0f0] border-b-2 border-[#e84545]" style={{ background: '#13132b' }}>
            🔥 Up Next
          </div>
          <div>
            {upNext.map(v => (
              <Link key={v.slug} href={`/vlogs/${v.slug}`} className="flex border-b border-[#2a2a4a] last:border-0 hover:bg-[#1a1a35] transition-colors group">
                <div className="relative w-28 flex-shrink-0" style={{ height: '64px' }}>
                  <Image src={v.thumbnail} alt={v.title} fill className="object-cover" sizes="112px" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-6 h-6 bg-[rgba(232,69,69,0.9)] rounded-full flex items-center justify-center text-white text-[10px]">▶</div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">{v.duration}</span>
                </div>
                <div className="flex-1 p-2 min-w-0">
                  <span className="block text-xs font-semibold text-[#f0f0f0] group-hover:text-[#e84545] line-clamp-2 leading-snug">{v.title}</span>
                  <span className="block text-[11px] text-[#666680] mt-1">👁 {(v.views / 1000).toFixed(0)}K • {v.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded border border-[#2a2a4a] overflow-hidden" style={{ background: '#111124' }}>
          <div className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#f0f0f0] border-b-2 border-[#e84545]" style={{ background: '#13132b' }}>📁 Categories</div>
          <ul>
            {[['Installation Guides', 84], ['Software Reviews', 62], ['Gaming Tips', 48], ['PC Optimization', 35], ['How-To Guides', 71]].map(([label, count]) => (
              <li key={label as string} className="border-b border-[#2a2a4a] last:border-0">
                <a href="#" className="flex items-center justify-between px-3.5 py-2.5 text-xs text-[#a0a0b8] hover:bg-[#1a1a35] hover:text-[#e84545] transition-all">
                  <span>{label as string}</span>
                  <span className="bg-[#1e1e3a] text-[#666680] text-[11px] px-2 py-0.5 rounded-full">{count as number}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded border border-[#3d1a6e] p-5 text-center" style={{ background: 'linear-gradient(135deg,#1a0a2e,#2a1040)' }}>
          <h4 className="text-sm font-bold text-[#f5a623] mb-1.5">📺 Subscribe on YouTube</h4>
          <p className="text-xs text-[#a0a0b8] mb-3">Get new tutorials every week.</p>
          <a href="#" className="inline-block bg-[#f5a623] text-black text-xs font-bold px-4 py-2 rounded">🔔 SUBSCRIBE</a>
        </div>
      </aside>
    </div>
  );
}
