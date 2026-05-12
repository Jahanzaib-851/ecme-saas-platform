import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 border-t-2 border-[#e84545]" style={{ background: '#0a0a1e' }}>
      <div className="max-w-[1200px] mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <Link href="/" className="flex items-center gap-2 font-black text-xl text-white mb-4">
            <span className="w-9 h-9 bg-[#e84545] rounded-lg flex items-center justify-center text-white font-black text-lg">G</span>
            Get<span className="text-[#e84545]">Into</span>PC
          </Link>
          <p className="text-xs text-[#a0a0b8] leading-7 mb-4">
            GetIntoPC provides free software downloads including the latest full versions, cracks, serials, patches, and keygen. All downloads are tested before publishing.
          </p>
          <div className="flex gap-2">
            {['f', 't', 'y', 'in'].map(s => (
              <a key={s} href="#" className="w-8 h-8 border border-[#2a2a4a] rounded-full flex items-center justify-center text-xs text-[#a0a0b8] hover:border-[#e84545] hover:bg-[#e84545] hover:text-white transition-all">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-white mb-4 pb-2 border-b border-[#2a2a4a]">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/category/windows', label: 'Windows Software' },
              { href: '/category/games', label: 'PC Games' },
              { href: '/category/android', label: 'Android Apps' },
              { href: '/vlogs', label: 'Vlogs' },
            ].map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-[#a0a0b8] hover:text-[#e84545] transition-colors hover:pl-1">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-white mb-4 pb-2 border-b border-[#2a2a4a]">Categories</h4>
          <ul className="space-y-2">
            {['Graphics & Design', 'Video Editing', 'Audio Tools', 'Security', 'Developer Tools'].map(c => (
              <li key={c}>
                <a href="#" className="text-xs text-[#a0a0b8] hover:text-[#e84545] transition-colors hover:pl-1">{c}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-white mb-4 pb-2 border-b border-[#2a2a4a]">Support</h4>
          <ul className="space-y-2">
            {['DMCA', 'Privacy Policy', 'Terms of Use', 'Contact Us', 'Disclaimer'].map(c => (
              <li key={c}>
                <a href="#" className="text-xs text-[#a0a0b8] hover:text-[#e84545] transition-colors hover:pl-1">{c}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#2a2a4a] bg-black/30">
        <div className="max-w-[1200px] mx-auto px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#666680]">
          <span>© 2025 GetIntoPC. All rights reserved.</span>
          <span>For educational purposes only. We do not host any files.</span>
          <span className="flex gap-3">
            <a href="#" className="hover:text-[#e84545]">DMCA</a>
            <a href="#" className="hover:text-[#e84545]">Privacy</a>
            <a href="#" className="hover:text-[#e84545]">Contact</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
