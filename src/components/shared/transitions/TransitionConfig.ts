// src/components/shared/transitions/TransitionConfig.ts
import { theme } from "../../../styles/theme";

/**
 * Transition direction enum
 * Used to specify the direction of transitions
 */
export enum TransitionDirection {
  NONE = "none",
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
  FADE = "fade",
}

/**
 * Duration constants based on theme values
 */
export const DURATIONS = {
  short: 0.15, // Matches theme.transitions.short (0.15s)
  medium: 0.3, // Matches theme.transitions.medium (0.3s)
  long: 0.5, // Matches theme.transitions.long (0.5s)
};

/**
 * Easing presets for animations
 */
export const EASINGS = {
  default: [0.4, 0.0, 0.2, 1], // Material standard easing
  easeOut: [0.0, 0.0, 0.2, 1], // Deceleration curve
  easeIn: [0.4, 0.0, 1, 1], // Acceleration curve
  sharp: [0.4, 0.0, 0.6, 1], // Sharp curve
};

/**
 * Distance constants for translations
 */
export const DISTANCES = {
  small: 10,
  medium: 20,
  large: 50,
  xlarge: 100, // Added extra large distance for more pronounced slides
};

/**
 * Page transition variants
 * Used for full page transitions
 */
export const pageTransitionVariants = {
  // Initial states
  initialLeft: {
    x: -DISTANCES.medium,
    opacity: 0,
  },
  initialRight: {
    x: DISTANCES.medium,
    opacity: 0,
  },
  initialUp: {
    y: -DISTANCES.medium,
    opacity: 0,
  },
  initialDown: {
    y: DISTANCES.medium,
    opacity: 0,
  },
  initialFade: {
    opacity: 0,
  },
  // Animate states
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.default,
    },
  },
  // Exit states
  exitLeft: {
    x: -DISTANCES.medium,
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
  exitRight: {
    x: DISTANCES.medium,
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
  exitUp: {
    y: -DISTANCES.medium,
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
  exitDown: {
    y: DISTANCES.medium,
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
  exitFade: {
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
};

/**
 * Modal transition variants
 * Used for modal dialogs
 */
export const modalTransitionVariants = {
  initial: {
    opacity: 0,
    y: DISTANCES.medium,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.default,
    },
  },
  exit: {
    opacity: 0,
    y: DISTANCES.medium,
    scale: 0.95,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
};

/**
 * Overlay transition variants
 * Used for modal backgrounds/overlays
 */
export const overlayTransitionVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.default,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
};

/**
 * Slide transition variants
 * Used for elements that slide in from a direction
 */
export const slideTransitionVariants = {
  initialLeft: {
    x: -DISTANCES.xlarge,
    opacity: 0,
  },
  initialRight: {
    x: DISTANCES.xlarge,
    opacity: 0,
  },
  initialUp: {
    y: -DISTANCES.xlarge,
    opacity: 0,
  },
  initialDown: {
    y: DISTANCES.xlarge,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.default,
      opacity: {
        duration: DURATIONS.medium * 0.7, // Fade in slightly faster than position
      },
    },
  },
  exitLeft: {
    x: -DISTANCES.xlarge,
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
      opacity: {
        duration: DURATIONS.medium * 0.5, // Fade out faster than position
      },
    },
  },
  exitRight: {
    x: DISTANCES.xlarge,
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
      opacity: {
        duration: DURATIONS.medium * 0.5, // Fade out faster than position
      },
    },
  },
  exitUp: {
    y: -DISTANCES.xlarge,
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
      opacity: {
        duration: DURATIONS.medium * 0.5, // Fade out faster than position
      },
    },
  },
  exitDown: {
    y: DISTANCES.xlarge,
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
      opacity: {
        duration: DURATIONS.medium * 0.5, // Fade out faster than position
      },
    },
  },
};

/**
 * Fade transition variants
 * Used for simple fade transitions
 */
export const fadeTransitionVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.default,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
};

/**
 * Scale transition variants
 * Used for elements that scale in/out
 */
export const scaleTransitionVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.default,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeIn,
    },
  },
};
