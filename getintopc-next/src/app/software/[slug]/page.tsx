import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getSoftwareBySlug, softwareList } from '@/data/software';
import SoftwareCard from '@/components/SoftwareCard';
import Sidebar from '@/components/Sidebar';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return softwareList.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const sw = getSoftwareBySlug(slug);
  return { title: sw ? `${sw.title} – GetIntoPC` : 'Not Found' };
}

export default async function SoftwarePage({ params }: Props) {
  const { slug } = await params;
  const sw = getSoftwareBySlug(slug);
  if (!sw) notFound();

  const related = softwareList.filter(s => s.slug !== slug).slice(0, 3);

  const screenshots = [1, 2, 3, 4, 5, 6].map(i => `https://picsum.photos/seed/${slug}-sc${i}/400/250`);

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6">
      <main>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#666680] mb-4">
          <Link href="/" className="text-[#a0a0b8] hover:text-[#e84545]">Home</Link>
          <span>›</span>
          <Link href={`/category/${sw.category.toLowerCase()}`} className="text-[#a0a0b8] hover:text-[#e84545]">{sw.category}</Link>
          <span>›</span>
          <span className="text-[#666680] truncate max-w-[200px]">{sw.title}</span>
        </div>

        <article className="rounded border border-[#2a2a4a] overflow-hidden" style={{ background: '#1a1a35' }}>
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#2a2a4a]">
            <span className="inline-block bg-[#e84545] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase mb-3">{sw.category}</span>
            <h1 className="text-xl font-black text-[#f0f0f0] leading-tight mb-3">{sw.title}</h1>
            <div className="flex flex-wrap gap-4 text-xs text-[#666680]">
              <span>📅 {sw.date}</span>
              <span>👁 {sw.views.toLocaleString()} Views</span>
              <span>💾 {sw.size}</span>
              <span>💻 {sw.os}</span>
              <span>✅ Pre-Activated</span>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/8' }}>
            <Image src={`https://picsum.photos/seed/${slug}-big/1200/500`} alt={sw.title} fill className="object-cover" priority sizes="900px" />
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <h3 className="text-sm font-bold text-[#f0f0f0] pl-3 border-l-[3px] border-[#e84545] mb-3 mt-0">Overview</h3>
            <p className="text-xs text-[#a0a0b8] leading-7 mb-4">
              <strong className="text-[#f0f0f0]">{sw.title.split(' v')[0]}</strong> is one of the most powerful tools in its category.
              This release introduces significant improvements in performance and new AI-powered features. Whether you&apos;re a professional
              or a beginner, this version delivers everything you need.
            </p>
            <p className="text-xs text-[#a0a0b8] leading-7 mb-5">
              This pre-activated version requires no internet connection during installation. Simply extract, run the installer,
              apply the included patch and you&apos;ll be up and running immediately.
            </p>

            {/* Info table */}
            <div className="rounded border border-l-[3px] border-[#f5a623] p-4 mb-5" style={{ background: '#13132b' }}>
              <h4 className="text-xs font-bold text-[#f5a623] mb-3">📄 Software Information</h4>
              <table className="w-full border-collapse text-xs">
                <tbody>
                  {[
                    ['Software Name', sw.title.split(' Free')[0].split(' v')[0]],
                    ['Version', sw.version || 'Latest 2025'],
                    ['Developer', sw.developer || 'Unknown'],
                    ['File Size', sw.size],
                    ['Architecture', '64-bit'],
                    ['License', 'Full (Pre-Activated)'],
                    ['Category', sw.category],
                    ['Compatible OS', sw.os],
                    ['Release Date', sw.date],
                  ].map(([key, val]) => (
                    <tr key={key} className="border-b border-[#2a2a4a] last:border-0">
                      <td className="py-1.5 px-2 text-[#666680] font-semibold w-36">{key}</td>
                      <td className="py-1.5 px-2 text-[#a0a0b8]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-sm font-bold text-[#f0f0f0] pl-3 border-l-[3px] border-[#e84545] mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-xs text-[#a0a0b8] space-y-1.5 mb-5">
              <li>Full version with all premium features unlocked</li>
              <li>Pre-activated — no serial key or internet required</li>
              <li>Multilingual support with all languages included</li>
              <li>Compatible with Windows 10 and Windows 11 (64-bit)</li>
              <li>Includes all latest updates and patches</li>
              <li>Clean installer — no adware or bundled software</li>
            </ul>

            {/* Screenshots */}
            <h3 className="text-sm font-bold text-[#f0f0f0] pl-3 border-l-[3px] border-[#e84545] mb-3">📷 Screenshots</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
              {screenshots.map((src, i) => (
                <div key={i} className="rounded overflow-hidden border border-[#2a2a4a] hover:border-[#e84545] transition-colors cursor-pointer" style={{ aspectRatio: '16/10', position: 'relative' }}>
                  <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover" sizes="200px" />
                </div>
              ))}
            </div>

            {/* System requirements */}
            <h3 className="text-sm font-bold text-[#f0f0f0] pl-3 border-l-[3px] border-[#e84545] mb-3">💻 System Requirements</h3>
            <div className="rounded border border-l-[3px] border-[#f5a623] p-4 mb-5" style={{ background: '#13132b' }}>
              <table className="w-full border-collapse text-xs">
                <tbody>
                  {[
                    ['Processor', 'Intel Core i5 / AMD Ryzen 5 (2.0 GHz+)'],
                    ['RAM', '8 GB minimum (16 GB recommended)'],
                    ['GPU', '2 GB VRAM, DirectX 12'],
                    ['Storage', '20 GB free space (SSD recommended)'],
                    ['OS', 'Windows 10 / 11 (64-bit)'],
                  ].map(([key, val]) => (
                    <tr key={key} className="border-b border-[#2a2a4a] last:border-0">
                      <td className="py-1.5 px-2 text-[#666680] font-semibold w-28">{key}</td>
                      <td className="py-1.5 px-2 text-[#a0a0b8]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How to install */}
            <h3 className="text-sm font-bold text-[#f0f0f0] pl-3 border-l-[3px] border-[#e84545] mb-3">How to Install</h3>
            <ul className="list-decimal list-inside text-xs text-[#a0a0b8] space-y-1.5 mb-5">
              <li>Click the download button and save the compressed file</li>
              <li>Disable antivirus temporarily (false positive warning)</li>
              <li>Extract with WinRAR or 7-Zip using the password below</li>
              <li>Run <code className="bg-[#13132b] text-[#f5a623] px-1.5 py-0.5 rounded font-mono">Setup.exe</code> as Administrator</li>
              <li>Follow the wizard — do NOT connect to internet during install</li>
              <li>Copy the <code className="bg-[#13132b] text-[#f5a623] px-1.5 py-0.5 rounded font-mono">Crack</code> folder contents to the install directory</li>
              <li>Launch the software — it will be fully activated!</li>
            </ul>

            {/* Password */}
            <div className="flex items-center gap-2.5 rounded border border-[#2a2a4a] p-3 mb-5" style={{ background: '#13132b' }}>
              <span className="text-xs text-[#666680]">🔒 Archive Password:</span>
              <code className="bg-[#1a1a35] text-[#f5a623] px-2 py-1 rounded font-mono text-xs">www.GetIntoPC.com</code>
            </div>

            {/* DOWNLOAD BOX */}
            <div className="rounded-lg border-2 border-[#e84545] p-6 text-center mb-5" style={{ background: 'linear-gradient(135deg,#1a2040,#0d1a35)' }}>
              <h3 className="text-lg font-black text-white mb-1.5">⬇ Download {sw.title.split(' Free')[0].split(' v')[0]}</h3>
              <p className="text-xs text-[#666680] mb-5">Direct link • No survey • No redirects • {sw.size} compressed</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <a href="#" className="inline-flex items-center gap-2 bg-[#e84545] hover:bg-[#c73333] text-white text-sm font-bold px-7 py-3 rounded-md transition-all hover:-translate-y-0.5">
                  ⬇ Direct Download
                </a>
                <a href="#" className="inline-flex items-center gap-2 border-2 border-[#e84545] text-[#e84545] hover:bg-[#e84545] hover:text-white text-sm font-bold px-5 py-3 rounded-md transition-all">
                  💾 Mirror Link
                </a>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded border border-l-[3px] border-[#e84545] p-3" style={{ background: '#13132b' }}>
              <h4 className="text-xs font-bold text-[#e84545] mb-1.5">⚠ Important Note</h4>
              <p className="text-xs text-[#a0a0b8]">
                This software is provided for <strong className="text-[#f0f0f0]">educational and testing purposes only</strong>.
                Please purchase a genuine license for commercial use. GetIntoPC does not host any files — all links redirect to third-party hosts.
              </p>
            </div>
          </div>
        </article>

        {/* Related */}
        <div className="mt-8">
          <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b-2 border-[#2a2a4a]">
            <div className="w-1 h-5 bg-[#e84545] rounded" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#f0f0f0]">🔄 Related Software</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(s => <SoftwareCard key={s.slug} software={s} />)}
          </div>
        </div>
      </main>

      <Sidebar />
    </div>
  );
}
