import { useRef, useEffect } from 'react'
import { gsap, EASE, scrubWordReveal, riseIn } from '../../animations/gsapSetup'
import { useReducedMotion } from '../../hooks/useResponsive'
import { profile } from '../../data/profile'

/**
 * Scene 02 — STORY.
 * The About content becomes a scroll-driven typographic narrative: the bio
 * disintegrates word by word as the reader descends, and the portrait is a
 * quiet platelet integrated into the environment rather than a hero image.
 */
export default function About() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    let ctx = null
    let cancelled = false

    // Wait for webfonts before splitting words, so SplitText measures the
    // real type and the scrub reveal isn't offset/re-laid-out by the font
    // swap. Bounded by a timeout so gating can never stall the timeline.
    const build = () => {
      if (cancelled || sectionRef.current !== section) return
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(section)

        scrubWordReveal(q('[data-story-words]'))

        riseIn(q('[data-rise]'), { y: 24, stagger: 0.05 })

        gsap.fromTo(
          q('[data-plate]'),
          { y: 46 },
          {
            y: -46,
            ease: EASE.drift,
            scrollTrigger: {
              trigger: q('[data-plate-wrap]')[0],
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )

        // thin rule that draws itself with a violet marker
        gsap.fromTo(
          q('[data-rule]')[0],
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: EASE.drift,
            scrollTrigger: {
              trigger: q('[data-story-words]')[0],
              start: 'top 75%',
              end: 'bottom 40%',
              scrub: true,
            },
          }
        )
      }, section)
    }

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
    fontsReady.then(build)
    const timeout = window.setTimeout(build, 2000)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      if (ctx) ctx.revert()
    }
  }, [reduced])

  return (
    <section
      id="scene-story"
      ref={sectionRef}
      aria-label="Story"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <div className="ghost-word absolute left-0 top-8 select-none text-[clamp(6rem,20vw,18rem)]">
        STORY
      </div>

      <div className="container-port relative">
        {/* scene index */}
        <div className="mb-20 flex items-center justify-between">
          <p className="kicker">Story</p>
          <p className="font-mono text-[10px] tracking-meta text-white/35">
            02<span className="text-violet-500"> / 06</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Narrative */}
          <div className="lg:col-span-7">
            <p className="mb-8 max-w-xl pl-5 font-mono text-[11px] uppercase leading-relaxed tracking-meta text-muted" style={{ borderLeft: '1px solid rgba(139,92,246,0.5)' }}>
              A developer who combines engineering discipline with a designer&apos;s eye.
            </p>

            <h2 data-story-words className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink">
              Full Stack Developer, passionate about building fast, responsive
              and scalable web applications with clean code and modern
              technologies.
            </h2>

            <span data-rule className="mt-14 block h-px w-full origin-top bg-gradient-to-r from-violet-500/70 via-white/10 to-transparent" />
          </div>

          {/* Portrait integrated into the environment */}
          <div data-plate-wrap className="lg:col-span-5">
            <div className="relative lg:ml-auto lg:max-w-[320px]">
              <div
                data-plate
                className="relative pl-5"
                style={{ willChange: 'transform' }}
              >
                <span className="absolute left-0 top-1 h-full w-px bg-violet-500/45" />
                <span className="absolute -left-0.5 bottom-16 h-16 w-px bg-violet-500/80 shadow-glowline" />
                <img
                  src={profile.portrait}
                  alt="Ankit Jha — portrait"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover brightness-95 contrast-[1.05] saturate-[0.4] transition-[filter,transform] duration-700 hover:saturate-[0.9]"
                />
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-meta text-white/40">
                  <span>Ankit Jha</span>
                  <span
                    className="flex items-center gap-2"
                    style={{ color: 'rgba(245,245,245,0.4)' }}
                  >
                    <span className="block h-1.5 w-1.5 rounded-full bg-violet-500" />
                    Portfolio
                  </span>
                </div>
                <p className="mt-6 max-w-[240px] text-[13px] leading-relaxed text-muted">
                  Designing and engineering creative, performant interfaces —
                  one deliberate detail at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}