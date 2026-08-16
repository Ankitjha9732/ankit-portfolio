import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useResponsive'
import { signalSystemReady } from '../../lib/systemStart'

const PHRASES = ['INITIALIZING…', 'LOADING EXPERIENCE…', 'SYSTEM READY']

const T_FADE_IN = 0.4
const T_FILL = 1.4
const T_HOLD = 0.4
const T_FADE_OUT = 0.4

/**
 * Initial-page loading overlay. Mounts once at app start, plays a fast
 * "system initialization" sequence so every status phrase stays readable
 * (~2.6s), then fades out and unmounts. Signals "system ready" the
 * moment it begins fading so the Hero intro hands off seamlessly. Reduced
 * motion is respected: the progress bar is not animated, but the overlay is
 * still shown statically so the text remains visible before it fades.
 */
export default function Loader() {
  const reduced = useReducedMotion()
  const overlayRef = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)
      const statusEl = q('[data-loader-status]')[0]
      const pctEl = q('[data-loader-pct]')[0]
      const fill = q('[data-loader-fill]')[0]

      // Static variant for reduced-motion: nothing animates, the fill sits at
      // 100% so the status text is simply readable before a calm fade.
      if (reduced) {
        if (fill) fill.style.transform = 'scaleX(1)'
        if (pctEl) pctEl.textContent = '100%'
        if (statusEl) statusEl.textContent = PHRASES[2]
        gsap.to(el, {
          opacity: 0,
          delay: 1.6,
          duration: T_FADE_OUT,
          ease: 'power2.inOut',
          onStart: signalSystemReady,
          onComplete: () => setGone(true),
        })
        return
      }

      const tl = gsap.timeline()
      tl.fromTo(
        q('[data-loader-inner]'),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: T_FADE_IN, ease: 'power2.out' }
      )
        .to(fill, {
          scaleX: 1,
          duration: T_FILL,
          ease: 'power2.inOut',
          onUpdate() {
            const p = Math.round(this.progress() * 100)
            if (pctEl) pctEl.textContent = `${p}%`
            if (statusEl) {
              statusEl.textContent =
                p < 25 ? PHRASES[0] : p < 65 ? PHRASES[1] : PHRASES[2]
            }
          },
        })
        // longer hold so "SYSTEM READY" is readable before the fade
        .to({}, { duration: T_HOLD })
        .to(el, {
          opacity: 0,
          duration: T_FADE_OUT,
          ease: 'power2.inOut',
          onStart: signalSystemReady,
          onComplete: () => setGone(true),
        })
    }, el)

    return () => ctx.revert()
  }, [reduced])

  if (gone) return null

  return (
    <div className="loader-overlay" ref={overlayRef} role="status" aria-label="Loading">
      <div data-loader-inner className="loader-inner">
        <p className="loader-kicker">Ankit Jha</p>
        <p className="loader-sub">Digital Developer — Portfolio</p>
        <p data-loader-status className="loader-status">
          {PHRASES[0]}
        </p>
        <div className="loader-bar">
          <div data-loader-fill className="loader-bar-fill" />
        </div>
        <p data-loader-pct className="loader-pct">
          0%
        </p>
      </div>
    </div>
  )
}