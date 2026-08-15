import gsap from 'gsap'
import { ScrollTrigger } from './gsapSetup'
import { EASE, DURATION, TRIGGER } from './gsapSetup'

/**
 * Batch-reveal elements as they enter the viewport.
 * @param {Array<HTMLElement>} targets - elements to reveal
 * @param {object} opts - { y, duration, stagger, ease, start, once, delay }
 */
export function batchReveal(targets, opts = {}) {
  const {
    y = 40,
    duration = DURATION.base,
    stagger = 0.08,
    ease = EASE.out,
    start = TRIGGER.start,
    once = true,
    delay = 0,
  } = opts

  if (!targets || !targets.length) return []

  const anims = targets.map((el) =>
    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        ease,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          once: once ? true : undefined,
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        },
      }
    )
  )

  // Stagger by adding incremental delay based on position
  anims.forEach((a, i) => {
    if (i > 0) a.delay(a.delay() + i * stagger)
  })

  return anims
}

/**
 * Single-element reveal.
 */
export function reveal(el, opts = {}) {
  return batchReveal([el], opts)[0]
}

/**
 * Parallax an element along Y as it scrolls through the viewport.
 * @param {HTMLElement|string} target
 * @param {number} amount - px to move (negative = moves up slower)
 */
export function parallax(target, amount = -80) {
  gsap.to(target, {
    y: amount,
    ease: EASE.drift,
    scrollTrigger: {
      trigger: target,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/**
 * Kill all ScrollTriggers.
 */
export function killScrollTriggers() {
  ScrollTrigger.getAll().forEach((st) => st.kill())
}

/**
 * Refresh ScrollTrigger after layout shifts (e.g. fonts, images, resize).
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}

export { gsap, ScrollTrigger }