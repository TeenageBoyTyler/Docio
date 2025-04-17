import React, { useState, forwardRef } from "react";
import styled from "styled-components";
import TextField, { TextFieldProps } from "./TextField";

export interface PasswordFieldProps
  extends Omit<TextFieldProps, "type" | "endIcon" | "onEndIconClick"> {
  /**
   * Whether to show the password visibility toggle
   * @default true
   */
  showToggle?: boolean;

  /**
   * Custom class name for the component
   */
  className?: string;
}

/**
 * PasswordField component with visibility toggle
 */
const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ showToggle = true, className, ...props }, ref) => {
    // State to track password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // Show/Hide icon components
    const VisibilityIcon = () => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
          fill="currentColor"
        />
      </svg>
    );

    const VisibilityOffIcon = () => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 6.5C15.79 6.5 19.17 8.63 20.82 12C20.23 13.27 19.4 14.36 18.41 15.21L20.54 17.34C21.86 16.04 22.99 14.41 23.82 12.5C22.08 7.88 17.53 4.5 12 4.5C10.22 4.5 8.52 4.84 6.95 5.45L9.02 7.52C9.98 6.86 10.95 6.5 12 6.5ZM2.81 2.81L1.39 4.22L4.1 6.93C2.5 8.35 1.21 10.28 0.5 12.5C2.24 17.12 6.78 20.5 12.32 20.5C14.31 20.5 16.21 20.04 17.91 19.21L20.78 22.08L22.19 20.66L2.81 2.81ZM12 16.5C10.68 16.5 9.44 16.03 8.47 15.21L9.64 14.04C10.11 14.35 10.65 14.5 11.23 14.5C12.89 14.5 14.23 13.16 14.23 11.5C14.23 10.92 14.08 10.38 13.77 9.91L14.94 8.74C15.76 9.71 16.23 10.95 16.23 12.27C16.23 14.64 14.37 16.5 12 16.5ZM6.69 10.69L8.73 12.73C8.73 12.73 8.74 12.72 8.74 12.72C8.74 13.67 9.5 14.43 10.45 14.43C10.45 14.43 10.45 14.44 10.45 14.44L12.49 16.48C11.74 16.84 10.89 17 10 17C7.24 17 5 14.76 5 12C5 11.11 5.16 10.26 5.52 9.51L6.69 10.69Z"
          fill="currentColor"
        />
      </svg>
    );

    return (
      <TextField
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={className}
        endIcon={
          showToggle ? (
            <ToggleButton
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </ToggleButton>
          ) : undefined
        }
      />
    );
  }
);

PasswordField.displayName = "PasswordField";

// Styled Components
const ToggleButton = styled.button`
  background: transparent;
  border: none;
  padding: ${(props) => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${(props) => props.theme.borderRadius.sm};

  /* Konsistente Übergänge nur für Farben */
  transition-property: color, background-color;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
    background-color: rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
`;

export default PasswordField;
