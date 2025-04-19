import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export type SpinnerSize = "small" | "medium" | "large";

export interface SpinnerProps {
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: SpinnerSize;

  /**
   * Color of the spinner
   * @default theme.colors.primary
   */
  color?: string;

  /**
   * Whether to show a label with the spinner
   * @default false
   */
  showLabel?: boolean;

  /**
   * Custom label text
   * @default 'Loading...'
   */
  labelText?: string;

  /**
   * Additional class name
   */
  className?: string;
}

// Size configurations
const sizeConfig = {
  small: {
    diameter: "16px",
    thickness: "2px",
    labelSize: "12px",
  },
  medium: {
    diameter: "24px",
    thickness: "3px",
    labelSize: "14px",
  },
  large: {
    diameter: "40px",
    thickness: "4px",
    labelSize: "16px",
  },
};

// Animation variants
const spinnerVariants = {
  rotate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1.2,
      ease: "linear",
    },
  },
};

// Styled Components
const SpinnerContainer = styled.div<{ $showLabel: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$showLabel ? "column" : "row")};
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const SpinnerCircle = styled(motion.div)<{
  $size: SpinnerSize;
  $spinnerColor: string;
}>`
  width: ${(props) => sizeConfig[props.$size].diameter};
  height: ${(props) => sizeConfig[props.$size].diameter};
  border-radius: 50%;
  border: ${(props) => sizeConfig[props.$size].thickness} solid
    ${(props) => props.theme.colors.surface};
  border-top-color: ${(props) =>
    props.$spinnerColor || props.theme.colors.primary};
  box-sizing: border-box;
`;

const SpinnerLabel = styled.div<{ $size: SpinnerSize }>`
  font-size: ${(props) => sizeConfig[props.$size].labelSize};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 4px;
`;

/**
 * Spinner component for loading states
 *
 * @example
 * // Basic usage
 * <Spinner />
 *
 * // With custom size and label
 * <Spinner size="large" showLabel labelText="Processing..." />
 *
 * // With custom color
 * <Spinner color={theme.colors.secondary} />
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color,
  showLabel = false,
  labelText = "Loading...",
  className,
}) => {
  // Use theme color if no custom color is provided
  const spinnerColor = color || "";

  return (
    <SpinnerContainer $showLabel={showLabel} className={className}>
      <SpinnerCircle
        $size={size}
        $spinnerColor={spinnerColor}
        variants={spinnerVariants}
        animate="rotate"
      />
      {showLabel && <SpinnerLabel $size={size}>{labelText}</SpinnerLabel>}
    </SpinnerContainer>
  );
};

export default Spinner;
