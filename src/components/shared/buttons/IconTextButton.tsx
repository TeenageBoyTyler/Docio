import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ButtonVariant, ButtonSize } from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import Icon, { IconProps } from "../icons/Icon"; // Import the Icon component
import * as LucideIcons from "lucide-react";

export interface IconTextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  iconName: keyof typeof LucideIcons; // Changed from icon: React.ReactNode
  iconPosition?: "left" | "right";
  iconColor?: string; // Add optional icon color

  // For backward compatibility during transition
  icon?: React.ReactNode;
}

const StyledIconTextButton = styled(motion.button)<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $iconPosition: "left" | "right";
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
  flex-direction: ${(props) =>
    props.$iconPosition === "left" ? "row" : "row-reverse"};

  /* Größenspezifische Styles */
  ${(props) => {
    switch (props.$size) {
      case "small":
        return `
          font-size: 0.875rem;
          padding: 6px 12px;
          border-radius: 4px;
          gap: 6px;
        `;
      case "large":
        return `
          font-size: 1.125rem;
          padding: 12px 24px;
          border-radius: 8px;
          gap: 10px;
        `;
      default: // 'medium'
        return `
          font-size: 1rem;
          padding: 8px 16px;
          border-radius: 6px;
          gap: 8px;
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

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const IconTextButton: React.FC<IconTextButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  isLoading = false,
  iconName,
  icon, // Keep for backward compatibility
  iconPosition = "left",
  iconColor,
  children,
  disabled,
  ...rest
}) => {
  // Animation für Button-Zustände
  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
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
      'IconTextButton: Using the "icon" prop is deprecated. Please use "iconName" instead.'
    );
  }

  return (
    <StyledIconTextButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $iconPosition={iconPosition}
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
        <>
          <span className="icon-container">
            {iconName ? (
              <Icon
                name={iconName}
                size={getIconSize(size)}
                color={iconColor}
              />
            ) : (
              icon // Fallback to legacy icon prop
            )}
          </span>
          <span>{children}</span>
        </>
      )}
    </StyledIconTextButton>
  );
};

export default IconTextButton;
