import Link from 'next/link';
import Image from 'next/image';
import { Software } from '@/types';

interface Props {
  software: Software;
}

export default function SoftwareCard({ software }: Props) {
  return (
    <div className="rounded border border-[#2a2a4a] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(232,69,69,0.2)] hover:border-[#e84545] group" style={{ background: '#1a1a35' }}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: '#0f0f22' }}>
        <Image
          src={software.image}
          alt={software.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
        <span className="absolute top-2 left-2 bg-[#e84545] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
          {software.category}
        </span>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 flex gap-2">
          <span className="bg-black/60 border border-white/20 text-[#ccc] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
            💾 {software.size}
          </span>
          <span className="bg-black/60 border border-white/20 text-[#ccc] text-[10px] px-1.5 py-0.5 rounded">
            💻 {software.os}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 pb-3.5">
        <Link href={`/software/${software.slug}`} className="block text-xs font-bold text-[#f0f0f0] leading-snug mb-2 line-clamp-2 hover:text-[#e84545] transition-colors">
          {software.title}
        </Link>
        <p className="text-xs text-[#a0a0b8] mb-3 line-clamp-2">{software.description}</p>

        <div className="flex items-center justify-between pt-2 border-t border-[#2a2a4a]">
          <span className="text-[11px] text-[#666680]">📅 {software.date}</span>
          <Link
            href={`/software/${software.slug}`}
            className="bg-[#e84545] hover:bg-[#c73333] text-white text-[11px] font-bold px-3 py-1 rounded flex items-center gap-1 transition-colors"
          >
            ⬇ Download
          </Link>
        </div>
      </div>
    </div>
  );
}
