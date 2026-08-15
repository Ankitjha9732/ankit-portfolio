// Lenis singleton so any component (spatial nav, inline CTAs) can animate
// the page scroll without importing/owning an instance.

let lenis = null

export function registerLenis(instance) {
  lenis = instance
  return lenis
}

export function getLenis() {
  return lenis
}

export function scrollToTarget(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: options.duration ?? 1.4,
      offset: options.offset ?? 0,
      force: false,
    })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el) el.scrollIntoView()
}