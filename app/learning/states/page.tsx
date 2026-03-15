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
  "Arizona":["California","Nevada","Utah","New Mexico"],
  "Arkansas":["Missouri","Tennessee","Mississippi","Louisiana","Texas","Oklahoma"],
  "California":["Oregon","Nevada","Arizona"],
  "Colorado":["Wyoming","Nebraska","Kansas","Oklahoma","New Mexico","Utah"],
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

const LILY_MSGS = [
  "<strong>Which state is glowing pink? 🌟</strong> Check the close-up and pick your answer!",
  "<strong>Can you name this state? 🗺️</strong> Look at the zoom view and choose below!",
  "<strong>Look at the pink state! ✨</strong> Which one is it? Pick from the choices!",
  "<strong>Great job! 🌸</strong> The close-up shows the state — which one is it?",
  "<strong>You're doing amazing! 💕</strong> Pick the name of the glowing pink state!",
]

export default function StatesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameRef = useRef<{
    d3: any
    topojson: any
    geoPath: any
    projection: any
    stateFeaturesMap: Record<string, unknown>
    allStateNames: string[]
    queue: string[]
    currentIdx: number
    currentState: string
    currentChoices: string[]
    correctChoiceIdx: number
    score: number
    answered: boolean
    correctStates: Set<string>
  }>({
    d3: null, topojson: null, geoPath: null, projection: null,
    stateFeaturesMap: {}, allStateNames: [],
    queue: [], currentIdx: 0, currentState: '',
    currentChoices: [], correctChoiceIdx: -1,
    score: 0, answered: false, correctStates: new Set()
  })

  useEffect(() => {
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
        gameRef.current.d3 = w.d3
        gameRef.current.topojson = w.topojson
        loadMap(w.d3, w.topojson)
      })
      .catch(() => {
        const el = document.getElementById('map-loading')
        if (el) el.textContent = 'Map failed to load — please refresh 🔄'
      })
  }, [])

  function shuffle(a: string[]): string[] {
    const b = [...a]
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]]
    }
    return b
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
      gameRef.current.allStateNames = Object.values(STATE_DATA)

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

  function makeChoices(correct: string): string[] {
    const g = gameRef.current
    const neighbors = (NEIGHBORS[correct] || []).filter(n => n !== correct)
    const shuffledNeighbors = shuffle(neighbors)
    const others = shuffle(g.allStateNames.filter(n => n !== correct && !shuffledNeighbors.includes(n)))
    const wrongs = [...shuffledNeighbors, ...others].slice(0, 3)
    return shuffle([correct, ...wrongs])
  }

  function initGame() {
    const g = gameRef.current
    const d3 = g.d3
    g.queue = shuffle([...g.allStateNames])
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
    g.currentChoices = makeChoices(g.currentState)
    g.correctChoiceIdx = g.currentChoices.indexOf(g.currentState)

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

    // Set choice buttons
    g.currentChoices.forEach((name, i) => {
      const btn = document.getElementById('choice-' + i) as HTMLButtonElement | null
      if (btn) { btn.textContent = name; btn.className = 'choice-btn'; btn.disabled = false }
    })

    const skipBtn = document.getElementById('skip-btn')
    if (skipBtn) skipBtn.style.display = 'block'
    const nextBtn = document.getElementById('next-btn')
    if (nextBtn) nextBtn.classList.remove('visible')

    const fill = document.getElementById('progress-fill')
    const label = document.getElementById('progress-label')
    if (fill) fill.style.width = (idx / 50 * 100) + '%'
    if (label) label.textContent = idx + ' / 50'
  }

  function handleChoice(i: number) {
    const g = gameRef.current
    const d3 = g.d3
    if (g.answered) return
    g.answered = true

    for (let j = 0; j < 4; j++) {
      const btn = document.getElementById('choice-' + j) as HTMLButtonElement | null
      if (btn) btn.disabled = true
    }
    const skipBtn = document.getElementById('skip-btn')
    if (skipBtn) skipBtn.style.display = 'none'

    const isCorrect = i === g.correctChoiceIdx

    if (isCorrect) {
      g.score++
      g.correctStates.add(g.currentState)
      const btn = document.getElementById('choice-' + i)
      if (btn) btn.className = 'choice-btn correct'
      d3.selectAll('.state-path').each(function(this: Element) {
        const el = d3.select(this)
        if (el.attr('data-name') === g.currentState) {
          el.attr('fill', '#5BE0C0').classed('active', false).classed('correct', true)
        }
      })
      d3.select('#zoom-svg').select('.zoom-state-active')
        .attr('class', 'zoom-state-correct')
        .style('filter', 'none').style('animation', 'none')
      const lilyMsg = document.getElementById('lily-message')
      if (lilyMsg) lilyMsg.innerHTML = '<strong>🎉 Yes! That\'s ' + g.currentState + '!</strong> Great job!'
    } else {
      const wrongBtn = document.getElementById('choice-' + i)
      if (wrongBtn) wrongBtn.className = 'choice-btn wrong'
      const revealBtn = document.getElementById('choice-' + g.correctChoiceIdx)
      if (revealBtn) revealBtn.className = 'choice-btn reveal'
      d3.selectAll('.state-path').each(function(this: Element) {
        const el = d3.select(this)
        if (el.attr('data-name') === g.currentState) {
          el.attr('fill', '#FF5555').classed('active', false)
          setTimeout(() => el.attr('fill', '#FF4FAE').classed('active', true), 600)
        }
      })
      const lilyMsg = document.getElementById('lily-message')
      if (lilyMsg) lilyMsg.innerHTML = '<strong>It\'s ' + g.currentState + '! 🗺️</strong> You\'ll get it next time!'
    }

    const nextBtn = document.getElementById('next-btn')
    if (nextBtn) nextBtn.classList.add('visible')
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
    const allF = [activeFeature, ...neighborFeatures]

    const geoPath = g.geoPath
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    allF.forEach(f => {
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
      const isCorrect = g.correctStates.has(STATE_DATA[(f as Record<string, string>).id])
      zoomGroup.append('path').attr('d', zPath(f))
        .attr('class', isCorrect ? 'zoom-state-correct' : 'zoom-state-neighbor')
    })
    zoomGroup.append('path').attr('d', zPath(activeFeature)).attr('class', 'zoom-state-active')
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
    else if (pct >= 0.7) { stars = '⭐⭐⭐'; title = 'State Explorer!'; msg = `Amazing — ${g.score} out of 50! Keep playing and you'll get them all! 🗺️` }
    else if (pct >= 0.5) { stars = '⭐⭐'; title = 'Getting There!'; msg = `You got ${g.score} out of 50! Play again and beat your score! 💪` }
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
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
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
          transition: fill 0.3s ease, filter 0.3s ease;
        }
        .state-path.active {
          fill: var(--pink) !important; stroke: rgba(255,255,255,0.9); stroke-width: 1.2;
          animation: glow-pulse 1.8s ease-in-out infinite;
        }
        .state-path.correct { fill: var(--teal-soft) !important; opacity: 0.72; filter: none; animation: none; }
        .state-path.wrong-flash { fill: #FF5555 !important; animation: none; }
        @keyframes glow-pulse {
          0%,100% { filter: drop-shadow(0 0 10px rgba(255,78,174,0.95)) drop-shadow(0 0 24px rgba(255,78,174,0.5)); }
          50%      { filter: drop-shadow(0 0 18px rgba(255,120,196,1))   drop-shadow(0 0 40px rgba(255,78,174,0.8)); }
        }
        .zoom-panel {
          background: rgba(30,28,50,0.9); border: 1.5px solid rgba(255,78,174,0.25);
          border-radius: 22px; padding: 0.9rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
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
        .zoom-state-neighbor { fill: rgba(200,200,216,0.35); stroke: rgba(255,255,255,0.25); stroke-width: 0.8; }
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
        .choices-card {
          background: rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.09);
          border-radius:20px; padding:1rem;
          display: flex; flex-direction: column; gap: 8px;
        }
        .choices-label { font-size:10px; font-weight:700; color:rgba(255,255,255,0.35); letter-spacing:1.8px; text-transform:uppercase; margin-bottom:4px; }
        .choice-btn {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: 2px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 14px 18px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s, border-color 0.15s, transform 0.12s;
          -webkit-font-smoothing: antialiased;
          font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
        }
        .choice-btn:hover:not(:disabled) {
          background: rgba(255,78,174,0.18);
          border-color: rgba(255,78,174,0.45);
          transform: translateY(-1px);
        }
        .choice-btn:active:not(:disabled) { transform: scale(0.98); }
        .choice-btn.correct {
          background: rgba(48,212,168,0.18) !important;
          border-color: var(--teal) !important;
          color: var(--teal-soft) !important;
        }
        .choice-btn.wrong {
          background: rgba(255,68,68,0.15) !important;
          border-color: #FF5555 !important;
          color: #FF8888 !important;
          animation: shake 0.28s ease;
        }
        .choice-btn.reveal {
          background: rgba(48,212,168,0.10) !important;
          border-color: rgba(48,212,168,0.3) !important;
          color: rgba(91,224,192,0.7) !important;
        }
        .choice-btn:disabled { cursor: default; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-5px)} 70%{transform:translateX(5px)} }
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
          .choice-btn { padding:12px 14px; font-size:14px; }
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
                    Look at the close-up and pick the right answer!
                  </div>
                </div>

                {/* Multiple choice */}
                <div className="choices-card">
                  <div className="choices-label">Pick the right state</div>
                  <button className="choice-btn" id="choice-0" onClick={() => handleChoice(0)}></button>
                  <button className="choice-btn" id="choice-1" onClick={() => handleChoice(1)}></button>
                  <button className="choice-btn" id="choice-2" onClick={() => handleChoice(2)}></button>
                  <button className="choice-btn" id="choice-3" onClick={() => handleChoice(3)}></button>
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
