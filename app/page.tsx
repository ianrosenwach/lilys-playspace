import Link from 'next/link'
import BgShapes from '@/components/BgShapes'
import LilyAvatar from '@/components/LilyAvatar'
import WaveFooter from '@/components/WaveFooter'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FEF6FB' }}>
      <BgShapes />

      {/* Header */}
      <div className="text-center pt-12 pb-4 px-4 relative z-10">
        <p
          className="text-[11px] font-semibold tracking-[4px] uppercase mb-3"
          style={{ color: '#C060A0', opacity: 0.6 }}
        >
          Welcome to
        </p>
        <h1 className="text-[42px] font-bold tracking-tight leading-tight" style={{ color: '#1A0818' }}>
          Lily&apos;s <span style={{ color: '#FF4FAE' }}>Playspace</span>
        </h1>
      </div>

      {/* Hero */}
      <div className="flex items-center justify-center gap-10 max-w-[820px] mx-auto px-6 py-8 pb-12 relative z-10 flex-1 flex-wrap">
        {/* Lily */}
        <div className="flex-none">
          <LilyAvatar size={220} bubble="Hi! Where shall we go? ✨" />
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-5 flex-1 min-w-[280px]">
          {/* Learning card */}
          <Link
            href="/learning"
            className="block rounded-[24px] p-6 cursor-pointer no-underline relative overflow-hidden transition-all duration-200 hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #FF78C4 0%, #FF4FAE 100%)',
              boxShadow: '0 8px 30px rgba(255,80,174,0.35)',
            }}
          >
            <div
              className="absolute rounded-full pointer-events-none"
              style={{ top: -40, right: -40, width: 100, height: 100, background: 'rgba(255,255,255,0.15)' }}
            />
            <span className="text-[28px] mb-1.5 block">📚</span>
            <p className="text-[26px] font-bold text-white tracking-tight mb-1">Learning</p>
            <p className="text-[13px] font-medium mb-3.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Let&apos;s grow your brain today!
            </p>
            <div className="flex gap-1.5 flex-wrap mb-4">
              {['Spelling', 'Numbers', 'Quizzes', 'Reading'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-[12px] px-3 py-1 text-[11.5px] font-semibold text-white"
                  style={{ background: 'rgba(255,255,255,0.22)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div
              className="inline-flex items-center gap-1.5 rounded-[20px] px-5 py-2 text-[13px] font-bold text-white"
              style={{ background: 'rgba(255,255,255,0.28)', border: '1.5px solid rgba(255,255,255,0.4)' }}
            >
              Let&apos;s learn <ArrowIcon />
            </div>
          </Link>

          {/* Playing card — coming soon */}
          <div
            className="block rounded-[24px] p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #30D4A8 0%, #00A880 100%)',
              boxShadow: '0 8px 30px rgba(0,168,128,0.2)',
              opacity: 0.6,
              cursor: 'default',
            }}
          >
            <div
              className="absolute rounded-full pointer-events-none"
              style={{ top: -40, right: -40, width: 100, height: 100, background: 'rgba(255,255,255,0.15)' }}
            />
            {/* Coming Soon badge */}
            <div className="absolute top-4 right-4">
              <span
                className="text-[11px] font-bold uppercase tracking-[1.5px] px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.5)' }}
              >
                Coming Soon
              </span>
            </div>
            <span className="text-[28px] mb-1.5 block">🎮</span>
            <p className="text-[26px] font-bold text-white tracking-tight mb-1">Playing</p>
            <p className="text-[13px] font-medium mb-3.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Time for adventure and fun!
            </p>
            <div className="flex gap-1.5 flex-wrap mb-4">
              {['Memory', 'Puzzles', 'Adventure', 'Stories'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-[12px] px-3 py-1 text-[11.5px] font-semibold text-white"
                  style={{ background: 'rgba(255,255,255,0.22)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WaveFooter />
    </div>
  )
}
