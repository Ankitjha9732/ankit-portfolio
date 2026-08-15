import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText)

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  drift: 'none',
  expo: 'expo.out',
  expoInOut: 'expo.inOut',
  sine: 'sine.inOut',
}

export const DURATION = {
  fast: 0.4,
  base: 0.65,
  med: 0.9,
  slow: 1.3,
}

export { gsap, ScrollTrigger, SplitText }

/**
 * Word-split a heading/content element for editorial reveals.
 * Returns the SplitText instance. Words keep the original parent styling.
 */
export function splitWords(el, options = {}) {
  const split = new SplitText(el, {
    type: 'words,lines',
    linesClass: 'sw-line',
    wordsClass: 'sw-word',
    ...options,
  })
  return split
}

/**
 * Scrub-driven word reveal: words fade up as the element travels through
 * the viewport. Intended for large editorial statements.
 */
export function scrubWordReveal(targets, triggers = []) {
  const anims = targets.map((el, i) => {
    const split = splitWords(el)
    gsap.fromTo(
      split.words,
      { opacity: 0.12, yPercent: 24, filter: 'blur(6px)' },
      {
        opacity: 1,
        yPercent: 0,
        filter: 'blur(0px)',
        ease: 'none',
        stagger: 0.025,
        scrollTrigger: {
          trigger: triggers[i] || el,
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: 0.6,
        },
      }
    )
    return split
  })
  return anims
}

/**
 * Plain fade-up on scroll for a set of elements (once).
 */
export function riseIn(targets, opts = {}) {
  const { y = 30, start = 'top 88%', delay = 0, stagger = 0.06 } = opts
  return targets.map((el) =>
    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.base,
        delay,
        ease: EASE.out,
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      }
    )
  )
}

/**
 * Cinematic approach: element + its scene push in from depth as the section
 * enters the viewport. Shared across scenes to keep the "travelling camera"
 * language consistent.
 */
export function sceneApproach(main, canvas, opts = {}) {
  const { duration = 1.4, distance = 60 } = opts
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: main,
      start: 'top 90%',
      once: true,
    },
  })
  tl.fromTo(
    canvas,
    { scale: 1.12, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: duration * 0.7,
      ease: 'power2.out',
    }
  )
    .fromTo(
      canvas,
      { z: distance },
      { z: 0, duration, ease: 'power2.out' },
      0
    )
    .fromTo(
      main,
      { opacity: 0.2 },
      { opacity: 1, duration: duration * 0.6, ease: 'power2.out' },
      0
    )
  return tl
}