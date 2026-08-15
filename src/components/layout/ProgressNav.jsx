import { useState, useRef, useEffect } from 'react'
import { scenes, scrollToScene } from '../../data/scenes'
import { getLenis } from '../../lib/scroll'
import { useReducedMotion } from '../../hooks/useResponsive'

/**
 * Minimal spatial progress navigator.
 * A single hairline on the right edge with the scene indexes (01–06) along it.
 * Indicates the current scene and allows jumping between scenes. Not a navbar:
 * no labels, no fill panel — just a quiet index on the edge of the experience.
 */
export default function ProgressNav() {
  const [active, setActive] = useState('identity')
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()
  const raf = useRef(0)

  useEffect(() => {
    const sections = scenes
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)
    if (!sections.length) return

    const observe = () => {
      const center = window.innerHeight / 2
      const mid = (el) => {
        const r = el.getBoundingClientRect()
        const box = Math.min(el.offsetHeight, window.innerHeight)
        return r.top + Math.min(box / 2, r.height) - center
      }
      let best = scenes[0].id
      let bestDist = Infinity
      sections.forEach((el, i) => {
        const d = Math.abs(mid(el))
        if (d < bestDist) {
          bestDist = d
          best = scenes[i].id
        }
      })
      setActive((prev) => (prev === best ? prev : best))
    }

    const onScroll = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        observe()
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? window.scrollY / max : 0)
      })
    }

    observe()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const onJump = (id) => {
    if (reduced && getLenis()) {
      getLenis().scrollTo(scenes.find((s) => s.id === id).target, { duration: 0, force: true })
      return
    }
    scrollToScene(id)
  }

  return (
    <>
      <nav
      aria-label="Scene navigation"
      className="fixed right-3 top-1/2 z-[70] hidden -translate-y-1/2 flex-col items-center gap-5 md:right-5 md:flex pb-8"
    >
      {/* fill line */}
      <span className="relative block h-24 w-px bg-white/10 md:h-32">
        <span
          className="absolute left-0 top-0 block w-px origin-top bg-violet-500 shadow-glowline"
          style={{ height: '100%', transform: `scaleY(${progress})` }}
        />
      </span>

      {scenes.map((s, i) => {
        const isActive = active === s.id
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onJump(s.id)}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`Go to ${s.label}`}
            className="group relative flex items-center justify-center py-0.5"
          >
            <span
              className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-violet-500 shadow-glowline scale-125'
                  : 'bg-white/20 group-hover:bg-white/60'
              }`}
            />
            <span className="pointer-events-none absolute right-5 flex items-baseline gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1">
              <span className="font-mono text-[9px] tracking-meta text-white/40">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`font-mono text-[9px] uppercase tracking-meta ${
                  isActive ? 'text-violet-400' : 'text-white/60'
                }`}
              >
                {s.label}
              </span>
            </span>
          </button>
        )
      })}

      {/* always-visible active index, bottom */}
      <span className="absolute -bottom-px left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-meta text-white/35">
        {String(scenes.findIndex((s) => s.id === active) + 1).padStart(2, '0')}
        <span className="text-violet-500"> / {scenes.length}</span>
      </span>
    </nav>

    {/* mobile: single hairline progress fill, no index */}
    <span className="fixed right-1 top-0 z-[70] block h-full w-px bg-white/5 md:hidden">
      <span
        className="absolute left-0 top-0 block w-px origin-top bg-violet-400/80"
        style={{ height: '100%', transform: `scaleY(${progress})` }}
      />
    </span>
    </>
  )
}