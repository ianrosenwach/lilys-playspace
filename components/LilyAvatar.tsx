import Image from 'next/image'

interface LilyAvatarProps {
  size?: number
  bubble?: string
}

export default function LilyAvatar({ size = 220, bubble = "Hi! Where shall we go? ✨" }: LilyAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Image
        src="/lily-avatar.png"
        alt="Lily"
        width={size}
        height={size}
        priority
        className="rounded-full object-cover object-top"
        style={{
          border: '6px solid #fff',
          boxShadow: '0 0 0 3px #FFD6EE, 0 12px 40px rgba(255,80,160,0.25)',
          width: size,
          height: size,
        }}
      />
      <div
        className="lily-bubble bg-white rounded-[20px] px-4 py-2.5 text-[14px] font-medium text-center"
        style={{
          color: '#6B2050',
          boxShadow: '0 4px 20px rgba(200,80,140,0.12)',
          border: '1.5px solid #FFE0F4',
          maxWidth: size + 20,
        }}
      >
        {bubble}
      </div>
    </div>
  )
}
