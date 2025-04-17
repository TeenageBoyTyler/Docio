import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

export interface LoadingTextProps {
  /**
   * Base text to display
   * @default 'Loading'
   */
  text?: string;

  /**
   * Number of dots to cycle through
   * @default 3
   */
  dotCount?: number;

  /**
   * Interval between dot animations in ms
   * @default 400
   */
  interval?: number;

  /**
   * Size of the text
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";

  /**
   * Color of the text
   * @default theme.colors.text.secondary
   */
  color?: string;

  /**
   * Additional class name
   */
  className?: string;
}

// Size configurations
const sizeConfig = {
  small: "12px",
  medium: "14px",
  large: "16px",
};

// Styled components
const Container = styled.div`
  display: inline-flex;
  align-items: center;
`;

const Text = styled.span<{
  textSize: "small" | "medium" | "large";
  textColor?: string;
}>`
  font-size: ${(props) => sizeConfig[props.textSize]};
  color: ${(props) => props.textColor || props.theme.colors.text.secondary};
`;

const DotsContainer = styled.span`
  display: inline-flex;
  min-width: 24px;
`;

const Dot = styled(motion.span)<{
  textSize: "small" | "medium" | "large";
  textColor?: string;
}>`
  font-size: ${(props) => sizeConfig[props.textSize]};
  color: ${(props) => props.textColor || props.theme.colors.text.secondary};
`;

/**
 * Loading text component with animated dots
 *
 * @example
 * // Basic usage
 * <LoadingText />
 *
 * // Custom text
 * <LoadingText text="Processing" />
 *
 * // With custom size and color
 * <LoadingText
 *   size="large"
 *   color={theme.colors.primary}
 * />
 *
 * // Custom dot animation
 * <LoadingText
 *   dotCount={5}
 *   interval={300}
 * />
 */
const LoadingText: React.FC<LoadingTextProps> = ({
  text = "Loading",
  dotCount = 3,
  interval = 400,
  size = "medium",
  color,
  className,
}) => {
  const [dots, setDots] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev + 1) % (dotCount + 1));
    }, interval);

    return () => clearInterval(timer);
  }, [dotCount, interval]);

  // Generate the dots string
  const dotString = ".".repeat(dots);

  return (
    <Container className={className}>
      <Text textSize={size} textColor={color}>
        {text}
      </Text>
      <DotsContainer>
        <AnimatePresence mode="wait">
          <Dot
            key={dots}
            textSize={size}
            textColor={color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {dotString}
          </Dot>
        </AnimatePresence>
      </DotsContainer>
    </Container>
  );
};

export default LoadingText;
