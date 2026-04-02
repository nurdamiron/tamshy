import { Variants } from 'framer-motion';

// Spring presets
export const spring = {
  snappy: { type: 'spring' as const, stiffness: 400, damping: 25 },
  gentle: { type: 'spring' as const, stiffness: 200, damping: 20 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 15 },
};

// Reusable variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.snappy,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring.gentle,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring.gentle,
  },
};

export const staggerContainer = (staggerDelay = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerDelay },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.snappy,
  },
};

// Card hover presets
export const cardHover = {
  lift: { y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06)' },
  glow: { y: -4, boxShadow: '0 0 40px rgba(2,132,199,0.15), 0 20px 40px rgba(0,0,0,0.06)' },
  subtle: { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' },
};

// Section heading animation
export const sectionHeading: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
