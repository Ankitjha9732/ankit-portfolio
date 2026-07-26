import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'

/**
 * AboutMeCard Component - A premium profile showcase card
 * Styled with rounded corners, subtle shadows, and orange accents.
 * 
 * Features:
 * - Rounded-2xl card structure with elegant borders & shadow
 * - Orange header with a User icon and tracking title
 * - Hover elevation and soft glow effect
 * - Responsive row grid using modern Lucide icons
 * - Smooth interactive row hover animations (slide-right, color transition)
 * - Cascading/staggered row entrance animations
 * 
 * @param {Array} props.data - Optional custom profile data rows.
 */
export default function AboutMeCard({ data }) {
  const defaultData = [
    { label: 'Role', value: 'Frontend & Full Stack Developer', icon: 'Briefcase' },
    { label: 'Education', value: 'B.Tech CSE (AI & ML) Student', icon: 'GraduationCap' },
    { label: 'Focus', value: 'Building beautiful, responsive web applications with React, Tailwind CSS, and modern JavaScript.', icon: 'Cpu' },
    { label: 'Currently Learning', value: 'MERN Stack, Three.js, and GSAP.', icon: 'BookOpen' },
    { label: 'Passion', value: 'Creating clean, responsive, and user-friendly web experiences.', icon: 'Heart' },
    { label: 'Goal', value: 'Become a Full Stack Developer and build impactful real-world products.', icon: 'Target' },
  ]

  const items = data || defaultData

  // Stagger variants for row children
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.35,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      whileHover={{ 
        y: -6, 
        boxShadow: '0 20px 40px -5px rgba(217, 119, 6, 0.12), 0 15px 30px -10px rgba(0, 0, 0, 0.06)' 
      }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className="w-full max-w-[500px] min-w-[280px] sm:min-w-[420px] rounded-2xl border border-slate-200/80 bg-white/95 shadow-soft overflow-hidden backdrop-blur-md self-center lg:self-start"
    >
      {/* Orange Accent Header */}
      <div className="bg-[#D97706] px-6 py-5 flex items-center gap-3 border-b border-[#D97706]/10">
        <LucideIcons.User className="h-5 w-5 text-white" />
        <h3 className="font-heading text-sm font-bold tracking-[0.25em] text-white uppercase">
          About Me
        </h3>
      </div>

      {/* Rows Container with stagger animation */}
      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="p-5 sm:p-6 space-y-4 bg-white/40"
      >
        {items.map((item, index) => {
          // Dynamically resolve icon from string name
          const IconComponent = typeof item.icon === 'string' 
            ? (LucideIcons[item.icon] || LucideIcons.HelpCircle) 
            : item.icon

          return (
            <motion.div
              key={`${item.label}-${index}`}
              variants={rowVariants}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="group flex items-start gap-4 p-2.5 rounded-xl transition-colors duration-200 hover:bg-[#D97706]/5 select-none"
            >
              {/* Icon Container with hover swap */}
              <div className="flex-shrink-0 mt-0.5 p-2 rounded-lg bg-[#D97706]/10 text-[#D97706] group-hover:bg-[#D97706] group-hover:text-white transition-all duration-300 shadow-sm">
                <IconComponent className="h-4 w-4" />
              </div>

              {/* Label & Description */}
              <div className="space-y-0.5 flex-1">
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706]">
                  {item.label}
                </span>
                <span className="block text-xs sm:text-[13px] text-slate-700 leading-relaxed font-sans font-medium">
                  {item.value}
                </span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
