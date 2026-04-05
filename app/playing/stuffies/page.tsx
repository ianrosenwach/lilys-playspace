'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────
// STUFFIE DEFINITIONS
// ─────────────────────────────────────────────
const TABS = ['Bears', 'Bunnies', 'Cats', 'Dogs', 'Others'] as const
type Tab = typeof TABS[number]

interface StuffieData {
  id: string
  name: string
  tab: Tab
}

const STUFFIES: StuffieData[] = [
  // Bears
  { id: 'brownie',    name: 'Brownie',    tab: 'Bears'   },
  { id: 'snowball',   name: 'Snowball',   tab: 'Bears'   },
  { id: 'panda',      name: 'Panda',      tab: 'Bears'   },
  { id: 'goldie',     name: 'Goldie',     tab: 'Bears'   },
  // Bunnies
  { id: 'rosie',      name: 'Rosie',      tab: 'Bunnies' },
  { id: 'cloudy',     name: 'Cloudy',     tab: 'Bunnies' },
  { id: 'cotton',     name: 'Cotton',     tab: 'Bunnies' },
  { id: 'lavender',   name: 'Lavender',   tab: 'Bunnies' },
  // Cats
  { id: 'sunny',      name: 'Sunny',      tab: 'Cats'    },
  { id: 'stormy',     name: 'Stormy',     tab: 'Cats'    },
  { id: 'biscuit',    name: 'Biscuit',    tab: 'Cats'    },
  { id: 'lilac',      name: 'Lilac',      tab: 'Cats'    },
  // Dogs
  { id: 'honey',      name: 'Honey',      tab: 'Dogs'    },
  { id: 'dotty',      name: 'Dotty',      tab: 'Dogs'    },
  { id: 'cheddar',    name: 'Cheddar',    tab: 'Dogs'    },
  { id: 'coco',       name: 'Coco',       tab: 'Dogs'    },
  // Others
  { id: 'ellie',      name: 'Ellie',      tab: 'Others'  },
  { id: 'starlight',  name: 'Starlight',  tab: 'Others'  },
  { id: 'pip',        name: 'Pip',        tab: 'Others'  },
  { id: 'froggy',     name: 'Froggy',     tab: 'Others'  },
]

// ─────────────────────────────────────────────
// STUFFIE SVG COMPONENTS
// All follow: round body + belly patch, bead eyes + highlight, rosy cheeks, curved smile
// ─────────────────────────────────────────────

function BrownieSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Bear ears */}
      <circle cx="28" cy="30" r="14" fill="#C47A3B" />
      <circle cx="72" cy="30" r="14" fill="#C47A3B" />
      <circle cx="28" cy="30" r="9"  fill="#DFA76E" />
      <circle cx="72" cy="30" r="9"  fill="#DFA76E" />
      {/* Body */}
      <circle cx="50" cy="60" r="36" fill="#C47A3B" />
      {/* Belly */}
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#DFA76E" />
      {/* Eyes */}
      <circle cx="38" cy="52" r="5" fill="#1A0818" />
      <circle cx="62" cy="52" r="5" fill="#1A0818" />
      <circle cx="40" cy="50" r="1.8" fill="white" />
      <circle cx="64" cy="50" r="1.8" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#7B4A20" />
      {/* Cheeks */}
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      {/* Smile */}
      <path d="M43 68 Q50 74 57 68" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function SnowballSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="28" cy="30" r="14" fill="#E8E8E4" />
      <circle cx="72" cy="30" r="14" fill="#E8E8E4" />
      <circle cx="28" cy="30" r="9"  fill="#F5F3F0" />
      <circle cx="72" cy="30" r="9"  fill="#F5F3F0" />
      <circle cx="50" cy="60" r="36" fill="#E8E8E4" />
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#F5F3F0" />
      <circle cx="38" cy="52" r="5" fill="#2A1A20" />
      <circle cx="62" cy="52" r="5" fill="#2A1A20" />
      <circle cx="40" cy="50" r="1.8" fill="white" />
      <circle cx="64" cy="50" r="1.8" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#BBBBBB" />
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#2A1A20" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function PandaSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="28" cy="30" r="14" fill="#2A2A2A" />
      <circle cx="72" cy="30" r="14" fill="#2A2A2A" />
      <circle cx="28" cy="30" r="9"  fill="#444" />
      <circle cx="72" cy="30" r="9"  fill="#444" />
      <circle cx="50" cy="60" r="36" fill="#F0EDEA" />
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#F5F3F0" />
      {/* Eye patches */}
      <ellipse cx="37" cy="50" rx="9" ry="8" fill="#2A2A2A" />
      <ellipse cx="63" cy="50" rx="9" ry="8" fill="#2A2A2A" />
      <circle cx="38" cy="52" r="4" fill="#1A1A1A" />
      <circle cx="62" cy="52" r="4" fill="#1A1A1A" />
      <circle cx="39" cy="50" r="1.8" fill="white" />
      <circle cx="63" cy="50" r="1.8" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#888" />
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#2A2A2A" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function GoldieSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="28" cy="30" r="14" fill="#E8A830" />
      <circle cx="72" cy="30" r="14" fill="#E8A830" />
      <circle cx="28" cy="30" r="9"  fill="#F5C97A" />
      <circle cx="72" cy="30" r="9"  fill="#F5C97A" />
      <circle cx="50" cy="60" r="36" fill="#E8A830" />
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#F5C97A" />
      <circle cx="38" cy="52" r="5" fill="#1A0818" />
      <circle cx="62" cy="52" r="5" fill="#1A0818" />
      <circle cx="40" cy="50" r="1.8" fill="white" />
      <circle cx="64" cy="50" r="1.8" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#B07820" />
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Bunnies ──

function RosieSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Tall bunny ears */}
      <ellipse cx="35" cy="22" rx="10" ry="22" fill="#FFB3D9" />
      <ellipse cx="65" cy="22" rx="10" ry="22" fill="#FFB3D9" />
      <ellipse cx="35" cy="22" rx="6"  ry="16" fill="#FF78C4" />
      <ellipse cx="65" cy="22" rx="6"  ry="16" fill="#FF78C4" />
      <circle cx="50" cy="62" r="34" fill="#FFB3D9" />
      <ellipse cx="50" cy="70" rx="20" ry="22" fill="#FFD4EC" />
      <circle cx="38" cy="54" r="5" fill="#1A0818" />
      <circle cx="62" cy="54" r="5" fill="#1A0818" />
      <circle cx="40" cy="52" r="1.8" fill="white" />
      <circle cx="64" cy="52" r="1.8" fill="white" />
      <ellipse cx="50" cy="64" rx="3" ry="2" fill="#FF78C4" />
      <circle cx="32" cy="66" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="66" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 70 Q50 76 57 70" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function CloudySVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <ellipse cx="35" cy="22" rx="10" ry="22" fill="#AAAAAA" />
      <ellipse cx="65" cy="22" rx="10" ry="22" fill="#AAAAAA" />
      <ellipse cx="35" cy="22" rx="6"  ry="16" fill="#D4D4D4" />
      <ellipse cx="65" cy="22" rx="6"  ry="16" fill="#D4D4D4" />
      <circle cx="50" cy="62" r="34" fill="#AAAAAA" />
      <ellipse cx="50" cy="70" rx="20" ry="22" fill="#D4D4D4" />
      <circle cx="38" cy="54" r="5" fill="#1A0818" />
      <circle cx="62" cy="54" r="5" fill="#1A0818" />
      <circle cx="40" cy="52" r="1.8" fill="white" />
      <circle cx="64" cy="52" r="1.8" fill="white" />
      <ellipse cx="50" cy="64" rx="3" ry="2" fill="#888" />
      <circle cx="32" cy="66" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="66" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 70 Q50 76 57 70" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function CottonSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <ellipse cx="35" cy="22" rx="10" ry="22" fill="#F4F4F0" />
      <ellipse cx="65" cy="22" rx="10" ry="22" fill="#F4F4F0" />
      <ellipse cx="35" cy="22" rx="6"  ry="16" fill="#FFD0E8" />
      <ellipse cx="65" cy="22" rx="6"  ry="16" fill="#FFD0E8" />
      <circle cx="50" cy="62" r="34" fill="#F4F4F0" />
      <ellipse cx="50" cy="70" rx="20" ry="22" fill="#FAFAFA" />
      <circle cx="38" cy="54" r="5" fill="#1A0818" />
      <circle cx="62" cy="54" r="5" fill="#1A0818" />
      <circle cx="40" cy="52" r="1.8" fill="white" />
      <circle cx="64" cy="52" r="1.8" fill="white" />
      <ellipse cx="50" cy="64" rx="3" ry="2" fill="#DDAACC" />
      <circle cx="32" cy="66" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="66" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 70 Q50 76 57 70" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function LavenderBunnySVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <ellipse cx="35" cy="22" rx="10" ry="22" fill="#C8A8F0" />
      <ellipse cx="65" cy="22" rx="10" ry="22" fill="#C8A8F0" />
      <ellipse cx="35" cy="22" rx="6"  ry="16" fill="#E0C8FF" />
      <ellipse cx="65" cy="22" rx="6"  ry="16" fill="#E0C8FF" />
      <circle cx="50" cy="62" r="34" fill="#C8A8F0" />
      <ellipse cx="50" cy="70" rx="20" ry="22" fill="#E0C8FF" />
      <circle cx="38" cy="54" r="5" fill="#1A0818" />
      <circle cx="62" cy="54" r="5" fill="#1A0818" />
      <circle cx="40" cy="52" r="1.8" fill="white" />
      <circle cx="64" cy="52" r="1.8" fill="white" />
      <ellipse cx="50" cy="64" rx="3" ry="2" fill="#9870C0" />
      <circle cx="32" cy="66" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="66" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 70 Q50 76 57 70" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Cats ──

function SunnyCatSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Triangular cat ears */}
      <polygon points="24,44 30,16 44,44" fill="#FF9944" />
      <polygon points="56,44 70,16 76,44" fill="#FF9944" />
      <polygon points="27,42 30,22 41,42" fill="#FFAAD4" />
      <polygon points="59,42 70,22 73,42" fill="#FFAAD4" />
      <circle cx="50" cy="60" r="36" fill="#FF9944" />
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#FFCC88" />
      <circle cx="38" cy="52" r="5" fill="#1A0818" />
      <circle cx="62" cy="52" r="5" fill="#1A0818" />
      <circle cx="40" cy="50" r="1.8" fill="white" />
      <circle cx="64" cy="50" r="1.8" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#DD7720" />
      {/* Whiskers */}
      <line x1="20" y1="62" x2="40" y2="64" stroke="#AA6620" strokeWidth="1.2" opacity="0.6" />
      <line x1="20" y1="67" x2="40" y2="67" stroke="#AA6620" strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="64" x2="80" y2="62" stroke="#AA6620" strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="67" x2="80" y2="67" stroke="#AA6620" strokeWidth="1.2" opacity="0.6" />
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function StormyCatSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <polygon points="24,44 30,16 44,44" fill="#8888AA" />
      <polygon points="56,44 70,16 76,44" fill="#8888AA" />
      <polygon points="27,42 30,22 41,42" fill="#FFAAD4" />
      <polygon points="59,42 70,22 73,42" fill="#FFAAD4" />
      <circle cx="50" cy="60" r="36" fill="#8888AA" />
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#BBBBCC" />
      <circle cx="38" cy="52" r="5" fill="#1A0818" />
      <circle cx="62" cy="52" r="5" fill="#1A0818" />
      <circle cx="40" cy="50" r="1.8" fill="white" />
      <circle cx="64" cy="50" r="1.8" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#666688" />
      <line x1="20" y1="62" x2="40" y2="64" stroke="#666688" strokeWidth="1.2" opacity="0.6" />
      <line x1="20" y1="67" x2="40" y2="67" stroke="#666688" strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="64" x2="80" y2="62" stroke="#666688" strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="67" x2="80" y2="67" stroke="#666688" strokeWidth="1.2" opacity="0.6" />
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function BiscuitCatSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <polygon points="24,44 30,16 44,44" fill="#F5DEB3" />
      <polygon points="56,44 70,16 76,44" fill="#F5DEB3" />
      <polygon points="27,42 30,22 41,42" fill="#FFAAD4" />
      <polygon points="59,42 70,22 73,42" fill="#FFAAD4" />
      <circle cx="50" cy="60" r="36" fill="#F5DEB3" />
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#FFF0D0" />
      <circle cx="38" cy="52" r="5" fill="#1A0818" />
      <circle cx="62" cy="52" r="5" fill="#1A0818" />
      <circle cx="40" cy="50" r="1.8" fill="white" />
      <circle cx="64" cy="50" r="1.8" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#C8A870" />
      <line x1="20" y1="62" x2="40" y2="64" stroke="#C8A870" strokeWidth="1.2" opacity="0.6" />
      <line x1="20" y1="67" x2="40" y2="67" stroke="#C8A870" strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="64" x2="80" y2="62" stroke="#C8A870" strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="67" x2="80" y2="67" stroke="#C8A870" strokeWidth="1.2" opacity="0.6" />
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function LilacCatSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <polygon points="24,44 30,16 44,44" fill="#C8A0D0" />
      <polygon points="56,44 70,16 76,44" fill="#C8A0D0" />
      <polygon points="27,42 30,22 41,42" fill="#FFAAD4" />
      <polygon points="59,42 70,22 73,42" fill="#FFAAD4" />
      <circle cx="50" cy="60" r="36" fill="#C8A0D0" />
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#E0C8E8" />
      <circle cx="38" cy="52" r="5" fill="#1A0818" />
      <circle cx="62" cy="52" r="5" fill="#1A0818" />
      <circle cx="40" cy="50" r="1.8" fill="white" />
      <circle cx="64" cy="50" r="1.8" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#9870A8" />
      <line x1="20" y1="62" x2="40" y2="64" stroke="#9870A8" strokeWidth="1.2" opacity="0.6" />
      <line x1="20" y1="67" x2="40" y2="67" stroke="#9870A8" strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="64" x2="80" y2="62" stroke="#9870A8" strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="67" x2="80" y2="67" stroke="#9870A8" strokeWidth="1.2" opacity="0.6" />
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Dogs ──

function HoneyDogSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Floppy ears hanging down */}
      <ellipse cx="20" cy="56" rx="13" ry="22" fill="#C07830" />
      <ellipse cx="80" cy="56" rx="13" ry="22" fill="#C07830" />
      <circle cx="50" cy="54" r="36" fill="#D4943B" />
      <ellipse cx="50" cy="62" rx="20" ry="24" fill="#ECC070" />
      <circle cx="38" cy="46" r="5" fill="#1A0818" />
      <circle cx="62" cy="46" r="5" fill="#1A0818" />
      <circle cx="40" cy="44" r="1.8" fill="white" />
      <circle cx="64" cy="44" r="1.8" fill="white" />
      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#8B4513" />
      <circle cx="32" cy="60" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="60" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 64 Q50 70 57 64" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function DottyDogSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <ellipse cx="20" cy="56" rx="13" ry="22" fill="#DDDDDD" />
      <ellipse cx="80" cy="56" rx="13" ry="22" fill="#DDDDDD" />
      <circle cx="50" cy="54" r="36" fill="#F0F0F0" />
      {/* Spots */}
      <circle cx="38" cy="68" r="7" fill="#2A2A2A" />
      <circle cx="60" cy="72" r="5" fill="#2A2A2A" />
      <circle cx="58" cy="44" r="4" fill="#2A2A2A" />
      <circle cx="30" cy="52" r="3" fill="#2A2A2A" />
      <ellipse cx="50" cy="62" rx="20" ry="24" fill="#FAFAFA" />
      <circle cx="38" cy="46" r="5" fill="#1A0818" />
      <circle cx="62" cy="46" r="5" fill="#1A0818" />
      <circle cx="40" cy="44" r="1.8" fill="white" />
      <circle cx="64" cy="44" r="1.8" fill="white" />
      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#888" />
      <circle cx="32" cy="60" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="60" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 64 Q50 70 57 64" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function CheddarDogSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Corgi - pointy-ish ears */}
      <ellipse cx="28" cy="30" rx="12" ry="18" fill="#E08840" transform="rotate(-15,28,30)" />
      <ellipse cx="72" cy="30" rx="12" ry="18" fill="#E08840" transform="rotate(15,72,30)" />
      <ellipse cx="28" cy="30" rx="7" ry="12" fill="#F5C090" transform="rotate(-15,28,30)" />
      <ellipse cx="72" cy="30" rx="7" ry="12" fill="#F5C090" transform="rotate(15,72,30)" />
      <circle cx="50" cy="58" r="36" fill="#E08840" />
      <ellipse cx="50" cy="66" rx="20" ry="24" fill="#F5C090" />
      <circle cx="38" cy="50" r="5" fill="#1A0818" />
      <circle cx="62" cy="50" r="5" fill="#1A0818" />
      <circle cx="40" cy="48" r="1.8" fill="white" />
      <circle cx="64" cy="48" r="1.8" fill="white" />
      <ellipse cx="50" cy="60" rx="5" ry="3.5" fill="#8B4513" />
      <circle cx="32" cy="62" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="62" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function CocoDogSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <ellipse cx="20" cy="56" rx="13" ry="22" fill="#6A3A10" />
      <ellipse cx="80" cy="56" rx="13" ry="22" fill="#6A3A10" />
      <circle cx="50" cy="54" r="36" fill="#8B5520" />
      <ellipse cx="50" cy="62" rx="20" ry="24" fill="#C08060" />
      <circle cx="38" cy="46" r="5" fill="#1A0818" />
      <circle cx="62" cy="46" r="5" fill="#1A0818" />
      <circle cx="40" cy="44" r="1.8" fill="white" />
      <circle cx="64" cy="44" r="1.8" fill="white" />
      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#4A2010" />
      <circle cx="32" cy="60" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="60" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 64 Q50 70 57 64" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Others ──

function EllieSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Big round elephant ears */}
      <circle cx="16" cy="54" r="20" fill="#9090B8" />
      <circle cx="84" cy="54" r="20" fill="#9090B8" />
      <circle cx="16" cy="54" r="14" fill="#B0B0D0" />
      <circle cx="84" cy="54" r="14" fill="#B0B0D0" />
      <circle cx="50" cy="54" r="36" fill="#9090B8" />
      <ellipse cx="50" cy="62" rx="20" ry="24" fill="#B0B0D0" />
      {/* Trunk */}
      <ellipse cx="50" cy="72" rx="6" ry="10" fill="#9090B8" />
      <circle cx="38" cy="46" r="5" fill="#1A0818" />
      <circle cx="62" cy="46" r="5" fill="#1A0818" />
      <circle cx="40" cy="44" r="1.8" fill="white" />
      <circle cx="64" cy="44" r="1.8" fill="white" />
      <circle cx="32" cy="58" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="58" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 66 Q50 72 57 66" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function StarlightSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Unicorn horn */}
      <polygon points="50,4 44,28 56,28" fill="#FFD700" />
      <line x1="50" y1="6" x2="44" y2="26" stroke="#FFC000" strokeWidth="1.5" opacity="0.5" />
      {/* Ears */}
      <ellipse cx="33" cy="26" rx="8" ry="14" fill="#F0EDEA" />
      <ellipse cx="67" cy="26" rx="8" ry="14" fill="#F0EDEA" />
      <ellipse cx="33" cy="26" rx="4" ry="9"  fill="#FFAAD4" />
      <ellipse cx="67" cy="26" rx="4" ry="9"  fill="#FFAAD4" />
      <circle cx="50" cy="60" r="36" fill="#F0EDEA" />
      <ellipse cx="50" cy="68" rx="20" ry="24" fill="#F9F7F5" />
      <circle cx="38" cy="52" r="5" fill="#1A0818" />
      <circle cx="62" cy="52" r="5" fill="#1A0818" />
      <circle cx="40" cy="50" r="1.8" fill="white" />
      <circle cx="64" cy="50" r="1.8" fill="white" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#FFAAD4" />
      {/* Rainbow mane hint */}
      <path d="M16 44 Q8 56 14 68" stroke="#FF78C4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M18 46 Q10 58 16 70" stroke="#FFD700" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M20 48 Q12 60 18 72" stroke="#5BE0C0" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <circle cx="32" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="64" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 68 Q50 74 57 68" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function PipSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Penguin - no distinct ears, small wing-like bumps */}
      <circle cx="50" cy="58" r="36" fill="#2A2A40" />
      {/* White belly */}
      <ellipse cx="50" cy="64" rx="22" ry="28" fill="#F0EDEA" />
      {/* Beak */}
      <polygon points="46,62 50,68 54,62" fill="#FFB300" />
      <circle cx="38" cy="50" r="5" fill="#1A0818" />
      <circle cx="62" cy="50" r="5" fill="#1A0818" />
      <circle cx="40" cy="48" r="1.8" fill="white" />
      <circle cx="64" cy="48" r="1.8" fill="white" />
      <circle cx="32" cy="62" r="7" fill="#FFAAD4" opacity="0.65" />
      <circle cx="68" cy="62" r="7" fill="#FFAAD4" opacity="0.65" />
      <path d="M43 70 Q50 76 57 70" stroke="#1A0818" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function FroggySVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Frog - eyes on top of head */}
      <circle cx="34" cy="30" r="12" fill="#5AC85A" />
      <circle cx="66" cy="30" r="12" fill="#5AC85A" />
      <circle cx="34" cy="28" r="7" fill="#1A0818" />
      <circle cx="66" cy="28" r="7" fill="#1A0818" />
      <circle cx="36" cy="26" r="2.2" fill="white" />
      <circle cx="68" cy="26" r="2.2" fill="white" />
      <circle cx="50" cy="62" r="36" fill="#5AC85A" />
      <ellipse cx="50" cy="70" rx="22" ry="24" fill="#90E090" />
      {/* No additional eyes on face needed */}
      <ellipse cx="50" cy="64" rx="5" ry="3" fill="#3A983A" />
      <circle cx="30" cy="66" r="8" fill="#FFAAD4" opacity="0.65" />
      <circle cx="70" cy="66" r="8" fill="#FFAAD4" opacity="0.65" />
      <path d="M40 72 Q50 80 60 72" stroke="#1A0818" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Map id → component
const STUFFIE_SVG: Record<string, () => JSX.Element> = {
  brownie:   BrownieSVG,
  snowball:  SnowballSVG,
  panda:     PandaSVG,
  goldie:    GoldieSVG,
  rosie:     RosieSVG,
  cloudy:    CloudySVG,
  cotton:    CottonSVG,
  lavender:  LavenderBunnySVG,
  sunny:     SunnyCatSVG,
  stormy:    StormyCatSVG,
  biscuit:   BiscuitCatSVG,
  lilac:     LilacCatSVG,
  honey:     HoneyDogSVG,
  dotty:     DottyDogSVG,
  cheddar:   CheddarDogSVG,
  coco:      CocoDogSVG,
  ellie:     EllieSVG,
  starlight: StarlightSVG,
  pip:       PipSVG,
  froggy:    FroggySVG,
}

// ─────────────────────────────────────────────
// BASKET SVG
// ─────────────────────────────────────────────

const BASKET_COLORS: Record<string, { fill: string; weave: string; handle: string; shadow: string }> = {
  natural: { fill: '#D4A84B', weave: '#B88A30', handle: '#C09030', shadow: '#A07020' },
  pink:    { fill: '#F4A0C0', weave: '#E07098', handle: '#E07098', shadow: '#C05080' },
  blue:    { fill: '#80B8E8', weave: '#5090C8', handle: '#5090C8', shadow: '#3070A8' },
  mint:    { fill: '#6DDCB8', weave: '#40B890', handle: '#40B890', shadow: '#2090 70' },
  peach:   { fill: '#F4B880', weave: '#D89050', handle: '#D89050', shadow: '#B87030' },
  purple:  { fill: '#C0A0E8', weave: '#9870C8', handle: '#9870C8', shadow: '#7850A8' },
  yellow:  { fill: '#F4DC60', weave: '#D8B820', handle: '#D8B820', shadow: '#B89000' },
  silver:  { fill: '#C8C8D4', weave: '#A0A0B0', handle: '#A0A0B0', shadow: '#808090' },
}

const RIBBON_OPTIONS = ['none', 'bigbow', 'stripes', 'polkadots'] as const
type RibbonOption = typeof RIBBON_OPTIONS[number]

interface BasketProps {
  colorKey: string
  ribbon: RibbonOption
  size?: number
  className?: string
}

function BasketSVG({ colorKey, ribbon, size = 200 }: BasketProps) {
  const c = BASKET_COLORS[colorKey] || BASKET_COLORS.natural
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      style={{ display: 'block' }}
    >
      {/* Handle */}
      <path
        d="M55 90 Q55 30 100 30 Q145 30 145 90"
        fill="none"
        stroke={c.handle}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M55 90 Q55 30 100 30 Q145 30 145 90"
        fill="none"
        stroke={c.fill}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Basket body */}
      <path d="M30 95 Q25 160 100 170 Q175 160 170 95 Z" fill={c.shadow} />
      <path d="M32 93 Q27 158 100 168 Q173 158 168 93 Z" fill={c.fill} />
      {/* Weave horizontal lines */}
      {[0,1,2,3,4,5].map(i => {
        const y = 100 + i * 11
        const xOff = i * 4
        return (
          <path
            key={i}
            d={`M${32 + xOff} ${y} Q100 ${y + 4} ${168 - xOff} ${y}`}
            fill="none"
            stroke={c.weave}
            strokeWidth="1.8"
            opacity="0.55"
          />
        )
      })}
      {/* Weave vertical lines */}
      {[45, 60, 75, 90, 105, 120, 135, 150, 165].map(x => (
        <line
          key={x}
          x1={x} y1="93"
          x2={x === 45 ? 48 : x === 165 ? 162 : x}
          y2="162"
          stroke={c.weave}
          strokeWidth="1.8"
          opacity="0.45"
        />
      ))}
      {/* Rim */}
      <ellipse cx="100" cy="93" rx="70" ry="10" fill={c.handle} />
      <ellipse cx="100" cy="91" rx="70" ry="9" fill={c.fill} />
      {/* Ribbon overlay */}
      {ribbon === 'bigbow' && (
        <g>
          <rect x="80" y="86" width="40" height="12" rx="6" fill="#FF78C4" opacity="0.9" />
          {/* Bow loops */}
          <ellipse cx="82" cy="92" rx="14" ry="8" fill="#FF4FAE" transform="rotate(-20,82,92)" />
          <ellipse cx="118" cy="92" rx="14" ry="8" fill="#FF4FAE" transform="rotate(20,118,92)" />
          <circle cx="100" cy="92" r="7" fill="#FF78C4" />
        </g>
      )}
      {ribbon === 'stripes' && (
        <g opacity="0.7">
          {[35, 55, 75, 95, 115, 135, 155].map(x => (
            <line key={x} x1={x} y1="82" x2={x - 8} y2="172" stroke="#FF4FAE" strokeWidth="5" />
          ))}
        </g>
      )}
      {ribbon === 'polkadots' && (
        <g opacity="0.75">
          {[
            [50,108],[70,120],[90,105],[110,125],[130,110],[150,122],
            [60,135],[80,148],[100,138],[120,150],[140,140],[55,155],
          ].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="#FF78C4" />
          ))}
        </g>
      )}
    </svg>
  )
}

// ─────────────────────────────────────────────
// STICKERS
// ─────────────────────────────────────────────
const STICKER_EMOJIS = ['⭐','❤️','🌸','🌈','🦋','✨','🌙','🍀','🎀','💫','🌺','🎵']

interface PlacedSticker {
  id: string
  emoji: string
  x: number  // % of basket container
  y: number  // % of basket container
}

// ─────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────
function StepIndicator({ step, step1Done }: { step: number; step1Done: boolean }) {
  return (
    <div className="flex items-center gap-3 justify-center">
      {[1, 2].map((s) => {
        const isActive = step === s
        const isDone = s === 1 && step1Done && step === 2
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full text-[13px] font-bold transition-all"
                style={{
                  width: 32, height: 32,
                  background: isDone ? '#5BE0C0' : isActive ? '#FF4FAE' : 'rgba(255,255,255,0.5)',
                  color: isDone || isActive ? 'white' : '#C060A0',
                  border: isActive || isDone ? 'none' : '1.5px solid #F4C0D1',
                  boxShadow: isActive ? '0 4px 12px rgba(255,80,174,0.35)' : 'none',
                }}
              >
                {isDone ? '✓' : s}
              </div>
              <span
                className="text-[13px] font-semibold hidden sm:block"
                style={{ color: isActive ? '#1A0818' : '#C060A0', opacity: isActive ? 1 : 0.6 }}
              >
                {s === 1 ? 'Pick Stuffies' : 'Decorate'}
              </span>
            </div>
            {s === 1 && (
              <div style={{ width: 28, height: 2, background: step === 2 ? '#5BE0C0' : '#F4C0D1', borderRadius: 2 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN GAME
// ─────────────────────────────────────────────
export default function StuffiesGame() {
  const [step, setStep] = useState<1 | 2>(1)
  const [activeTab, setActiveTab] = useState<Tab>('Bears')
  const [basketIds, setBasketIds] = useState<string[]>([])
  const [dragOverBasket, setDragOverBasket] = useState(false)
  const [dragStuffieId, setDragStuffieId] = useState<string | null>(null)

  // Step 2 state
  const [colorKey, setColorKey] = useState('natural')
  const [ribbon, setRibbon] = useState<RibbonOption>('none')
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [dragStickerEmoji, setDragStickerEmoji] = useState<string | null>(null)
  const [showReveal, setShowReveal] = useState(false)

  const basketDropRef = useRef<HTMLDivElement>(null)
  const basketCanvasRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  const tabStuffies = STUFFIES.filter(s => s.tab === activeTab)

  // ── Step 1: drag stuffie ──
  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('stuffieId', id)
    setDragStuffieId(id)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragStuffieId(null)
    setDragOverBasket(false)
  }, [])

  const handleBasketDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOverBasket(true)
  }, [])

  const handleBasketDragLeave = useCallback(() => {
    setDragOverBasket(false)
  }, [])

  const handleBasketDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('stuffieId')
    if (id && !basketIds.includes(id)) {
      setBasketIds(prev => [...prev, id])
    }
    setDragOverBasket(false)
    setDragStuffieId(null)
  }, [basketIds])

  // Also handle click-to-add for mobile / ease
  const handleStuffieClick = useCallback((id: string) => {
    if (!basketIds.includes(id)) {
      setBasketIds(prev => [...prev, id])
    }
  }, [basketIds])

  // ── Step 2: sticker drag ──
  const handleStickerDragStart = useCallback((e: React.DragEvent, emoji: string) => {
    e.dataTransfer.setData('stickerEmoji', emoji)
    setDragStickerEmoji(emoji)
  }, [])

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const emoji = e.dataTransfer.getData('stickerEmoji')
    if (!emoji || !basketCanvasRef.current) return
    const rect = basketCanvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPlacedStickers(prev => [
      ...prev,
      { id: `${Date.now()}`, emoji, x, y }
    ])
    setDragStickerEmoji(null)
  }, [])

  // ── Save as PNG ──
  const handleSave = useCallback(async () => {
    if (!revealRef.current) return
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(revealRef.current, {
        useCORS: true,
        background: '#FEF0FB',
        scale: 2,
      } as Parameters<typeof html2canvas>[1])
      const link = document.createElement('a')
      link.download = 'my-stuffie-basket.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error('Save failed', e)
    }
  }, [])

  const handleStartOver = useCallback(() => {
    setStep(1)
    setBasketIds([])
    setColorKey('natural')
    setRibbon('none')
    setPlacedStickers([])
    setShowReveal(false)
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FEF0FB', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', sans-serif" }}>
      {/* ── TOP BAR ── */}
      <div
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(254,240,251,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid #F4C0D1' }}
      >
        <Link
          href="/playing"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold no-underline"
          style={{ color: '#C060A0' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={16} height={16}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="hidden sm:block">Back</span>
        </Link>

        <div className="text-center flex-1 mx-2">
          <p className="text-[18px] font-bold tracking-tight" style={{ color: '#1A0818' }}>
            My Stuffies 🧸
          </p>
        </div>

        <div className="min-w-[60px] flex justify-end">
          <StepIndicator step={step} step1Done={basketIds.length > 0} />
        </div>
      </div>

      {/* ══════════════════════════════════════
          STEP 1 — PICK YOUR STUFFIES
      ══════════════════════════════════════ */}
      {step === 1 && (
        <div className="flex-1 flex flex-col max-w-[900px] mx-auto w-full px-4 pb-8">
          {/* Title */}
          <div className="text-center pt-6 pb-4">
            <h1 className="text-[28px] font-bold" style={{ color: '#1A0818' }}>
              Pick your stuffies! <span style={{ color: '#FF4FAE' }}>🧸</span>
            </h1>
            <p className="text-[13px] font-medium mt-1" style={{ color: '#7B3566' }}>
              Drag them into the basket (or tap to add)
            </p>
          </div>

          {/* Main content row */}
          <div className="flex gap-4 flex-col md:flex-row">
            {/* Left: tabs + grid */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-none rounded-[12px] px-4 py-2 text-[13px] font-bold transition-all"
                    style={{
                      background: activeTab === tab ? '#FF4FAE' : 'white',
                      color: activeTab === tab ? 'white' : '#C060A0',
                      border: '1.5px solid',
                      borderColor: activeTab === tab ? '#FF4FAE' : '#F4C0D1',
                      boxShadow: activeTab === tab ? '0 4px 12px rgba(255,80,174,0.3)' : 'none',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Stuffie grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tabStuffies.map(stuffie => {
                  const inBasket = basketIds.includes(stuffie.id)
                  const SvgComp = STUFFIE_SVG[stuffie.id]
                  return (
                    <div
                      key={stuffie.id}
                      draggable
                      onDragStart={e => handleDragStart(e, stuffie.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleStuffieClick(stuffie.id)}
                      className="relative rounded-[18px] p-3 flex flex-col items-center cursor-grab active:cursor-grabbing select-none transition-all duration-200"
                      style={{
                        background: 'white',
                        border: '1.5px solid #FFE0F4',
                        boxShadow: '0 3px 12px rgba(200,80,140,0.08)',
                        opacity: inBasket ? 0.4 : 1,
                        transform: dragStuffieId === stuffie.id ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {/* Teal checkmark badge */}
                      {inBasket && (
                        <div
                          className="absolute top-2 right-2 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                          style={{ width: 22, height: 22, background: '#5BE0C0', zIndex: 2 }}
                        >
                          ✓
                        </div>
                      )}
                      <div style={{ width: 70, height: 70 }}>
                        {SvgComp && <SvgComp />}
                      </div>
                      <p className="text-[12px] font-semibold mt-2 text-center" style={{ color: '#1A0818' }}>
                        {stuffie.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: basket drop zone */}
            <div className="md:w-[200px] flex flex-col items-center gap-3">
              <p className="text-[12px] font-bold uppercase tracking-[2px]" style={{ color: '#C060A0', opacity: 0.7 }}>
                Your Basket
              </p>

              {/* Basket drop target */}
              <div
                ref={basketDropRef}
                onDragOver={handleBasketDragOver}
                onDragLeave={handleBasketDragLeave}
                onDrop={handleBasketDrop}
                className="relative rounded-[20px] flex flex-col items-center justify-start transition-all duration-200"
                style={{
                  width: 180,
                  minHeight: 200,
                  background: dragOverBasket ? 'rgba(91,224,192,0.15)' : 'rgba(255,255,255,0.7)',
                  border: `2px dashed ${dragOverBasket ? '#5BE0C0' : '#F4C0D1'}`,
                  boxShadow: dragOverBasket ? '0 0 0 4px rgba(91,224,192,0.2)' : 'none',
                  padding: '12px 8px',
                }}
              >
                {/* Basket SVG */}
                <div className="pointer-events-none">
                  <BasketSVG colorKey="natural" ribbon="none" size={150} />
                </div>

                {/* Mini stuffies stacked inside */}
                {basketIds.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1 px-2">
                    {basketIds.map(id => {
                      const SvgComp = STUFFIE_SVG[id]
                      return (
                        <div
                          key={id}
                          className="rounded-full overflow-hidden animate-bounce-in"
                          style={{
                            width: 32, height: 32,
                            background: 'white',
                            border: '1.5px solid #F4C0D1',
                            animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                          }}
                        >
                          {SvgComp && <SvgComp />}
                        </div>
                      )
                    })}
                  </div>
                )}

                {basketIds.length === 0 && (
                  <p className="text-[11px] font-medium text-center mt-2 px-3" style={{ color: '#C060A0', opacity: 0.6 }}>
                    Drop stuffies here!
                  </p>
                )}
              </div>

              {/* Count */}
              {basketIds.length > 0 && (
                <p className="text-[12px] font-semibold" style={{ color: '#5BE0C0' }}>
                  {basketIds.length} stuffie{basketIds.length !== 1 ? 's' : ''} added!
                </p>
              )}

              {/* Done button */}
              <button
                disabled={basketIds.length === 0}
                onClick={() => setStep(2)}
                className="rounded-[16px] px-6 py-2.5 text-[14px] font-bold transition-all duration-200"
                style={{
                  background: basketIds.length > 0
                    ? 'linear-gradient(135deg,#5BE0C0,#00A880)'
                    : '#F0D0E8',
                  color: basketIds.length > 0 ? 'white' : '#C0A0B0',
                  boxShadow: basketIds.length > 0 ? '0 4px 16px rgba(0,168,128,0.35)' : 'none',
                  cursor: basketIds.length > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                Done! →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          STEP 2 — DECORATE YOUR BASKET
      ══════════════════════════════════════ */}
      {step === 2 && (
        <div className="flex-1 flex flex-col pb-10">
          <div className="text-center pt-6 pb-4">
            <h1 className="text-[28px] font-bold" style={{ color: '#1A0818' }}>
              Decorate your basket! <span style={{ color: '#FF4FAE' }}>✨</span>
            </h1>
            <p className="text-[13px] font-medium mt-1" style={{ color: '#7B3566' }}>
              Add colors, ribbons, and stickers
            </p>
          </div>

          <div className="flex gap-4 flex-col lg:flex-row max-w-[960px] mx-auto w-full px-4">
            {/* ── LEFT PANEL ── */}
            <div
              className="lg:w-[240px] rounded-[20px] p-4 flex flex-col gap-5 flex-none"
              style={{ background: 'white', border: '1.5px solid #FFE0F4', boxShadow: '0 4px 16px rgba(200,80,140,0.08)' }}
            >
              {/* Basket colors */}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#C060A0' }}>
                  Basket Color
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(BASKET_COLORS).map(([key, c]) => (
                    <button
                      key={key}
                      onClick={() => setColorKey(key)}
                      title={key.charAt(0).toUpperCase() + key.slice(1)}
                      className="rounded-[10px] transition-all"
                      style={{
                        width: '100%', aspectRatio: '1',
                        background: c.fill,
                        border: colorKey === key ? `2.5px solid #FF4FAE` : '2px solid transparent',
                        outline: colorKey === key ? '2px solid rgba(255,80,174,0.2)' : 'none',
                        outlineOffset: 2,
                        transform: colorKey === key ? 'scale(1.12)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {Object.keys(BASKET_COLORS).map(key => (
                    <p key={key} className="text-[9px] text-center" style={{ color: '#C060A0', opacity: 0.7 }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </p>
                  ))}
                </div>
              </div>

              {/* Ribbons */}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#C060A0' }}>
                  Ribbon
                </p>
                <div className="flex flex-col gap-2">
                  {([
                    { val: 'none',      label: 'No ribbon',   icon: '—' },
                    { val: 'bigbow',    label: 'Big bow',     icon: '🎀' },
                    { val: 'stripes',   label: 'Stripes',     icon: '〰️' },
                    { val: 'polkadots', label: 'Polka dots',  icon: '⚫' },
                  ] as const).map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setRibbon(opt.val)}
                      className="rounded-[12px] px-3 py-2 text-[12px] font-semibold flex items-center gap-2 transition-all text-left"
                      style={{
                        background: ribbon === opt.val ? 'linear-gradient(135deg,#FF78C4,#FF4FAE)' : '#FFF0F9',
                        color: ribbon === opt.val ? 'white' : '#C060A0',
                        border: ribbon === opt.val ? 'none' : '1px solid #FFD6EE',
                      }}
                    >
                      <span>{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stickers */}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#C060A0' }}>
                  Stickers
                </p>
                <p className="text-[10px] mb-2" style={{ color: '#C060A0', opacity: 0.7 }}>
                  Drag onto the basket
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {STICKER_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      draggable
                      onDragStart={e => handleStickerDragStart(e, emoji)}
                      className="rounded-[12px] flex items-center justify-center text-[22px] transition-all hover:scale-110 active:scale-95"
                      style={{
                        width: '100%', aspectRatio: '1',
                        background: '#FFF0F9',
                        border: '1.5px solid #FFD6EE',
                        cursor: 'grab',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CENTER: BASKET CANVAS ── */}
            <div className="flex-1 flex flex-col items-center gap-4">
              {/* Basket drop zone */}
              <div
                ref={basketCanvasRef}
                onDragOver={handleCanvasDragOver}
                onDrop={handleCanvasDrop}
                className="relative rounded-[24px] flex items-center justify-center"
                style={{
                  width: '100%', maxWidth: 380,
                  aspectRatio: '1',
                  background: 'white',
                  border: '2px dashed #F4C0D1',
                  boxShadow: '0 8px 30px rgba(200,80,140,0.1)',
                  overflow: 'hidden',
                  cursor: dragStickerEmoji ? 'copy' : 'default',
                }}
              >
                <BasketSVG colorKey={colorKey} ribbon={ribbon} size={320} />
                {/* Placed stickers */}
                {placedStickers.map(s => (
                  <div
                    key={s.id}
                    style={{
                      position: 'absolute',
                      left: `${s.x}%`,
                      top: `${s.y}%`,
                      fontSize: 28,
                      transform: 'translate(-50%,-50%)',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }}
                  >
                    {s.emoji}
                  </div>
                ))}
                {placedStickers.length === 0 && (
                  <p
                    className="absolute bottom-4 text-[11px] font-medium text-center px-6"
                    style={{ color: '#C060A0', opacity: 0.5 }}
                  >
                    Drag stickers onto the basket!
                  </p>
                )}
              </div>

              {/* Stuffie previews */}
              <div className="flex gap-2 flex-wrap justify-center">
                {basketIds.map(id => {
                  const stuffie = STUFFIES.find(s => s.id === id)
                  const SvgComp = STUFFIE_SVG[id]
                  return (
                    <div key={id} className="flex flex-col items-center gap-1">
                      <div
                        className="rounded-full overflow-hidden"
                        style={{ width: 40, height: 40, background: 'white', border: '1.5px solid #F4C0D1' }}
                      >
                        {SvgComp && <SvgComp />}
                      </div>
                      <p className="text-[9px] font-semibold" style={{ color: '#7B3566' }}>{stuffie?.name}</p>
                    </div>
                  )
                })}
              </div>

              {/* All done button */}
              <button
                onClick={() => setShowReveal(true)}
                className="rounded-[18px] px-8 py-3 text-[16px] font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg,#FF78C4,#FF4FAE)',
                  color: 'white',
                  boxShadow: '0 6px 20px rgba(255,80,174,0.4)',
                }}
              >
                All done! See my basket 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          REVEAL OVERLAY
      ══════════════════════════════════════ */}
      {showReveal && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
          style={{ background: 'rgba(30,0,20,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div
            ref={revealRef}
            className="rounded-[28px] flex flex-col items-center gap-4 p-8"
            style={{
              background: '#FEF0FB',
              boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
              maxWidth: 420,
              width: '100%',
            }}
          >
            <p className="text-[24px] font-bold text-center" style={{ color: '#1A0818' }}>
              Your Stuffie Basket! 🎉
            </p>

            {/* Basket with decorations */}
            <div
              className="relative rounded-[20px] flex items-center justify-center"
              style={{ width: 300, height: 300, background: 'white', border: '2px solid #FFE0F4', overflow: 'hidden' }}
            >
              <BasketSVG colorKey={colorKey} ribbon={ribbon} size={280} />
              {placedStickers.map(s => (
                <div
                  key={s.id}
                  style={{
                    position: 'absolute',
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    fontSize: 26,
                    transform: 'translate(-50%,-50%)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                  }}
                >
                  {s.emoji}
                </div>
              ))}
            </div>

            {/* Stuffie row */}
            <div className="flex gap-2 flex-wrap justify-center">
              {basketIds.map(id => {
                const SvgComp = STUFFIE_SVG[id]
                return (
                  <div
                    key={id}
                    className="rounded-full overflow-hidden"
                    style={{ width: 44, height: 44, background: 'white', border: '1.5px solid #F4C0D1' }}
                  >
                    {SvgComp && <SvgComp />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              className="rounded-[16px] px-6 py-3 text-[14px] font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#5BE0C0,#00A880)', boxShadow: '0 4px 16px rgba(0,168,128,0.4)' }}
            >
              💾 Save my basket
            </button>
            <button
              onClick={handleStartOver}
              className="rounded-[16px] px-6 py-3 text-[14px] font-bold transition-all hover:-translate-y-0.5"
              style={{ background: 'white', color: '#C060A0', border: '1.5px solid #F4C0D1' }}
            >
              Start over
            </button>
          </div>

          {/* Close */}
          <button
            onClick={() => setShowReveal(false)}
            className="mt-3 text-[13px] font-semibold"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            ← Keep decorating
          </button>
        </div>
      )}

      {/* pop-in animation */}
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
