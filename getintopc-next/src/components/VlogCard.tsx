import Link from 'next/link';
import Image from 'next/image';
import { Vlog } from '@/types';

interface Props {
  vlog: Vlog;
}

export default function VlogCard({ vlog }: Props) {
  const views = vlog.views >= 1000
    ? (vlog.views / 1000).toFixed(0) + 'K'
    : vlog.views.toString();

  return (
    <div className="rounded border border-[#2a2a4a] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(232,69,69,0.2)] hover:border-[#e84545] group" style={{ background: '#1a1a35' }}>
      {/* Thumbnail */}
      <Link href={`/vlogs/${vlog.slug}`} className="relative block overflow-hidden" style={{ aspectRatio: '16/9', background: '#0f0f22' }}>
        <Image
          src={vlog.thumbnail}
          alt={vlog.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-[#e84545]/20 transition-colors">
          <div className="w-12 h-12 bg-[rgba(232,69,69,0.9)] rounded-full flex items-center justify-center text-white text-lg border-[3px] border-white/30 transition-transform duration-200 group-hover:scale-110">
            ▶
          </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded">
          {vlog.duration}
        </span>
      </Link>

      {/* Body */}
      <div className="p-3 pb-3.5">
        <Link href={`/vlogs/${vlog.slug}`} className="block text-xs font-bold text-[#f0f0f0] leading-snug mb-2 line-clamp-2 hover:text-[#e84545] transition-colors">
          {vlog.title}
        </Link>
        <div className="flex items-center gap-2.5 text-[11px] text-[#666680]">
          <span>👁 {views} views</span>
          <span>📅 {vlog.date}</span>
        </div>
      </div>
    </div>
  );
}
