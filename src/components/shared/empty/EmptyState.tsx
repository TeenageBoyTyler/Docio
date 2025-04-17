import React, { ReactNode } from "react";
import styled from "styled-components";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "../buttons";

export type EmptyStateSize = "small" | "medium" | "large";

export interface EmptyStateProps {
  /**
   * Icon or illustration to display
   */
  icon?: ReactNode;

  /**
   * Main title text
   */
  title: string;

  /**
   * Supporting description text
   */
  description?: string;

  /**
   * Size of the empty state component
   * @default 'medium'
   */
  size?: EmptyStateSize;

  /**
   * Primary action button text
   */
  primaryActionText?: string;

  /**
   * Function to call when primary action button is clicked
   */
  onPrimaryAction?: () => void;

  /**
   * Secondary action button text
   */
  secondaryActionText?: string;

  /**
   * Function to call when secondary action button is clicked
   */
  onSecondaryAction?: () => void;

  /**
   * Custom class name for the component
   */
  className?: string;

  /**
   * Children components to render
   */
  children?: ReactNode;

  /**
   * Whether the component is visible
   * @default true
   */
  isVisible?: boolean;

  /**
   * Custom color for the icon
   * @default theme.colors.text.disabled
   */
  iconColor?: string;

  /**
   * Alignment of the empty state content
   * @default 'center'
   */
  align?: "center" | "left" | "right";
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, type: "spring", stiffness: 260, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// Styled components
const Container = styled(motion.div)<{
  $size: EmptyStateSize;
  $align: "center" | "left" | "right";
}>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => {
    if (props.$align === "left") return "flex-start";
    if (props.$align === "right") return "flex-end";
    return "center";
  }};
  justify-content: center;
  text-align: ${(props) => props.$align};
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return props.theme.spacing.md;
      case "large":
        return props.theme.spacing.xxl;
      default:
        return props.theme.spacing.xl;
    }
  }};
  width: 100%;
  max-width: ${(props) => {
    switch (props.$size) {
      case "small":
        return "400px";
      case "large":
        return "600px";
      default:
        return "500px";
    }
  }};
  margin: 0 auto;
`;

const IconContainer = styled.div<{ $size: EmptyStateSize; $color?: string }>`
  color: ${(props) => props.$color || props.theme.colors.text.disabled};
  margin-bottom: ${(props) => {
    switch (props.$size) {
      case "small":
        return props.theme.spacing.md;
      case "large":
        return props.theme.spacing.xl;
      default:
        return props.theme.spacing.lg;
    }
  }};

  svg {
    width: ${(props) => {
      switch (props.$size) {
        case "small":
          return "48px";
        case "large":
          return "96px";
        default:
          return "64px";
      }
    }};
    height: auto;
  }
`;

const Title = styled.h3<{ $size: EmptyStateSize }>`
  font-size: ${(props) => {
    switch (props.$size) {
      case "small":
        return props.theme.typography.fontSize.lg;
      case "large":
        return props.theme.typography.fontSize.xxl;
      default:
        return props.theme.typography.fontSize.xl;
    }
  }};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const Description = styled.p<{ $size: EmptyStateSize }>`
  font-size: ${(props) => {
    switch (props.$size) {
      case "small":
        return props.theme.typography.fontSize.sm;
      case "large":
        return props.theme.typography.fontSize.lg;
      default:
        return props.theme.typography.fontSize.md;
    }
  }};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  max-width: ${(props) => {
    switch (props.$size) {
      case "small":
        return "300px";
      case "large":
        return "500px";
      default:
        return "400px";
    }
  }};
  line-height: ${(props) => props.theme.typography.lineHeight.normal};
`;

const ButtonContainer = styled.div<{ $align: "center" | "left" | "right" }>`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
  justify-content: ${(props) => {
    if (props.$align === "left") return "flex-start";
    if (props.$align === "right") return "flex-end";
    return "center";
  }};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

/**
 * EmptyState component displays a visually consistent message when content is not available
 *
 * @example
 * // Basic usage
 * <EmptyState
 *   icon={<DocumentIcon />}
 *   title="No Documents Yet"
 *   description="Upload documents to see them here."
 * />
 *
 * // With actions
 * <EmptyState
 *   icon={<SearchIcon />}
 *   title="No Search Results"
 *   description="Try different search terms or filters."
 *   primaryActionText="Back to Search"
 *   onPrimaryAction={() => navigate('/search')}
 * />
 *
 * // Different sizes
 * <EmptyState
 *   icon={<UploadIcon />}
 *   title="No Files Selected"
 *   description="Select files to upload."
 *   size="small"
 * />
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  size = "medium",
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  className,
  children,
  isVisible = true,
  iconColor,
  align = "center",
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <Container
          className={className}
          $size={size}
          $align={align}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {icon && (
            <IconContainer $size={size} $color={iconColor}>
              {icon}
            </IconContainer>
          )}

          <Title $size={size}>{title}</Title>

          {description && <Description $size={size}>{description}</Description>}

          {children}

          {(primaryActionText || secondaryActionText) && (
            <ButtonContainer $align={align}>
              {primaryActionText && (
                <Button variant="primary" onClick={onPrimaryAction}>
                  {primaryActionText}
                </Button>
              )}

              {secondaryActionText && (
                <Button variant="text" onClick={onSecondaryAction}>
                  {secondaryActionText}
                </Button>
              )}
            </ButtonContainer>
          )}
        </Container>
      )}
    </AnimatePresence>
  );
};

export default EmptyState;
