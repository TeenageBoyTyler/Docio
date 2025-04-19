import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ButtonSize } from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import Icon, { IconProps } from "../icons/Icon"; // Import the Icon component
import * as LucideIcons from "lucide-react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  iconName: keyof typeof LucideIcons; // Changed from icon: React.ReactNode
  variant?: "primary" | "text";
  isLoading?: boolean;
  iconColor?: string; // Add optional icon color

  // For backward compatibility during transition
  icon?: React.ReactNode;
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
`;

export const IconButton: React.FC<IconButtonProps> = ({
  size = "medium",
  iconName,
  icon, // Keep for backward compatibility
  variant = "text",
  isLoading = false,
  iconColor,
  disabled,
  ...rest
}) => {
  // Animation für Button-Zustände
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Map button size to icon size
  const getIconSize = (buttonSize: ButtonSize): IconProps["size"] => {
    switch (buttonSize) {
      case "small":
        return "small";
      case "large":
        return "large";
      default:
        return "medium";
    }
  };

  // Warning for deprecated usage
  if (process.env.NODE_ENV !== "production" && icon && !iconName) {
    console.warn(
      'IconButton: Using the "icon" prop is deprecated. Please use "iconName" instead.'
    );
  }

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
      ) : iconName ? (
        <Icon name={iconName} size={getIconSize(size)} color={iconColor} />
      ) : (
        icon // Fallback to legacy icon prop
      )}
    </StyledIconButton>
  );
};

export default IconButton;
