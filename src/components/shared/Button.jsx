import { motion } from 'framer-motion'

/**
 * Button Component - Flexible, reusable button with multiple variants.
 * @param {string} variant - 'primary', 'secondary', or 'outline'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {ReactNode} children - Button content
 * @param {object} props - Additional props (className, onClick, etc.)
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30'

  const variants = {
    primary: 'bg-[#D97706] text-black shadow-[0_8px_30px_rgba(217,119,6,0.35)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(217,119,6,0.45)] hover:bg-[#C25A00]',
    secondary: 'border-2 border-black bg-white text-black shadow-soft hover:-translate-y-1 hover:bg-[#F7F3E9]',
    outline: 'border border-[#D97706]/30 bg-transparent text-[#D97706] hover:bg-[#D97706]/10',
  }

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
