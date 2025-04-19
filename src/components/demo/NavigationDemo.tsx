// src/components/demo/NavigationDemo.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigation } from "../../context/NavigationContext";
import { BackButton } from "../shared/navigation";

const NavigationDemo: React.FC = () => {
  const {
    activeSection,
    navigateTo,
    currentProfileView,
    navigateToProfileView,
    currentUploadStep,
    navigateToUploadStep,
    currentSearchStep,
    navigateToSearchStep,
    navigateToDocuments,
    navigateToUpload,
    navigateToSearch,
  } = useNavigation();

  // State für Demo-Controls
  const [showDetails, setShowDetails] = useState(false);

  // Beispiel für komplexe Navigation
  const demonstrateComplexNavigation = () => {
    // 1. Zu einem spezifischen Bereich navigieren
    navigateTo("profile");

    // 2. Nach kurzer Verzögerung zu einer spezifischen Ansicht im Bereich
    setTimeout(() => {
      navigateToProfileView("documents");
    }, 1000);

    // 3. Nach weiterer Verzögerung zurück zum Upload-Bereich und dort zu einem bestimmten Schritt
    setTimeout(() => {
      navigateToUpload();
      setTimeout(() => {
        navigateToUploadStep("preview");
      }, 500);
    }, 2000);
  };

  return (
    <DemoContainer>
      <DemoHeader>
        <BackButton onClick={() => navigateTo("upload")} size="large">
          Back to Upload
        </BackButton>
        <DemoTitle>Navigation Components Demo</DemoTitle>
      </DemoHeader>

      <Section>
        <SectionTitle>Current Navigation State</SectionTitle>
        <StateIndicator>
          <StateItem>
            <StateLabel>Active Section:</StateLabel>
            <StateValue>{activeSection}</StateValue>
          </StateItem>
          <StateItem>
            <StateLabel>Profile View:</StateLabel>
            <StateValue>{currentProfileView}</StateValue>
          </StateItem>
          <StateItem>
            <StateLabel>Upload Step:</StateLabel>
            <StateValue>{currentUploadStep}</StateValue>
          </StateItem>
          <StateItem>
            <StateLabel>Search Step:</StateLabel>
            <StateValue>{currentSearchStep}</StateValue>
          </StateItem>
        </StateIndicator>
      </Section>

      <Section>
        <SectionTitle>Back Button Variations</SectionTitle>
        <DemoGrid>
          <DemoBox>
            <BackButton
              onClick={() => {}}
              size="small"
              showLabel={false}
              label="Small"
            />
          </DemoBox>
          <DemoBox>
            <BackButton onClick={() => {}} showLabel={false} label="Default" />
          </DemoBox>
          <DemoBox>
            <BackButton
              onClick={() => {}}
              size="large"
              showLabel={false}
              label="Large"
            />
          </DemoBox>
          <DemoBox>
            <BackButton
              onClick={() => {}}
              variant="text"
              showLabel={true}
              label="Text Variant"
            />
          </DemoBox>
          <DemoBox>
            <BackButton onClick={() => {}} iconOnly={true} label="Icon Only" />
          </DemoBox>
        </DemoGrid>
      </Section>

      <Section>
        <SectionTitle>Basic Navigation</SectionTitle>
        <ButtonGroup>
          <ActionButton onClick={() => navigateTo("upload")}>
            Go to Upload
          </ActionButton>
          <ActionButton onClick={() => navigateTo("search")}>
            Go to Search
          </ActionButton>
          <ActionButton onClick={() => navigateTo("profile")}>
            Go to Profile
          </ActionButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Profile Section Navigation</SectionTitle>
        <ButtonGroup>
          <ActionButton onClick={() => navigateToProfileView("home")}>
            Profile Home
          </ActionButton>
          <ActionButton onClick={() => navigateToProfileView("documents")}>
            Documents Archive
          </ActionButton>
          <ActionButton onClick={() => navigateToProfileView("tags")}>
            Tags Management
          </ActionButton>
          <ActionButton onClick={() => navigateToProfileView("settings")}>
            Processing Settings
          </ActionButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Upload Section Navigation</SectionTitle>
        <ButtonGroup>
          <ActionButton onClick={() => navigateToUploadStep("selection")}>
            Selection
          </ActionButton>
          <ActionButton onClick={() => navigateToUploadStep("preview")}>
            Preview
          </ActionButton>
          <ActionButton onClick={() => navigateToUploadStep("tagging")}>
            Tagging
          </ActionButton>
          <ActionButton onClick={() => navigateToUploadStep("processing")}>
            Processing
          </ActionButton>
          <ActionButton onClick={() => navigateToUploadStep("uploading")}>
            Uploading
          </ActionButton>
          <ActionButton onClick={() => navigateToUploadStep("success")}>
            Success
          </ActionButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Search Section Navigation</SectionTitle>
        <ButtonGroup>
          <ActionButton onClick={() => navigateToSearchStep("input")}>
            Input
          </ActionButton>
          <ActionButton onClick={() => navigateToSearchStep("results")}>
            Results
          </ActionButton>
          <ActionButton onClick={() => navigateToSearchStep("actions")}>
            Actions
          </ActionButton>
          <ActionButton onClick={() => navigateToSearchStep("pdfCreation")}>
            PDF Creation
          </ActionButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Shortcut Navigation</SectionTitle>
        <ButtonGroup>
          <ActionButton onClick={() => navigateToDocuments()}>
            Go to Documents Archive
          </ActionButton>
          <ActionButton onClick={() => navigateToUpload()}>
            Go to Upload (New)
          </ActionButton>
          <ActionButton onClick={() => navigateToSearch()}>
            Go to Search (New)
          </ActionButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Complex Navigation Demo</SectionTitle>
        <ButtonGroup>
          <ActionButtonHighlight onClick={demonstrateComplexNavigation}>
            Start Navigation Sequence
          </ActionButtonHighlight>
          <ActionButton onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide Details" : "Show Details"}
          </ActionButton>
        </ButtonGroup>

        {showDetails && (
          <DetailsBox
            as={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p>This demo shows a multi-step navigation sequence:</p>
            <ol>
              <li>First navigates to the Profile section</li>
              <li>Then navigates to the Documents view within Profile</li>
              <li>Then navigates back to Upload section</li>
              <li>Finally navigates to the Preview step within Upload</li>
            </ol>
            <p>
              This demonstrates the ability to create complex navigation flows
              that maintain state across different sections of the application.
            </p>
          </DetailsBox>
        )}
      </Section>
    </DemoContainer>
  );
};

// Styled Components
const DemoContainer = styled.div`
  padding: ${(props) => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  color: ${(props) => props.theme.colors.text.primary};
`;

const DemoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  padding-bottom: ${(props) => props.theme.spacing.lg};
`;

const DemoTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-left: ${(props) => props.theme.spacing.lg};
`;

const Section = styled.section`
  margin-bottom: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text.primary};
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.divider};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const ActionButtonHighlight = styled(ActionButton)`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  border: none;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}CC;
    color: ${(props) => props.theme.colors.background};
  }
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
  margin-top: ${(props) => props.theme.spacing.md};
`;

const DemoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  min-height: 100px;
`;

const StateIndicator = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const StateItem = styled.div`
  padding: ${(props) => props.theme.spacing.sm};
`;

const StateLabel = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-right: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const StateValue = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-family: monospace;
`;

const DetailsBox = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border-left: 4px solid ${(props) => props.theme.colors.primary};

  p {
    margin-bottom: ${(props) => props.theme.spacing.md};
    line-height: ${(props) => props.theme.typography.lineHeight.normal};
  }

  ol {
    margin-left: ${(props) => props.theme.spacing.xl};
    margin-bottom: ${(props) => props.theme.spacing.md};

    li {
      margin-bottom: ${(props) => props.theme.spacing.xs};
    }
  }
`;

export default NavigationDemo;
