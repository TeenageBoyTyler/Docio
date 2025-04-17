import React, { forwardRef, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Label text displayed next to the checkbox
   */
  label?: string;

  /**
   * Error state or error message
   */
  error?: boolean | string;

  /**
   * Helper text displayed below the checkbox
   */
  helperText?: string;

  /**
   * Whether the checkbox is in indeterminate state
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Size of the checkbox
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Custom class name for the component
   */
  className?: string;
}

/**
 * Checkbox component for boolean selection
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      indeterminate = false,
      size = "medium",
      className,
      disabled,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    // Create local ref if no ref is provided
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement) => {
      // Update forwarded ref if provided
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      // Update local ref
      inputRef.current = node;
    };

    // Determine if we're showing an error
    const showError = error !== undefined && error !== false;
    const errorMessage = typeof error === "string" ? error : "";

    // Set indeterminate property (can't be set via props)
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Animation variants for the checkbox
    const checkVariants = {
      checked: {
        pathLength: 1,
        transition: { duration: 0.2 },
      },
      unchecked: {
        pathLength: 0,
        transition: { duration: 0.2 },
      },
    };

    // Animation variants for the checkbox container
    const boxVariants = {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    };

    return (
      <Container className={className} $disabled={disabled}>
        <Label $disabled={disabled}>
          <CheckboxContainer
            as={motion.div}
            whileHover={!disabled ? "hover" : undefined}
            whileTap={!disabled ? "tap" : undefined}
            variants={boxVariants}
          >
            <HiddenCheckbox
              type="checkbox"
              ref={combinedRef}
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              {...props}
            />
            <StyledCheckbox
              $checked={checked === true}
              $indeterminate={indeterminate}
              $error={showError}
              $disabled={disabled}
              $size={size}
            >
              {/* Checkmark SVG */}
              {checked && !indeterminate && (
                <motion.svg
                  viewBox="0 0 24 24"
                  initial="unchecked"
                  animate="checked"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M5 13L9 17L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={checkVariants}
                  />
                </motion.svg>
              )}

              {/* Indeterminate state dash */}
              {indeterminate && (
                <motion.svg
                  viewBox="0 0 24 24"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </motion.svg>
              )}
            </StyledCheckbox>
          </CheckboxContainer>

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

Checkbox.displayName = "Checkbox";

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

const CheckboxContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const StyledCheckbox = styled.div<{
  $checked: boolean;
  $indeterminate: boolean;
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
  background: ${(props) =>
    props.$checked || props.$indeterminate
      ? props.theme.colors.primary
      : "rgba(30, 30, 30, 0.7)"};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  border: 1px solid
    ${(props) => {
      if (props.$error) return props.theme.colors.error;
      if (props.$checked || props.$indeterminate)
        return props.theme.colors.primary;
      return props.theme.colors.divider;
    }};
  transition: all ${(props) => props.theme.transitions.short};
  color: #000;

  &:hover {
    border-color: ${(props) => {
      if (props.$disabled) {
        if (props.$error) return props.theme.colors.error;
        if (props.$checked || props.$indeterminate)
          return props.theme.colors.primary;
        return props.theme.colors.divider;
      }
      if (props.$error) return props.theme.colors.error;
      if (props.$checked || props.$indeterminate)
        return props.theme.colors.primary;
      return props.theme.colors.text.secondary;
    }};
  }

  svg {
    width: 100%;
    height: 100%;
  }
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

export default Checkbox;
