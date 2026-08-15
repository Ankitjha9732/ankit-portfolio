import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { EASE, DURATION } from '../../animations/gsapSetup'
import { useReducedMotion } from '../../hooks/useResponsive'
import { education } from '../../data/education'

/**
 * Education timeline: animated timeline progress line + staggered entry cards.
 * Preserved content — Government Polytechnic Muzaffarpur (diploma) & CDLU Sirsa (B.Tech).
 */
export default function Education() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Under reduced motion keep the timeline line visible, skip the rest.
    if (reduced) {
      gsap.set(section.querySelector('[data-timeline-line]'), { scaleY: 1 })
      return
    }

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)

      // Draw the center line
      gsap.fromTo(
        q('[data-timeline-line]')[0],
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: q('[data-timeline]')[0],
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      )

      // Reveal heading lines
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

      // Cards stagger in
      q('[data-edu-card]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: DURATION.med,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        )
      })

      // Node dots pop
      q('[data-timeline-dot]').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: EASE.springy,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        )
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="education"
      ref={sectionRef}
      data-section
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* faint background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[80vh] w-[80vw] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />

      <div className="container-custom relative">
        <p
          data-reveal-line
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#8B5CF6]"
        >
          My Academic Journey
        </p>
        <h2
          data-reveal-line
          className="mb-16 text-4xl font-bold md:text-6xl"
          style={{ fontFamily: "'Mitr', sans-serif" }}
        >
          Education
        </h2>

        <div data-timeline className="relative">
          {/* Timeline track */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[#1f1f24] md:left-1/2">
            <div
              data-timeline-line
              className="h-full w-full origin-top bg-gradient-to-b from-[#8B5CF6] to-[#a78bfa]"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {education.map((edu, i) => {
              const right = i % 2 === 1 // start with left on desktop
              return (
                <div key={edu.id} className="relative pl-12 md:pl-0">
                  {/* Node dot */}
                  <span
                    data-timeline-dot
                    className={`absolute left-4 top-2 -translate-x-1/2 md:left-1/2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#8B5CF6] bg-[#050505] shadow-[0_0_16px_rgba(139,92,246,0.5)]`}
                  >
                    <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                  </span>

                  <div
                    data-edu-card
                    className={`md:w-[calc(50%-3rem)] rounded-2xl border border-edge bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#8B5CF6]/40 md:p-8 ${
                      right ? 'md:ml-auto' : ''
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${
                          edu.statusBadge === 'current'
                            ? 'border border-[#8B5CF6]/40 bg-[#8B5CF6]/15 text-[#a78bfa]'
                            : 'border border-edge text-[#A1A1AA]'
                        }`}
                      >
                        {edu.status}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.15em] text-[#A1A1AA]">
                        {edu.years}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#F5F5F5]">
                      {edu.level} — {edu.degree}
                    </h3>
                    {edu.specialization && (
                      <p className="mt-1 text-sm font-semibold text-[#a78bfa]">
                        {edu.specialization}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-[#A1A1AA]">{edu.institution}</p>

                    <div className="mt-5 border-t border-edge pt-4">
                      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#A1A1AA]">
                        Key Subjects
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {edu.subjects.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-edge px-2.5 py-1 font-mono text-[10px] text-[#A1A1AA]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-edge pt-4">
                      {edu.stats.map((s) => (
                        <div key={s.label}>
                          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#A1A1AA]">
                            {s.label}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-[#F5F5F5]">
                            {s.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}