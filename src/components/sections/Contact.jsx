import { useRef, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { EASE } from '../../animations/gsapSetup'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import LazyScene from '../three/LazyScene'
import TextLink from '../shared/TextLink'
import { profile, socialLinks, contactRows } from '../../data/profile'

const ConvergenceScene = lazy(() => import('../three/ConvergenceScene'))

const DIR = [
  { label: 'Email', value: profile.email, url: `mailto:${profile.email}` },
  ...socialLinks
    .filter((s) => s.icon !== 'instagram' && s.icon !== 'email')
    .map((s) => ({ label: s.label, value: s.url.replace(/^https?:\/\/(www\.)?/, ''), url: s.url })),
]

/**
 * Scene 06 — CONNECT.
 * The ending of the journey: the environment quiets and converges into a
 * point, and the closing statement + real contact directory appear there.
 */
export default function Contact() {
  const sectionRef = useRef(null)
  const quality = useGraphicQuality()
  const reduced = useReducedMotion()
  const progress = useScrollProgress(sectionRef, 1)

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)

      gsap.fromTo(
        q('[data-final-block]'),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: EASE.out,
          scrollTrigger: {
            trigger: q('[data-final-block]')[0],
            start: 'top 70%',
            end: 'top 25%',
            scrub: 0.5,
          },
        }
      )
      gsap.fromTo(
        q('[data-dir-row]'),
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: EASE.out,
          scrollTrigger: { trigger: q('[data-dir]')[0], start: 'top 80%', once: true },
        }
      )
    }, section)
    return () => ctx.revert()
  }, [reduced])

  const status = contactRows.find((r) => r.label === 'STATUS')?.value
  const base = contactRows.find((r) => r.label === 'LOCATION')?.value
  const response = contactRows.find((r) => r.label === 'RESPONSE')?.value

  return (
    <section
      id="scene-connect"
      ref={sectionRef}
      aria-label="Connect"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <LazyScene Component={ConvergenceScene} quality={quality} reducedMotion={reduced} progressRef={progress} />
      </div>
      <div className="vignette-base pointer-events-none absolute inset-0" />

      <div className="container-port relative">
        <div className="flex items-center justify-between pt-24">
          <p className="kicker">Connect</p>
          <p className="font-mono text-[10px] tracking-meta text-white/35">
            06<span className="text-violet-500"> / 06</span>
          </p>
        </div>

        {/* journey through empty space before the point resolves */}
        <div className="hidden md:block" style={{ height: '44vh' }} />

        {/* final block resolves at the convergence point */}
        <div data-final-block className="pb-10 pt-16 md:pt-24">
          <h2 className="font-display font-semibold leading-[0.95] tracking-[-0.035em] text-ink">
            <span className="block text-[clamp(2.6rem,7vw,5.6rem)]">LET&apos;S BUILD</span>
            <span className="block text-[clamp(2.6rem,7vw,5.6rem)]">SOMETHING</span>
            <span className="block font-serif italic font-medium text-violet-400 text-[clamp(2.6rem,7vw,5.6rem)]">
              together.
            </span>
          </h2>

          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted">
            {profile.title} open to full-stack roles, freelance work and
            open-source collaboration — {response?.toLowerCase() || 'fast replies'}.
          </p>

          {/* directory */}
          <div data-dir className="mt-14 max-w-2xl border-t border-line">
            {DIR.map((r) => {
              const external = r.url.startsWith('http')
              return (
                <div
                  key={r.label}
                  data-dir-row
                  className="group flex items-center justify-between gap-6 border-b border-line py-5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-meta text-white/45">
                    {r.label}
                  </span>
                  <TextLink
                    href={r.url}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    arrow={external}
                  >
                    {r.value}
                  </TextLink>
                </div>
              )
            })}
          </div>

          {/* meta footer line */}
          <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-3 font-mono text-[9px] uppercase tracking-meta text-white/40">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-glowline" />
              {status}
            </span>
            <span>{base}</span>
            <span>{response}</span>
          </div>

          <div className="mt-20 border-t border-line pt-8 pb-12">
            <p className="font-mono text-[9px] uppercase tracking-meta text-white/40">
              © 2026 Ankit Jha — crafted with React, Three.js &amp; GSAP
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}