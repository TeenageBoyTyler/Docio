// src/components/demo/IconDemo.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Icon } from "../shared/icons";

const IconDemo: React.FC = () => {
  const [clickedIcon, setClickedIcon] = useState<string | null>(null);

  const handleIconClick = (iconName: string) => {
    setClickedIcon(iconName);
    setTimeout(() => setClickedIcon(null), 1000);
  };

  return (
    <Container>
      <DemoHeader>Icon System Demo</DemoHeader>
      <HomeLink to="/">Back to Home</HomeLink>

      <DemoSection>
        <SectionTitle>Common UI Icons</SectionTitle>
        <Description>
          Our application uses Lucide icons, providing a consistent, minimalist
          look.
        </Description>

        <IconGrid>
          <IconCard>
            <Icon name="ChevronLeft" size="medium" />
            <IconName>ChevronLeft</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Plus" size="medium" />
            <IconName>Plus</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Pencil" size="medium" />
            <IconName>Pencil</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Trash2" size="medium" />
            <IconName>Trash2</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Search" size="medium" />
            <IconName>Search</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Filter" size="medium" />
            <IconName>Filter</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Check" size="medium" />
            <IconName>Check</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Cloud" size="medium" />
            <IconName>Cloud</IconName>
          </IconCard>
          <IconCard>
            <Icon name="FileText" size="medium" />
            <IconName>FileText</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Settings" size="medium" />
            <IconName>Settings</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Tag" size="medium" />
            <IconName>Tag</IconName>
          </IconCard>
          <IconCard>
            <Icon name="Upload" size="medium" />
            <IconName>Upload</IconName>
          </IconCard>
        </IconGrid>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Icon Sizes</SectionTitle>
        <Description>
          Icons can be rendered in three sizes: small, medium (default), and
          large.
        </Description>

        <IconSizesContainer>
          <IconSizeExample>
            <Icon name="FileText" size="small" />
            <SizeLabel>Small</SizeLabel>
          </IconSizeExample>
          <IconSizeExample>
            <Icon name="FileText" size="medium" />
            <SizeLabel>Medium (Default)</SizeLabel>
          </IconSizeExample>
          <IconSizeExample>
            <Icon name="FileText" size="large" />
            <SizeLabel>Large</SizeLabel>
          </IconSizeExample>
        </IconSizesContainer>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Icon Colors</SectionTitle>
        <Description>
          Icons inherit their color from parent elements, or you can set a
          specific color.
        </Description>

        <IconColorsContainer>
          <IconColorExample>
            <Icon name="AlertCircle" />
            <ColorLabel>Inherited</ColorLabel>
          </IconColorExample>
          <IconColorExample $color={(theme) => theme.colors.primary}>
            <Icon name="AlertCircle" />
            <ColorLabel>Primary</ColorLabel>
          </IconColorExample>
          <IconColorExample $color={(theme) => theme.colors.error}>
            <Icon name="AlertCircle" />
            <ColorLabel>Error</ColorLabel>
          </IconColorExample>
          <IconColorExample $color={(theme) => theme.colors.success}>
            <Icon name="AlertCircle" />
            <ColorLabel>Success</ColorLabel>
          </IconColorExample>
        </IconColorsContainer>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Interactive Icons</SectionTitle>
        <Description>
          Icons can handle click events and show focus states for accessibility.
        </Description>

        <InteractiveIconsContainer>
          <InteractiveIconExample>
            <Icon
              name="Bell"
              size="large"
              onClick={() => handleIconClick("Bell")}
              ariaLabel="Notifications"
            />
            <IconStatus active={clickedIcon === "Bell"}>
              {clickedIcon === "Bell" ? "Clicked!" : "Click me"}
            </IconStatus>
          </InteractiveIconExample>
          <InteractiveIconExample>
            <Icon
              name="ThumbsUp"
              size="large"
              onClick={() => handleIconClick("ThumbsUp")}
              ariaLabel="Like"
            />
            <IconStatus active={clickedIcon === "ThumbsUp"}>
              {clickedIcon === "ThumbsUp" ? "Clicked!" : "Click me"}
            </IconStatus>
          </InteractiveIconExample>
          <InteractiveIconExample>
            <Icon
              name="Heart"
              size="large"
              onClick={() => handleIconClick("Heart")}
              ariaLabel="Favorite"
            />
            <IconStatus active={clickedIcon === "Heart"}>
              {clickedIcon === "Heart" ? "Clicked!" : "Click me"}
            </IconStatus>
          </InteractiveIconExample>
        </InteractiveIconsContainer>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Usage Example</SectionTitle>
        <CodeExample>
          <pre>{`
// Import the Icon component
import { Icon } from "../shared/icons";

// Use in your component
<Icon 
  name="FileText" 
  size="medium" 
  onClick={handleIconClick}
  ariaLabel="Document"
/>
          `}</pre>
        </CodeExample>
      </DemoSection>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.lg};
`;

const DemoHeader = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const HomeLink = styled(Link)`
  display: inline-block;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

const DemoSection = styled.section`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
  padding-bottom: ${(props) => props.theme.spacing.xs};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
`;

const IconCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: transform ${(props) => props.theme.transitions.short};

  &:hover {
    transform: translateY(-2px);
  }
`;

const IconName = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
`;

const IconSizesContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const IconSizeExample = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

const SizeLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

interface IconColorExampleProps {
  $color?: (theme: any) => string;
}

const IconColorsContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const IconColorExample = styled.div<IconColorExampleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  color: ${(props) => (props.$color ? props.$color(props.theme) : "inherit")};
`;

const ColorLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const InteractiveIconsContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const InteractiveIconExample = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

interface IconStatusProps {
  active: boolean;
}

const IconStatus = styled.div<IconStatusProps>`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.text.secondary};
  font-weight: ${(props) =>
    props.active
      ? props.theme.typography.fontWeight.bold
      : props.theme.typography.fontWeight.regular};
  transition: all ${(props) => props.theme.transitions.short};
`;

const CodeExample = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  overflow-x: auto;

  pre {
    font-family: monospace;
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

export default IconDemo;
