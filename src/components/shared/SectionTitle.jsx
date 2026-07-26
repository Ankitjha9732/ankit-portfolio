import { motion } from 'framer-motion'

/**
 * SectionTitle Component - Consistent section headers across the portfolio
 * @param {string} title - Main heading
 * @param {string} subtitle - Optional subheading
 * @param {boolean} centered - Center text alignment
 */
export default function SectionTitle({
  title,
  subtitle = '',
  centered = true,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-lg text-[#4B5563]">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
