import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export interface FilterChipProps {
  /**
   * Text to display in the chip
   */
  label: string;

  /**
   * Callback when chip is removed
   */
  onRemove?: () => void;

  /**
   * Whether the chip is active
   * @default true
   */
  active?: boolean;

  /**
   * Whether the chip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display before the label
   */
  icon?: React.ReactNode;

  /**
   * Size of the chip
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Color of the chip (uses theme.colors.tags if provided)
   */
  color?: string;

  /**
   * Custom class name for the component
   */
  className?: string;

  /**
   * Callback when chip is clicked
   */
  onClick?: () => void;
}

/**
 * FilterChip component for displaying active filters
 */
const FilterChip: React.FC<FilterChipProps> = ({
  label,
  onRemove,
  active = true,
  disabled = false,
  icon,
  size = "medium",
  color,
  className,
  onClick,
}) => {
  // Handler for click on remove button
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onRemove) {
      onRemove();
    }
  };

  // Handler for click on entire chip
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // Animation variants
  const chipVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Close icon for remove button
  const CloseIcon = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <StyledChip
      as={motion.div}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      variants={chipVariants}
      transition={{ duration: 0.2 }}
      $active={active}
      $disabled={disabled}
      $size={size}
      $color={color}
      onClick={handleClick}
    >
      {icon && <ChipIcon>{icon}</ChipIcon>}
      <ChipLabel>{label}</ChipLabel>
      {onRemove && !disabled && (
        <RemoveButton
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${label} filter`}
        >
          <CloseIcon />
        </RemoveButton>
      )}
    </StyledChip>
  );
};

// Function to determine background color
const getBackgroundColor = (props: {
  theme: any;
  $active: boolean;
  $color?: string;
}) => {
  if (!props.$active) return "rgba(255, 255, 255, 0.08)";

  if (props.$color) {
    // Try to use the provided color from the theme.colors.tags if it exists
    const themeColor = props.theme.colors.tags?.[props.$color];
    if (themeColor) {
      return `${themeColor}30`; // 30% opacity
    }
    // Otherwise use the provided color with opacity
    return `${props.$color}30`;
  }

  // Default to primary color with opacity
  return `${props.theme.colors.primary}30`;
};

// Function to determine text color
const getTextColor = (props: {
  theme: any;
  $active: boolean;
  $color?: string;
}) => {
  if (!props.$active) return props.theme.colors.text.secondary;

  if (props.$color) {
    // Try to use the provided color from the theme.colors.tags if it exists
    const themeColor = props.theme.colors.tags?.[props.$color];
    if (themeColor) {
      return themeColor;
    }
    // Otherwise use the provided color
    return props.$color;
  }

  // Default to primary color
  return props.theme.colors.primary;
};

// Function to determine border color
const getBorderColor = (props: {
  theme: any;
  $active: boolean;
  $color?: string;
}) => {
  if (!props.$active) return "transparent";

  if (props.$color) {
    // Try to use the provided color from the theme.colors.tags if it exists
    const themeColor = props.theme.colors.tags?.[props.$color];
    if (themeColor) {
      return `${themeColor}40`; // 40% opacity
    }
    // Otherwise use the provided color with opacity
    return `${props.$color}40`;
  }

  // Default to primary color with opacity
  return `${props.theme.colors.primary}40`;
};

// Styled components
const StyledChip = styled.div<{
  $active: boolean;
  $disabled: boolean;
  $size: "small" | "medium" | "large";
  $color?: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.xs};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${getBackgroundColor};
  color: ${getTextColor};
  border: 1px solid ${getBorderColor};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  cursor: ${(props) => {
    if (props.$disabled) return "not-allowed";
    return "default";
  }};
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`;
      case "large":
        return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
      default:
        return `4px ${props.theme.spacing.sm}`;
    }
  }};
  font-size: ${(props) => {
    switch (props.$size) {
      case "small":
        return props.theme.typography.fontSize.xs;
      case "large":
        return props.theme.typography.fontSize.md;
      default:
        return props.theme.typography.fontSize.sm;
    }
  }};
  transition: all ${(props) => props.theme.transitions.short};
  user-select: none;
`;

const ChipIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ChipLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 2px;
  margin-left: 2px;
  color: currentColor;
  cursor: pointer;
  opacity: 0.7;
  border-radius: 50%;

  &:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

export default FilterChip;
