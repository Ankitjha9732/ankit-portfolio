import { motion } from 'framer-motion'

/**
 * Premium Engineer Specification Table component
 * Minimal Swiss/Brutalist aesthetic.
 *
 * - White background with subtle paper texture
 * - Thick black 3px border, sharp corners (no border radius)
 * - Orange (#D97706) header with black text
 * - Monospace uppercase labels (35%) / sans-serif values (65%)
 * - Framer Motion: slide-in from right, staggered rows, hover lift, pulsing status dot
 *
 * @param {Array} props.data - Optional custom rows [{label, value}].
 */
export default function ExperienceTable({ data }) {
  const rows = data || [
    { label: 'ROLE', value: 'Frontend & Full Stack Developer' },
    { label: 'EDUCATION', value: 'B.Tech CSE (AI & ML) Student' },
    { label: 'FOCUS', value: 'Building beautiful, responsive web applications with React, Tailwind CSS, and modern JavaScript.' },
    { label: 'LEARNING', value: 'MERN Stack • Three.js • GSAP' },
    { label: 'PASSION', value: 'Creating clean, responsive, and user-friendly web experiences.' },
    { label: 'GOAL', value: 'Become a Full Stack Developer and build impactful real-world products.' },
    { label: 'STATUS', value: 'Available for Opportunities' },
  ]

  // Paper/Noise Texture SVG
  const paperTextureStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E")`,
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{
        y: -6,
        boxShadow: '12px 12px 0 0 #000000',
        transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
      }}
      style={{
        ...paperTextureStyle,
        boxShadow: '6px 6px 0 0 #000000',
      }}
      className="group w-full max-w-[500px] rounded-none border-[3px] border-black bg-white p-0 text-black transition-all duration-300 self-center lg:self-start"

    >
      {/* Orange Header */}
      <motion.div
        variants={headerVariants}
        className="border-b-[3px] border-black bg-[#D97706] px-4 sm:px-6 py-3 sm:py-4 shadow-[0_0_15px_rgba(217,119,6,0.15)] transition-all duration-300 group-hover:bg-[#D97706] group-hover:shadow-[0_0_20px_rgba(217,119,6,0.35)]"
      >
        <h3 className="font-mono text-[11px] sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-black">
          Profile Spec
        </h3>
      </motion.div>

      {/* Specification Table Rows */}
      <div className="divide-y-[2px] divide-black">
        {rows.map((row, index) => {
          const isStatus = row.label.toUpperCase() === 'STATUS'

          return (
            <motion.div
              key={`${row.label}-${index}`}
              variants={rowVariants}
              className="grid grid-cols-[35%_65%] items-center min-h-[44px] sm:min-h-[54px] select-none"
            >
              {/* Monospace label (left 35%) */}
              <div className="h-full border-r-[2px] border-black bg-[#fbfbfb]/80 px-2 sm:px-4 py-2 sm:py-3 flex items-center font-mono text-[8px] sm:text-[9px] md:text-[11px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-black overflow-hidden break-words">
                {row.label}
              </div>

              {/* Sans-serif value (right 65%) */}
              <div className="px-2 sm:px-4 py-2 sm:py-3 font-sans text-[10px] sm:text-[11px] md:text-sm text-slate-800 font-semibold flex items-center h-full">
                {isStatus ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="inline-block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#D97706] shadow-[0_0_8px_rgba(217,119,6,0.8)]"
                    />
                    <span className="text-black font-bold">{row.value}</span>
                  </span>
                ) : (
                  row.value
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
