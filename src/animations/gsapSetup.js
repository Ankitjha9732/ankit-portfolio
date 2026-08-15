import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// Shared easing curves + durations — tuned for a premium feel.
export const EASE = {
  // Smooth power ease for entrances
  out: 'power3.out',
  // Long smooth cinematic drift
  drift: 'none',
  // Bouncy-but-tasteful overshoot
  springy: 'back.out(1.6)',
  // Slow, luxurious
  expoOut: 'expo.out',
}

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  med: 0.9,
  slow: 1.2,
  scroll: 1,
}

// Default scroll trigger edges for reveal animations.
export const TRIGGER = {
  start: 'top 85%',
  end: 'bottom 15%',
}

// Create a GSAP context scoped to a ref — ensures cleanup on unmount.
export function useGsapScope(ref) {
  return gsap.context(() => {}, ref)
}

export { gsap, ScrollTrigger }