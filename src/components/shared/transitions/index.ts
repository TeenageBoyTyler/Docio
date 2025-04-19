// src/components/shared/transitions/index.ts

// Export all transition components
export { default as PageTransition } from "./PageTransition";
export { default as FadeTransition } from "./FadeTransition";
export { default as ModalTransition } from "./ModalTransition";
export { default as SlideTransition } from "./SlideTransition";

// Export transition config
export {
  TransitionDirection,
  DURATIONS,
  EASINGS,
  DISTANCES,
  pageTransitionVariants,
  modalTransitionVariants,
  overlayTransitionVariants,
  slideTransitionVariants,
  fadeTransitionVariants,
  scaleTransitionVariants,
} from "./TransitionConfig";

// Export transition hooks
export {
  useTransitionDirection,
  useTransitionVariants,
} from "./useTransitionDirection";
