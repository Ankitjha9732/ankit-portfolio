// Framer Motion Animation Presets
// These can be used across components for consistent animations

export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const slideUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
};

export const slideInFromLeftVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.4 },
};

export const slideInFromRightVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: 0.4 },
};

export const scaleUpVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3 },
};

export const staggerContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

// Hover animations
export const hoverScaleVariants = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 10 },
};

export const hoverGlowVariants = {
  whileHover: { filter: 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.5))' },
  transition: { duration: 0.2 },
};

export default {
  fadeInVariants,
  slideUpVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
  scaleUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
  hoverScaleVariants,
  hoverGlowVariants,
};
