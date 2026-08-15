import { useMagnetic } from '../../hooks/useMagnetic'

/**
 * Magnetic button. Can render as <button> or <a>.
 * Props: as ('a'|'button'), variant ('primary'|'outline'|'ghost'), href, target, rel, className, children, ...rest
 */
export default function MagneticButton({
  as: Tag = 'button',
  variant = 'primary',
  href,
  className = '',
  children,
  ...rest
}) {
  const ref = useMagnetic(0.45)

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 relative overflow-hidden group/[btn]'

  const variants = {
    primary:
      'bg-[#8B5CF6] text-white shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5',
    outline:
      'border border-[#2c2c33] bg-white/[0.03] text-[#F5F5F5] backdrop-blur-sm hover:border-[#8B5CF6]/60 hover:text-white hover:-translate-y-0.5',
    ghost:
      'border border-[#8B5CF6]/30 bg-transparent text-[#a78bfa] hover:bg-[#8B5CF6]/10',
  }

  const props = Tag === 'a' ? { href, ...rest } : { ...rest }

  return (
    <Tag
      ref={ref}
      className={`magnetic ${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}