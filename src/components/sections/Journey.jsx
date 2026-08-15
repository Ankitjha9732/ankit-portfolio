import { useRef, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { EASE } from '../../animations/gsapSetup'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import LazyScene from '../three/LazyScene'
import { journeyMilestones } from '../../data/education'

const JourneyScene = lazy(() => import('../three/JourneyScene'))

const TAG_STYLE = {
  completed: { label: 'Completed', cls: 'text-white/55' },
  current: { label: 'In progress', cls: 'text-violet-400' },
  next: { label: 'Next', cls: 'text-white/55' },
}

/**
 * Scene 05 — JOURNEY.
 * The education data becomes a path: three declared milestones (diploma,
 * degree, projected graduation) rising along a spatial line. Presented as
 * editorial rows — no table, no cards.
 */
export default function Journey() {
  const sectionRef = useRef(null)
  const progress = useScrollProgress(sectionRef, 1)
  const quality = useGraphicQuality()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)
      q('[data-milestone]').forEach((el, i) => {
        const xFrom = i % 2 === 0 ? -40 : 40
        gsap.fromTo(
          el,
          { opacity: 0, y: 70, x: xFrom },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.9,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          }
        )
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="scene-journey"
      ref={sectionRef}
      aria-label="Journey"
      className="relative overflow-hidden"
    >
      {/* spatial path behind */}
      <div className="absolute inset-0" aria-hidden="true">
        <LazyScene Component={JourneyScene} progressRef={progress} quality={quality} reducedMotion={reduced} />
      </div>
      <div className="stage-mask pointer-events-none absolute inset-0" />

      <div className="container-port relative py-28 md:py-40">
        <div className="mb-28 flex items-center justify-between">
          <p className="kicker">Journey</p>
          <p className="font-mono text-[10px] tracking-meta text-white/35">
            05<span className="text-violet-500"> / 06</span>
          </p>
        </div>

        <h2 className="max-w-2xl font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-ink">
          From first lines of code to a degree in{' '}
          <span className="text-violet-400">AI & ML</span>.
        </h2>

        <div className="mt-24">
          {journeyMilestones.map((m, i) => {
            const tag = TAG_STYLE[m.tag]
            const even = i % 2 === 0
            return (
              <div
                key={`${m.year}-${m.phase}`}
                data-milestone
                className={`relative grid grid-cols-1 gap-6 border-t border-line py-20 md:grid-cols-12 md:gap-8 md:py-24 ${
                  even ? '' : 'md:[direction:rtl]'
                }`}
              >
                <div className="md:col-span-4 md:[direction:ltr] md:pl-6">
                  <p className="font-display text-[clamp(3.5rem,9vw,7.5rem)] font-bold leading-none tracking-[-0.05em] text-ink/90">
                    {m.year}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-meta text-muted">
                    {m.phase}
                  </p>
                </div>

                <div className="md:col-span-8 md:[direction:ltr] md:pr-20 lg:pr-32">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        m.tag === 'current' ? 'bg-violet-500 shadow-glowline' : 'bg-white/25'
                      }`}
                    />
                    <span className={`font-mono text-[9px] uppercase tracking-meta ${tag.cls}`}>
                      {tag.label}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-medium leading-tight text-ink md:text-3xl">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-muted">{m.org}</p>

                  {m.subjects && (
                    <p className="mt-6 max-w-md border-l border-white/10 pl-4 text-[13px] leading-relaxed text-muted">
                      <span className="font-mono text-[9px] uppercase tracking-meta text-white/40">
                        Studies ·
                      </span>{' '}
                      {m.subjects.join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}