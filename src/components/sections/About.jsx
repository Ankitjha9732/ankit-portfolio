import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { EASE, DURATION } from '../../animations/gsapSetup'
import { useReducedMotion } from '../../hooks/useResponsive'
import { profile } from '../../data/profile'

/**
 * About section: large typography reveal + portrait with parallax.
 * Content preserved from the original portfolio (FULL STACK DEVELOPER identity,
 * portrait, bio). Includes only real facts — no invented statistics.
 */
const FACTS = [
  { label: 'Role', value: 'Frontend & Full Stack Developer' },
  { label: 'Education', value: 'B.Tech CSE (AI & ML) Student' },
  { label: 'Learning', value: 'MERN Stack · Three.js · GSAP' },
  { label: 'Status', value: 'Available for Opportunities' },
]

export default function About() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)

      // Large background word parallax
      gsap.fromTo(
        q('[data-about-bg]'),
        { y: 80, opacity: 0.4 },
        {
          y: -80,
          opacity: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      // Portrait parallax
      gsap.fromTo(
        q('[data-about-img]'),
        { y: 40 },
        {
          y: -40,
          ease: EASE.drift,
          scrollTrigger: {
            trigger: q('[data-about-img-wrap]')[0],
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      // Reveal copies
      q('[data-reveal-line]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.base,
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
      id="about"
      ref={sectionRef}
      data-section
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* Background word */}
      <div
        data-about-bg
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 left-0 select-none font-black leading-none tracking-tighter text-[#F5F5F5]/[0.04]"
        style={{ fontFamily: "'Mitr', sans-serif", fontSize: 'clamp(6rem, 22vw, 20rem)' }}
      >
        ABOUT
      </div>

      <div className="container-custom relative grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        {/* Portrait */}
        <div data-about-img-wrap className="relative lg:col-span-5">
          <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[#8B5CF6]/10 blur-2xl" />
          <div className="pointer-events-none absolute -inset-px rounded-[1.5rem] border border-[#8B5CF6]/25" />
          <img
            data-about-img
            src={profile.portrait}
            alt="Ankit Jha — portrait"
            loading="lazy"
            className="relative aspect-[3/4] w-full max-w-md rounded-[1.5rem] object-cover"
            style={{ willChange: 'transform' }}
          />
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
          <p
            data-reveal-line
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#8B5CF6]"
          >
            About Me
          </p>
          <h2
            data-reveal-line
            className="mb-6 text-4xl font-bold leading-[1.05] md:text-6xl"
            style={{ fontFamily: "'Mitr', sans-serif" }}
          >
            Full Stack Developer crafting{' '}
            <span className="bg-gradient-to-r from-[#a78bfa] to-[#8B5CF6] bg-clip-text text-transparent">
              immersive
            </span>{' '}
            experiences.
          </h2>
          <p data-reveal-line className="max-w-2xl text-base leading-relaxed">
            {profile.bio} I combine clean engineering with cinematic design,
            building fast, responsive, and scalable web applications.
          </p>

          {/* Real profile facts */}
          <div className="mt-10 max-w-lg divide-y divide-edge rounded-2xl border border-edge bg-white/[0.02]">
            {FACTS.map((fact, i) => (
              <div
                key={fact.label}
                data-reveal-line
                className="flex items-center justify-between gap-4 px-5 py-3.5"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8B5CF6]">
                  {fact.label}
                </span>
                <span className="text-sm text-[#F5F5F5]">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}