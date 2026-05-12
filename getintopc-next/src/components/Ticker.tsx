export default function Ticker() {
  const items = [
    'Adobe Photoshop 2025 v26.5',
    'AutoCAD 2025 Full',
    'Windows 11 Pro Activated',
    'Microsoft Office 2024',
    'CorelDRAW 2024',
    'Vegas Pro 22',
    'FL Studio 21',
    'Wondershare Filmora 13',
    '3ds Max 2025',
    'Blender 4.2',
  ];

  return (
    <div className="overflow-hidden border-b border-[#2a2a4a]" style={{ background: '#13132b' }}>
      <div className="max-w-[1200px] mx-auto px-5 py-1.5 flex items-center gap-3">
        <span className="bg-[#e84545] text-white text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap">
          🔴 LATEST
        </span>
        <div className="overflow-hidden flex-1">
          <span className="inline-block whitespace-nowrap text-xs text-[#a0a0b8] animate-ticker">
            {items.join(' &nbsp;&bull;&nbsp; ')}
          </span>
        </div>
      </div>
    </div>
  );
}
