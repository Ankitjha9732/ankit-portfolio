import { useRef, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { EASE } from '../../animations/gsapSetup'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import { onSystemReady } from '../../lib/systemStart'
import LazyScene from '../three/LazyScene'
import TextLink from '../shared/TextLink'
import { profile, socialLinks } from '../../data/profile'

const IdentityScene = lazy(() => import('../three/IdentityScene'))

const linkedin = socialLinks.find((s) => s.icon === 'linkedin')?.url

// Floating technology labels that drift around the lattice core (decor only).
const ORBITS = [
  { label: 'React', top: '16%', left: '10%', delay: '0s' },
  { label: 'JavaScript', top: '22%', left: '72%', delay: '1.1s' },
  { label: 'MERN', top: '33%', left: '84%', delay: '2.2s' },
  { label: 'Three.js', top: '38%', left: '14%', delay: '0.6s' },
  { label: 'GSAP', top: '46%', left: '62%', delay: '1.7s' },
]

/**
 * Scene 01 — IDENTITY.
 * The lattice core drifts as the single focal visual, ringed by floating
 * technology labels. Identity is a compact editorial mark — small labels,
 * an outlined accent word, modest type and whitespace — with resume/LinkedIn
 * actions. A short load sequence plays once.
 */
export default function Hero() {
  const sectionRef = useRef(null)
  const visualRef = useRef(null)
  const scrollRef = useRef({ y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  const pulseRef = useRef(0)
  const lastX = useRef(0)
  const lastY = useRef(0)
  const lastT = useRef(0)
  const quality = useGraphicQuality()
  const reduced = useReducedMotion()

  // Scene sensors: scroll depth + pointer position/velocity, shared into WebGL.
  useEffect(() => {
    const onScroll = () => {
      scrollRef.current.y = window.scrollY
    }
    const onPointer = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
      const now = performance.now()
      const dt = Math.max(16, now - lastT.current)
      const dx = e.clientX - lastX.current
      const dy = e.clientY - lastY.current
      const speed = Math.sqrt(dx * dx + dy * dy)
      pulseRef.current = Math.min(1, speed / 26 + (0.08 * dt) / 16)
      lastX.current = e.clientX
      lastY.current = e.clientY
      lastT.current = now
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    // Intro builds when the loader reports "system ready" (or after a safety
    // timeout so gating can never stall the reveal). Content stays visible
    // behind the opaque loader, then lifts in as it fades out.
    let ctx = null
    const build = () => {
      if (ctx) return
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(section)
        // geometry arrives first, then the identity pieces assemble in order.
        const tl = gsap.timeline({ defaults: { ease: EASE.out } })

        gsap.fromTo(
          q('[data-id-core]'),
          { opacity: 0 },
          { opacity: 1, duration: 1.4, ease: 'power2.out' }
        )
        tl.fromTo(q('[data-id-brand]'), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 })
          .fromTo(q('[data-id-orbit]'), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.08 }, '-=0.3')
          .fromTo(q('[data-id-mark]'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
          .fromTo(
            q('[data-id-name] .sw-word'),
            { clipPath: 'inset(0 0 100% 0)', y: '18%' },
            { clipPath: 'inset(0 0 0% 0)', y: '0%', duration: 0.8, stagger: 0.14, ease: EASE.expo },
            '-=0.25'
          )
          .fromTo(q('[data-id-line]'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.45')
          .fromTo(q('[data-id-cta] > *'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.4')
          .fromTo(q('[data-id-cue]'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.1')
      }, section)
    }

    const fallback = window.setTimeout(build, 2600)
    const off = onSystemReady(build)

    return () => {
      window.clearTimeout(fallback)
      off()
      if (ctx) ctx.revert()
    }
  }, [reduced])

  return (
    <section
      id="scene-identity"
      ref={sectionRef}
      aria-label="Identity"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* WebGL landscape */}
      <div
        ref={visualRef}
        data-id-core
        className="absolute inset-0 opacity-0"
        aria-hidden="true"
      >
        <LazyScene
          Component={IdentityScene}
          quality={quality}
          reducedMotion={reduced}
          scrollRef={scrollRef}
          mouseRef={mouseRef}
          pulseRef={pulseRef}
        />
      </div>

      {/* depth + grain */}
      <div className="vignette-base pointer-events-none absolute inset-0" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-70" />

      {/* quiet brand mark */}
      <div className="container-port pointer-events-none absolute left-0 right-0 top-8 z-10 flex items-center justify-between">
        <p data-id-brand className="font-mono text-[10px] uppercase tracking-meta text-white/50">
          A/JHA — Digital Developer
        </p>
        <p className="hidden font-mono text-[10px] tracking-meta text-white/35 md:block">
          01<span className="text-violet-500"> / 06</span>
        </p>
      </div>

      {/* floating technology labels around the core */}
      <div className="absolute inset-0 z-[5] hidden md:block" aria-hidden="true">
        {ORBITS.map((o) => (
          <span
            key={o.label}
            data-id-orbit
            className="hero-orbit"
            style={{ top: o.top, left: o.left, animationDelay: o.delay }}
          >
            {o.label}
          </span>
        ))}
      </div>

      {/* content — compact identity mark, bottom-anchored */}
      <div className="container-port relative z-10 w-full hero-side">
        <div className="max-w-3xl">
          {/* editorial micro-label */}
          <p data-id-mark className="font-mono text-[9px] uppercase tracking-meta text-violet-400">
            // Developer identity
          </p>

          {/* identity mark — modest size, outlined accent word */}
          <h1
            data-id-name
            className="hero-name mt-5 font-sans font-bold uppercase leading-[1.02] tracking-[-0.01em] text-ink"
          >
            <span className="sw-word inline-block">{profile.firstName}</span>{' '}
            <span className="sw-word inline-block hero-name-accent">{profile.lastName}</span>
            <span className="sw-word inline-block hero-name-dot">.</span>
          </h1>

          <p data-id-line className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-meta text-ink/80">
            <span className="h-px w-5 bg-violet-500/70" />
            Frontend &amp; Full Stack Developer
          </p>
          <p data-id-line className="mt-2 font-mono text-[9px] uppercase tracking-meta text-white/40">
            B.Tech CSE (AI &amp; ML) Student
          </p>

          <p data-id-line className="hero-desc mt-5 max-w-md leading-relaxed text-muted">
            Building beautiful, responsive web applications with React, Tailwind CSS, and modern
            JavaScript. Currently exploring MERN Stack, Three.js, and GSAP.
          </p>

          {/* actions */}
          <div data-id-cta className="mt-9 flex flex-wrap items-center gap-x-12 gap-y-4">
            <TextLink href={profile.resumePath} download={profile.resumeName}>
              View Resume
            </TextLink>
            <TextLink href={linkedin} target="_blank" rel="noopener noreferrer" dim arrow>
              LinkedIn
            </TextLink>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-id-cue
        className="hero-cue absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        <span className="font-mono text-[9px] uppercase tracking-meta text-white/45">
          Scroll to explore
        </span>
        <span className="scroll-cue-line block h-px w-24" />
      </div>
    </section>
  )
}