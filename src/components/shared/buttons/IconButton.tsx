import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ButtonSize } from "./Button";
import LoadingSpinner from "./LoadingSpinner";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  icon: React.ReactNode;
  variant?: "primary" | "text";
  isLoading?: boolean;
}

const StyledIconButton = styled(motion.button)<{
  $size: ButtonSize;
  $variant: "primary" | "text";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 50%;
  padding: 0;
  overflow: hidden;
  
  /* Größenspezifische Styles mit festen Dimensionen */
  ${(props) => {
    switch (props.$size) {
      case "small":
        return `
          width: 32px;
          height: 32px;
          min-width: 32px;
          min-height: 32px;
        `;
      case "large":
        return `
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
        `;
      default: // 'medium'
        return `
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
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
            transform: scale(0.95);
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
            transform: scale(0.95);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
        `;
    }
  }}
  
  /* SVG-Styling für Icons */
  svg {
    width: 24px;
    height: 24px;
    pointer-events: none;
  }
`;

export const IconButton: React.FC<IconButtonProps> = ({
  size = "medium",
  icon,
  variant = "text",
  isLoading = false,
  disabled,
  ...rest
}) => {
  // Animation für Button-Zustände
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <StyledIconButton
      $size={size}
      $variant={variant}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "tap" : undefined}
      variants={buttonVariants}
      {...rest}
    >
      {isLoading ? (
        <LoadingSpinner 
          size={size === "small" ? 16 : size === "large" ? 24 : 20} 
        />
      ) : (
        icon
      )}
    </StyledIconButton>
  );
};

export default IconButton;