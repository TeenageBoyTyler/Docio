import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

/**
 * Props für die BackButton-Komponente
 */
export interface BackButtonProps {
  /**
   * Text, der neben dem Zurück-Icon angezeigt wird
   */
  label?: string;

  /**
   * Gibt an, ob der Text angezeigt werden soll
   * @default false
   */
  showLabel?: boolean;

  /**
   * Variante des Buttons
   * @default "text"
   */
  variant?: "primary" | "text";

  /**
   * Größe des Buttons
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Handler für Klick-Events
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Benutzerdefinierte Klasse für die Container-Komponente
   */
  className?: string;
}

/**
 * BackButton Komponente für konsistente Navigation zurück
 * Ein einzelnes interaktives Element mit Pfeil-Icon und optionalem Label
 */
const BackButton: React.FC<BackButtonProps> = ({
  label = "Back",
  showLabel = false,
  size = "medium",
  variant = "text",
  onClick,
  className,
  ...rest
}) => {
  // SVG für das Pfeil-Icon
  const BackIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
        fill="currentColor"
      />
    </svg>
  );

  // Wenn nur der Button ohne Label angezeigt werden soll
  if (!showLabel) {
    return (
      <IconContainer
        className={className}
        as={motion.div}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label="Go back"
        onKeyDown={(e) => {
          // Tastatur-Unterstützung für Barrierefreiheit
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick && onClick(e as any);
          }
        }}
        $variant={variant}
        $size={size}
        {...rest}
      >
        <BackIcon />
      </IconContainer>
    );
  }

  // Mit Label - ein einzelnes interaktives Element
  return (
    <Container
      className={className}
      as={motion.div}
      whileHover={{ x: -2 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Go back to ${label}`}
      onKeyDown={(e) => {
        // Tastatur-Unterstützung für Barrierefreiheit
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick && onClick(e as any);
        }
      }}
      $variant={variant}
      $size={size}
      {...rest}
    >
      <IconWrapper $size={size}>
        <BackIcon />
      </IconWrapper>
      {showLabel && <Label $size={size}>{label}</Label>}
    </Container>
  );
};

// Styled Components
interface ContainerProps {
  $variant: "primary" | "text";
  $size: "small" | "medium" | "large";
}

const Container = styled.div<ContainerProps>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: all ${(props) => props.theme.transitions.short};
  background-color: ${(props) =>
    props.$variant === "primary" ? props.theme.colors.primary : "transparent"};
  color: ${(props) =>
    props.$variant === "primary"
      ? props.theme.colors.background
      : props.theme.colors.text.primary};

  &:hover {
    background-color: ${(props) =>
      props.$variant === "primary"
        ? `${props.theme.colors.primary}CC` // 80% Opacity
        : props.theme.colors.background};
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const IconContainer = styled(Container)`
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return "6px";
      case "large":
        return "12px";
      default:
        return "8px";
    }
  }};
  border-radius: 50%;
`;

const IconWrapper = styled.div<{ $size: "small" | "medium" | "large" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => {
    switch (props.$size) {
      case "small":
        return "20px";
      case "large":
        return "28px";
      default:
        return "24px";
    }
  }};
  height: ${(props) => {
    switch (props.$size) {
      case "small":
        return "20px";
      case "large":
        return "28px";
      default:
        return "24px";
    }
  }};
`;

const Label = styled.span<{ $size: "small" | "medium" | "large" }>`
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
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  user-select: none; /* Verhindert Textauswahl beim Klicken */
`;

export default BackButton;
