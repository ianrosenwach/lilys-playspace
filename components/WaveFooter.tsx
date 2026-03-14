export default function WaveFooter() {
  return (
    <div className="mt-12 relative z-10">
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        height="60"
        className="block w-full"
      >
        <path
          d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,50 1440,48 L1440,60 L0,60 Z"
          fill="#FF4FAE"
        />
      </svg>
      <div className="bg-[#FF4FAE] py-5 text-center">
        <p className="text-[18px] font-bold text-white tracking-tight">Lily&apos;s Playspace</p>
        <p className="text-white/70 text-[12px] mt-0.5">✦ ✦ ✦ ✦ ✦</p>
      </div>
    </div>
  )
}
