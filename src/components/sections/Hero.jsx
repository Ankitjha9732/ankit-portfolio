import { useRef, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import { EASE, DURATION } from '../../animations/gsapSetup'
import LazyScene from '../three/LazyScene'
import MagneticButton from '../shared/MagneticButton'
import { profile } from '../../data/profile'

const HeroScene = lazy(() => import('../three/HeroScene'))

export default function Hero() {
  const sectionRef = useRef(null)
  const sceneWrapRef = useRef(null)
  const tlRef = useRef(null)
  const quality = useGraphicQuality()
  const reduced = useReducedMotion()
  const introSeen = useRef(() => {
    try {
      return !!sessionStorage.getItem('ajp-intro-seen')
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    const startDelay = introSeen.current() ? 0.15 : 1.35

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)
      const tl = gsap.timeline({
        defaults: { ease: EASE.out },
        delay: startDelay, // waits for intro (if not already seen)
      })

      tl.fromTo(q('[data-hero-roles] > span'), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: DURATION.fast, stagger: 0.1 })
        .fromTo(q('[data-hero-greet]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          q('[data-hero-name]'),
          { yPercent: 70, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7 },
          '-=0.2'
        )
        .fromTo(
          q('[data-hero-sub]'),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          q('[data-hero-cta] > *'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
          '-=0.2'
        )
        .fromTo(
          q('[data-hero-scroll]'),
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          '-=0.1'
        )

      tlRef.current = tl

      // Scene fades in slightly later + parallax on scroll
      gsap.fromTo(
        sceneWrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, delay: startDelay + 0.15 }
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* 3D background */}
      <div
        ref={sceneWrapRef}
        className="absolute inset-0 opacity-0"
        aria-hidden="true"
      >
        <LazyScene Component={HeroScene} quality={quality} reducedMotion={reduced} />
      </div>

      {/* Depth vignette + noise */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,transparent_30%,rgba(5,5,5,0.75)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />

      {/* Content */}
      <div className="container-custom relative z-10 w-full pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Roles */}
          <div
            data-hero-roles
            className="mb-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA]"
          >
            {profile.roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>

          <p data-hero-greet className="mb-3 text-lg text-[#A1A1AA]">
            Hi, I'm
          </p>

          {/* Name */}
          <h1 className="leading-none" data-hero-name>
            <span
              className="block select-none uppercase"
              style={{
                fontFamily: "'Mitr', sans-serif",
                fontSize: 'clamp(3.4rem, 13vw, 11rem)',
                letterSpacing: '-0.04em',
                lineHeight: '0.9',
                background: 'linear-gradient(135deg, #ffffff 20%, #a78bfa 55%, #8B5CF6 80%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Ankit Jha
            </span>
          </h1>

          {/* Description */}
          <p data-hero-sub className="mt-6 max-w-xl text-base leading-relaxed text-[#A1A1AA]">
            {profile.bio} I craft immersive digital experiences with{' '}
            <span className="text-[#a78bfa]">React</span>,{' '}
            <span className="text-[#a78bfa]">Three.js</span>, and{' '}
            <span className="text-[#a78bfa]">GSAP</span>.
          </p>

          {/* CTAs */}
          <div data-hero-cta className="mt-8 flex flex-wrap gap-4">
            <MagneticButton as="a" href={profile.resumePath} download={profile.resumeName} variant="primary">
              Download Resume
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://www.linkedin.com/in/ankitjhaa/"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Connect on LinkedIn
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A1A1AA]"
        style={{ opacity: 0 }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="block h-8 w-px animate-[scrollLine_1.8s_ease-in-out_infinite] bg-gradient-to-b from-[#8B5CF6] to-transparent" />
      </div>
    </section>
  )
}