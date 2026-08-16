import { Suspense, useRef, useState, useEffect } from 'react'

/**
 * LazyScene — mounts an async (React.lazy) child only when the wrapper is
 * near the viewport. Falls back to nothing while loading. This keeps the
 * heavy Three.js chunk out of the critical bundle and offscreen work minimal.
 *
 * When `eager` is true, the component mounts immediately without waiting
 * for IntersectionObserver — used for the Hero scene which is always in
 * the viewport and needs the fastest possible initialization.
 *
 * Usage:
 *   <LazyScene Component={HeroScene} quality={quality} eager />
 */
export default function LazyScene({ Component, fallback = null, offset = 200, eager = false, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(eager)

  useEffect(() => {
    if (eager) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: `${offset}px 0px`, threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [offset, eager])

  return (
    <div ref={ref} className="relative h-full w-full">
      {visible ? (
        <Suspense fallback={fallback}>
          <Component {...props} />
        </Suspense>
      ) : null}
    </div>
  )
}
