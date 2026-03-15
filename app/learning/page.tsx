import Link from 'next/link'
import BgShapes from '@/components/BgShapes'
import WaveFooter from '@/components/WaveFooter'

const games = [
  {
    id: 'pi-day',
    href: '/learning/pi-day',
    icon: '🥧',
    title: 'Pi Day Adventure',
    description: 'Discover the magic of Pi — the number that never ends! Learn its history, see it in real life, then take the quiz.',
    tags: ['Math', 'History', 'Quiz'],
    color: 'pink' as const,
    badge: '🎂 March 14',
  },
  {
    id: 'states',
    href: '/learning/states',
    icon: '🗺️',
    title: 'State Explorer',
    description: 'Can you name all 50 states? The map lights up pink — type the state name and explore the whole country!',
    tags: ['Geography', 'USA', 'Game'],
    color: 'teal' as const,
    badge: null,
  },
]

function GameCard({ game }: { game: typeof games[0] }) {
  const isPink = game.color === 'pink'
  return (
    <Link
      href={game.href}
      className="block rounded-[24px] p-6 no-underline transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
      style={{
        background: '#fff',
        border: '1.5px solid #FFE0F4',
        boxShadow: '0 4px 16px rgba(200,80,140,0.09)',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex-none rounded-[18px] flex items-center justify-center text-[32px]"
          style={{ width: 64, height: 64, background: isPink ? 'linear-gradient(135deg,#FF78C4,#FF4FAE)' : 'linear-gradient(135deg,#30D4A8,#00A880)' }}
        >
          {game.icon}
        </div>
        <div className="flex-1">
          {game.badge && (
            <span
              className="inline-block text-[11px] font-bold px-3 py-1 rounded-[12px] mb-2"
              style={{ background: '#FFF0F9', color: '#C060A0', border: '1px solid #FFD6EE' }}
            >
              {game.badge}
            </span>
          )}
          <h2 className="text-[20px] font-bold tracking-tight mb-1" style={{ color: '#1A0818' }}>
            {game.title}
          </h2>
          <p className="text-[13px] font-medium leading-relaxed mb-3" style={{ color: '#7B3566' }}>
            {game.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11.5px] font-semibold px-3 py-1 rounded-[12px]"
                style={{ background: isPink ? 'linear-gradient(135deg,#FF78C4,#FF4FAE)' : 'linear-gradient(135deg,#30D4A8,#00A880)', color: '#fff' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div
          className="flex-none rounded-full flex items-center justify-center"
          style={{
            width: 36, height: 36,
            background: isPink ? 'linear-gradient(135deg,#FF78C4,#FF4FAE)' : 'linear-gradient(135deg,#30D4A8,#00A880)',
            boxShadow: isPink ? '0 4px 12px rgba(255,80,174,0.3)' : '0 4px 12px rgba(0,168,128,0.3)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width={14} height={14}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function LearningPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FEF6FB' }}>
      <BgShapes />

      {/* Header */}
      <div className="text-center pt-10 pb-4 px-4 relative z-10">
        <p className="text-[11px] font-semibold tracking-[3px] uppercase mb-2" style={{ color: '#C060A0', opacity: 0.6 }}>
          Lily&apos;s Playspace
        </p>
        <h1 className="text-[38px] font-bold tracking-tight leading-tight" style={{ color: '#1A0818' }}>
          Learning <span style={{ color: '#FF4FAE' }}>Hub</span>
        </h1>
        <p className="text-[13px] font-medium mt-1.5" style={{ color: '#7B3566', opacity: 0.8 }}>
          Pick a topic and start exploring!
        </p>
      </div>

      {/* Back link */}
      <div className="max-w-[760px] mx-auto px-6 pt-4 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold no-underline mb-6"
          style={{ color: '#C060A0', opacity: 0.8 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={16} height={16}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Playspace
        </Link>
      </div>

      {/* Games list */}
      <div className="max-w-[760px] mx-auto px-6 pb-12 relative z-10 w-full flex flex-col gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}

        {/* Coming soon placeholder */}
        <div
          className="rounded-[24px] p-6 flex items-center gap-4"
          style={{ background: '#fff', border: '1.5px dashed #FFD6EE', opacity: 0.6 }}
        >
          <div
            className="flex-none rounded-[18px] flex items-center justify-center text-[28px]"
            style={{ width: 64, height: 64, background: '#FFF0F9' }}
          >
            🌟
          </div>
          <div>
            <p className="text-[16px] font-bold" style={{ color: '#1A0818' }}>More adventures coming soon!</p>
            <p className="text-[13px] font-medium" style={{ color: '#7B3566' }}>New games and lessons are on the way...</p>
          </div>
        </div>
      </div>

      <WaveFooter />
    </div>
  )
}
