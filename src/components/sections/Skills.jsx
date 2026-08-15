import { useRef, useState, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { EASE, DURATION } from '../../animations/gsapSetup'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import LazyScene from '../three/LazyScene'
import { skillCategories } from '../../data/skills'

const SkillsScene = lazy(() => import('../three/SkillsScene'))

/**
 * Skills: 3D "technology ecosystem" on the left, interactive DOM cards on the right.
 * Hovering a skill card highlights the matching node in the 3D scene.
 */
export default function Skills() {
  const sectionRef = useRef(null)
  const quality = useGraphicQuality()
  const reduced = useReducedMotion()
  const [activeTech, setActiveTech] = useState(null)

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)

      gsap.fromTo(
        q('[data-skills-bg]'),
        { y: 60, opacity: 0.4 },
        {
          y: -60,
          opacity: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      q('[data-reveal-line]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.base,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        )
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="skills"
      ref={sectionRef}
      data-section
      className="relative overflow-hidden py-28 md:py-36"
    >
      <div
        data-skills-bg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 select-none font-black leading-none tracking-tighter text-[#F5F5F5]/[0.04]"
        style={{ fontFamily: "'Mitr', sans-serif", fontSize: 'clamp(6rem, 20vw, 18rem)' }}
      >
        SKILLS
      </div>

      <div className="container-custom relative">
        <p
          data-reveal-line
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#8B5CF6]"
        >
          Tech Ecosystem
        </p>
        <h2
          data-reveal-line
          className="mb-6 text-4xl font-bold md:text-6xl"
          style={{ fontFamily: "'Mitr', sans-serif" }}
        >
          My{' '}
          <span className="bg-gradient-to-r from-[#a78bfa] to-[#8B5CF6] bg-clip-text text-transparent">
            Capabilities
          </span>
        </h2>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* 3D scene */}
          <div className="relative order-2 h-[340px] lg:order-1 lg:col-span-6 lg:h-[560px]">
            <LazyScene Component={SkillsScene} quality={quality} activeTech={activeTech} />
            <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-[#A1A1AA]/60">
              {activeTech ? `${activeTech} · active` : 'Hover a card to highlight'}
            </p>
          </div>

          {/* Skills cards */}
          <div className="order-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-2 lg:col-span-6">
            {skillCategories.map((group) => (
              <div
                key={group.category}
                data-reveal-line
                className="rounded-2xl border border-edge bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#8B5CF6]/40 hover:bg-white/[0.04]"
              >
                <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-[#F5F5F5]">
                  <span className="h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  {group.category}
                </h3>
                <p className="mb-4 text-[11px] text-[#A1A1AA]">{group.subtitle}</p>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onMouseEnter={() => setActiveTech(skill)}
                      onMouseLeave={() => setActiveTech(null)}
                      onFocus={() => setActiveTech(skill)}
                      onBlur={() => setActiveTech(null)}
                      className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 ${
                        activeTech === skill
                          ? 'border-[#8B5CF6]/70 bg-[#8B5CF6]/15 text-white shadow-glow'
                          : 'border-edge text-[#A1A1AA] hover:border-[#8B5CF6]/40 hover:text-white'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}