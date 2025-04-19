// src/components/shared/transitions/FadeTransition.tsx
import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { fadeTransitionVariants, DURATIONS } from "./TransitionConfig";

export interface FadeTransitionProps {
  /**
   * Unique identifier for this component
   * Used by AnimatePresence for tracking
   */
  transitionKey: string | number;

  /**
   * Whether the component is currently visible/active
   * @default true
   */
  isActive?: boolean;

  /**
   * Custom variants for the motion component
   * Will override default variants if provided
   */
  variants?: Variants;

  /**
   * Animation duration in seconds
   * @default DURATIONS.medium (0.3s)
   */
  duration?: number;

  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number;

  /**
   * Whether to apply a slight scale effect
   * @default false
   */
  withScale?: boolean;

  /**
   * Additional className to apply to the component
   */
  className?: string;

  /**
   * Child elements
   */
  children: React.ReactNode;
}

/**
 * FadeTransition component
 *
 * Creates a simple fade transition effect for elements
 */
const FadeTransition: React.FC<FadeTransitionProps> = ({
  transitionKey,
  isActive = true,
  variants = fadeTransitionVariants,
  duration = DURATIONS.medium,
  delay = 0,
  withScale = false,
  className,
  children,
}) => {
  // Combine default variants with optional scale effect and custom timing
  const customVariants = {
    ...variants,
    initial: {
      ...variants.initial,
      scale: withScale ? 0.95 : 1,
    },
    animate: {
      ...variants.animate,
      scale: 1,
      transition: {
        ...variants.animate.transition,
        duration,
        delay,
      },
    },
    exit: {
      ...variants.exit,
      scale: withScale ? 0.95 : 1,
      transition: {
        ...variants.exit.transition,
        duration,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={transitionKey}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={customVariants}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FadeTransition;
