import { useRef, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { EASE, DURATION } from '../../animations/gsapSetup'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import LazyScene from '../three/LazyScene'
import MagneticButton from '../shared/MagneticButton'
import { contactRows, opportunities, socialLinks } from '../../data/profile'
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const ContactScene = lazy(() => import('../three/ContactScene'))

const ICON_MAP = {
  email: FaEnvelope,
  linkedin: FaLinkedin,
  github: FaGithub,
  twitter: FaTwitter,
  location: FaMapMarkerAlt,
}

const SOCIAL_ICON_MAP = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  email: FaEnvelope,
}

/**
 * Contact / final scene: large typography, 3D torus + particle halo, magnetic CTAs,
 * contact columns, social icons. All contact links/badges preserved.
 */
export default function Contact() {
  const sectionRef = useRef(null)
  const quality = useGraphicQuality()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section)

      q('[data-reveal]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.base,
            delay: i * 0.06,
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
      id="contact"
      ref={sectionRef}
      data-section
      className="relative overflow-hidden"
    >
      {/* 3D final scene backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <LazyScene Component={ContactScene} quality={quality} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

      <div className="container-custom relative py-32 md:py-44">
        <div className="text-center">
          <p data-reveal className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#8B5CF6]">
            Contact
          </p>
          <h2
            data-reveal
            className="bg-gradient-to-r from-[#F5F5F5] via-[#a78bfa] to-[#8B5CF6] bg-clip-text text-5xl font-bold leading-none text-transparent md:text-8xl"
            style={{ fontFamily: "'Mitr', sans-serif" }}
          >
            Let's Build
            <br />
            Something
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-md text-[#A1A1AA]">
            Open to full-stack roles, freelance, and collaborations. I usually
            reply within 24 hours.
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton as="a" href="mailto:ankitjhaworks@gmail.com" variant="primary">
              Send an Email
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

        {/* Opportunities + Contact spec */}
        <div className="mt-24 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Opportunities */}
          <div data-reveal className="rounded-3xl border border-edge bg-white/[0.02] p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inset-0 rounded-full bg-[#8B5CF6] opacity-60 animate-ping" />
                <span className="absolute inset-0 rounded-full bg-[#8B5CF6]" />
              </span>
              <span className="text-sm font-semibold text-[#F5F5F5]">
                Available for Work
              </span>
            </div>
            <ul className="space-y-3">
              {opportunities.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                  <span className="h-1 w-1 rounded-full bg-[#8B5CF6]" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Socials */}
            <div className="mt-8 border-t border-edge pt-6">
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#A1A1AA]">
                Elsewhere
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((s) => {
                  const Icon = SOCIAL_ICON_MAP[s.icon]
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target={s.url.startsWith('mailto') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-edge text-[#A1A1AA] transition-all duration-200 hover:border-[#8B5CF6]/60 hover:text-[#a78bfa] hover:-translate-y-0.5"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Contact spec */}
          <div data-reveal className="overflow-hidden rounded-3xl border border-edge bg-white/[0.02] backdrop-blur-sm">
            <div className="border-b border-edge bg-[#8B5CF6]/10 px-6 py-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#a78bfa]">
                Contact Spec
              </h3>
            </div>
            <div>
              {contactRows.map((row) => {
                const Icon = row.icon ? ICON_MAP[row.icon] : null
                return (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 border-b border-edge/60 px-6 py-3.5 last:border-0"
                  >
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#A1A1AA]">
                      {Icon && <Icon className="h-3 w-3 text-[#8B5CF6]" />}
                      {row.label}
                    </div>
                    <div className="text-right text-sm font-semibold text-[#F5F5F5]">
                      {row.label === 'STATUS' ? (
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                          {row.value}
                        </span>
                      ) : (
                        row.value
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Big closing line */}
        <p
          data-reveal
          className="mt-24 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-[#A1A1AA]/60"
        >
          © 2024 Ankit Jha · Crafted with React, Three.js &amp; GSAP
        </p>
      </div>
    </section>
  )
}