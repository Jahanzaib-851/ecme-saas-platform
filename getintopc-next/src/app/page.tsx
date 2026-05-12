import Link from 'next/link';
import Image from 'next/image';
import Ticker from '@/components/Ticker';
import SoftwareCard from '@/components/SoftwareCard';
import VlogCard from '@/components/VlogCard';
import SectionTitle from '@/components/SectionTitle';
import Sidebar from '@/components/Sidebar';
import { softwareList } from '@/data/software';
import { vlogList } from '@/data/vlogs';

export default function HomePage() {
  const featured = softwareList[0];
  const miniCards = softwareList.slice(1, 5);
  const latestSoftware = softwareList.slice(0, 9);
  const latestVlogs = vlogList.slice(0, 3);

  return (
    <>
      <Ticker />

      {/* HERO */}
      <section className="py-10 px-5 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0d0d2b 0%,#1a0a2e 50%,#0d1a2b 100%)' }}>
        <h1 className="text-3xl font-black text-white mb-2">
          Download <span className="text-[#e84545]">Premium Software</span> for Free
        </h1>
        <p className="text-[#a0a0b8] text-sm mb-6">Full version, pre-activated, direct links — no surveys, no adware</p>
        <div className="flex justify-center gap-8 flex-wrap">
          {[['12,500+', 'Software'], ['850K+', 'Daily Visitors'], ['4.2M+', 'Downloads'], ['99.9%', 'Uptime']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-[#e84545]">{num}</div>
              <div className="text-[11px] text-[#666680] uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN */}
      <div className="max-w-[1200px] mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6">
        <div>
          {/* FEATURED */}
          <SectionTitle title="⭐ Featured Software" />
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 mb-7">
            {/* Big featured */}
            <Link href={`/software/${featured.slug}`} className="rounded border border-[#2a2a4a] overflow-hidden transition-all hover:border-[#e84545] group block" style={{ background: '#1a1a35' }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: '#0f0f22' }}>
                <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="600px" />
                <span className="absolute top-2 left-2 bg-[#e84545] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{featured.category}</span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 flex gap-2">
                  <span className="bg-black/60 border border-white/20 text-[#ccc] text-[10px] px-1.5 py-0.5 rounded">💾 {featured.size}</span>
                  <span className="bg-black/60 border border-white/20 text-[#ccc] text-[10px] px-1.5 py-0.5 rounded">⭐ Featured</span>
                </div>
              </div>
              <div className="p-3.5">
                <h3 className="text-sm font-bold text-[#f0f0f0] group-hover:text-[#e84545] line-clamp-2 mb-2">{featured.title}</h3>
                <p className="text-xs text-[#a0a0b8] line-clamp-2 mb-3">{featured.description}</p>
                <div className="flex items-center justify-between border-t border-[#2a2a4a] pt-2">
                  <span className="text-[11px] text-[#666680]">📅 {featured.date}</span>
                  <span className="bg-[#e84545] text-white text-[11px] font-bold px-3 py-1 rounded">⬇ Download</span>
                </div>
              </div>
            </Link>

            {/* Mini cards */}
            <div className="flex flex-col gap-3">
              {miniCards.map(sw => (
                <Link key={sw.slug} href={`/software/${sw.slug}`} className="flex gap-2.5 rounded border border-[#2a2a4a] overflow-hidden hover:border-[#e84545] transition-colors group" style={{ background: '#1a1a35' }}>
                  <div className="relative w-24 flex-shrink-0 overflow-hidden">
                    <Image src={sw.image} alt={sw.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="96px" />
                  </div>
                  <div className="flex-1 py-2 pr-2 flex flex-col justify-between min-w-0">
                    <span className="text-xs font-bold text-[#f0f0f0] group-hover:text-[#e84545] line-clamp-2 leading-snug">{sw.title}</span>
                    <div className="flex gap-2 text-[11px] text-[#666680] mt-1">
                      <span>💾 {sw.size}</span>
                      <span>📅 {sw.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* LATEST SOFTWARE */}
          <SectionTitle title="🔄 Latest Downloads" seeAllHref="/category/windows" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {latestSoftware.map(sw => <SoftwareCard key={sw.slug} software={sw} />)}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-1.5 mb-8 flex-wrap">
            {[1, 2, 3, 4, 5].map(p => (
              <button key={p} className={`px-3 py-1.5 rounded border text-xs transition-colors ${p === 1 ? 'bg-[#e84545] border-[#e84545] text-white' : 'border-[#2a2a4a] text-[#a0a0b8] hover:bg-[#e84545] hover:border-[#e84545] hover:text-white'}`} style={{ background: p === 1 ? undefined : '#1a1a35' }}>
                {p}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded border border-[#2a2a4a] text-xs text-[#a0a0b8] hover:bg-[#e84545] hover:border-[#e84545] hover:text-white transition-colors" style={{ background: '#1a1a35' }}>
              Next →
            </button>
          </div>

          {/* LATEST VLOGS */}
          <SectionTitle title="🎥 Latest Vlogs" seeAllHref="/vlogs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {latestVlogs.map(v => <VlogCard key={v.slug} vlog={v} />)}
          </div>
        </div>

        <Sidebar />
      </div>
    </>
  );
}
