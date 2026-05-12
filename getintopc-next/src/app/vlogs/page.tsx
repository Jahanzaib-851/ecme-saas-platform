import Link from 'next/link';
import Image from 'next/image';
import VlogCard from '@/components/VlogCard';
import SectionTitle from '@/components/SectionTitle';
import { vlogList } from '@/data/vlogs';

export const metadata = {
  title: 'Vlogs – Tech Tips, Tutorials & Reviews – GetIntoPC',
};

const VLOG_CATEGORIES = ['All Vlogs', 'Installation Guides', 'Software Reviews', 'Gaming Tips', 'PC Optimization', 'How-To', 'Top Lists'];

export default function VlogsPage() {
  const featured = vlogList[0];
  const miniVlogs = vlogList.slice(1, 5);

  return (
    <>
      {/* Hero */}
      <section className="py-7 px-5 text-center" style={{ background: 'linear-gradient(135deg,#0d0d2b 0%,#1a0a2e 50%,#0d1a2b 100%)' }}>
        <h1 className="text-2xl font-black text-white mb-1">🎥 Tech <span className="text-[#e84545]">Vlogs</span> & Tutorials</h1>
        <p className="text-xs text-[#a0a0b8] mb-4">Installation guides, software reviews, gaming tips & PC tutorials</p>
        <div className="flex justify-center gap-8 flex-wrap">
          {[['245+', 'Videos'], ['12M+', 'Total Views'], ['85K+', 'Subscribers']].map(([n, l]) => (
            <div key={l}><div className="text-xl font-black text-[#e84545]">{n}</div><div className="text-[11px] text-[#666680] uppercase">{l}</div></div>
          ))}
        </div>
      </section>

      {/* Filter tabs */}
      <div className="border-b border-[#2a2a4a]" style={{ background: '#13132b' }}>
        <div className="max-w-[1200px] mx-auto px-5 flex overflow-x-auto scrollbar-hide">
          {VLOG_CATEGORIES.map((c, i) => (
            <button key={c} className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-[#e84545] text-white' : 'text-[#a0a0b8] hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 py-6">
        {/* Featured */}
        <SectionTitle title="⭐ Featured Vlog" />
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 mb-8">
          <Link href={`/vlogs/${featured.slug}`} className="rounded border border-[#2a2a4a] overflow-hidden hover:border-[#e84545] transition-colors group block" style={{ background: '#1a1a35' }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <Image src={featured.thumbnail} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="600px" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-[#e84545]/20 transition-colors">
                <div className="w-16 h-16 bg-[rgba(232,69,69,0.9)] rounded-full flex items-center justify-center text-white text-2xl border-[3px] border-white/30 group-hover:scale-110 transition-transform">▶</div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded">{featured.duration}</span>
              <span className="absolute top-2 left-2 bg-[#e84545] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Featured</span>
            </div>
            <div className="p-3.5">
              <h3 className="text-sm font-bold text-[#f0f0f0] group-hover:text-[#e84545] line-clamp-3 mb-2">{featured.title}</h3>
              <div className="flex items-center justify-between border-t border-[#2a2a4a] pt-2">
                <span className="text-[11px] text-[#666680]">👁 {(featured.views / 1000).toFixed(0)}K views • {featured.date}</span>
                <span className="bg-[#e84545] text-white text-[11px] font-bold px-3 py-1 rounded">▶ Watch</span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-3">
            {miniVlogs.map(v => (
              <Link key={v.slug} href={`/vlogs/${v.slug}`} className="flex gap-2.5 rounded border border-[#2a2a4a] overflow-hidden hover:border-[#e84545] transition-colors group" style={{ background: '#1a1a35' }}>
                <div className="relative w-24 flex-shrink-0 overflow-hidden" style={{ aspectRatio: 'unset', height: '64px' }}>
                  <Image src={v.thumbnail} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="96px" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-6 h-6 bg-[rgba(232,69,69,0.9)] rounded-full flex items-center justify-center text-white text-[10px]">▶</div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">{v.duration}</span>
                </div>
                <div className="flex-1 py-2 pr-2 flex flex-col justify-between min-w-0">
                  <span className="text-xs font-bold text-[#f0f0f0] group-hover:text-[#e84545] line-clamp-2 leading-snug">{v.title}</span>
                  <span className="text-[11px] text-[#666680]">👁 {(v.views / 1000).toFixed(0)}K • {v.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All vlogs */}
        <SectionTitle title="🎥 All Vlogs" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {vlogList.map(v => <VlogCard key={v.slug} vlog={v} />)}
        </div>

        <div className="flex justify-center gap-1.5 flex-wrap">
          {[1, 2, 3].map(p => (
            <button key={p} className={`px-3 py-1.5 rounded border text-xs ${p === 1 ? 'bg-[#e84545] border-[#e84545] text-white' : 'border-[#2a2a4a] text-[#a0a0b8]'}`} style={{ background: p !== 1 ? '#1a1a35' : undefined }}>
              {p}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded border border-[#2a2a4a] text-xs text-[#a0a0b8]" style={{ background: '#1a1a35' }}>Next →</button>
        </div>
      </div>
    </>
  );
}
