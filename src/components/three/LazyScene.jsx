import { Suspense, useRef, useState, useEffect } from 'react'

/**
 * LazyScene — mounts an async (React.lazy) child only when the wrapper is
 * near the viewport. Falls back to nothing while loading. This keeps the
 * heavy Three.js chunk out of the critical bundle and offscreen work minimal.
 *
 * Usage:
 *   <LazyScene Component={HeroScene} quality={quality} />
 */
export default function LazyScene({ Component, fallback = null, offset = 200, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
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
  }, [offset])

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