'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WaveFooter from '@/components/WaveFooter'
import { saveScore, getLastScore, type GameScore } from '@/lib/supabase'

// ── Types ──
type Screen = 'intro' | 'what' | 'history' | 'reallife' | 'quiz' | 'score'

// ── Quiz data ──
const questions = [
  {
    q: "What shape does Pi (π) help us measure?",
    options: ["Squares", "Triangles", "Circles", "Stars"],
    correct: 2,
    emoji: "🔵",
    explanation: "Pi is the special number that connects the distance across a circle (diameter) to the distance around it (circumference). Every circle uses Pi!"
  },
  {
    q: "What is Pi approximately equal to?",
    options: ["2.71", "3.14", "4.00", "1.62"],
    correct: 1,
    emoji: "🎯",
    explanation: "Pi starts with 3.14159... That's why we celebrate Pi Day on March 14th (3/14)! The digits go on forever without repeating."
  },
  {
    q: "When is Pi Day celebrated every year?",
    options: ["January 1st", "July 22nd", "March 14th", "December 25th"],
    correct: 2,
    emoji: "📅",
    explanation: "Pi Day is March 14th — written as 3/14, which looks just like the first three digits of Pi: 3.14! Larry Shaw started this tradition in 1988."
  },
  {
    q: "Which ancient civilization used Pi to help build the pyramids?",
    options: ["Romans", "Vikings", "Egyptians", "Aztecs"],
    correct: 2,
    emoji: "🏺",
    explanation: "Ancient Egyptians used a value close to Pi (about 3.16) in their calculations when building the pyramids over 3,600 years ago. Amazing, right?"
  },
  {
    q: "Do the digits of Pi ever end or repeat?",
    options: ["Yes, they end at 100 digits", "Yes, they repeat every 10 digits", "No! They go on forever with no pattern", "They end when you reach 1 billion"],
    correct: 2,
    emoji: "♾️",
    explanation: "Pi is an 'irrational number' — its decimal digits go on infinitely (forever!) without ever repeating a pattern. That's one of the things that makes it so magical!"
  },
  {
    q: "Which famous scientist was born on Pi Day, March 14th?",
    options: ["Isaac Newton", "Albert Einstein", "Marie Curie", "Galileo Galilei"],
    correct: 1,
    emoji: "🎂",
    explanation: "Albert Einstein was born on March 14, 1879 — Pi Day! He grew up to be one of the most brilliant scientists who ever lived. Happy Birthday, Einstein!"
  }
]

const PI_DIGITS = ['1','4','1','5','9','2','6','5','3','5',' ','8','9','7','9','3','2','3','8','4','6',' ','2','6','4','3','3','8','3','2','7','9','...']

// ── Shared sub-components ──

function BgShapes() {
  return (
    <>
      <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 150, height: 150, background: '#FFE8F7', top: 10, left: -40 }} />
      <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 90, height: 90, background: '#E0FFF5', top: 50, right: -20 }} />
      <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 60, height: 60, background: '#FFF8DC', bottom: 250, left: 60 }} />
      <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 50, height: 50, background: '#E8E0FF', bottom: 320, right: 50 }} />
    </>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer mb-5 font-semibold text-[13px]"
      style={{ color: '#C060A0', opacity: 0.8 }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={16} height={16}>
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      Back to Adventure Map
    </button>
  )
}

function NextBtn({ onClick, label = 'Next →', teal = false }: { onClick: () => void; label?: string; teal?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3.5 border-none rounded-[16px] text-white text-[15px] font-bold cursor-pointer mt-4 transition-transform hover:-translate-y-0.5"
      style={{
        background: teal ? 'linear-gradient(135deg, #30D4A8, #00A880)' : 'linear-gradient(135deg, #FF78C4, #FF4FAE)',
        boxShadow: teal ? '0 6px 20px rgba(0,168,128,0.35)' : '0 6px 20px rgba(255,80,174,0.35)',
      }}
    >
      {label}
    </button>
  )
}

function SectionCard({ icon, title, desc, onClick, teal = false }: {
  icon: string; title: string; desc: string; onClick: () => void; teal?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3.5 w-full text-left rounded-[20px] px-6 py-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border-none"
      style={{
        background: teal ? 'linear-gradient(135deg, #30D4A8, #00A880)' : '#fff',
        border: teal ? 'none' : '1.5px solid #FFE0F4',
        boxShadow: teal ? '0 4px 16px rgba(0,168,128,0.2)' : '0 4px 16px rgba(200,80,140,0.09)',
      }}
    >
      <span className="text-[34px] flex-none">{icon}</span>
      <div className="flex-1">
        <div className="text-[17px] font-bold tracking-tight mb-0.5" style={{ color: teal ? '#fff' : '#1A0818' }}>{title}</div>
        <div className="text-[12.5px] font-medium" style={{ color: teal ? 'rgba(255,255,255,0.85)' : '#7B3566' }}>{desc}</div>
      </div>
      <div
        className="flex-none rounded-full flex items-center justify-center"
        style={{
          width: 36, height: 36,
          background: teal ? 'rgba(255,255,255,0.25)' : 'linear-gradient(135deg,#FF78C4,#FF4FAE)',
          boxShadow: teal ? 'none' : '0 4px 12px rgba(255,80,174,0.3)',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width={14} height={14}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

// ── Screens ──

function IntroScreen({ goTo, lastScore }: { goTo: (s: Screen) => void; lastScore: GameScore | null }) {
  return (
    <>
      <div className="text-center pt-10 pb-2 px-4 relative z-10">
        <p className="text-[11px] font-semibold tracking-[3px] uppercase mb-2" style={{ color: '#C060A0', opacity: 0.6 }}>
          Lily&apos;s Playspace · Learning
        </p>
        <h1 className="text-[36px] font-bold tracking-tight leading-tight" style={{ color: '#1A0818' }}>
          Pi Day <span style={{ color: '#FF4FAE' }}>Adventure!</span> 🥧
        </h1>
        <p className="text-[13px] font-medium mt-1.5" style={{ color: '#7B3566', opacity: 0.75 }}>
          March 14 is Pi Day — today we celebrate the most famous number in math!
        </p>
      </div>

      <div className="flex items-start justify-center gap-8 max-w-[820px] mx-auto px-6 py-6 pb-8 relative z-10 flex-wrap">
        {/* Lily col */}
        <div className="flex-none flex flex-col items-center gap-2.5" style={{ width: 190 }}>
          <Image
            src="/lily-avatar.png"
            alt="Lily"
            width={190}
            height={190}
            priority
            className="rounded-full object-cover object-top"
            style={{ border: '6px solid #fff', boxShadow: '0 0 0 3px #FFD6EE, 0 12px 40px rgba(255,80,160,0.25)', width: 190, height: 190 }}
          />
          <div
            className="lily-bubble bg-white rounded-[18px] px-3.5 py-2.5 text-[13.5px] font-medium text-center relative"
            style={{ color: '#6B2050', boxShadow: '0 4px 20px rgba(200,80,140,0.12)', border: '1.5px solid #FFE0F4', maxWidth: 200 }}
          >
            Hooray! Today is Pi Day! Let&apos;s explore! ✨
          </div>
        </div>

        {/* Content col */}
        <div className="flex-1 min-w-[260px]">
          {/* Last score banner */}
          {lastScore && (
            <div
              className="rounded-[16px] px-4 py-3 flex items-center gap-3 mb-4"
              style={{ background: 'linear-gradient(135deg,#30D4A8,#00A880)', boxShadow: '0 4px 16px rgba(0,168,128,0.25)', color: '#fff' }}
            >
              <span className="text-[22px]">🏆</span>
              <span className="text-[13px] font-semibold">
                Last score: {lastScore.score}/{lastScore.total} — {lastScore.score === lastScore.total ? 'Perfect! 🌟' : 'Keep practicing!'}
              </span>
            </div>
          )}

          {/* Day banner */}
          <div
            className="rounded-[16px] px-4 py-3 flex items-center gap-3 mb-4"
            style={{ background: 'linear-gradient(135deg,#30D4A8,#00A880)', boxShadow: '0 4px 16px rgba(0,168,128,0.25)', color: '#fff' }}
          >
            <span className="text-[24px]">📅</span>
            <span className="text-[13px] font-semibold">
              Today is March 14th — 3/14 — which looks just like 3.14, the start of Pi!
            </span>
          </div>

          {/* Pi hero */}
          <div
            className="rounded-[24px] px-8 py-6 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#FF78C4,#FF4FAE)', boxShadow: '0 8px 30px rgba(255,80,174,0.35)', color: '#fff' }}
          >
            <div className="absolute rounded-full" style={{ top: -40, right: -40, width: 110, height: 110, background: 'rgba(255,255,255,0.15)' }} />
            <div className="absolute text-[64px] font-extrabold" style={{ opacity: 0.25, right: '1.5rem', top: '50%', transform: 'translateY(-50%)', letterSpacing: -3 }}>π</div>
            <div className="text-[11px] font-bold uppercase tracking-[2px] mb-1.5" style={{ opacity: 0.8 }}>The Star of Today</div>
            <div className="text-[26px] font-bold tracking-tight mb-1.5">What is Pi?</div>
            <div className="text-[13px] font-medium max-w-[260px]" style={{ opacity: 0.88 }}>
              Pi (π) is a special number that helps us measure circles. It goes on forever and never repeats!
            </div>
          </div>

          {/* Section cards */}
          <div className="flex flex-col gap-3">
            <SectionCard icon="🔵" title="What IS Pi?" desc="Discover the magic number that rules all circles" onClick={() => goTo('what')} />
            <SectionCard icon="📜" title="Pi Through History" desc="People have known about Pi for thousands of years!" onClick={() => goTo('history')} />
            <SectionCard icon="🏗️" title="Pi in Real Life" desc="Wheels, pizza, planets — Pi is everywhere!" onClick={() => goTo('reallife')} />
            <SectionCard icon="🎯" title="Pi Quiz Challenge!" desc="Test what you know about Pi — can you get them all?" onClick={() => goTo('quiz')} teal />
          </div>
        </div>
      </div>
    </>
  )
}

function WhatIsPiScreen({ goTo }: { goTo: (s: Screen) => void }) {
  return (
    <>
      <div className="text-center pt-6 pb-2 px-4 relative z-10">
        <p className="text-[11px] font-semibold tracking-[3px] uppercase mb-2" style={{ color: '#C060A0', opacity: 0.6 }}>Lily&apos;s Playspace · Learning</p>
        <h1 className="text-[36px] font-bold tracking-tight" style={{ color: '#1A0818' }}>What <span style={{ color: '#FF4FAE' }}>is Pi?</span></h1>
      </div>
      <div className="max-w-[760px] mx-auto px-6 pb-12 relative z-10">
        <BackBtn onClick={() => goTo('intro')} />

        <div className="mb-6">
          <div className="text-[42px] mb-2">🔵</div>
          <h2 className="text-[28px] font-bold tracking-tight mb-1.5" style={{ color: '#1A0818' }}>The Number That Never Ends</h2>
          <p className="text-[14px] font-medium leading-relaxed" style={{ color: '#7B3566' }}>
            Pi is a special number that shows us how circles work. Every single circle in the whole universe uses Pi — from tiny coins to giant planets!
          </p>
        </div>

        <LessonCard pill="Step 1" title="What does Pi mean?">
          Imagine you have a circle. If you measure across the middle (the <strong>diameter</strong>), and then measure all the way around the edge (the <strong>circumference</strong>), something magical happens!
        </LessonCard>

        {/* Pi circle demo */}
        <div className="flex items-center justify-center gap-8 py-5 flex-wrap">
          <div className="relative" style={{ width: 140, height: 140 }}>
            <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" width={140} height={140}>
              <circle cx="70" cy="70" r="55" fill="none" stroke="#FFE0F4" strokeWidth="3"/>
              <circle cx="70" cy="70" r="55" fill="none" stroke="#FF4FAE" strokeWidth="3" strokeDasharray="345.6" strokeDashoffset="0" strokeLinecap="round"/>
              <line x1="15" y1="70" x2="125" y2="70" stroke="#FF78C4" strokeWidth="2.5" strokeDasharray="6 3"/>
              <circle cx="15" cy="70" r="4" fill="#FF4FAE"/>
              <circle cx="125" cy="70" r="4" fill="#FF4FAE"/>
              <text x="70" y="62" textAnchor="middle" fontSize="10" fill="#FF4FAE" fontWeight="700" fontFamily="system-ui">diameter</text>
              <text x="70" y="135" textAnchor="middle" fontSize="9" fill="#7B3566" fontFamily="system-ui">circumference</text>
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-[11px] font-bold" style={{ color: '#FF4FAE' }}>÷</div>
              <div className="text-[22px] font-extrabold" style={{ color: '#1A0818' }}>π</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              '🔵 Draw around the edge = circumference',
              '↔️ Draw across the middle = diameter',
              '✨ circumference ÷ diameter = always Pi!',
            ].map((s, i) => (
              <div key={i} className="rounded-[14px] px-4 py-2.5 text-[13px]" style={{ background: '#fff', border: '1.5px solid #FFE0F4' }}>{s}</div>
            ))}
          </div>
        </div>

        <LessonCard pill="Step 2" title="Pi's digits go on forever!">
          No matter how far mathematicians calculate Pi, the digits never repeat a pattern. It goes on <em>forever</em>! That&apos;s what makes it so special and mysterious. 🌟
        </LessonCard>

        {/* Pi digits display */}
        <div className="rounded-[20px] px-6 py-5 my-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1A0818,#3D1030)' }}>
          <div className="text-[11px] font-bold uppercase tracking-[2px] mb-2.5" style={{ color: '#FF78C4' }}>🎵 The digits of Pi (hover to highlight!)</div>
          <div className="font-mono text-[22px] font-bold leading-relaxed" style={{ color: '#fff', letterSpacing: 2 }}>
            <span className="pi-digit text-[28px]" style={{ color: '#FF78C4' }}>π = 3.</span>
            {PI_DIGITS.map((d, i) => (
              <span key={i} className="pi-digit">{d}</span>
            ))}
          </div>
        </div>

        <FunFact icon="🤯">
          Mathematicians have calculated Pi to over <strong>100 trillion decimal places</strong> using computers — and they still haven&apos;t found a pattern or an ending!
        </FunFact>

        <LessonCard pill="Did you know?" title="Why is it called Pi?">
          Pi is the 16th letter of the Greek alphabet (π). A mathematician named William Jones first used the symbol π for this number in 1706. It was chosen because &quot;perimeter&quot; in Greek starts with this letter! 🏛️
        </LessonCard>

        <NextBtn onClick={() => goTo('history')} label="Next: Pi Through History →" />
      </div>
    </>
  )
}

function HistoryScreen({ goTo }: { goTo: (s: Screen) => void }) {
  const items = [
    { year: '~4,000 years ago · Ancient Babylon 🌙', text: 'Babylonian mathematicians wrote on clay tablets that Pi was about <strong>3.125</strong>. They were building amazing things and needed to figure out circles!' },
    { year: '~3,600 years ago · Ancient Egypt 🐫', text: 'The Rhind Papyrus (an ancient scroll) shows Egyptians used a value close to <strong>3.16</strong> for Pi when building their magnificent pyramids!' },
    { year: '~250 BCE · Archimedes of Greece 🏛️', text: 'The brilliant mathematician Archimedes calculated that Pi was between 3.1408 and 3.1429. He used a clever trick: he drew shapes inside and outside a circle and kept adding more sides!' },
    { year: '480 CE · Zu Chongzhi of China 🀄', text: 'Chinese mathematician Zu Chongzhi calculated Pi to <strong>7 decimal places</strong> (3.1415926) — a record that stood for 900 years!' },
    { year: '1706 CE · William Jones names it π 📐', text: 'The Welsh mathematician William Jones started using the symbol <strong>π</strong> (the Greek letter for "p"). This caught on when the famous Euler used it too!' },
    { year: '1988 CE · First Pi Day! 🥧', text: 'Physicist Larry Shaw started celebrating Pi Day on March 14 at the San Francisco Exploratorium. Now millions of people celebrate it worldwide!' },
    { year: 'Today · 100 Trillion Digits 💻', text: 'Computers have calculated Pi to over <strong>100 trillion decimal places</strong>! Scientists keep going to test how powerful computers can be.' },
  ]

  return (
    <>
      <div className="text-center pt-6 pb-2 px-4 relative z-10">
        <p className="text-[11px] font-semibold tracking-[3px] uppercase mb-2" style={{ color: '#C060A0', opacity: 0.6 }}>Lily&apos;s Playspace · Learning</p>
        <h1 className="text-[36px] font-bold tracking-tight" style={{ color: '#1A0818' }}>Pi Through <span style={{ color: '#FF4FAE' }}>History!</span></h1>
      </div>
      <div className="max-w-[760px] mx-auto px-6 pb-12 relative z-10">
        <BackBtn onClick={() => goTo('intro')} />

        <div className="mb-6">
          <div className="text-[42px] mb-2">📜</div>
          <h2 className="text-[28px] font-bold tracking-tight mb-1.5" style={{ color: '#1A0818' }}>Humans Have Loved Pi for Ages!</h2>
          <p className="text-[14px] font-medium leading-relaxed" style={{ color: '#7B3566' }}>
            People have been curious about the relationship between circles and this special number for thousands of years — way before smartphones or even books!
          </p>
        </div>

        <div className="timeline">
          {items.map((item, i) => (
            <div key={i} className="relative mb-5">
              <div
                className="absolute rounded-full"
                style={{ left: -20, top: 4, width: 12, height: 12, background: '#FF4FAE', border: '2px solid #fff', boxShadow: '0 0 0 2px #FF78C4' }}
              />
              <div className="text-[11px] font-bold mb-0.5" style={{ color: '#FF4FAE', letterSpacing: 1 }}>{item.year}</div>
              <div
                className="text-[13.5px] font-medium leading-relaxed"
                style={{ color: '#3D1030' }}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </div>
          ))}
        </div>

        <FunFact icon="🎂" style={{ marginTop: '1.4rem' }}>
          Albert Einstein was born on March 14th — <strong>Pi Day!</strong> What are the chances? Maybe that&apos;s why he became such a great scientist! 🎉
        </FunFact>

        <NextBtn onClick={() => goTo('reallife')} label="Next: Pi in Real Life →" />
      </div>
    </>
  )
}

function RealLifeScreen({ goTo }: { goTo: (s: Screen) => void }) {
  const cards = [
    { icon: '🍕', title: 'Pizza & Pie', desc: 'When chefs calculate how much pizza to make, they use Pi to figure out how big each circle is!' },
    { icon: '🚗', title: 'Car Wheels', desc: 'Engineers use Pi to design tires. How far does one spin take you? Pi tells them!' },
    { icon: '🌍', title: 'Our Planet', desc: "Scientists use Pi to measure Earth's equator — about 40,075 km — using just its radius!" },
    { icon: '🏗️', title: 'Buildings & Bridges', desc: 'Curved bridges, round pillars, domed roofs — all built using Pi to be safe and strong!' },
    { icon: '🏀', title: 'Sports Balls', desc: 'Basketballs, tennis balls, soccer balls — Pi helps make them perfectly round and bouncy!' },
    { icon: '🚀', title: 'Space Missions', desc: 'NASA uses Pi to calculate orbits of planets and guide spacecraft billions of miles away!' },
  ]

  return (
    <>
      <div className="text-center pt-6 pb-2 px-4 relative z-10">
        <p className="text-[11px] font-semibold tracking-[3px] uppercase mb-2" style={{ color: '#C060A0', opacity: 0.6 }}>Lily&apos;s Playspace · Learning</p>
        <h1 className="text-[36px] font-bold tracking-tight" style={{ color: '#1A0818' }}>Pi in <span style={{ color: '#FF4FAE' }}>Real Life!</span></h1>
      </div>
      <div className="max-w-[760px] mx-auto px-6 pb-12 relative z-10">
        <BackBtn onClick={() => goTo('intro')} />

        <div className="mb-6">
          <div className="text-[42px] mb-2">🌍</div>
          <h2 className="text-[28px] font-bold tracking-tight mb-1.5" style={{ color: '#1A0818' }}>Pi is Everywhere Around You!</h2>
          <p className="text-[14px] font-medium leading-relaxed" style={{ color: '#7B3566' }}>
            Every time you see something round — wheels, bubbles, even your pupils! — Pi is quietly doing its math. Let&apos;s find it!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {cards.map((c) => (
            <div key={c.title} className="rounded-[18px] p-5 text-center" style={{ background: '#fff', border: '1.5px solid #FFE0F4', boxShadow: '0 3px 10px rgba(200,80,140,0.07)' }}>
              <div className="text-[32px] mb-2">{c.icon}</div>
              <div className="text-[14px] font-bold mb-1" style={{ color: '#1A0818' }}>{c.title}</div>
              <div className="text-[12px] font-medium leading-relaxed" style={{ color: '#7B3566' }}>{c.desc}</div>
            </div>
          ))}
        </div>

        <LessonCard pill="Try it!" title="The Pizza Challenge 🍕">
          If a pizza is 10 inches across (diameter), how far is it around the edge? Multiply the diameter by Pi!<br /><br />
          <strong>10 × 3.14 = 31.4 inches</strong> around the edge of your pizza! 🎉
        </LessonCard>

        <FunFact icon="🎵">
          Some people memorize Pi digits as a hobby! The world record is over <strong>70,000 digits</strong> memorized by heart. That person recited them for 10 hours straight — without a single mistake!
        </FunFact>

        <NextBtn onClick={() => goTo('quiz')} label="🎯 Now Take the Pi Quiz! →" teal />
      </div>
    </>
  )
}

function QuizScreen({ goTo, onFinish }: { goTo: (s: Screen) => void; onFinish: (score: number, total: number) => void }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)

  const q = questions[currentQ]
  const total = questions.length
  const pct = (currentQ / total) * 100
  const letters = ['A', 'B', 'C', 'D']

  function selectAnswer(idx: number) {
    if (answered) return
    const correct = idx === q.correct
    setAnswered(true)
    setSelected(idx)
    setIsCorrect(correct)
    if (correct) setScore(s => s + 1)
  }

  function next() {
    if (currentQ < total - 1) {
      setCurrentQ(q => q + 1)
      setAnswered(false)
      setSelected(null)
    } else {
      onFinish(score + (isCorrect ? 0 : 0), total)
      // score is updated via state, pass current accumulated
      onFinish(isCorrect ? score + 1 : score, total)
    }
  }

  return (
    <>
      <div className="text-center pt-6 pb-2 px-4 relative z-10">
        <p className="text-[11px] font-semibold tracking-[3px] uppercase mb-2" style={{ color: '#C060A0', opacity: 0.6 }}>Lily&apos;s Playspace · Learning</p>
        <h1 className="text-[36px] font-bold tracking-tight" style={{ color: '#1A0818' }}>Pi <span style={{ color: '#FF4FAE' }}>Quiz!</span> 🎯</h1>
      </div>
      <div className="max-w-[760px] mx-auto px-6 pb-12 relative z-10">
        <BackBtn onClick={() => goTo('intro')} />

        {/* Progress */}
        <div className="mb-5">
          <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: '#FFE0F4' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#FF78C4,#FF4FAE)' }}
            />
          </div>
          <div className="text-[12px] font-semibold" style={{ color: '#C060A0' }}>Question {currentQ + 1} of {total}</div>
        </div>

        {/* Question */}
        <div className="rounded-[20px] px-7 py-6 mb-5" style={{ background: '#fff', border: '1.5px solid #FFE0F4', boxShadow: '0 4px 16px rgba(200,80,140,0.09)' }}>
          <div className="text-[11px] font-bold uppercase tracking-[2px] mb-2.5" style={{ color: '#C060A0' }}>🧠 Think carefully!</div>
          <div className="text-[18px] font-bold leading-snug" style={{ color: '#1A0818' }}>{q.q}</div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mb-5">
          {q.options.map((opt, i) => {
            let extra = {}
            let letterBg = '#FFE0F4'
            let letterColor = '#C060A0'
            if (answered) {
              if (i === q.correct) {
                extra = { borderColor: '#00A880', background: '#E8FFF8', color: '#006050' }
                letterBg = '#00A880'; letterColor = '#fff'
              } else if (i === selected && i !== q.correct) {
                extra = { borderColor: '#FF4444', background: '#FFF0F0', color: '#AA2020' }
                letterBg = '#FF4444'; letterColor = '#fff'
              }
            }
            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className="flex items-center gap-3 rounded-[16px] px-4 py-3.5 text-[14px] font-semibold text-left cursor-pointer transition-all duration-150 border-2"
                style={{
                  background: '#fff',
                  borderColor: '#FFE0F4',
                  color: '#3D1030',
                  cursor: answered ? 'default' : 'pointer',
                  ...extra,
                  ...(!answered ? {} : {}),
                }}
                onMouseEnter={e => {
                  if (!answered) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#FF78C4'
                    ;(e.currentTarget as HTMLButtonElement).style.background = '#FFF0F9'
                  }
                }}
                onMouseLeave={e => {
                  if (!answered && i !== selected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#FFE0F4'
                    ;(e.currentTarget as HTMLButtonElement).style.background = '#fff'
                  }
                }}
              >
                <span
                  className="flex-none rounded-full flex items-center justify-center text-[12px] font-extrabold"
                  style={{ width: 28, height: 28, background: letterBg, color: letterColor }}
                >
                  {letters[i]}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div className="rounded-[16px] px-4 py-3.5 mb-4 flex items-start gap-3" style={{ background: '#fff', border: '1.5px solid #FFE0F4' }}>
            <span className="text-[24px] flex-none">{isCorrect ? '🎉' : '💡'}</span>
            <div className="text-[13.5px] font-medium leading-relaxed" style={{ color: '#3D1030' }}>
              <strong>{isCorrect ? `Correct! ${q.emoji}` : 'Not quite!'}</strong> {q.explanation}
            </div>
          </div>
        )}

        {answered && (
          <button
            onClick={next}
            className="w-full py-3.5 border-none rounded-[16px] text-white text-[15px] font-bold cursor-pointer transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#FF78C4,#FF4FAE)', boxShadow: '0 6px 20px rgba(255,80,174,0.35)' }}
          >
            {currentQ < total - 1 ? 'Next Question →' : 'See My Score! 🎊'}
          </button>
        )}
      </div>
    </>
  )
}

function ScoreScreen({ score, total, goTo, saving }: {
  score: number; total: number; goTo: (s: Screen) => void; saving: boolean
}) {
  const pct = score / total
  let stars = '⭐'
  let title = 'Keep exploring!'
  let msg = "Pi is tricky, but you're learning! Go back through the lessons and try again — you've got this! 🚀"

  if (pct === 1) {
    stars = '⭐⭐⭐'; title = 'Pi Master!'; msg = "You got every single question right! You really know your Pi! You're a true math superstar. 🌟"
  } else if (pct >= 0.67) {
    stars = '⭐⭐'; title = 'Great job!'; msg = "You know a lot about Pi! Try again to get a perfect score — you're so close! 💪"
  }

  return (
    <>
      <div className="text-center pt-6 pb-2 px-4 relative z-10">
        <p className="text-[11px] font-semibold tracking-[3px] uppercase mb-2" style={{ color: '#C060A0', opacity: 0.6 }}>Lily&apos;s Playspace · Learning</p>
        <h1 className="text-[36px] font-bold tracking-tight" style={{ color: '#1A0818' }}>You did <span style={{ color: '#FF4FAE' }}>it!</span></h1>
      </div>
      <div className="max-w-[760px] mx-auto px-6 pb-12 relative z-10">
        <div className="text-center py-8">
          <div className="text-[52px] mb-4">{stars}</div>
          <div className="text-[28px] font-bold tracking-tight mb-2" style={{ color: '#1A0818' }}>{title}</div>
          <div className="text-[18px] font-bold mb-1.5" style={{ color: '#FF4FAE' }}>{score} out of {total} correct!</div>
          <div className="text-[14px] font-medium leading-relaxed max-w-[340px] mx-auto mb-6" style={{ color: '#7B3566' }}>{msg}</div>
          {saving && <p className="text-[12px] mb-4" style={{ color: '#C060A0' }}>Saving your score... 💾</p>}
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => goTo('quiz')}
              className="inline-flex items-center gap-2 border-none rounded-[20px] px-7 py-3.5 text-[15px] font-bold text-white cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#FF78C4,#FF4FAE)', boxShadow: '0 6px 20px rgba(255,80,174,0.35)' }}
            >
              🔄 Try Again!
            </button>
            <button
              onClick={() => goTo('intro')}
              className="inline-flex items-center gap-2 border-none rounded-[20px] px-7 py-3.5 text-[15px] font-bold text-white cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#30D4A8,#00A880)', boxShadow: '0 6px 20px rgba(0,168,128,0.35)' }}
            >
              🗺️ Adventure Map
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Shared lesson/fact components ──

function LessonCard({ pill, title, children }: { pill: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] px-6 py-5 mb-4" style={{ background: '#fff', border: '1.5px solid #FFE0F4', boxShadow: '0 3px 12px rgba(200,80,140,0.07)' }}>
      <div className="flex items-center gap-3 mb-2.5">
        <span
          className="text-[11px] font-bold uppercase tracking-[1px] px-3 py-1 rounded-[20px] text-white"
          style={{ background: 'linear-gradient(135deg,#FF78C4,#FF4FAE)' }}
        >
          {pill}
        </span>
        <h3 className="text-[16px] font-bold tracking-tight" style={{ color: '#1A0818' }}>{title}</h3>
      </div>
      <p className="text-[13.5px] leading-relaxed" style={{ color: '#5A3050' }}>{children}</p>
    </div>
  )
}

function FunFact({ icon, children, style }: { icon: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="rounded-[18px] px-6 py-5 my-4 flex items-start gap-3"
      style={{ background: 'linear-gradient(135deg,#FFF4FB,#FFE8F7)', border: '1.5px dashed #FF78C4', ...style }}
    >
      <span className="text-[24px] flex-none mt-0.5">{icon}</span>
      <p className="text-[13.5px] font-medium leading-relaxed" style={{ color: '#3D1030' }}>{children}</p>
    </div>
  )
}

// ── Main page ──

export default function PiDayPage() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [finalScore, setFinalScore] = useState(0)
  const [quizTotal] = useState(questions.length)
  const [saving, setSaving] = useState(false)
  const [lastScore, setLastScore] = useState<GameScore | null>(null)

  useEffect(() => {
    getLastScore('pi-day').then(setLastScore)
  }, [])

  function goTo(s: Screen) {
    setScreen(s)
    window.scrollTo(0, 0)
  }

  async function handleQuizFinish(score: number, total: number) {
    setFinalScore(score)
    setSaving(true)
    goTo('score')
    await saveScore('pi-day', score, total)
    setSaving(false)
    // refresh last score
    const updated = await getLastScore('pi-day')
    setLastScore(updated)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FEF6FB' }}>
      <BgShapes />

      {/* Back to learning hub */}
      <div className="max-w-[820px] mx-auto px-6 pt-4 relative z-10 w-full">
        <Link
          href="/learning"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold no-underline"
          style={{ color: '#C060A0', opacity: 0.7 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Learning Hub
        </Link>
      </div>

      {screen === 'intro' && <IntroScreen goTo={goTo} lastScore={lastScore} />}
      {screen === 'what' && <WhatIsPiScreen goTo={goTo} />}
      {screen === 'history' && <HistoryScreen goTo={goTo} />}
      {screen === 'reallife' && <RealLifeScreen goTo={goTo} />}
      {screen === 'quiz' && <QuizScreen goTo={goTo} onFinish={handleQuizFinish} />}
      {screen === 'score' && <ScoreScreen score={finalScore} total={quizTotal} goTo={goTo} saving={saving} />}

      <WaveFooter />
    </div>
  )
}
