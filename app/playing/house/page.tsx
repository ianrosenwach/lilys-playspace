'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'

const HOUSE_SVGS: Record<string, string> = {
  classic: `<ellipse cx="36" cy="62" rx="28" ry="3.5" fill="#000" opacity="0.15"/><rect x="10" y="32" width="52" height="26" rx="4" fill="#FFCBA4"/><rect x="10" y="32" width="52" height="4" fill="#FFB77A" opacity="0.5"/><polygon points="36,6 66,32 6,32" fill="#FF6B6B"/><polygon points="36,10 56,28 36,28" fill="#FF8C8C" opacity="0.4"/><polygon points="36,6 66,32 6,32" fill="none" stroke="#D94F4F" stroke-width="1.5"/><rect x="48" y="12" width="8" height="14" rx="2" fill="#CC5555"/><rect x="46" y="10" width="12" height="4" rx="2" fill="#BB4444"/><rect x="27" y="40" width="18" height="18" rx="3" fill="#8B4513"/><rect x="27" y="40" width="18" height="8" rx="2" fill="#A0522D"/><circle cx="42" cy="50" r="1.8" fill="#FFD700"/><rect x="12" y="36" width="12" height="10" rx="2" fill="#AED6F1"/><line x1="18" y1="36" x2="18" y2="46" stroke="#fff" stroke-width="1" opacity="0.7"/><line x1="12" y1="41" x2="24" y2="41" stroke="#fff" stroke-width="1" opacity="0.7"/><rect x="48" y="36" width="12" height="10" rx="2" fill="#AED6F1"/><line x1="54" y1="36" x2="54" y2="46" stroke="#fff" stroke-width="1" opacity="0.7"/><line x1="48" y1="41" x2="60" y2="41" stroke="#fff" stroke-width="1" opacity="0.7"/><rect x="10" y="56" width="52" height="4" rx="2" fill="#5DBB63" opacity="0.6"/><circle cx="16" cy="55" r="3" fill="#FF78C4" opacity="0.9"/><circle cx="56" cy="55" r="3" fill="#FF78C4" opacity="0.9"/>`,
  apartment: `<ellipse cx="36" cy="62" rx="22" ry="2.5" fill="#000" opacity="0.10"/><rect x="14" y="10" width="44" height="50" rx="5" fill="#B0C4DE"/><rect x="14" y="10" width="44" height="8" rx="4" fill="#C8D8EC" opacity="0.6"/><rect x="10" y="8" width="52" height="6" rx="3" fill="#7B96B2"/><rect x="22" y="4" width="8" height="8" rx="2" fill="#9AAEC2"/><rect x="42" y="4" width="8" height="8" rx="2" fill="#9AAEC2"/><line x1="14" y1="26" x2="58" y2="26" stroke="#8FA8C0" stroke-width="1" opacity="0.5"/><line x1="14" y1="40" x2="58" y2="40" stroke="#8FA8C0" stroke-width="1" opacity="0.5"/><rect x="18" y="14" width="9" height="9" rx="2" fill="#FFF9C4"/><rect x="31" y="14" width="9" height="9" rx="2" fill="#AED6F1"/><rect x="44" y="14" width="9" height="9" rx="2" fill="#FFF9C4"/><rect x="18" y="28" width="9" height="9" rx="2" fill="#AED6F1"/><rect x="44" y="28" width="9" height="9" rx="2" fill="#AED6F1"/><rect x="18" y="42" width="9" height="9" rx="2" fill="#FFF9C4"/><rect x="44" y="42" width="9" height="9" rx="2" fill="#AED6F1"/><rect x="28" y="46" width="16" height="14" rx="3" fill="#5D4037"/><circle cx="41" cy="54" r="1.5" fill="#FFD700"/>`,
  castle: `<ellipse cx="36" cy="62" rx="22" ry="2.5" fill="#000" opacity="0.10"/><rect x="14" y="24" width="44" height="36" rx="3" fill="#C0A882"/><rect x="8" y="16" width="16" height="46" rx="2" fill="#B89A6A"/><rect x="48" y="16" width="16" height="46" rx="2" fill="#B89A6A"/><rect x="8" y="12" width="4" height="6" rx="1" fill="#A08858"/><rect x="14" y="12" width="4" height="6" rx="1" fill="#A08858"/><rect x="20" y="12" width="4" height="6" rx="1" fill="#A08858"/><rect x="48" y="12" width="4" height="6" rx="1" fill="#A08858"/><rect x="54" y="12" width="4" height="6" rx="1" fill="#A08858"/><rect x="60" y="12" width="4" height="6" rx="1" fill="#A08858"/><rect x="22" y="20" width="4" height="5" rx="1" fill="#B89A6A"/><rect x="28" y="20" width="4" height="5" rx="1" fill="#B89A6A"/><rect x="34" y="20" width="4" height="5" rx="1" fill="#B89A6A"/><rect x="40" y="20" width="4" height="5" rx="1" fill="#B89A6A"/><rect x="46" y="20" width="4" height="5" rx="1" fill="#B89A6A"/><line x1="36" y1="4" x2="36" y2="20" stroke="#888" stroke-width="1.2"/><polygon points="36,4 46,9 36,14" fill="#FF4FAE"/><rect x="12" y="22" width="8" height="8" rx="2" fill="#AED6F1"/><rect x="52" y="22" width="8" height="8" rx="2" fill="#AED6F1"/><rect x="26" y="38" width="20" height="22" rx="10" fill="#4A3728"/><rect x="18" y="34" width="8" height="8" rx="2" fill="#FFF9C4" opacity="0.8"/><rect x="46" y="34" width="8" height="8" rx="2" fill="#FFF9C4" opacity="0.8"/>`,
  treehouse: `<ellipse cx="36" cy="62" rx="22" ry="2.5" fill="#000" opacity="0.10"/><rect x="30" y="40" width="12" height="22" rx="4" fill="#8B6914"/><line x1="36" y1="46" x2="18" y2="34" stroke="#7A5C10" stroke-width="4" stroke-linecap="round"/><line x1="36" y1="46" x2="54" y2="34" stroke="#7A5C10" stroke-width="4" stroke-linecap="round"/><ellipse cx="36" cy="22" rx="22" ry="16" fill="#5DBB63"/><ellipse cx="20" cy="28" rx="12" ry="10" fill="#4CAF50"/><ellipse cx="52" cy="28" rx="12" ry="10" fill="#4CAF50"/><ellipse cx="36" cy="16" rx="14" ry="10" fill="#66BB6A"/><rect x="16" y="32" width="40" height="4" rx="2" fill="#A07820"/><rect x="18" y="20" width="36" height="16" rx="3" fill="#FFCBA4"/><polygon points="36,8 56,22 16,22" fill="#FF8C8C"/><polygon points="36,8 56,22 16,22" fill="none" stroke="#E06060" stroke-width="1.2"/><rect x="30" y="26" width="12" height="10" rx="2" fill="#8B4513"/><rect x="20" y="22" width="8" height="7" rx="1" fill="#AED6F1"/><rect x="44" y="22" width="8" height="7" rx="1" fill="#AED6F1"/><line x1="28" y1="36" x2="26" y2="56" stroke="#A07820" stroke-width="1.5"/><line x1="34" y1="36" x2="32" y2="56" stroke="#A07820" stroke-width="1.5"/><line x1="26.5" y1="42" x2="32.5" y2="42" stroke="#A07820" stroke-width="1.2"/><line x1="25.5" y1="48" x2="31.5" y2="48" stroke="#A07820" stroke-width="1.2"/>`,
  beach: `<ellipse cx="36" cy="62" rx="28" ry="3" fill="#000" opacity="0.08"/><rect x="18" y="44" width="3" height="16" rx="1" fill="#A07820"/><rect x="28" y="44" width="3" height="16" rx="1" fill="#A07820"/><rect x="41" y="44" width="3" height="16" rx="1" fill="#A07820"/><rect x="51" y="44" width="3" height="16" rx="1" fill="#A07820"/><rect x="14" y="42" width="44" height="4" rx="2" fill="#DEB887"/><rect x="14" y="26" width="44" height="18" rx="4" fill="#FFF8DC"/><polygon points="36,10 62,28 10,28" fill="#F4A460"/><polygon points="36,10 62,28 10,28" fill="none" stroke="#D4894A" stroke-width="1.5"/><rect x="28" y="32" width="16" height="12" rx="3" fill="#87CEEB"/><rect x="16" y="30" width="9" height="8" rx="2" fill="#ADE8F4"/><rect x="47" y="30" width="9" height="8" rx="2" fill="#ADE8F4"/><path d="M8 57 Q18 53 28 57 Q38 61 48 57 Q58 53 66 57" fill="none" stroke="#87CEEB" stroke-width="1.5" opacity="0.7"/>`,
  igloo: `<ellipse cx="36" cy="58" rx="30" ry="6" fill="#E8F4FF" opacity="0.4"/><ellipse cx="36" cy="42" rx="26" ry="22" fill="#E8F4FF"/><ellipse cx="30" cy="36" rx="10" ry="8" fill="#fff" opacity="0.6"/><path d="M10 48 Q36 26 62 48" fill="none" stroke="#B0D8F0" stroke-width="1" opacity="0.6"/><path d="M12 54 Q36 34 60 54" fill="none" stroke="#B0D8F0" stroke-width="1" opacity="0.6"/><ellipse cx="36" cy="42" rx="26" ry="22" fill="none" stroke="#90C8E8" stroke-width="1.5"/><rect x="24" y="50" width="24" height="10" rx="5" fill="#D4EEF8"/><rect x="28" y="52" width="16" height="8" rx="4" fill="#1a1f40"/><polygon points="20,60 22,60 21,64" fill="#AED6F1"/><polygon points="30,60 32,60 31,64" fill="#AED6F1"/><polygon points="40,60 42,60 41,64" fill="#AED6F1"/><polygon points="50,60 52,60 51,64" fill="#AED6F1"/>`,
  houseboat: `<rect x="0" y="50" width="72" height="14" rx="8" fill="#4FC3F7" opacity="0.4"/><path d="M2 54 Q18 50 34 54 Q50 58 66 54" fill="none" stroke="#29B6F6" stroke-width="1.5" opacity="0.7"/><path d="M8 50 L10 58 Q36 62 62 58 L64 50 Z" fill="#FF8C8C"/><path d="M8 50 L10 58 Q36 62 62 58 L64 50 Z" fill="none" stroke="#E05555" stroke-width="1.2"/><rect x="14" y="28" width="44" height="24" rx="4" fill="#FFF8DC"/><polygon points="36,12 62,30 10,30" fill="#FF78C4"/><polygon points="36,12 62,30 10,30" fill="none" stroke="#E055A0" stroke-width="1.2"/><circle cx="20" cy="38" r="5" fill="#AED6F1"/><circle cx="20" cy="38" r="5" fill="none" stroke="#7FB3D3" stroke-width="1.2"/><circle cx="52" cy="38" r="5" fill="#AED6F1"/><circle cx="52" cy="38" r="5" fill="none" stroke="#7FB3D3" stroke-width="1.2"/><rect x="29" y="36" width="14" height="16" rx="3" fill="#8B4513"/><circle cx="40" cy="45" r="1.5" fill="#FFD700"/><line x1="36" y1="2" x2="36" y2="14" stroke="#888" stroke-width="1.5"/><polygon points="36,2 46,6 36,10" fill="#FFD700"/>`,
  tiny: `<circle cx="22" cy="56" r="6" fill="#555"/><circle cx="22" cy="56" r="4" fill="#777"/><circle cx="22" cy="56" r="1.5" fill="#999"/><circle cx="50" cy="56" r="6" fill="#555"/><circle cx="50" cy="56" r="4" fill="#777"/><circle cx="50" cy="56" r="1.5" fill="#999"/><rect x="10" y="46" width="52" height="10" rx="3" fill="#C8A870"/><rect x="14" y="28" width="44" height="20" rx="4" fill="#DEB887"/><ellipse cx="36" cy="28" rx="22" ry="10" fill="#DDA0DD"/><ellipse cx="36" cy="28" rx="22" ry="10" fill="none" stroke="#BB88BB" stroke-width="1.2"/><rect x="28" y="22" width="8" height="5" rx="2" fill="#AED6F1" opacity="0.8"/><rect x="27" y="34" width="14" height="14" rx="7" fill="#8B4513"/><circle cx="38" cy="42" r="1.5" fill="#FFD700"/><rect x="15" y="32" width="9" height="8" rx="2" fill="#AED6F1"/><rect x="48" y="32" width="9" height="8" rx="2" fill="#AED6F1"/><rect x="15" y="40" width="9" height="4" rx="1" fill="#8B4513"/><circle cx="17" cy="39" r="2" fill="#FF78C4"/><circle cx="20" cy="38" r="2" fill="#FFD700"/><circle cx="23" cy="39" r="2" fill="#FF78C4"/><rect x="4" y="50" width="10" height="2" rx="1" fill="#888"/><circle cx="4" cy="51" r="2" fill="#666"/>`,
}

const THEMES: Record<string, { sky: string; ground: string; groundTop: string; sun: string }> = {
  classic:   { sky: 'linear-gradient(180deg,#1a3a8c 0%,#2a5ab0 45%,#3a7a28 68%,#2a5a18 100%)', ground: 'linear-gradient(180deg,#3d8b28 0%,#2a6018 100%)', groundTop: '#4a9e30', sun: 'rgba(255,220,80,0.28)' },
  apartment: { sky: 'linear-gradient(180deg,#1a2a5c 0%,#2a3a80 45%,#888 68%,#666 100%)',       ground: 'linear-gradient(180deg,#777 0%,#555 100%)',         groundTop: '#888',    sun: 'rgba(200,220,255,0.2)' },
  castle:    { sky: 'linear-gradient(180deg,#2a1a4c 0%,#4a2a7c 45%,#3a4a28 68%,#2a3a18 100%)', ground: 'linear-gradient(180deg,#3a5020 0%,#283810 100%)',    groundTop: '#4a6028', sun: 'rgba(200,150,255,0.22)' },
  treehouse: { sky: 'linear-gradient(180deg,#0a3a18 0%,#1a5a28 45%,#2a7a30 68%,#1a5a20 100%)', ground: 'linear-gradient(180deg,#2a7020 0%,#1a5010 100%)',    groundTop: '#3a8828', sun: 'rgba(255,240,100,0.3)' },
  beach:     { sky: 'linear-gradient(180deg,#0a6a9a 0%,#1a8ac0 35%,#f4d03f 65%,#87CEEB 80%,#4a9a60 90%,#2a7a40 100%)', ground: 'linear-gradient(180deg,#c8a440 0%,#a07820 100%)', groundTop: '#e0b840', sun: 'rgba(255,200,50,0.4)' },
  igloo:     { sky: 'linear-gradient(180deg,#0a1a3c 0%,#1a2a5c 45%,#c8e8f8 68%,#a8d8f0 100%)', ground: 'linear-gradient(180deg,#d0e8f8 0%,#a8c8e8 100%)',   groundTop: '#e8f4ff', sun: 'rgba(180,220,255,0.25)' },
  houseboat: { sky: 'linear-gradient(180deg,#0a2a5c 0%,#1a4a8c 35%,#1a6aaa 60%,#0a4a7c 100%)', ground: 'linear-gradient(180deg,#1a6aaa 0%,#0a4a7c 100%)',  groundTop: '#2a8acc', sun: 'rgba(255,220,100,0.3)' },
  tiny:      { sky: 'linear-gradient(180deg,#2a1a4c 0%,#4a3a7c 45%,#6a5a9c 65%,#3a4a28 78%,#2a3a18 100%)', ground: 'linear-gradient(180deg,#4a6030 0%,#2a4018 100%)', groundTop: '#5a7838', sun: 'rgba(255,180,255,0.25)' },
}

const DECOR: Record<string, { s: string; n: string }[]> = {
  classic: [
    { s: '🌳', n: 'Tree' }, { s: '🌷', n: 'Flowers' }, { s: '🌻', n: 'Sunflower' }, { s: '🌈', n: 'Rainbow' },
    { s: '⭐', n: 'Stars' }, { s: '🐱', n: 'Cat' }, { s: '🐶', n: 'Dog' }, { s: '🪴', n: 'Plant' },
    { s: '📪', n: 'Mailbox' }, { s: '⛲', n: 'Fountain' }, { s: '🦋', n: 'Butterfly' }, { s: '🍄', n: 'Mushroom' },
  ],
  apartment: [
    { s: '🌳', n: 'Tree' }, { s: '🌆', n: 'City view' }, { s: '🚲', n: 'Bicycle' }, { s: '☁️', n: 'Cloud' },
    { s: '⭐', n: 'Stars' }, { s: '🐱', n: 'Cat' }, { s: '🪴', n: 'Plant' }, { s: '📪', n: 'Mailbox' },
    { s: '🚗', n: 'Car' }, { s: '🌙', n: 'Moon' }, { s: '🦋', n: 'Butterfly' }, { s: '🎆', n: 'Fireworks' },
  ],
  castle: [
    { s: '🐉', n: 'Dragon' }, { s: '⚔️', n: 'Sword' }, { s: '👑', n: 'Crown' }, { s: '🛡️', n: 'Shield' },
    { s: '🌲', n: 'Pine tree' }, { s: '🦅', n: 'Eagle' }, { s: '🌙', n: 'Moon' }, { s: '⭐', n: 'Stars' },
    { s: '🪄', n: 'Magic wand' }, { s: '🔮', n: 'Crystal ball' }, { s: '🦁', n: 'Lion' }, { s: '🌹', n: 'Rose' },
  ],
  treehouse: [
    { s: '🦉', n: 'Owl' }, { s: '🐿️', n: 'Squirrel' }, { s: '🍎', n: 'Apple' }, { s: '🪺', n: 'Nest' },
    { s: '🌿', n: 'Leaves' }, { s: '🍄', n: 'Mushroom' }, { s: '🦋', n: 'Butterfly' }, { s: '🐦', n: 'Bird' },
    { s: '🌈', n: 'Rainbow' }, { s: '🐰', n: 'Bunny' }, { s: '🌺', n: 'Flower' }, { s: '🌙', n: 'Moon' },
  ],
  beach: [
    { s: '🦀', n: 'Crab' }, { s: '🐚', n: 'Shell' }, { s: '⛵', n: 'Sailboat' }, { s: '🏄', n: 'Surfer' },
    { s: '🌴', n: 'Palm tree' }, { s: '🐬', n: 'Dolphin' }, { s: '☀️', n: 'Sun' }, { s: '🌊', n: 'Wave' },
    { s: '🦩', n: 'Flamingo' }, { s: '🐠', n: 'Fish' }, { s: '⛱️', n: 'Umbrella' }, { s: '🦞', n: 'Lobster' },
  ],
  igloo: [
    { s: '🐧', n: 'Penguin' }, { s: '❄️', n: 'Snowflake' }, { s: '🦭', n: 'Seal' }, { s: '🎿', n: 'Skis' },
    { s: '☃️', n: 'Snowman' }, { s: '🌨️', n: 'Snow' }, { s: '🦊', n: 'Arctic fox' }, { s: '🌌', n: 'Aurora' },
    { s: '🐻‍❄️', n: 'Polar bear' }, { s: '🛷', n: 'Sled' }, { s: '⭐', n: 'Stars' }, { s: '🌙', n: 'Moon' },
  ],
  houseboat: [
    { s: '⚓', n: 'Anchor' }, { s: '🐟', n: 'Fish' }, { s: '⛵', n: 'Sailboat' }, { s: '🦆', n: 'Duck' },
    { s: '🌊', n: 'Wave' }, { s: '🐙', n: 'Octopus' }, { s: '🦀', n: 'Crab' }, { s: '🌅', n: 'Sunset' },
    { s: '🎣', n: 'Fishing' }, { s: '🦭', n: 'Seal' }, { s: '🐳', n: 'Whale' }, { s: '🌙', n: 'Moon' },
  ],
  tiny: [
    { s: '🌻', n: 'Sunflower' }, { s: '🐱', n: 'Cat' }, { s: '🪴', n: 'Plant' }, { s: '🌈', n: 'Rainbow' },
    { s: '🦋', n: 'Butterfly' }, { s: '🍄', n: 'Mushroom' }, { s: '🐰', n: 'Bunny' }, { s: '⭐', n: 'Stars' },
    { s: '🌙', n: 'Moon' }, { s: '🌷', n: 'Flowers' }, { s: '🐦', n: 'Bird' }, { s: '🏮', n: 'Lantern' },
  ],
}

const LILY_CHEERS = [
  "<strong>So cute! 💕</strong> What else should we add?",
  "<strong>Amazing! 🌟</strong> Keep decorating!",
  "<strong>I love it! ✨</strong> Your house looks magical!",
  "<strong>Perfect! 🎉</strong> You have great taste!",
  "<strong>Beautiful! 🌸</strong> This is the best house ever!",
  "<strong>Wow! 😍</strong> That looks incredible!",
]

const HOUSES = [
  { id: 'classic', label: 'Classic' },
  { id: 'apartment', label: 'Apartment' },
  { id: 'castle', label: 'Castle' },
  { id: 'treehouse', label: 'Treehouse' },
  { id: 'beach', label: 'Beach house' },
  { id: 'igloo', label: 'Igloo' },
  { id: 'houseboat', label: 'Houseboat' },
  { id: 'tiny', label: 'Tiny house' },
]

type Screen = 'pick' | 'decorate' | 'share'
type DecorPos = { emoji: string; cx: number; cy: number }

const css = `
:root {
  --pink: #FF4FAE;
  --pink-light: #FF78C4;
  --teal: #30D4A8;
  --dark: #1a0f2e;
  --darker: #120b20;
  --gold: #FFD166;
}
.house-game-root {
  font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  background: var(--darker);
  min-height: 100vh;
  color: #fff;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.stars {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 25% 55%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 45% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 65% 35%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 80% 65%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(800px at 15% 20%, rgba(255,78,174,0.08) 0%, transparent 55%),
    radial-gradient(800px at 85% 80%, rgba(48,212,168,0.06) 0%, transparent 55%);
}
.wrapper {
  position: relative; z-index: 1;
  max-width: 1060px; margin: 0 auto;
  padding: 1.2rem 1.2rem 2rem;
}
.header { display:flex; align-items:center; gap:12px; margin-bottom:1.1rem; }
.back-btn {
  background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.14);
  border-radius:12px; padding:7px 14px; color:rgba(255,255,255,0.65);
  font-size:13px; font-weight:600; cursor:pointer; text-decoration:none; transition:all 0.18s;
}
.back-btn:hover { background:rgba(255,255,255,0.13); color:#fff; }
.game-title { font-size:22px; font-weight:800; letter-spacing:-0.5px; }
.game-title span { color:var(--pink-light); }
.lily-card { display:flex; align-items:center; gap:10px; margin-bottom:1.1rem; }
.lily-icon {
  width:40px; height:40px; border-radius:50%;
  background:linear-gradient(135deg,var(--pink-light),var(--pink));
  display:flex; align-items:center; justify-content:center;
  font-size:19px; flex-shrink:0; box-shadow:0 4px 14px rgba(255,78,174,0.4);
}
.lily-bubble {
  background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.11);
  border-radius:16px; padding:9px 14px;
  font-size:13px; color:rgba(255,255,255,0.82); font-weight:500; line-height:1.45;
}
.lily-bubble strong { color:#fff; }
.house-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.house-card {
  background: rgba(255,255,255,0.07);
  border: 2.5px solid rgba(255,255,255,0.12);
  border-radius: 22px;
  padding: 12px 8px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.18s;
  position: relative;
  overflow: hidden;
}
.house-card::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 65%);
  pointer-events:none;
}
.house-card:hover {
  border-color:rgba(255,78,174,0.55);
  background:rgba(255,78,174,0.12);
  transform:translateY(-3px);
  box-shadow:0 8px 28px rgba(255,78,174,0.2);
}
.house-card svg { width:72px; height:64px; margin:0 auto 7px; display:block; }
.house-label { font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); }
.decorate-layout {
  display: grid;
  grid-template-columns: 1fr 148px;
  gap: 12px;
  align-items: start;
}
.stage-wrap {
  border-radius:26px; overflow:hidden;
  border:1.5px solid rgba(255,255,255,0.08);
}
.stage {
  position:relative; height:380px; overflow:hidden;
  transition: background 0.5s ease;
}
.stage-ground {
  position:absolute; bottom:0; left:0; right:0; height:34%;
  pointer-events:none;
}
.stage-ground::before {
  content:''; position:absolute; top:-8px; left:0; right:0; height:16px;
  background: var(--ground-top, #4a9e30);
  border-radius:50% 50% 0 0 / 80% 80% 0 0;
}
.sky-cloud {
  position:absolute; border-radius:50px; pointer-events:none;
  background:rgba(255,255,255,0.10);
}
.sky-sun {
  position:absolute; top:10%; right:12%;
  width:34px; height:34px; border-radius:50%;
  pointer-events:none;
}
.stage-house {
  position:absolute; bottom:30%; left:50%; transform:translateX(-50%);
  width:180px; filter:drop-shadow(0 14px 28px rgba(0,0,0,0.45));
  pointer-events:none; z-index:2;
}
.placed-decor {
  position:absolute; font-size:32px; transform:translate(-50%,-50%);
  cursor:grab; z-index:3;
  filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  animation:pop-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
  touch-action:none; user-select:none;
}
.placed-decor:active { cursor:grabbing; }
@keyframes pop-in {
  from { transform:translate(-50%,-50%) scale(0) rotate(-12deg); opacity:0; }
  to   { transform:translate(-50%,-50%) scale(1) rotate(0deg);   opacity:1; }
}
.stage-bar {
  padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:8px;
  background:rgba(20,14,40,0.9);
}
.clear-btn {
  background:transparent; border:1.5px solid rgba(255,255,255,0.14);
  border-radius:12px; padding:8px 14px;
  color:rgba(255,255,255,0.5); font-size:12px; font-weight:700; cursor:pointer; transition:all 0.18s;
}
.clear-btn:hover { color:#fff; border-color:rgba(255,255,255,0.3); }
.save-btn {
  flex:1; background:linear-gradient(135deg,var(--teal),#00B890);
  border:none; border-radius:12px; padding:9px 16px;
  color:#fff; font-size:13px; font-weight:800; cursor:pointer;
  box-shadow:0 4px 16px rgba(48,212,168,0.32); transition:transform 0.15s;
}
.save-btn:hover { transform:translateY(-1px); }
.tray {
  background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.09);
  border-radius:22px; padding:10px 8px;
  display:flex; flex-direction:column; gap:5px;
}
.tray-scroll { max-height:360px; overflow-y:auto; padding-right:2px; display:flex; flex-direction:column; gap:5px; }
.tray-scroll::-webkit-scrollbar { width:3px; }
.tray-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.12); border-radius:2px; }
.decor-btn {
  width:100%; background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.11);
  border-radius:12px; padding:7px 8px;
  display:flex; align-items:center; gap:7px; cursor:pointer; transition:all 0.16s; text-align:left;
}
.decor-btn:hover:not(.used) {
  background:rgba(255,120,196,0.2); border-color:rgba(255,78,174,0.45); transform:translateX(-2px);
}
.decor-btn.used { opacity:0.28; cursor:default; }
.decor-btn-emoji { font-size:20px; line-height:1; flex-shrink:0; }
.decor-btn-name { font-size:10.5px; font-weight:700; color:rgba(255,255,255,0.78); }
.share-screen { text-align:center; padding:2rem 1rem; }
.share-stars { font-size:52px; margin-bottom:1rem; animation:bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes bounce-in { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
.share-title { font-size:28px; font-weight:900; letter-spacing:-0.5px; margin-bottom:6px; }
.share-sub { font-size:14px; color:rgba(255,255,255,0.55); margin-bottom:1.4rem; font-weight:500; }
.share-canvas-wrap {
  display:inline-block; border-radius:20px; overflow:hidden;
  box-shadow:0 16px 48px rgba(0,0,0,0.5); margin-bottom:1.4rem;
  border:2px solid rgba(255,78,174,0.35);
}
canvas { display:block; max-width:100%; }
.share-btns { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
.dl-btn {
  background:linear-gradient(135deg,var(--pink-light),var(--pink)); border:none; border-radius:14px;
  padding:13px 24px; color:#fff; font-size:14px; font-weight:800; cursor:pointer;
  box-shadow:0 6px 20px rgba(255,78,174,0.38); transition:transform 0.15s;
}
.dl-btn:hover { transform:translateY(-2px); }
.again-btn {
  background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.18);
  border-radius:14px; padding:13px 24px; color:#fff; font-size:14px; font-weight:800; cursor:pointer;
}
.again-btn:hover { background:rgba(255,255,255,0.14); }
@media(max-width:700px) {
  .house-grid { grid-template-columns:repeat(2,1fr); }
  .decorate-layout { grid-template-columns:1fr; }
  .tray { flex-direction:row; flex-wrap:wrap; }
  .tray-scroll { max-height:none; flex-direction:row; flex-wrap:wrap; }
  .decor-btn { width:auto; padding:6px 8px; }
  .decor-btn-name { display:none; }
  .stage { height:260px; }
}
`

export default function HouseGame() {
  const [screen, setScreen] = useState<Screen>('pick')
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [lilyMsg, setLilyMsg] = useState(
    "<strong>Which house do you want to live in? 🏠</strong> Tap your favorite to start decorating!"
  )
  const [usedEmojis, setUsedEmojis] = useState<Set<string>>(new Set())

  const selectedHouseRef = useRef<string | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const decorPositionsRef = useRef<DecorPos[]>([])

  // Auto-advance: tap selects AND immediately goes to decorate
  function selectHouse(id: string, label: string) {
    setSelectedHouse(id)
    selectedHouseRef.current = id
    setUsedEmojis(new Set())
    const name = label.charAt(0).toUpperCase() + label.slice(1)
    setLilyMsg(`<strong>Welcome to your ${name}! 🏠</strong> Tap decorations to add them — then drag to move!`)
    setScreen('decorate')
  }

  function goBack() {
    setScreen('pick')
    setSelectedHouse(null)
    selectedHouseRef.current = null
    stageRef.current?.querySelectorAll('.placed-decor').forEach(el => el.remove())
    setLilyMsg("<strong>Which house do you want to live in? 🏠</strong> Tap your favorite to start decorating!")
  }

  function makeDraggable(el: HTMLElement, stage: HTMLDivElement) {
    let dragging = false

    function start(cx: number, cy: number) {
      dragging = true
      el.style.zIndex = '10'
      el.style.transition = 'none'
    }
    function move(cx: number, cy: number) {
      if (!dragging) return
      const sr = stage.getBoundingClientRect()
      el.style.left = Math.min(95, Math.max(5, ((cx - sr.left) / sr.width * 100))) + '%'
      el.style.top  = Math.min(95, Math.max(5, ((cy - sr.top)  / sr.height * 100))) + '%'
    }
    function end() {
      dragging = false
      el.style.zIndex = '3'
      el.style.transition = ''
    }

    el.addEventListener('mousedown', e => { e.preventDefault(); start(e.clientX, e.clientY) })
    window.addEventListener('mousemove', e => move(e.clientX, e.clientY))
    window.addEventListener('mouseup', end)
    el.addEventListener('touchstart', e => { e.preventDefault(); start(e.touches[0].clientX, e.touches[0].clientY) }, { passive: false })
    window.addEventListener('touchmove', e => { if (dragging) { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY) } }, { passive: false })
    window.addEventListener('touchend', end)
  }

  function addDecor(emoji: string) {
    if (usedEmojis.has(emoji)) return
    const stage = stageRef.current
    if (!stage) return
    const x = 12 + Math.random() * 76
    const y = 12 + Math.random() * 72
    const el = document.createElement('div')
    el.className = 'placed-decor'
    el.textContent = emoji
    el.style.left = x + '%'
    el.style.top  = y + '%'
    stage.appendChild(el)
    setUsedEmojis(prev => new Set(Array.from(prev).concat(emoji)))
    setLilyMsg(LILY_CHEERS[Math.floor(Math.random() * LILY_CHEERS.length)])
    makeDraggable(el, stage)
  }

  function clearDecorations() {
    stageRef.current?.querySelectorAll('.placed-decor').forEach(el => el.remove())
    setUsedEmojis(new Set())
    setLilyMsg("<strong>All clear! 🎨</strong> Start decorating again!")
  }

  function goShare() {
    const stage = stageRef.current
    if (stage) {
      const sr = stage.getBoundingClientRect()
      decorPositionsRef.current = Array.from(stage.querySelectorAll('.placed-decor')).map(d => {
        const dr = d.getBoundingClientRect()
        return {
          emoji: (d as HTMLElement).textContent || '',
          cx: (dr.left + dr.width / 2 - sr.left) / sr.width,
          cy: (dr.top + dr.height / 2 - sr.top) / sr.height,
        }
      })
    }
    setScreen('share')
    setLilyMsg("<strong>Your house looks amazing! 🌟</strong> Save the picture and show everyone!")
  }

  useEffect(() => {
    if (screen === 'share') renderShareCanvas()
  }, [screen])

  function renderShareCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = 480, H = 360
    const house = selectedHouseRef.current

    // Per-theme sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7)
    if (house === 'beach') {
      skyGrad.addColorStop(0, '#0a6a9a'); skyGrad.addColorStop(0.5, '#1a8ac0'); skyGrad.addColorStop(1, '#87CEEB')
    } else if (house === 'igloo') {
      skyGrad.addColorStop(0, '#0a1a3c'); skyGrad.addColorStop(0.6, '#1a2a5c'); skyGrad.addColorStop(1, '#c8e8f8')
    } else if (house === 'castle') {
      skyGrad.addColorStop(0, '#2a1a4c'); skyGrad.addColorStop(0.5, '#4a2a7c'); skyGrad.addColorStop(1, '#3a4a28')
    } else if (house === 'treehouse') {
      skyGrad.addColorStop(0, '#0a3a18'); skyGrad.addColorStop(0.5, '#1a5a28'); skyGrad.addColorStop(1, '#2a7a30')
    } else if (house === 'houseboat') {
      skyGrad.addColorStop(0, '#0a2a5c'); skyGrad.addColorStop(0.5, '#1a4a8c'); skyGrad.addColorStop(1, '#1a6aaa')
    } else if (house === 'apartment') {
      skyGrad.addColorStop(0, '#1a2a5c'); skyGrad.addColorStop(0.5, '#2a3a80'); skyGrad.addColorStop(1, '#888')
    } else if (house === 'tiny') {
      skyGrad.addColorStop(0, '#2a1a4c'); skyGrad.addColorStop(0.5, '#4a3a7c'); skyGrad.addColorStop(1, '#6a5a9c')
    } else {
      skyGrad.addColorStop(0, '#1a3a8c'); skyGrad.addColorStop(0.5, '#2a5ab0'); skyGrad.addColorStop(1, '#3a7a28')
    }
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, W, H)

    // Per-theme ground
    const gc = house === 'beach' ? ['#c8a440', '#a07820']
      : house === 'igloo' ? ['#d0e8f8', '#a8c8e8']
      : house === 'houseboat' ? ['#1a6aaa', '#0a4a7c']
      : house === 'apartment' ? ['#777', '#555']
      : ['#3d8b28', '#2a6018']
    const gndGrad = ctx.createLinearGradient(0, H * 0.65, 0, H)
    gndGrad.addColorStop(0, gc[0]); gndGrad.addColorStop(1, gc[1])
    ctx.fillStyle = gndGrad
    ctx.fillRect(0, H * 0.65, W, H * 0.35)

    // Draw house SVG
    if (!house) return
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 64">${HOUSE_SVGS[house] || ''}</svg>`
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const hw = 200, hh = 178
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.4)'
      ctx.shadowBlur = 24
      ctx.shadowOffsetY = 14
      ctx.drawImage(img, (W - hw) / 2, H * 0.65 - hh * 0.72, hw, hh)
      ctx.restore()
      URL.revokeObjectURL(url)

      decorPositionsRef.current.forEach(({ emoji, cx, cy }) => {
        ctx.font = '32px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(emoji, cx * W, cy * H)
      })

      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.fillRect(0, H - 28, W, 28)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.font = 'bold 12px -apple-system,sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText("🌸 Lily's Playspace — Pick Your House", W / 2, H - 14)
      ctx.strokeStyle = 'rgba(255,78,174,0.5)'
      ctx.lineWidth = 3
      ctx.strokeRect(1.5, 1.5, W - 3, H - 3)
    }
    img.src = url
  }

  function downloadImage() {
    const a = document.createElement('a')
    a.download = 'my-lily-house.png'
    a.href = canvasRef.current?.toDataURL('image/png') || ''
    a.click()
  }

  function startOver() {
    setSelectedHouse(null)
    selectedHouseRef.current = null
    setUsedEmojis(new Set())
    decorPositionsRef.current = []
    stageRef.current?.querySelectorAll('.placed-decor').forEach(el => el.remove())
    setScreen('pick')
    setLilyMsg("<strong>Which house do you want to live in? 🏠</strong> Tap your favorite to start decorating!")
  }

  const theme = selectedHouse ? THEMES[selectedHouse] : THEMES.classic

  return (
    <>
      <style>{css}</style>
      <div className="house-game-root">
        <div className="stars" />
        <div className="wrapper">

          {/* Header */}
          <div className="header">
            {screen === 'pick'
              ? <Link className="back-btn" href="/playing">← Playing</Link>
              : <button className="back-btn" onClick={goBack}>← Change house</button>
            }
            <div className="game-title">🏠 Pick Your <span>House</span></div>
          </div>

          {/* Lily */}
          <div className="lily-card">
            <div className="lily-icon">🌸</div>
            <div className="lily-bubble" dangerouslySetInnerHTML={{ __html: lilyMsg }} />
          </div>

          {/* Screen 1: Pick */}
          {screen === 'pick' && (
            <div className="house-grid">
              {HOUSES.map(h => (
                <div
                  key={h.id}
                  className="house-card"
                  onClick={() => selectHouse(h.id, h.label)}
                >
                  <svg viewBox="0 0 72 64" dangerouslySetInnerHTML={{ __html: HOUSE_SVGS[h.id] }} />
                  <div className="house-label">{h.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Screen 2: Decorate */}
          {screen === 'decorate' && selectedHouse && (
            <div className="decorate-layout">
              <div className="stage-wrap">
                <div
                  className="stage"
                  ref={stageRef}
                  style={{ background: theme.sky } as React.CSSProperties}
                >
                  <div
                    className="sky-sun"
                    style={{
                      background: theme.sun,
                      boxShadow: `0 0 0 10px ${theme.sun.replace(/[\d.]+\)$/, v => String(parseFloat(v) * 0.3) + ')')}`,
                    }}
                  />
                  <div className="sky-cloud" style={{ width: 64, height: 20, top: '12%', left: '7%' }} />
                  <div className="sky-cloud" style={{ width: 42, height: 14, top: '20%', left: '17%' }} />
                  <div className="sky-cloud" style={{ width: 52, height: 18, top: '8%', right: '10%' }} />
                  <div className="sky-cloud" style={{ width: 32, height: 12, top: '26%', right: '20%' }} />
                  <div
                    className="stage-ground"
                    style={{ '--ground-top': theme.groundTop, background: theme.ground } as React.CSSProperties}
                  />
                  <svg
                    className="stage-house"
                    viewBox="0 0 72 64"
                    dangerouslySetInnerHTML={{ __html: HOUSE_SVGS[selectedHouse] }}
                  />
                </div>
                <div className="stage-bar">
                  <button className="clear-btn" onClick={clearDecorations}>↩ Clear</button>
                  <button className="save-btn" onClick={goShare}>📸 Save my house!</button>
                </div>
              </div>

              <div className="tray">
                <div className="tray-scroll">
                  {(DECOR[selectedHouse] || []).map(item => (
                    <button
                      key={item.s}
                      className={`decor-btn${usedEmojis.has(item.s) ? ' used' : ''}`}
                      onClick={() => addDecor(item.s)}
                    >
                      <span className="decor-btn-emoji">{item.s}</span>
                      <span className="decor-btn-name">{item.n}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Screen 3: Share */}
          {screen === 'share' && (
            <div className="share-screen">
              <div className="share-stars">🌟🌟🌟</div>
              <div className="share-title">Your house is ready! 🏠</div>
              <div className="share-sub">Look how amazing it turned out!</div>
              <div className="share-canvas-wrap">
                <canvas ref={canvasRef} width={480} height={360} />
              </div>
              <div className="share-btns">
                <button className="dl-btn" onClick={downloadImage}>⬇️ Save picture</button>
                <button className="again-btn" onClick={startOver}>🔄 Pick another house</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
