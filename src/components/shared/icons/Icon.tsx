// src/components/shared/icons/Icon.tsx
import React from "react";
import styled from "styled-components";
import * as LucideIcons from "lucide-react";

/**
 * Icon size variants
 */
export type IconSize = "small" | "medium" | "large";

/**
 * Props for the Icon component
 */
export interface IconProps {
  /**
   * Name of the Lucide icon
   */
  name: keyof typeof LucideIcons;

  /**
   * Size of the icon
   * @default "medium"
   */
  size?: IconSize;

  /**
   * Color of the icon. If not provided, inherits from parent.
   */
  color?: string;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Accessibility label for the icon
   */
  ariaLabel?: string;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Standardized icon component using Lucide icons
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = "medium",
  color,
  onClick,
  ariaLabel,
  className,
}) => {
  const LucideIcon = LucideIcons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  return (
    <IconWrapper
      $size={size}
      $hasClickHandler={!!onClick}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      className={className}
    >
      <LucideIcon color={color} />
    </IconWrapper>
  );
};

interface IconWrapperProps {
  $size: IconSize;
  $hasClickHandler: boolean;
}

const IconWrapper = styled.div<IconWrapperProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Size based on the size prop */
  width: ${(props) => {
    switch (props.$size) {
      case "small":
        return "16px";
      case "large":
        return "24px";
      default:
        return "20px";
    }
  }};
  height: ${(props) => {
    switch (props.$size) {
      case "small":
        return "16px";
      case "large":
        return "24px";
      default:
        return "20px";
    }
  }};

  /* Cursor and interaction styles if the icon is clickable */
  cursor: ${(props) => (props.$hasClickHandler ? "pointer" : "default")};

  svg {
    width: 100%;
    height: 100%;
  }

  /* Accessibility focus styles */
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

export default Icon;
