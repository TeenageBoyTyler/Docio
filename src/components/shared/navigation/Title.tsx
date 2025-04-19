import React from "react";
import styled from "styled-components";

interface TitleProps {
  /**
   * Title content
   */
  children: React.ReactNode;

  /**
   * Title size variant
   * @default "default"
   */
  variant?: "small" | "default" | "large";

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Standardized title component for headers
 */
const Title: React.FC<TitleProps> = ({
  children,
  variant = "default",
  className,
}) => {
  return (
    <StyledTitle className={className} $variant={variant}>
      {children}
    </StyledTitle>
  );
};

interface StyledTitleProps {
  $variant: "small" | "default" | "large";
}

const StyledTitle = styled.h2<StyledTitleProps>`
  font-size: ${(props) => {
    switch (props.$variant) {
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
  margin: 0;
`;

export default Title;
