import { softwareList } from '@/data/software';
import SoftwareCard from '@/components/SoftwareCard';
import Sidebar from '@/components/Sidebar';
import SectionTitle from '@/components/SectionTitle';

interface Props {
  params: Promise<{ category: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  windows: '💻 Windows Software',
  mac: '🍎 Mac Software',
  android: '📱 Android Apps',
  games: '🎮 PC Games',
  graphics: '🎨 Graphics & Design',
  multimedia: '🎬 Multimedia',
  security: '🛡 Security Software',
  developer: '🖥 Developer Tools',
  office: '📄 Office & Business',
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map(c => ({ category: c }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const label = CATEGORY_LABELS[category] || category;
  return { title: `${label} – Free Download – GetIntoPC` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const label = CATEGORY_LABELS[category] || category;
  const software = softwareList;

  return (
    <>
      <section className="py-7 px-5 text-center" style={{ background: 'linear-gradient(135deg,#0d0d2b 0%,#1a0a2e 50%,#0d1a2b 100%)' }}>
        <h1 className="text-2xl font-black text-white mb-1">{label}</h1>
        <p className="text-xs text-[#a0a0b8]">Download full version software — pre-activated, direct links, no surveys</p>
      </section>

      <div className="max-w-[1200px] mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6">
        <main>
          <SectionTitle title="📦 All Software" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {software.map(sw => <SoftwareCard key={sw.slug} software={sw} />)}
          </div>

          <div className="flex justify-center gap-1.5 flex-wrap">
            {[1, 2, 3, 4].map(p => (
              <button key={p} className={`px-3 py-1.5 rounded border text-xs ${p === 1 ? 'bg-[#e84545] border-[#e84545] text-white' : 'border-[#2a2a4a] text-[#a0a0b8]'}`} style={{ background: p !== 1 ? '#1a1a35' : undefined }}>
                {p}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded border border-[#2a2a4a] text-xs text-[#a0a0b8]" style={{ background: '#1a1a35' }}>Next →</button>
          </div>
        </main>

        <Sidebar />
      </div>
    </>
  );
}
