import { useMagnetic } from '../../hooks/useMagnetic'

export default function Magnetic({ children, strength = 0.35, className = '', as = 'span' }) {
  const ref = useMagnetic(strength)
  const Tag = as
  return (
    <Tag ref={ref} className={`magnetic ${className}`}>
      {children}
    </Tag>
  )
}