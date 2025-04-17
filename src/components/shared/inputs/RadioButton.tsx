import React, { forwardRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Label text displayed next to the radio button
   */
  label?: string;

  /**
   * Error state or error message
   */
  error?: boolean | string;

  /**
   * Helper text displayed below the radio button
   */
  helperText?: string;

  /**
   * Size of the radio button
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Custom class name for the component
   */
  className?: string;
}

/**
 * RadioButton component for mutually exclusive selection
 */
const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      label,
      error,
      helperText,
      size = "medium",
      className,
      disabled,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    // Determine if we're showing an error
    const showError = error !== undefined && error !== false;
    const errorMessage = typeof error === "string" ? error : "";

    // Animation variants
    const circleVariants = {
      checked: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.2 },
      },
      unchecked: {
        scale: 0,
        opacity: 0,
        transition: { duration: 0.2 },
      },
    };

    // Animation variants for container
    const containerVariants = {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    };

    return (
      <Container className={className} $disabled={disabled}>
        <Label $disabled={disabled}>
          <RadioContainer
            as={motion.div}
            whileHover={!disabled ? "hover" : undefined}
            whileTap={!disabled ? "tap" : undefined}
            variants={containerVariants}
          >
            <HiddenRadio
              type="radio"
              ref={ref}
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              {...props}
            />
            <StyledRadio
              $checked={checked === true}
              $error={showError}
              $disabled={disabled}
              $size={size}
            >
              <RadioDot
                as={motion.div}
                initial="unchecked"
                animate={checked ? "checked" : "unchecked"}
                variants={circleVariants}
              />
            </StyledRadio>
          </RadioContainer>

          {label && <LabelText>{label}</LabelText>}
        </Label>

        {(helperText || errorMessage) && (
          <HelperText $error={showError}>
            {errorMessage || helperText}
          </HelperText>
        )}
      </Container>
    );
  }
);

RadioButton.displayName = "RadioButton";

// Styled components
const Container = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spacing.md};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
`;

const Label = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
`;

const RadioContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const StyledRadio = styled.div<{
  $checked: boolean;
  $error: boolean;
  $disabled?: boolean;
  $size: "small" | "medium" | "large";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: rgba(30, 30, 30, 0.7);
  border-radius: 50%;
  border: 2px solid
    ${(props) => {
      if (props.$error) return props.theme.colors.error;
      if (props.$checked) return props.theme.colors.primary;
      return props.theme.colors.divider;
    }};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    border-color: ${(props) => {
      if (props.$disabled) {
        if (props.$error) return props.theme.colors.error;
        if (props.$checked) return props.theme.colors.primary;
        return props.theme.colors.divider;
      }
      if (props.$error) return props.theme.colors.error;
      if (props.$checked) return props.theme.colors.primary;
      return props.theme.colors.text.secondary;
    }};
  }
`;

const RadioDot = styled.div`
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
`;

const LabelText = styled.span`
  margin-left: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.primary};
`;

const HelperText = styled.span<{ $error: boolean }>`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  margin-top: ${(props) => props.theme.spacing.xs};
  margin-left: ${(props) => props.theme.spacing.xl};
  color: ${(props) =>
    props.$error
      ? props.theme.colors.error
      : props.theme.colors.text.secondary};
`;

export default RadioButton;
