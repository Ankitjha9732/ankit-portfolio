import { motion } from 'framer-motion'

/**
 * Card Component - Flexible container for content.
 * Can be used for projects, skills, testimonials, and more.
 */
export default function Card({
  children,
  className = '',
  hoverable = true,
  ...props
}) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -6, scale: 1.01, boxShadow: '0 20px 45px rgba(31, 41, 55, 0.08)' } : {}}
      className={`rounded-2xl border border-[#CFD3D8] bg-[#F7F3E9] p-6 shadow-card transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
