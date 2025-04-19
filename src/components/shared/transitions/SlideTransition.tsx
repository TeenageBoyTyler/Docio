// src/components/shared/transitions/SlideTransition.tsx
import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  TransitionDirection,
  slideTransitionVariants,
  DURATIONS,
} from "./TransitionConfig";
import { useTransitionVariants } from "./useTransitionDirection";

export interface SlideTransitionProps {
  /**
   * Unique identifier for this component
   * Used by AnimatePresence for tracking
   */
  transitionKey: string | number;

  /**
   * Direction of the transition
   * @default TransitionDirection.LEFT
   */
  direction?: TransitionDirection;

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
   * Distance for the slide animation in pixels
   * @default 100
   */
  slideDistance?: number;

  /**
   * Whether to slide completely out of view when exiting
   * @default false
   */
  slideOutCompletely?: boolean;

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
 * SlideTransition component
 *
 * Creates a slide transition effect for elements
 * from a specified direction
 */
const SlideTransition: React.FC<SlideTransitionProps> = ({
  transitionKey,
  direction = TransitionDirection.LEFT,
  isActive = true,
  variants = slideTransitionVariants,
  duration = DURATIONS.medium,
  delay = 0,
  slideDistance = 100,
  slideOutCompletely = false,
  className,
  children,
}) => {
  const { initialVariant, exitVariant } = useTransitionVariants(direction);

  // Create custom variants with our specific parameters
  const customVariants = {
    ...variants,
    initialLeft: {
      ...variants.initialLeft,
      x: -slideDistance,
    },
    initialRight: {
      ...variants.initialRight,
      x: slideDistance,
    },
    initialUp: {
      ...variants.initialUp,
      y: -slideDistance,
    },
    initialDown: {
      ...variants.initialDown,
      y: slideDistance,
    },
    animate: {
      ...variants.animate,
      transition: {
        ...variants.animate.transition,
        duration,
        delay,
      },
    },
    exitLeft: {
      ...variants.exitLeft,
      x: slideOutCompletely ? -window.innerWidth : -slideDistance,
      transition: {
        ...variants.exitLeft.transition,
        duration,
      },
    },
    exitRight: {
      ...variants.exitRight,
      x: slideOutCompletely ? window.innerWidth : slideDistance,
      transition: {
        ...variants.exitRight.transition,
        duration,
      },
    },
    exitUp: {
      ...variants.exitUp,
      y: slideOutCompletely ? -window.innerHeight : -slideDistance,
      transition: {
        ...variants.exitUp.transition,
        duration,
      },
    },
    exitDown: {
      ...variants.exitDown,
      y: slideOutCompletely ? window.innerHeight : slideDistance,
      transition: {
        ...variants.exitDown.transition,
        duration,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={transitionKey}
          initial={initialVariant}
          animate="animate"
          exit={exitVariant}
          variants={customVariants}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideTransition;
