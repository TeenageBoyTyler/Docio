import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
}

/**
 * Ein verbesserter LoadingSpinner mit modernerer Optik
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color,
  thickness = 2,
}) => {
  return (
    <SpinnerContainer
      size={size}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <SpinnerCircle viewBox="0 0 50 50" $thickness={thickness} $color={color}>
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth={thickness}
        />
      </SpinnerCircle>
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled(motion.div)<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerCircle = styled.svg<{ $thickness: number; $color?: string }>`
  width: 100%;
  height: 100%;

  .path {
    stroke: ${(props) => props.$color || "currentColor"};
    stroke-linecap: round;
    stroke-dasharray: 128;
    stroke-dashoffset: 64;
  }
`;

export default LoadingSpinner;
