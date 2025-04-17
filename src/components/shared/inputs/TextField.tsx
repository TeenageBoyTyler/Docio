import React, { forwardRef } from "react";
import styled from "styled-components";

export type TextFieldSize = "small" | "medium" | "large";
export type TextFieldVariant = "outlined" | "minimal";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text displayed above the input
   */
  label?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error state or error message
   */
  error?: boolean | string;

  /**
   * Icon displayed at the start of the input
   */
  startIcon?: React.ReactNode;

  /**
   * Icon displayed at the end of the input
   */
  endIcon?: React.ReactNode;

  /**
   * Visual style variant
   * @default "outlined"
   */
  variant?: TextFieldVariant;

  /**
   * Whether the input should take the full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Callback for when start icon is clicked
   */
  onStartIconClick?: () => void;

  /**
   * Callback for when end icon is clicked
   */
  onEndIconClick?: () => void;

  /**
   * Size of the input
   * @default "medium"
   */
  size?: TextFieldSize;
}

/**
 * TextField component for user input
 */
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      variant = "outlined",
      fullWidth = false,
      onStartIconClick,
      onEndIconClick,
      size = "medium",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine if we're showing an error message
    const showError = error !== undefined && error !== false;
    const errorMessage = typeof error === "string" ? error : "";

    return (
      <Container className={className} $fullWidth={fullWidth}>
        {label && <Label htmlFor={props.id}>{label}</Label>}

        <InputWrapper
          $variant={variant}
          $size={size}
          $error={showError}
          $disabled={disabled}
        >
          {startIcon && (
            <IconWrapper
              onClick={
                !disabled && onStartIconClick ? onStartIconClick : undefined
              }
              $clickable={!!onStartIconClick && !disabled}
              $disabled={disabled}
            >
              {startIcon}
            </IconWrapper>
          )}

          <StyledInput
            ref={ref}
            $hasStartIcon={!!startIcon}
            $hasEndIcon={!!endIcon}
            disabled={disabled}
            {...props}
          />

          {endIcon && (
            <IconWrapper
              onClick={!disabled && onEndIconClick ? onEndIconClick : undefined}
              $clickable={!!onEndIconClick && !disabled}
              $disabled={disabled}
            >
              {endIcon}
            </IconWrapper>
          )}
        </InputWrapper>

        {(helperText || errorMessage) && (
          <HelperText $error={showError}>
            {errorMessage || helperText}
          </HelperText>
        )}
      </Container>
    );
  }
);

TextField.displayName = "TextField";

// Styled components
const Container = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const Label = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const InputWrapper = styled.div<{
  $variant: TextFieldVariant;
  $size: TextFieldSize;
  $error: boolean;
  $disabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.$variant === "outlined"
      ? "rgba(45, 45, 45, 0.7)"
      : props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 2px solid
    ${(props) => {
      if (props.$error) return props.theme.colors.error;
      return "transparent"; // Kein Rand im normalen Zustand
    }};
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`;
      case "large":
        return `${props.theme.spacing.md} ${props.theme.spacing.lg}`;
      default:
        return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
    }
  }};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  /* Separate transitions for only color properties */
  transition-property: background-color, border-color, color;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  &:hover {
    background-color: ${(props) =>
      props.$variant === "outlined"
        ? "rgba(50, 50, 50, 0.8)" // Etwas hellerer Hintergrund beim Hover
        : props.theme.colors.surface};
    border-color: ${(props) => {
      if (props.$disabled) return "transparent";
      if (props.$error) return props.theme.colors.error;
      return props.theme.colors.text.disabled;
    }};
  }

  &:focus-within {
    background-color: rgba(38, 38, 38, 0.9); // Dunklerer Hintergrund im Fokus
    border-color: ${(props) => {
      if (props.$error) return props.theme.colors.error;
      return props.theme.colors.primary;
    }};
    /* NO shadow, NO padding adjustments */
  }
`;

const StyledInput = styled.input<{
  $hasStartIcon: boolean;
  $hasEndIcon: boolean;
}>`
  width: 100%;
  border: none;
  background: transparent;
  padding: ${(props) => props.theme.spacing.xs} 0;
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.primary};
  padding-left: ${(props) =>
    props.$hasStartIcon ? props.theme.spacing.sm : 0};
  padding-right: ${(props) => (props.$hasEndIcon ? props.theme.spacing.sm : 0)};

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.disabled};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.div<{
  $clickable: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$disabled
      ? props.theme.colors.text.disabled
      : props.theme.colors.text.secondary};
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};

  &:hover {
    color: ${(props) => {
      if (props.$disabled) return props.theme.colors.text.disabled;
      if (props.$clickable) return props.theme.colors.text.primary;
      return props.theme.colors.text.secondary;
    }};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HelperText = styled.span<{ $error: boolean }>`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  margin-top: ${(props) => props.theme.spacing.xs};
  color: ${(props) =>
    props.$error
      ? props.theme.colors.error
      : props.theme.colors.text.secondary};
`;

export default TextField;
