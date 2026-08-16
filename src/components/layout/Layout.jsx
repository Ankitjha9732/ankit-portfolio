import { lazy, Suspense } from 'react'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import ProgressNav from './ProgressNav'

const CustomCursor = lazy(() => import('../shared/CustomCursor'))

export default function Layout({ children }) {
  useSmoothScroll()

  return (
    <div className="relative min-h-screen bg-base text-ink">
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>
      <ProgressNav />
      <main>{children}</main>
    </div>
  )
}
