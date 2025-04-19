import React from "react";
import styled from "styled-components";

interface BackButtonContainerProps {
  /**
   * Children components
   */
  children: React.ReactNode;

  /**
   * Whether this is for desktop layout
   * @default false
   */
  desktop?: boolean;

  /**
   * Position in parent container
   * @default "absolute"
   */
  position?: "absolute" | "relative";

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Standard container for BackButton with consistent styling
 * Can be positioned either absolutely or relatively in the parent container
 */
const BackButtonContainer: React.FC<BackButtonContainerProps> = ({
  children,
  desktop = false,
  position = "absolute",
  className,
}) => {
  return (
    <StyledContainer
      $desktop={desktop}
      $position={position}
      className={className}
    >
      {children}
    </StyledContainer>
  );
};

interface ContainerProps {
  $desktop: boolean;
  $position: "absolute" | "relative";
}

const StyledContainer = styled.div<ContainerProps>`
  position: ${(props) => props.$position};
  left: ${(props) => props.theme.spacing.md};
  top: ${(props) => (props.$desktop ? props.theme.spacing.lg : "50%")};
  transform: ${(props) => (props.$desktop ? "none" : "translateY(-50%)")};
  z-index: ${(props) => props.theme.zIndex.navigation};
`;

export default BackButtonContainer;
