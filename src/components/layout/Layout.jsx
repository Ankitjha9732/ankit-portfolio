import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import ProgressNav from './ProgressNav'
import CustomCursor from '../shared/CustomCursor'

export default function Layout({ children }) {
  useSmoothScroll()

  return (
    <div className="relative min-h-screen bg-base text-ink">
      <CustomCursor />
      <ProgressNav />
      <main>{children}</main>
    </div>
  )
}