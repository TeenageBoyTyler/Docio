// src/components/shared/transitions/ModalTransition.tsx
import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  modalTransitionVariants,
  overlayTransitionVariants,
  DURATIONS,
} from "./TransitionConfig";

export interface ModalTransitionProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Function to call when the modal should close
   */
  onClose: () => void;

  /**
   * Whether to close when clicking on the overlay backdrop
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Duration for the animation in seconds
   * @default DURATIONS.medium (0.3s)
   */
  duration?: number;

  /**
   * Whether to add padding around the modal content
   * @default true
   */
  withPadding?: boolean;

  /**
   * Maximum width of the modal content
   * @default "500px"
   */
  maxWidth?: string;

  /**
   * Optional z-index for the modal
   * @default 1000
   */
  zIndex?: number;

  /**
   * Child elements (modal content)
   */
  children: React.ReactNode;
}

/**
 * ModalTransition component
 *
 * Creates a standardized modal with overlay backdrop
 * and consistent animations
 */
const ModalTransition: React.FC<ModalTransitionProps> = ({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  duration = DURATIONS.medium,
  withPadding = true,
  maxWidth = "500px",
  zIndex = 1000,
  children,
}) => {
  // Update animation duration if custom duration provided
  const contentVariants = {
    ...modalTransitionVariants,
    animate: {
      ...modalTransitionVariants.animate,
      transition: {
        ...modalTransitionVariants.animate.transition,
        duration,
      },
    },
    exit: {
      ...modalTransitionVariants.exit,
      transition: {
        ...modalTransitionVariants.exit.transition,
        duration,
      },
    },
  };

  const backdropVariants = {
    ...overlayTransitionVariants,
    animate: {
      ...overlayTransitionVariants.animate,
      transition: {
        ...overlayTransitionVariants.animate.transition,
        duration,
      },
    },
    exit: {
      ...overlayTransitionVariants.exit,
      transition: {
        ...overlayTransitionVariants.exit.transition,
        duration,
      },
    },
  };

  // Handler for overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Overlay
          initial="initial"
          animate="animate"
          exit="exit"
          variants={backdropVariants}
          onClick={handleOverlayClick}
          style={{ zIndex }}
        >
          <ModalContent
            initial="initial"
            animate="animate"
            exit="exit"
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()}
            $withPadding={withPadding}
            $maxWidth={maxWidth}
          >
            {children}
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

// Styled components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.lg};
  backdrop-filter: blur(2px);
`;

interface ModalContentProps {
  $withPadding: boolean;
  $maxWidth: string;
}

const ModalContent = styled(motion.div)<ModalContentProps>`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: 0 4px 12px ${(props) => props.theme.colors.shadow};
  max-width: ${(props) => props.$maxWidth};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${(props) => (props.$withPadding ? props.theme.spacing.lg : 0)};

  /* Subtle scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.divider};
    border-radius: ${(props) => props.theme.borderRadius.md};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text.disabled};
  }
`;

export default ModalTransition;
