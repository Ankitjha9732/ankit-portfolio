import { useRef, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { EASE } from '../../animations/gsapSetup'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import LazyScene from '../three/LazyScene'
import TextLink from '../shared/TextLink'
import { profile } from '../../data/profile'
import { scrollToScene } from '../../data/scenes'

const IdentityScene = lazy(() => import('../three/IdentityScene'))

/**
 * Scene 01 — IDENTITY.
 * A connected-node lattice core acts as the spatial centerpiece; the DOM
 * content is a compact identity statement rather than a giant name plate.
 * A short load sequence (geometry → name → roles → statement → cue) plays once.
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

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)
      // geometry arrives first, then the identity text is revealed.
      const tl = gsap.timeline({ defaults: { ease: EASE.out } })

      gsap.fromTo(
        q('[data-id-core]'),
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power2.out' }
      )
      tl.fromTo(q('[data-id-brand]'), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          q('[data-id-name] .sw-word'),
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.07 },
          '-=0.1'
        )
        .fromTo(q('[data-id-roles] > span'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.4')
        .fromTo(q('[data-id-statement]'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.25')
        .fromTo(q('[data-id-cta] > *'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.35')
        .fromTo(q('[data-id-cue]'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.1')
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="scene-identity"
      ref={sectionRef}
      aria-label="Identity"
      className="relative flex min-h-[100svh] items-start overflow-hidden md:items-stretch"
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
          Ankit Jha — Digital Developer
        </p>
        <p className="hidden font-mono text-[10px] tracking-meta text-white/35 md:block">
          01<span className="text-violet-500"> / 06</span>
        </p>
      </div>

      {/* content */}
      <div className="container-port relative z-10 flex w-full flex-1 flex-col justify-end pb-20 pt-32 md:pb-24">
        <div className="max-w-4xl">
          {/* roles metadata */}
          <div
            data-id-roles
            className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-meta text-muted"
          >
            {profile.roles.map((r) => (
              <span key={r} className="flex items-center gap-2">
                <span className="h-px w-4 bg-violet-500/60" />
                {r}
              </span>
            ))}
          </div>

          {/* identity name — part of the environment, not a headline */}
          <h1
            data-id-name
            className="font-display text-[clamp(2.6rem, 8vw, 6.5rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-ink"
          >
            <span className="sw-word inline-block">Ankit</span>{' '}
            <span className="sw-word inline-block">
              <em className="font-serif italic tracking-[-0.03em] text-violet-400">Jha</em>
            </span>
          </h1>

          {/* statement */}
          <p
            data-id-statement
            className="mt-7 max-w-md text-[15px] leading-relaxed text-muted"
          >
            {profile.bio} I build web experiences that combine clean engineering
            with cinematic, intentional design.
          </p>

          {/* controls */}
          <div data-id-cta className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-12">
            <TextLink arrow onClick={() => scrollToScene('work')}>
              Explore the work
            </TextLink>
            <TextLink
              href={profile.resumePath}
              download={profile.resumeName}
              dim
            >
              Download resume
            </TextLink>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-id-cue
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
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