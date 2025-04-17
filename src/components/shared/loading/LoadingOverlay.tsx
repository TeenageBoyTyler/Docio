import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "./Spinner";

export interface LoadingOverlayProps {
  /**
   * Whether the overlay is visible
   */
  isVisible: boolean;

  /**
   * Text to display under the spinner
   * @default 'Loading...'
   */
  text?: string;

  /**
   * Whether to block user interaction while loading
   * @default true
   */
  blockInteraction?: boolean;

  /**
   * Background opacity
   * @default 0.6
   */
  opacity?: number;

  /**
   * Spinner size
   * @default 'large'
   */
  spinnerSize?: "small" | "medium" | "large";

  /**
   * Spinner color
   * @default theme.colors.primary
   */
  spinnerColor?: string;

  /**
   * Whether to show the loading text
   * @default true
   */
  showText?: boolean;

  /**
   * Callback when animation completes
   */
  onAnimationComplete?: () => void;

  /**
   * z-index for the overlay
   * @default 1000
   */
  zIndex?: number;
}

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.15 },
  },
};

// Styled components
const OverlayContainer = styled(motion.div)<{
  blockInteraction: boolean;
  bgOpacity: number;
  $zIndex: number;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${(props) => props.$zIndex};
  background-color: ${(props) => `rgba(18, 18, 18, ${props.bgOpacity})`};
  pointer-events: ${(props) => (props.blockInteraction ? "all" : "none")};
`;

const ContentContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.surface};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingText = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  margin-top: 4px;
`;

/**
 * Full-screen loading overlay component
 *
 * @example
 * // Basic usage
 * <LoadingOverlay isVisible={isLoading} />
 *
 * // With custom text
 * <LoadingOverlay
 *   isVisible={isProcessing}
 *   text="Processing your document..."
 * />
 *
 * // Non-blocking overlay
 * <LoadingOverlay
 *   isVisible={isUploading}
 *   blockInteraction={false}
 *   opacity={0.3}
 * />
 *
 * // With completion callback
 * <LoadingOverlay
 *   isVisible={isLoading}
 *   onAnimationComplete={() => console.log('Loading complete')}
 * />
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = "Loading...",
  blockInteraction = true,
  opacity = 0.6,
  spinnerSize = "large",
  spinnerColor,
  showText = true,
  onAnimationComplete,
  zIndex = 1000,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <OverlayContainer
          blockInteraction={blockInteraction}
          bgOpacity={opacity}
          $zIndex={zIndex}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={onAnimationComplete}
        >
          <ContentContainer
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Spinner size={spinnerSize} color={spinnerColor} />
            {showText && <LoadingText>{text}</LoadingText>}
          </ContentContainer>
        </OverlayContainer>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
