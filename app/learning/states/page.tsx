'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import WaveFooter from '@/components/WaveFooter'

// ── State data ──
const STATE_DATA: Record<string, string> = {
  "01":"Alabama","02":"Alaska","04":"Arizona","05":"Arkansas","06":"California",
  "08":"Colorado","09":"Connecticut","10":"Delaware","12":"Florida","13":"Georgia",
  "15":"Hawaii","16":"Idaho","17":"Illinois","18":"Indiana","19":"Iowa",
  "20":"Kansas","21":"Kentucky","22":"Louisiana","23":"Maine","24":"Maryland",
  "25":"Massachusetts","26":"Michigan","27":"Minnesota","28":"Mississippi","29":"Missouri",
  "30":"Montana","31":"Nebraska","32":"Nevada","33":"New Hampshire","34":"New Jersey",
  "35":"New Mexico","36":"New York","37":"North Carolina","38":"North Dakota","39":"Ohio",
  "40":"Oklahoma","41":"Oregon","42":"Pennsylvania","44":"Rhode Island","45":"South Carolina",
  "46":"South Dakota","47":"Tennessee","48":"Texas","49":"Utah","50":"Vermont",
  "51":"Virginia","53":"Washington","54":"West Virginia","55":"Wisconsin","56":"Wyoming"
}

const NEIGHBORS: Record<string, string[]> = {
  "Alabama":["Florida","Georgia","Tennessee","Mississippi"],
  "Alaska":[],
  "Arizona":["California","Nevada","Utah","Colorado","New Mexico"],
  "Arkansas":["Missouri","Tennessee","Mississippi","Louisiana","Texas","Oklahoma"],
  "California":["Oregon","Nevada","Arizona"],
  "Colorado":["Wyoming","Nebraska","Kansas","Oklahoma","New Mexico","Arizona","Utah"],
  "Connecticut":["New York","Massachusetts","Rhode Island"],
  "Delaware":["Maryland","Pennsylvania","New Jersey"],
  "Florida":["Georgia","Alabama"],
  "Georgia":["Florida","Alabama","Tennessee","North Carolina","South Carolina"],
  "Hawaii":[],
  "Idaho":["Montana","Wyoming","Utah","Nevada","Oregon","Washington"],
  "Illinois":["Wisconsin","Iowa","Missouri","Kentucky","Indiana"],
  "Indiana":["Michigan","Ohio","Kentucky","Illinois"],
  "Iowa":["Minnesota","Wisconsin","Illinois","Missouri","Nebraska","South Dakota"],
  "Kansas":["Nebraska","Missouri","Oklahoma","Colorado"],
  "Kentucky":["Indiana","Ohio","West Virginia","Virginia","Tennessee","Missouri","Illinois"],
  "Louisiana":["Arkansas","Mississippi","Texas"],
  "Maine":["New Hampshire"],
  "Maryland":["Pennsylvania","Delaware","Virginia","West Virginia"],
  "Massachusetts":["Vermont","New Hampshire","Rhode Island","Connecticut","New York"],
  "Michigan":["Wisconsin","Indiana","Ohio"],
  "Minnesota":["Wisconsin","Iowa","South Dakota","North Dakota"],
  "Mississippi":["Tennessee","Alabama","Louisiana","Arkansas"],
  "Missouri":["Iowa","Illinois","Kentucky","Tennessee","Arkansas","Oklahoma","Kansas","Nebraska"],
  "Montana":["Idaho","Wyoming","South Dakota","North Dakota"],
  "Nebraska":["South Dakota","Iowa","Missouri","Kansas","Colorado","Wyoming"],
  "Nevada":["Oregon","Idaho","Utah","Arizona","California"],
  "New Hampshire":["Vermont","Maine","Massachusetts"],
  "New Jersey":["New York","Pennsylvania","Delaware"],
  "New Mexico":["Colorado","Oklahoma","Texas","Arizona","Utah"],
  "New York":["Vermont","Massachusetts","Connecticut","New Jersey","Pennsylvania"],
  "North Carolina":["Virginia","Tennessee","Georgia","South Carolina"],
  "North Dakota":["Montana","South Dakota","Minnesota"],
  "Ohio":["Michigan","Pennsylvania","West Virginia","Kentucky","Indiana"],
  "Oklahoma":["Kansas","Missouri","Arkansas","Texas","New Mexico","Colorado"],
  "Oregon":["Washington","Idaho","Nevada","California"],
  "Pennsylvania":["New York","New Jersey","Delaware","Maryland","West Virginia","Ohio"],
  "Rhode Island":["Massachusetts","Connecticut"],
  "South Carolina":["North Carolina","Georgia"],
  "South Dakota":["North Dakota","Minnesota","Iowa","Nebraska","Wyoming","Montana"],
  "Tennessee":["Kentucky","Virginia","North Carolina","Georgia","Alabama","Mississippi","Arkansas","Missouri"],
  "Texas":["New Mexico","Oklahoma","Arkansas","Louisiana"],
  "Utah":["Idaho","Wyoming","Colorado","New Mexico","Arizona","Nevada"],
  "Vermont":["New York","New Hampshire","Massachusetts"],
  "Virginia":["Maryland","West Virginia","Kentucky","Tennessee","North Carolina"],
  "Washington":["Idaho","Oregon"],
  "West Virginia":["Ohio","Pennsylvania","Maryland","Virginia","Kentucky"],
  "Wisconsin":["Minnesota","Iowa","Illinois","Michigan"],
  "Wyoming":["Montana","South Dakota","Nebraska","Colorado","Utah","Idaho"]
}

const STATE_HINTS: Record<string, string> = {
  "Alabama":"Borders the Gulf of Mexico. Its largest city is Birmingham! 🌊",
  "Alaska":"The biggest state! Separated from the rest, it borders Canada 🐻",
  "Arizona":"Home to the Grand Canyon! 🏜️",
  "Arkansas":"Known for the Ozark mountains and hot springs! ♨️",
  "California":"Home to Hollywood and the Golden Gate Bridge 🌉",
  "Colorado":"Famous for the Rocky Mountains and skiing! ⛷️",
  "Connecticut":"One of the first 13 colonies! One of the smallest states 🦞",
  "Delaware":"The very first state to join the US! Tiny but mighty 🦅",
  "Florida":"The Sunshine State! Home to Disney World 🐊",
  "Georgia":"Famous for peaches! Atlanta is the capital 🍑",
  "Hawaii":"The only state made of islands! In the Pacific Ocean 🌺",
  "Idaho":"Famous for potatoes and beautiful mountains! 🥔",
  "Illinois":"Chicago, the Windy City, is here! 🌆",
  "Indiana":"Home of the Indianapolis 500 car race! 🏎️",
  "Iowa":"Grows more corn than almost anywhere in the US! 🌽",
  "Kansas":"Right in the middle of the country! Dorothy from Oz lived here 🌪️",
  "Kentucky":"Famous for horses and the Kentucky Derby! 🐎",
  "Louisiana":"Famous for New Orleans and jazz music! 🎷",
  "Maine":"The most northeastern state! Famous for lobster 🦞",
  "Maryland":"Famous for blue crabs and the Chesapeake Bay 🦀",
  "Massachusetts":"The Pilgrims landed here in 1620! ⚾",
  "Michigan":"Shaped like a mitten! Touches four Great Lakes 🧤",
  "Minnesota":"The Land of 10,000 Lakes! ❄️",
  "Mississippi":"Named after the mighty Mississippi River 🌊",
  "Missouri":"The Gateway to the West! Home of the Gateway Arch 🏛️",
  "Montana":"Big Sky Country! Home to Glacier National Park 🏔️",
  "Nebraska":"Famous for wide open plains and Chimney Rock 🌾",
  "Nevada":"Las Vegas is here! Lots of deserts 🎰",
  "New Hampshire":"Beautiful White Mountains and live free or die! 🗻",
  "New Jersey":"The Garden State! Near New York City 🌿",
  "New Mexico":"The Land of Enchantment! Famous for green chile 🌶️",
  "New York":"New York City is the biggest city in America! 🗽",
  "North Carolina":"The Wright Brothers' first airplane flight was here! ✈️",
  "North Dakota":"Famous for the Badlands and sunflower fields 🌻",
  "Ohio":"More US presidents were born here than any other state! 🌰",
  "Oklahoma":"The Sooner State! Famous for the Land Rush 🌾",
  "Oregon":"Home to Crater Lake and beautiful forests 🌲",
  "Pennsylvania":"The Declaration of Independence was signed here! 🔔",
  "Rhode Island":"The tiniest state in the whole country! 🏖️",
  "South Carolina":"Famous for peaches and sweet tea! 🍑",
  "South Dakota":"Mount Rushmore is here! 🏔️",
  "Tennessee":"Home of country music! Nashville is Music City 🎸",
  "Texas":"The Lone Star State! Famous for cowboys and BBQ 🤠",
  "Utah":"Home to the Great Salt Lake and five national parks! 🏜️",
  "Vermont":"Famous for maple syrup and fall colors! 🍁",
  "Virginia":"Eight US presidents were born here! 🏛️",
  "Washington":"Home to Seattle and Mount Rainier! ☔",
  "West Virginia":"The Mountain State! ⛰️",
  "Wisconsin":"America's Dairyland! Famous for cheese 🧀",
  "Wyoming":"Home to Yellowstone, the first national park! 🦌"
}

const LILY_MSGS = [
  "<strong>Which state is glowing pink? 🌟</strong> Check the close-up view and type its name!",
  "<strong>Can you name this state? 🗺️</strong> Look at the zoom view — type the name below!",
  "<strong>Look at the close-up! ✨</strong> The pink state is shown big — what is it called?",
  "<strong>Great job so far! 🌸</strong> The zoom shows you the state and its neighbors!",
  "<strong>You're doing amazing! 💕</strong> Name the glowing pink state!",
]

export default function StatesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameRef = useRef<{
    d3: any
    topojson: any
    geoPath: any
    projection: any
    stateFeaturesMap: Record<string, unknown>
    queue: string[]
    currentIdx: number
    currentState: string
    score: number
    answered: boolean
    correctStates: Set<string>
  }>({
    d3: null, topojson: null, geoPath: null, projection: null,
    stateFeaturesMap: {}, queue: [], currentIdx: 0,
    currentState: '', score: 0, answered: false, correctStates: new Set()
  })

  useEffect(() => {
    // Load D3 then TopoJSON sequentially, then init game
    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`)
        if (existing) { resolve(); return }
        const s = document.createElement('script')
        s.src = src
        s.onload = () => resolve()
        s.onerror = reject
        document.head.appendChild(s)
      })

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js')
      .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js'))
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any
        const d3 = w.d3
        const topojson = w.topojson
        gameRef.current.d3 = d3
        gameRef.current.topojson = topojson
        loadMap(d3, topojson)
      })
      .catch(() => {
        const el = document.getElementById('map-loading')
        if (el) el.textContent = 'Map failed to load — please refresh 🔄'
      })

    return () => { /* scripts remain cached */ }
  }, [])

  function shuffle(a: string[]): string[] {
    const b = [...a]
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]]
    }
    return b
  }

  function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0))
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function loadMap(d3: any, topojson: any) {
    try {
      const topoData = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      const loadingEl = document.getElementById('map-loading')
      if (loadingEl) loadingEl.style.display = 'none'

      const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
      const geoPath = d3.geoPath().projection(projection)
      gameRef.current.projection = projection
      gameRef.current.geoPath = geoPath

      const svg = d3.select('#map-svg')
      const states = topojson.feature(topoData, topoData.objects.states)

      states.features.forEach((f: { id: string }) => {
        const name = STATE_DATA[f.id]
        if (name) gameRef.current.stateFeaturesMap[name] = f
      })

      svg.selectAll('.state-path')
        .data(states.features)
        .enter().append('path')
        .attr('class', 'state-path')
        .attr('id', (d: { id: string }) => 'state-' + d.id)
        .attr('d', geoPath)
        .attr('data-name', (d: { id: string }) => STATE_DATA[d.id] || '')
        .attr('data-id', (d: { id: string }) => d.id)

      svg.append('path')
        .datum(topojson.mesh(topoData, topoData.objects.states, (a: unknown, b: unknown) => a !== b))
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.5)')
        .attr('stroke-width', '0.7')
        .attr('d', geoPath)

      initGame()
    } catch (e) {
      const el = document.getElementById('map-loading')
      if (el) el.textContent = 'Map failed to load — please refresh 🔄'
      console.error(e)
    }
  }

  function initGame() {
    const g = gameRef.current
    const d3 = g.d3
    g.queue = shuffle(Object.values(STATE_DATA))
    g.currentIdx = 0; g.score = 0
    g.correctStates.clear()
    d3.selectAll('.state-path')
      .classed('active', false).classed('correct', false)
      .attr('fill', 'var(--state-base)').attr('opacity', 1)
    loadState(0)
  }

  function loadState(idx: number) {
    const g = gameRef.current
    const d3 = g.d3
    g.answered = false
    g.currentState = g.queue[idx]

    d3.selectAll('.state-path.active').classed('active', false).attr('fill', 'var(--state-base)')
    d3.selectAll('.state-path').each(function(this: Element) {
      const el = d3.select(this)
      if (el.attr('data-name') === g.currentState && !el.classed('correct')) {
        el.attr('fill', '#FF4FAE').classed('active', true)
      }
    })

    renderZoom(g.currentState)

    const lilyMsg = document.getElementById('lily-message')
    if (lilyMsg) lilyMsg.innerHTML = LILY_MSGS[idx % LILY_MSGS.length]

    const input = document.getElementById('state-input') as HTMLInputElement | null
    if (input) { input.value = ''; input.className = 'state-input'; input.disabled = false; input.focus() }

    const hintBtn = document.getElementById('hint-btn')
    const skipBtn = document.getElementById('skip-btn')
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null
    if (hintBtn) hintBtn.style.display = 'flex'
    if (skipBtn) skipBtn.style.display = 'block'
    if (submitBtn) submitBtn.disabled = false
    hideFeedback()

    const nextBtn = document.getElementById('next-btn')
    if (nextBtn) nextBtn.classList.remove('visible')

    const fill = document.getElementById('progress-fill')
    const label = document.getElementById('progress-label')
    if (fill) fill.style.width = (idx / 50 * 100) + '%'
    if (label) label.textContent = idx + ' / 50'
  }

  function renderZoom(stateName: string) {
    const g = gameRef.current
    const d3 = g.d3
    const zsvg = d3.select('#zoom-svg')
    zsvg.selectAll('*').remove()

    const activeFeature = g.stateFeaturesMap[stateName]
    if (!activeFeature) return

    const neighborNames = NEIGHBORS[stateName] || []
    const neighborFeatures = neighborNames.map(n => g.stateFeaturesMap[n]).filter(Boolean)
    const allFeatures = [activeFeature, ...neighborFeatures]

    // Bounding box
    const geoPath = g.geoPath
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    allFeatures.forEach(f => {
      const b = geoPath.bounds(f)
      x0 = Math.min(x0, b[0][0]); y0 = Math.min(y0, b[0][1])
      x1 = Math.max(x1, b[1][0]); y1 = Math.max(y1, b[1][1])
    })
    const pad = Math.max(x1 - x0, y1 - y0) * 0.45
    const bx0 = x0 - pad, by0 = y0 - pad, bx1 = x1 + pad, by1 = y1 + pad
    const bw = bx1 - bx0, bh = by1 - by0
    const vw = 300, vh = 180
    const scale = Math.min(vw / bw, vh / bh) * 0.9
    const tx = (vw - bw * scale) / 2 - bx0 * scale
    const ty = (vh - bh * scale) / 2 - by0 * scale

    const zoomGroup = zsvg.append('g').attr('transform', `translate(${tx},${ty}) scale(${scale})`)
    const zPath = d3.geoPath().projection(g.projection)

    neighborFeatures.forEach(f => {
      const isCorrect = g.correctStates.has(STATE_DATA[(f as Record<string, string>).id]) // eslint-disable-line @typescript-eslint/no-explicit-any
      zoomGroup.append('path').attr('d', zPath(f))
        .attr('class', isCorrect ? 'zoom-state-correct' : 'zoom-state-neighbor')
    })
    zoomGroup.append('path').attr('d', zPath(activeFeature)).attr('class', 'zoom-state-active')
  }

  function checkAnswer() {
    const g = gameRef.current
    const d3 = g.d3
    if (g.answered) return
    const input = document.getElementById('state-input') as HTMLInputElement | null
    if (!input) return
    const typed = input.value.trim().toLowerCase()
    if (!typed) return
    const correct = g.currentState.toLowerCase()
    const isCorrect = typed === correct || levenshtein(typed, correct) <= 1

    g.answered = true
    input.disabled = true
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null
    if (submitBtn) submitBtn.disabled = true
    const hintBtn = document.getElementById('hint-btn')
    const skipBtn = document.getElementById('skip-btn')
    if (hintBtn) hintBtn.style.display = 'none'
    if (skipBtn) skipBtn.style.display = 'none'

    if (isCorrect) {
      g.score++
      g.correctStates.add(g.currentState)
      input.className = 'state-input correct-input'
      d3.selectAll('.state-path').each(function(this: Element) {
        const el = d3.select(this)
        if (el.attr('data-name') === g.currentState) {
          el.attr('fill', '#5BE0C0').classed('active', false).classed('correct', true)
        }
      })
      d3.select('#zoom-svg').select('.zoom-state-active')
        .attr('class', 'zoom-state-correct')
        .style('filter', 'none').style('animation', 'none')
      showFeedback('correct', '🎉 That\'s ' + g.currentState + '!', STATE_HINTS[g.currentState])
    } else {
      input.className = 'state-input wrong-input'
      d3.selectAll('.state-path').each(function(this: Element) {
        const el = d3.select(this)
        if (el.attr('data-name') === g.currentState) {
          el.attr('fill', '#FF5555').classed('active', false)
          setTimeout(() => el.attr('fill', '#FF4FAE').classed('active', true), 600)
        }
      })
      showFeedback('wrong', 'It\'s ' + g.currentState, STATE_HINTS[g.currentState])
    }
    const nextBtn = document.getElementById('next-btn')
    if (nextBtn) nextBtn.classList.add('visible')
  }

  function showHint() {
    const g = gameRef.current
    const hintBtn = document.getElementById('hint-btn')
    if (hintBtn) hintBtn.style.display = 'none'
    showFeedback('hint', '💡 Hint:', STATE_HINTS[g.currentState] || 'Look at where it is on the map!')
  }

  function showFeedback(type: string, title: string, body?: string) {
    const banner = document.getElementById('feedback-banner')
    if (!banner) return
    banner.className = 'feedback-banner visible ' + (type === 'correct' ? 'correct-fb' : type === 'wrong' ? 'wrong-fb' : 'hint-fb')
    const icon = document.getElementById('fb-icon')
    const text = document.getElementById('fb-text')
    if (icon) icon.textContent = type === 'correct' ? '🎉' : '💡'
    if (text) text.innerHTML = `<strong>${title}</strong>${body ? `<span>${body}</span>` : ''}`
  }

  function hideFeedback() {
    const banner = document.getElementById('feedback-banner')
    if (banner) banner.className = 'feedback-banner'
  }

  function nextState() {
    const g = gameRef.current
    g.currentIdx++
    if (g.currentIdx >= 50) showComplete()
    else loadState(g.currentIdx)
  }

  function showComplete() {
    const g = gameRef.current
    const gameMain = document.getElementById('game-main')
    const completeScreen = document.getElementById('complete-screen')
    if (gameMain) gameMain.style.display = 'none'
    if (completeScreen) completeScreen.classList.add('visible')

    const pct = g.score / 50
    let stars, title, msg
    if (pct >= 0.9) { stars = '🌟🌟🌟'; title = 'State Champion!'; msg = `You got ${g.score} out of 50! You're a geography superstar! 🏆` }
    else if (pct >= 0.7) { stars = '⭐⭐⭐'; title = 'State Explorer!'; msg = `Amazing — ${g.score} out of 50! Keep practicing! 🗺️` }
    else if (pct >= 0.5) { stars = '⭐⭐'; title = 'Getting There!'; msg = `You got ${g.score} out of 50! Try again and beat your score! 💪` }
    else { stars = '⭐'; title = 'Keep Exploring!'; msg = `You got ${g.score} out of 50. Every explorer starts somewhere! 🌟` }

    const starsEl = document.getElementById('complete-stars')
    const titleEl = document.getElementById('complete-title')
    const scoreEl = document.getElementById('complete-score')
    const msgEl = document.getElementById('complete-msg')
    const fill = document.getElementById('progress-fill')
    const label = document.getElementById('progress-label')
    if (starsEl) starsEl.textContent = stars
    if (titleEl) titleEl.textContent = title
    if (scoreEl) scoreEl.textContent = g.score + ' out of 50 correct!'
    if (msgEl) msgEl.textContent = msg
    if (fill) fill.style.width = '100%'
    if (label) label.textContent = '50 / 50'
  }

  function restartGame() {
    const gameMain = document.getElementById('game-main')
    const completeScreen = document.getElementById('complete-screen')
    if (gameMain) gameMain.style.display = 'block'
    if (completeScreen) completeScreen.classList.remove('visible')
    initGame()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (gameRef.current.answered) nextState()
      else checkAnswer()
    }
  }

  return (
    <>
      <style>{`
        :root {
          --pink: #FF4FAE;
          --pink-light: #FF78C4;
          --dark: #1a1035;
          --darker: #120b28;
          --teal: #30D4A8;
          --teal-soft: #5BE0C0;
          --gold: #FFD166;
          --state-base: #C8C8D8;
        }
        .states-page {
          font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, "Helvetica Neue", sans-serif;
          background: var(--darker);
          min-height: 100vh;
          color: #fff;
          overflow-x: hidden;
        }
        .stars-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 35% 62%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 52% 14%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 71% 38%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 72%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(700px at 15% 25%, rgba(255,78,174,0.07) 0%, transparent 60%),
            radial-gradient(700px at 85% 75%, rgba(48,212,168,0.05) 0%, transparent 60%);
        }
        .states-wrapper {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 1.2rem 1.2rem 2rem;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .states-header { display: flex; align-items: center; gap: 14px; }
        .states-back-btn {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px; padding: 7px 14px; color: rgba(255,255,255,0.65);
          font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.18s;
          display: inline-block;
        }
        .states-back-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }
        .game-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #fff; }
        .game-title span { color: var(--pink-light); }
        .game-area {
          display: grid; grid-template-columns: 1fr 300px; gap: 1rem; align-items: start;
        }
        .map-panel {
          background: rgba(30,28,50,0.85); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px; padding: 1rem 1rem 0.8rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
          position: relative; overflow: hidden;
        }
        .map-panel::before {
          content:''; position:absolute; inset:0;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,78,174,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        #map-svg { width:100%; height:auto; display:block; }
        .map-loading { text-align:center; padding:4rem 2rem; color:rgba(255,255,255,0.3); font-size:14px; font-weight:600; }
        .map-progress { display:flex; align-items:center; gap:10px; margin-top:10px; padding:0 2px; }
        .map-progress-bar { flex:1; height:5px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; }
        .map-progress-fill { height:100%; background:linear-gradient(90deg,var(--pink-light),var(--pink)); border-radius:10px; transition:width 0.5s ease; }
        .map-progress-label { font-size:11px; font-weight:700; color:rgba(255,255,255,0.35); white-space:nowrap; }
        .state-path {
          fill: var(--state-base); stroke: rgba(255,255,255,0.55); stroke-width: 0.6;
          cursor: default; transition: fill 0.3s ease, filter 0.3s ease;
        }
        .state-path.active {
          fill: var(--pink) !important; stroke: rgba(255,255,255,0.9); stroke-width: 1.2;
          animation: glow-pulse 1.8s ease-in-out infinite;
        }
        .state-path.correct { fill: var(--teal-soft) !important; opacity: 0.72; filter: none; animation: none; }
        @keyframes glow-pulse {
          0%,100% { filter: drop-shadow(0 0 10px rgba(255,78,174,0.95)) drop-shadow(0 0 24px rgba(255,78,174,0.5)); }
          50%      { filter: drop-shadow(0 0 18px rgba(255,120,196,1))   drop-shadow(0 0 40px rgba(255,78,174,0.8)); }
        }
        .zoom-panel {
          background: rgba(30,28,50,0.9); border: 1.5px solid rgba(255,78,174,0.25);
          border-radius: 22px; padding: 0.9rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04);
          position: relative; overflow: hidden;
        }
        .zoom-panel::before {
          content:''; position:absolute; inset:0;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,78,174,0.06) 0%, transparent 65%);
          pointer-events: none;
        }
        .zoom-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--pink-light); margin-bottom: 6px; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .zoom-label::before, .zoom-label::after { content:''; flex:1; height:1px; background:rgba(255,78,174,0.2); }
        #zoom-svg { width:100%; height:160px; display:block; }
        .zoom-state-active {
          fill: var(--pink); stroke: rgba(255,255,255,0.9); stroke-width: 1.5;
          filter: drop-shadow(0 0 10px rgba(255,78,174,0.9)) drop-shadow(0 0 22px rgba(255,78,174,0.5));
          animation: glow-pulse 1.8s ease-in-out infinite;
        }
        .zoom-state-neighbor { fill: rgba(200,200,216,0.4); stroke: rgba(255,255,255,0.3); stroke-width: 0.8; }
        .zoom-state-correct { fill: var(--teal-soft); opacity: 0.65; stroke: rgba(255,255,255,0.3); stroke-width: 0.8; }
        .right-panel { display:flex; flex-direction:column; gap:12px; }
        .lily-card {
          background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
          border-radius:20px; padding:11px 14px; display:flex; align-items:flex-start; gap:10px;
        }
        .lily-icon {
          width:38px; height:38px; border-radius:50%;
          background:linear-gradient(135deg,var(--pink-light),var(--pink));
          display:flex; align-items:center; justify-content:center;
          font-size:18px; flex-shrink:0; box-shadow:0 4px 14px rgba(255,78,174,0.35);
        }
        .lily-text { font-size:12.5px; color:rgba(255,255,255,0.72); font-weight:500; line-height:1.5; }
        .lily-text strong { color:#fff; }
        .input-card {
          background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.09);
          border-radius:20px; padding:1.1rem;
        }
        .input-label { font-size:10px; font-weight:700; color:rgba(255,255,255,0.35); letter-spacing:1.8px; text-transform:uppercase; margin-bottom:8px; }
        .input-row { display:flex; gap:8px; margin-bottom:9px; }
        .state-input {
          flex:1; background:rgba(255,255,255,0.07); border:2px solid rgba(255,78,174,0.3);
          border-radius:14px; padding:12px 15px; font-size:15px; font-weight:700; color:#fff; outline:none;
          transition:border-color 0.2s, background 0.2s;
          font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
        }
        .state-input:focus { border-color:var(--pink-light); background:rgba(255,255,255,0.10); }
        .state-input::placeholder { color:rgba(255,255,255,0.22); font-weight:400; }
        .state-input.correct-input { border-color:var(--teal); background:rgba(48,212,168,0.08); }
        .state-input.wrong-input { border-color:#FF5555; background:rgba(255,68,68,0.08); animation:shake 0.28s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-5px)} 70%{transform:translateX(5px)} }
        .submit-btn {
          background:linear-gradient(135deg,var(--pink-light),var(--pink)); border:none; border-radius:14px;
          padding:12px 18px; color:#fff; font-size:16px; font-weight:800; cursor:pointer;
          box-shadow:0 4px 16px rgba(255,78,174,0.4); transition:transform 0.15s;
        }
        .submit-btn:hover { transform:translateY(-2px); }
        .hint-btn {
          width:100%; background:rgba(255,209,102,0.07); border:1.5px solid rgba(255,209,102,0.22);
          border-radius:12px; padding:9px; color:var(--gold); font-size:12px; font-weight:700; cursor:pointer;
          transition:all 0.18s; display:flex; align-items:center; justify-content:center; gap:5px;
        }
        .hint-btn:hover { background:rgba(255,209,102,0.13); }
        .feedback-banner {
          border-radius:16px; padding:12px 14px; font-size:13px; font-weight:700;
          display:flex; align-items:flex-start; gap:10px;
          opacity:0; transform:translateY(5px); transition:all 0.22s ease; pointer-events:none;
        }
        .feedback-banner.visible { opacity:1; transform:translateY(0); pointer-events:auto; }
        .feedback-banner.correct-fb { background:rgba(48,212,168,0.12); border:1.5px solid rgba(48,212,168,0.35); color:var(--teal-soft); }
        .feedback-banner.wrong-fb   { background:rgba(255,68,68,0.10);  border:1.5px solid rgba(255,68,68,0.28);  color:#FF8888; }
        .feedback-banner.hint-fb    { background:rgba(255,209,102,0.09);border:1.5px solid rgba(255,209,102,0.28);color:var(--gold); }
        .fb-icon { font-size:20px; flex-shrink:0; line-height:1.3; }
        .fb-text strong { display:block; font-size:14px; margin-bottom:3px; }
        .fb-text span   { font-size:12px; opacity:0.85; font-weight:500; line-height:1.4; display:block; }
        .next-btn {
          width:100%; background:linear-gradient(135deg,var(--teal),#00B890); border:none; border-radius:14px;
          padding:13px; color:#fff; font-size:15px; font-weight:800; cursor:pointer;
          box-shadow:0 4px 16px rgba(48,212,168,0.3); transition:transform 0.15s; display:none;
        }
        .next-btn.visible { display:block; }
        .next-btn:hover { transform:translateY(-2px); }
        .skip-btn {
          width:100%; background:transparent; border:1px solid rgba(255,255,255,0.09);
          border-radius:12px; padding:8px; color:rgba(255,255,255,0.28); font-size:12px; font-weight:600; cursor:pointer; transition:all 0.18s;
        }
        .skip-btn:hover { color:rgba(255,255,255,0.55); border-color:rgba(255,255,255,0.18); }
        .complete-screen { display:none; text-align:center; padding:3rem 2rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:28px; }
        .complete-screen.visible { display:block; }
        .complete-stars { font-size:52px; margin-bottom:1rem; }
        .complete-title { font-size:30px; font-weight:900; letter-spacing:-0.5px; margin-bottom:8px; }
        .complete-score { font-size:19px; color:var(--pink-light); font-weight:800; margin-bottom:8px; }
        .complete-msg { font-size:14px; color:rgba(255,255,255,0.55); max-width:340px; margin:0 auto 2rem; line-height:1.65; }
        .complete-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .play-again-btn { background:linear-gradient(135deg,var(--pink-light),var(--pink)); border:none; border-radius:16px; padding:13px 26px; color:#fff; font-size:15px; font-weight:800; cursor:pointer; box-shadow:0 6px 20px rgba(255,78,174,0.38); transition:transform 0.15s; }
        .play-again-btn:hover { transform:translateY(-2px); }
        .home-btn { background:rgba(255,255,255,0.07); border:1.5px solid rgba(255,255,255,0.18); border-radius:16px; padding:13px 26px; color:#fff; font-size:15px; font-weight:800; cursor:pointer; }
        .states-footer { text-align:center; padding:1rem; opacity:0.25; font-size:12px; font-weight:600; }
        @media(max-width:768px) {
          .game-area { grid-template-columns:1fr; }
          .right-panel { order:-1; }
          .game-title { font-size:18px; }
        }
      `}</style>

      <div className="states-page">
        <div className="stars-bg" />
        <div className="states-wrapper">

          {/* Header */}
          <div className="states-header">
            <Link href="/learning" className="states-back-btn">← Learning</Link>
            <div className="game-title">🗺️ <span>State</span> Explorer</div>
          </div>

          {/* Main game */}
          <div id="game-main">
            <div className="game-area">

              {/* Full map */}
              <div className="map-panel">
                <div className="map-loading" id="map-loading">Loading map… 🗺️</div>
                <svg id="map-svg" viewBox="0 0 975 610"></svg>
                <div className="map-progress">
                  <div className="map-progress-bar">
                    <div className="map-progress-fill" id="progress-fill" style={{ width: '0%' }}></div>
                  </div>
                  <div className="map-progress-label" id="progress-label">0 / 50</div>
                </div>
              </div>

              {/* Right panel */}
              <div className="right-panel">

                {/* Zoom panel */}
                <div className="zoom-panel">
                  <div className="zoom-label">✦ Close-up ✦</div>
                  <svg id="zoom-svg" viewBox="0 0 300 180"></svg>
                </div>

                {/* Lily */}
                <div className="lily-card">
                  <div className="lily-icon">🌸</div>
                  <div className="lily-text" id="lily-message">
                    <strong>Which state is glowing pink? 🌟</strong>
                    Look at the close-up and type its name!
                  </div>
                </div>

                {/* Input */}
                <div className="input-card">
                  <div className="input-label">Your Answer</div>
                  <div className="input-row">
                    <input
                      className="state-input"
                      id="state-input"
                      type="text"
                      placeholder="Type the state name…"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="words"
                      spellCheck={false}
                      onKeyDown={handleKeyDown}
                    />
                    <button className="submit-btn" id="submit-btn" onClick={checkAnswer}>→</button>
                  </div>
                  <button className="hint-btn" id="hint-btn" onClick={showHint}>💡 Need a hint?</button>
                </div>

                <div className="feedback-banner" id="feedback-banner">
                  <span className="fb-icon" id="fb-icon">🎉</span>
                  <div className="fb-text" id="fb-text"></div>
                </div>

                <button className="next-btn" id="next-btn" onClick={nextState}>Next State →</button>
                <button className="skip-btn" id="skip-btn" onClick={nextState}>Skip this one ›</button>
              </div>
            </div>
          </div>

          {/* Complete screen */}
          <div className="complete-screen" id="complete-screen">
            <div className="complete-stars" id="complete-stars">🌟🌟🌟</div>
            <div className="complete-title" id="complete-title">State Champion!</div>
            <div className="complete-score" id="complete-score"></div>
            <div className="complete-msg" id="complete-msg"></div>
            <div className="complete-btns">
              <button className="play-again-btn" onClick={restartGame}>🔄 Play Again</button>
              <Link href="/learning" className="home-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>📚 Back to Learning</Link>
            </div>
          </div>

          <div className="states-footer">© 2026 Lily&apos;s Playspace</div>
        </div>
      </div>

      <WaveFooter />
    </>
  )
}
