import { useRef, useState, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { EASE } from '../../animations/gsapSetup'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import LazyScene from '../three/LazyScene'
import { techNodes } from '../../data/skills'

const EcosystemScene = lazy(() => import('../three/EcosystemScene'))

/**
 * Scene 03 — ECOSYSTEM.
 * The technologies themselves are the interface: nodes in a spatial graph.
 * Hovering a node (or a listed technology) highlights it, lights its spoke
 * and reveals its profile in the readout. No cards, no pills.
 */
export default function Skills() {
  const sectionRef = useRef(null)
  const [activeTech, setActiveTech] = useState(null)
  const quality = useGraphicQuality()
  const reduced = useReducedMotion()

  const active = activeTech ? techNodes.find((n) => n.tech === activeTech) : null
  const categories = [...new Set(techNodes.map((n) => n.category))]

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)
      q('[data-rise]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.05,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="scene-ecosystem"
      ref={sectionRef}
      aria-label="Ecosystem"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <div className="ghost-word absolute right-0 top-10 select-none text-[clamp(5rem,18vw,16rem)]">
        SYST
        <span className="text-violet-500/40">EM</span>
      </div>

      <div className="container-port relative">
        <div className="mb-16 flex items-center justify-between">
          <p data-rise className="kicker">
            Ecosystem
          </p>
          <p data-rise className="font-mono text-[10px] tracking-meta text-white/35">
            03<span className="text-violet-500"> / 06</span>
          </p>
        </div>

        <h2 data-rise className="max-w-3xl font-display text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
          The technologies I work with, arranged as a living{' '}
          <span className="text-violet-400">graph</span>.
        </h2>
        <p data-rise className="mt-5 max-w-lg text-muted">
          Hover a node to inspect it. Nodes on the outer ring are tools I use
          daily or am currently learning — the ecosystem is always expanding.
        </p>

        {/* 3D ecosystem */}
        <div className="relative mt-14 h-[54vh] w-full md:h-[76vh]">
          <LazyScene
            Component={EcosystemScene}
            quality={quality}
            reducedMotion={reduced}
            activeTech={activeTech}
            onHover={setActiveTech}
          />

          {/* readout */}
          <div className="pointer-events-none absolute bottom-6 left-0 z-10 md:bottom-8">
            {active ? (
              <div className="plate px-6 py-5 backdrop-blur-sm" style={{ minWidth: 240 }}>
                <div className="flex items-start justify-between gap-8">
                  <div>
                    <p className="font-display text-2xl font-semibold text-ink">{active.tech}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-meta text-white/45">
                      {active.category}
                      {active.learning ? ' · currently learning' : ''}
                    </p>
                  </div>
                  {active.level != null ? (
                    <p className="font-display text-xl font-semibold text-violet-400">
                      {active.level}
                      <span className="text-[10px] text-white/40">%</span>
                    </p>
                  ) : (
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500 shadow-glowline" />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-1">
                <span className="block h-6 w-px bg-violet-500/50" />
                <p className="font-mono text-[10px] uppercase tracking-meta text-white/40">
                  Explore the ecosystem — hover a node
                </p>
              </div>
            )}
          </div>
        </div>

        {/* accessible index */}
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 md:grid-cols-4">
          {categories.map((cat) => (
            <div key={cat}>
              <p className="mb-4 font-mono text-[9px] uppercase tracking-meta text-white/40">
                {cat}
              </p>
              <ul className="space-y-1">
                {techNodes
                  .filter((n) => n.category === cat)
                  .map((n) => {
                    const isActive = activeTech === n.tech
                    return (
                      <li key={n.tech}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveTech(n.tech)}
                          onMouseLeave={() => setActiveTech(null)}
                          onFocus={() => setActiveTech(n.tech)}
                          onBlur={() => setActiveTech(null)}
                          aria-pressed={isActive}
                          className={`font-mono text-[11px] uppercase tracking-label transition-colors duration-200 ${
                            isActive ? 'text-violet-400' : 'text-muted hover:text-ink'
                          }`}
                        >
                          {n.tech}
                          {n.learning && <span className="ml-1 text-[9px] text-white/30">· L</span>}
                        </button>
                      </li>
                    )
                  })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}