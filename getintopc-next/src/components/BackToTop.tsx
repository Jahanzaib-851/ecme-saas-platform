'use client';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 w-10 h-10 bg-[#e84545] text-white rounded-full flex items-center justify-center text-lg shadow-[0_4px_15px_rgba(232,69,69,0.4)] hover:-translate-y-1 transition-transform z-50"
    >
      ↑
    </button>
  );
}
