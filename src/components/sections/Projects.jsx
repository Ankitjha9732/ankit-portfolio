import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from '../../animations/gsapSetup'
import { EASE } from '../../animations/gsapSetup'
import { showcaseProjects, upcomingProjects } from '../../data/projects'
import { useReducedMotion } from '../../hooks/useResponsive'
import MagneticButton from '../shared/MagneticButton'

/**
 * Projects: horizontal showcase driven by vertical scroll (desktop),
 * vertical stacked fallback on mobile/tablet. Upcoming projects listed separately.
 */
export default function Projects() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const [horizontal, setHorizontal] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const check = () => setHorizontal(mq.matches && !reduced)
    check()
    mq.addEventListener('change', check)
    return () => mq.removeEventListener('change', check)
  }, [reduced])

  useEffect(() => {
    if (!horizontal) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const getX = () => -(track.scrollWidth - window.innerWidth)

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: getX,
        ease: EASE.drift,
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Refresh math on resize
      const onResize = () => {
        tween.vars.x = getX()
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }, section)

    return () => ctx.revert()
  }, [horizontal])

  return (
    <section
      id="projects"
      ref={sectionRef}
      data-section
      className="relative overflow-hidden"
    >
      {horizontal ? (
        /* -------- HORIZONTAL section (desktop) -------- */
        <div ref={pinRef} className="relative h-screen overflow-hidden">
          <div ref={trackRef} className="flex h-full items-center" style={{ width: 'max-content' }}>
            {/* Intro panel */}
            <div className="relative flex h-full w-screen shrink-0 items-center px-[8vw]">
              <div>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#8B5CF6]">
                  Selected Work
                </p>
                <h2
                  className="text-5xl font-bold md:text-7xl"
                  style={{ fontFamily: "'Mitr', sans-serif" }}
                >
                  Projects
                </h2>
                <p className="mt-4 max-w-md text-[#A1A1AA]">
                  A horizontal journey through my real-world builds. Keep
                  scrolling to explore.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8B5CF6]">
                  Scroll →
                </span>
              </div>
            </div>

            {/* Project panels */}
            {showcaseProjects.map((project, idx) => (
              <div
                key={project.id}
                className="relative flex h-full w-screen shrink-0 items-center justify-center px-[8vw]"
              >
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-black text-[18vw] leading-none text-[#F5F5F5]/[0.03]">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="grid w-full max-w-6xl grid-cols-12 items-center gap-10">
                  {/* Image */}
                  <div className="col-span-7">
                    <div className="group relative overflow-hidden rounded-3xl border border-edge bg-[#0c0c0f] shadow-card">
                      <img
                        src={project.image}
                        alt={project.name}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="col-span-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B5CF6]">
                      {String(idx + 1).padStart(2, '0')} · {project.category}
                    </p>
                    <h3 className="mt-2 text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Mitr', sans-serif" }}>
                      {project.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA]">
                      {project.description}
                    </p>

                    {/* Tech */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-edge px-3 py-1 font-mono text-[10px] text-[#A1A1AA]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {project.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                          <span className="h-1 w-1 rounded-full bg-[#8B5CF6]" />
                          {f}
                        </div>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="mt-7 flex flex-wrap gap-3">
                      <MagneticButton
                        as="a"
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="primary"
                      >
                        GitHub
                      </MagneticButton>
                      <MagneticButton
                        as="a"
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                      >
                        Live Demo ↗
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* End panel */}
            <div className="relative flex h-full w-screen shrink-0 items-center px-[8vw]">
              <div className="max-w-md">
                <h3 className="text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Mitr', sans-serif" }}>
                  More in the works →
                </h3>
                <p className="mt-4 text-[#A1A1AA]">
                  Scroll on to see what&apos;s coming next.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* -------- VERTICAL fallback (mobile/tablet) -------- */
        <div className="container-custom py-24 md:py-32">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#8B5CF6]">
            Selected Work
          </p>
          <h2
            className="mb-14 text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "'Mitr', sans-serif" }}
          >
            Projects
          </h2>

          <div className="space-y-12">
            {showcaseProjects.map((project, idx) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-3xl border border-edge bg-white/[0.02]"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B5CF6]">
                    {String(idx + 1).padStart(2, '0')} · {project.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold" style={{ fontFamily: "'Mitr', sans-serif" }}>
                    {project.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-edge px-3 py-1 font-mono text-[10px] text-[#A1A1AA]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <MagneticButton as="a" href={project.github} target="_blank" rel="noopener noreferrer" variant="primary">
                      GitHub
                    </MagneticButton>
                    <MagneticButton as="a" href={project.live} target="_blank" rel="noopener noreferrer" variant="outline">
                      Live Demo ↗
                    </MagneticButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------- Upcoming (always shown, listed separately) -------- */}
      <div className="container-custom border-t border-edge py-16 md:py-24">
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#8B5CF6]">
            On The Radar
          </p>
          <h3 className="mt-2 text-2xl font-bold md:text-3xl" style={{ fontFamily: "'Mitr', sans-serif" }}>
            Coming Soon
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {upcomingProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-dashed border-edge bg-white/[0.01] p-6 text-center transition-all duration-300 hover:border-[#8B5CF6]/40"
            >
              <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-edge text-[#8B5CF6]">
                ✦
              </span>
              <h4 className="text-lg font-semibold text-[#F5F5F5]">
                {project.name}
              </h4>
              <p className="mt-1 text-xs text-[#A1A1AA]">{project.category}</p>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#A1A1AA]/70">
                In development
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}