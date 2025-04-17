import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Button, IconButton, IconTextButton } from "../shared/buttons";
// Direkter Import der Tag-Komponente ohne über index.ts zu gehen
import Tag from "../shared/tags/Tag";

/**
 * Demo component showcasing all button components
 */
const ButtonDemo: React.FC = () => {
  // State for tracking button click counts
  const [clickCount, setClickCount] = useState<number>(0);
  const handleClick = () => setClickCount((prev) => prev + 1);

  // State for toggling loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Toggle loading state for 2 seconds when triggered
  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Example tags for button combinations
  const exampleTags = [
    { id: "1", label: "Important", color: "#F43F5E" },
    { id: "2", label: "Draft", color: "#FACC15" },
    { id: "3", label: "New", color: "#4ADE80" },
  ];

  // Improved SVG icons for the demo with fixed dimensions
  const icons = {
    add: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4V20M4 12H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    back: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    refresh: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 8L16 4M16 4L12 0M16 4H8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    settings: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    search: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    arrow: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <DemoContainer>
      <h1>Button Components Demo</h1>

      {/* Standard Buttons Section */}
      <Section>
        <SectionTitle>Standard Buttons</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Primary Button (Default)</Label>
            <Button onClick={handleClick}>Click Me ({clickCount})</Button>
          </DemoItem>

          <DemoItem>
            <Label>Text Button</Label>
            <Button variant="text" onClick={handleClick}>
              Text Button
            </Button>
          </DemoItem>

          <DemoItem>
            <Label>Disabled State</Label>
            <Button disabled>Disabled Button</Button>
            <SpacerSmall />
            <Button variant="text" disabled>
              Disabled Text Button
            </Button>
          </DemoItem>

          <DemoItem>
            <Label>Loading State</Label>
            <Button isLoading={isLoading} onClick={triggerLoading}>
              {isLoading ? "Loading..." : "Click to Load"}
            </Button>
            <SpacerSmall />
            <Button
              variant="text"
              isLoading={isLoading}
              onClick={triggerLoading}
            >
              {isLoading ? "Loading..." : "Click to Load"}
            </Button>
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <Button size="small">Small Button</Button>
            <SpacerSmall />
            <Button size="medium">Medium Button</Button>
            <SpacerSmall />
            <Button size="large">Large Button</Button>
          </DemoItem>

          <DemoItem>
            <Label>Full Width</Label>
            <Button fullWidth>Full Width Button</Button>
          </DemoItem>

          <DemoItem>
            <Label>With Start Icon</Label>
            <Button startIcon={icons.add}>With Start Icon</Button>
          </DemoItem>

          <DemoItem>
            <Label>With End Icon</Label>
            <Button endIcon={icons.arrow}>With End Icon</Button>
          </DemoItem>
        </ComponentGrid>
      </Section>

      {/* Buttons with Tags Section */}
      <Section>
        <SectionTitle>Buttons with Tags</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Buttons with Tags</Label>
            <ButtonTagGroup>
              <Button>Create Document</Button>
              <Tag color={exampleTags[0].color}>{exampleTags[0].label}</Tag>
            </ButtonTagGroup>
            <SpacerSmall />
            <ButtonTagGroup>
              <Button variant="text">View Draft</Button>
              <Tag color={exampleTags[1].color}>{exampleTags[1].label}</Tag>
            </ButtonTagGroup>
          </DemoItem>

          <DemoItem>
            <Label>Multiple Tags</Label>
            <ButtonTagGroup>
              <Button>New Feature</Button>
              <TagContainer>
                <Tag color={exampleTags[2].color}>{exampleTags[2].label}</Tag>
                <Tag color={exampleTags[0].color}>{exampleTags[0].label}</Tag>
              </TagContainer>
            </ButtonTagGroup>
          </DemoItem>

          <DemoItem>
            <Label>Icon Button with Tag</Label>
            <ButtonTagGroup>
              <IconButton
                variant="primary"
                icon={icons.add}
                aria-label="Add item"
              />
              <Tag color={exampleTags[2].color}>{exampleTags[2].label}</Tag>
            </ButtonTagGroup>
          </DemoItem>

          <DemoItem>
            <Label>Icon Text Button with Tag</Label>
            <ButtonTagGroup>
              <IconTextButton icon={icons.settings} onClick={handleClick}>
                Settings
              </IconTextButton>
              <Tag color="#8B5CF6">System</Tag>
            </ButtonTagGroup>
          </DemoItem>
        </ComponentGrid>
      </Section>

      {/* Icon Buttons Section */}
      <Section>
        <SectionTitle>Icon Buttons</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default Icon Button (Text Variant)</Label>
            <ButtonRow>
              <IconButton
                icon={icons.add}
                onClick={handleClick}
                aria-label="Add item"
              />
              <IconButton
                icon={icons.back}
                onClick={handleClick}
                aria-label="Go back"
              />
              <IconButton
                icon={icons.refresh}
                onClick={handleClick}
                aria-label="Refresh"
              />
            </ButtonRow>
          </DemoItem>

          <DemoItem>
            <Label>Primary Variant</Label>
            <ButtonRow>
              <IconButton
                variant="primary"
                icon={icons.add}
                onClick={handleClick}
                aria-label="Add item"
              />
              <IconButton
                variant="primary"
                icon={icons.search}
                onClick={handleClick}
                aria-label="Search"
              />
              <IconButton
                variant="primary"
                icon={icons.settings}
                onClick={handleClick}
                aria-label="Settings"
              />
            </ButtonRow>
          </DemoItem>

          <DemoItem>
            <Label>Disabled State</Label>
            <ButtonRow>
              <IconButton icon={icons.add} disabled aria-label="Add item" />
              <IconButton
                variant="primary"
                icon={icons.add}
                disabled
                aria-label="Add item"
              />
            </ButtonRow>
          </DemoItem>

          <DemoItem>
            <Label>Loading State</Label>
            <ButtonRow>
              <IconButton
                icon={icons.refresh}
                isLoading={isLoading}
                onClick={triggerLoading}
                aria-label="Refresh"
              />
              <IconButton
                variant="primary"
                icon={icons.refresh}
                isLoading={isLoading}
                onClick={triggerLoading}
                aria-label="Refresh"
              />
            </ButtonRow>
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <ButtonRow>
              <IconButton
                size="small"
                icon={icons.add}
                aria-label="Small icon button"
              />
              <IconButton
                size="medium"
                icon={icons.add}
                aria-label="Medium icon button"
              />
              <IconButton
                size="large"
                icon={icons.add}
                aria-label="Large icon button"
              />
            </ButtonRow>
          </DemoItem>
        </ComponentGrid>
      </Section>

      {/* Icon Text Buttons Section */}
      <Section>
        <SectionTitle>Icon Text Buttons</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Primary Icon Text Button (Left Icon)</Label>
            <IconTextButton icon={icons.add} onClick={handleClick}>
              Add New Item
            </IconTextButton>
          </DemoItem>

          <DemoItem>
            <Label>Text Variant</Label>
            <IconTextButton
              variant="text"
              icon={icons.refresh}
              onClick={handleClick}
            >
              Refresh Data
            </IconTextButton>
          </DemoItem>

          <DemoItem>
            <Label>Right Icon Position</Label>
            <IconTextButton
              icon={icons.arrow}
              iconPosition="right"
              onClick={handleClick}
            >
              Continue
            </IconTextButton>
          </DemoItem>

          <DemoItem>
            <Label>Disabled State</Label>
            <IconTextButton icon={icons.add} disabled>
              Disabled Button
            </IconTextButton>
            <SpacerSmall />
            <IconTextButton variant="text" icon={icons.add} disabled>
              Disabled Text Button
            </IconTextButton>
          </DemoItem>

          <DemoItem>
            <Label>Loading State</Label>
            <IconTextButton
              icon={icons.refresh}
              isLoading={isLoading}
              onClick={triggerLoading}
            >
              {isLoading ? "Loading..." : "Load Data"}
            </IconTextButton>
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <IconTextButton size="small" icon={icons.add}>
              Small Button
            </IconTextButton>
            <SpacerSmall />
            <IconTextButton size="medium" icon={icons.add}>
              Medium Button
            </IconTextButton>
            <SpacerSmall />
            <IconTextButton size="large" icon={icons.add}>
              Large Button
            </IconTextButton>
          </DemoItem>

          <DemoItem>
            <Label>Full Width</Label>
            <IconTextButton icon={icons.add} fullWidth>
              Full Width Button
            </IconTextButton>
          </DemoItem>
        </ComponentGrid>
      </Section>

      {/* Interactive Examples Section */}
      <Section>
        <SectionTitle>Interactive Examples</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Button Click Counter</Label>
            <InteractiveDemo>
              <p>You've clicked the buttons {clickCount} times</p>
              <ButtonRow>
                <Button onClick={handleClick}>Increment</Button>
                <Button variant="text" onClick={() => setClickCount(0)}>
                  Reset
                </Button>
              </ButtonRow>
            </InteractiveDemo>
          </DemoItem>

          <DemoItem>
            <Label>Loading Demo</Label>
            <InteractiveDemo>
              <p>Click a button to see loading state for 2 seconds</p>
              <ButtonRow>
                <Button
                  isLoading={isLoading}
                  onClick={triggerLoading}
                  disabled={isLoading}
                >
                  Standard Button
                </Button>
                <IconButton
                  icon={icons.refresh}
                  isLoading={isLoading}
                  onClick={triggerLoading}
                  disabled={isLoading}
                  aria-label="Refresh"
                />
                <IconTextButton
                  icon={icons.refresh}
                  isLoading={isLoading}
                  onClick={triggerLoading}
                  disabled={isLoading}
                >
                  Load
                </IconTextButton>
              </ButtonRow>
            </InteractiveDemo>
          </DemoItem>
        </ComponentGrid>
      </Section>
    </DemoContainer>
  );
};

// Styled Components
const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl};

  h1 {
    margin-bottom: ${(props) => props.theme.spacing.xl};
    color: ${(props) => props.theme.colors.text.primary};
    font-size: ${(props) => props.theme.typography.fontSize.xxxl};
    text-align: center;
  }
`;

const Section = styled.section`
  margin-bottom: ${(props) => props.theme.spacing.xxl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  color: ${(props) => props.theme.colors.primary};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  padding-bottom: ${(props) => props.theme.spacing.sm};
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const DemoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.h3`
  margin-bottom: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const ButtonTagGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const TagContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xs};
`;

const SpacerSmall = styled.div`
  height: ${(props) => props.theme.spacing.sm};
`;

const InteractiveDemo = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};

  p {
    margin-bottom: ${(props) => props.theme.spacing.md};
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;

export default ButtonDemo;
