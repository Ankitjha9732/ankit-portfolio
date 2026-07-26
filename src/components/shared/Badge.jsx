/**
 * Badge Component - For tags, labels, and technology indicators
 * @param {string} color - Color variant: 'blue', 'cyan', 'green', 'gray'
 * @param {ReactNode} children - Badge content
 */
export default function Badge({
  children,
  color = 'blue',
  className = '',
  ...props
}) {
  const colorStyles = {
    blue: 'bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20',
    cyan: 'bg-[#D97706]/10 text-[#92400E] border border-[#D97706]/20',
    green: 'bg-[#FDE68A]/20 text-[#92400E] border border-[#FDE68A]/40',
    gray: 'bg-white/70 text-[#4B5563] border border-[#CFD3D8]',
  }

  return (
    <span
      className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${colorStyles[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
