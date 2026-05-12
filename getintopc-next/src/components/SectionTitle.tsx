import Link from 'next/link';

interface Props {
  title: string;
  seeAllHref?: string;
}

export default function SectionTitle({ title, seeAllHref }: Props) {
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b-2 border-[#2a2a4a]">
      <div className="w-1 h-5 bg-[#e84545] rounded" />
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#f0f0f0]">{title}</h2>
      {seeAllHref && (
        <Link href={seeAllHref} className="ml-auto text-xs text-[#e84545] border border-[#e84545] px-2.5 py-0.5 rounded hover:bg-[#e84545] hover:text-white transition-colors">
          View All →
        </Link>
      )}
    </div>
  );
}
