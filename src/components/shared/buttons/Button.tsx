import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// Typdefinitionen für die Button-Komponente
export type ButtonVariant = "primary" | "text";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

// Styled Components für verschiedene Button-Varianten
const StyledButton = styled(motion.button)<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};

  /* Größenspezifische Styles */
  ${(props) => {
    switch (props.$size) {
      case "small":
        return `
          font-size: 0.875rem;
          padding: 6px 12px;
          border-radius: 4px;
          gap: 4px;
        `;
      case "large":
        return `
          font-size: 1.125rem;
          padding: 12px 24px;
          border-radius: 8px;
          gap: 8px;
        `;
      default: // 'medium'
        return `
          font-size: 1rem;
          padding: 8px 16px;
          border-radius: 6px;
          gap: 6px;
        `;
    }
  }}

  /* Variantenspezifische Styles */
  ${(props) => {
    switch (props.$variant) {
      case "text":
        return `
          background: transparent;
          color: ${props.theme.colors.primaryText};
          opacity: 0.8;

          &:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.05);
          }

          &:active {
            transform: scale(0.98);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
        `;
      default: // 'primary'
        return `
          background: ${props.theme.colors.primary};
          color: #000;
          opacity: 0.85;

          &:hover {
            opacity: 1;
          }

          &:active {
            transform: scale(0.98);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
        `;
    }
  }}
`;

// Komponente für den Loading-Spinner
const LoadingSpinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
`;

// Button-Komponente
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  isLoading = false,
  startIcon,
  endIcon,
  children,
  disabled,
  ...rest
}) => {
  // Animation für Button-Zustände
  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  // Animation für den Loading-Spinner
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  };

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "tap" : undefined}
      variants={buttonVariants}
      {...rest}
    >
      {isLoading ? (
        <LoadingSpinner variants={spinnerVariants} animate="animate" />
      ) : (
        <>
          {startIcon && <span className="button-start-icon">{startIcon}</span>}
          {children}
          {endIcon && <span className="button-end-icon">{endIcon}</span>}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
