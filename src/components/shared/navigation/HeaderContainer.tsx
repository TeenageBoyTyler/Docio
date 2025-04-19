import React from "react";
import styled from "styled-components";

interface HeaderContainerProps {
  /**
   * Left-aligned content (typically BackButton)
   */
  leftContent?: React.ReactNode;

  /**
   * Main content (typically Title)
   */
  children: React.ReactNode;

  /**
   * Right-aligned content (typically action buttons)
   */
  rightContent?: React.ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * Standardized container for page headers with consistent layout
 * Maintains the app's minimalist design approach
 */
const HeaderContainer: React.FC<HeaderContainerProps> = ({
  leftContent,
  children,
  rightContent,
  className,
}) => {
  return (
    <StyledHeader className={className}>
      {leftContent && <LeftSection>{leftContent}</LeftSection>}
      <MainSection>{children}</MainSection>
      {rightContent && <RightSection>{rightContent}</RightSection>}
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
  width: 100%;
`;

const LeftSection = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const MainSection = styled.div`
  flex: 1;
  margin: 0 ${(props) => props.theme.spacing.md};
`;

const RightSection = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

export default HeaderContainer;
