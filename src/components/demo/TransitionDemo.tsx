// src/components/demo/TransitionDemo.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// Import the transition components
import {
  PageTransition,
  SlideTransition,
  FadeTransition,
  ModalTransition,
  TransitionDirection,
  useTransitionDirection,
} from "../shared/transitions";

// Import other UI components
import { Button, IconButton } from "../shared/buttons";
import { HeaderContainer, Title } from "../shared/navigation";
import { Icon } from "../shared/icons";

/**
 * TransitionDemo
 *
 * Demonstrates the usage of various transition components
 * in the Docio application.
 */
const TransitionDemo: React.FC = () => {
  // Demo states
  const [currentSection, setCurrentSection] = useState("pageTransition");
  const [pageIndex, setPageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<TransitionDirection>(
    TransitionDirection.RIGHT
  );
  const [fadeVisible, setFadeVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [manualDirection, setManualDirection] = useState<TransitionDirection>(
    TransitionDirection.RIGHT
  );

  // Use the transition direction hook to automatically determine direction
  const { direction } = useTransitionDirection({
    current: pageIndex,
    vertical: false,
  });

  // Content for the different page examples
  const pages = [
    {
      color: "#4285F4",
      title: "First Page",
      content: "This demonstrates a page transition with direction awareness.",
    },
    {
      color: "#0F9D58",
      title: "Second Page",
      content:
        "Notice how the transition direction changes based on navigation.",
    },
    {
      color: "#DB4437",
      title: "Third Page",
      content:
        "The useTransitionDirection hook keeps track of navigation direction.",
    },
  ];

  // Page navigation with direction tracking
  const goToNextPage = () => {
    setPageIndex((prev) => (prev < pages.length - 1 ? prev + 1 : prev));
  };

  const goToPreviousPage = () => {
    setPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Manual direction selection for demos
  const handleDirectionChange = (newDirection: TransitionDirection) => {
    setManualDirection(newDirection);
    setSlideDirection(newDirection);
  };

  // Section navigation
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  // Render the PageTransition demo
  const renderPageTransitionDemo = () => {
    return (
      <SectionContent>
        <SectionDescription>
          PageTransition creates smooth transitions between different views or
          pages. It automatically determines the appropriate animation
          direction.
        </SectionDescription>

        <DemoContainer>
          <NavigationControls>
            <Button
              variant="text"
              onClick={goToPreviousPage}
              disabled={pageIndex === 0}
              startIcon={<Icon name="ChevronLeft" size="small" />}
            >
              Previous
            </Button>
            <PageIndicator>
              Page {pageIndex + 1} of {pages.length}
            </PageIndicator>
            <Button
              variant="text"
              onClick={goToNextPage}
              disabled={pageIndex === pages.length - 1}
              endIcon={<Icon name="ChevronRight" size="small" />}
            >
              Next
            </Button>
          </NavigationControls>

          <PageTransitionWrapper>
            <PageTransition
              transitionKey={`page-${pageIndex}`}
              direction={direction}
              isActive={true}
            >
              <DemoPage style={{ backgroundColor: pages[pageIndex].color }}>
                <DemoPageTitle>{pages[pageIndex].title}</DemoPageTitle>
                <DemoPageContent>{pages[pageIndex].content}</DemoPageContent>
              </DemoPage>
            </PageTransition>
          </PageTransitionWrapper>

          <CodeExample>
            {`// Usage example:
<PageTransition
  transitionKey="unique-key" // Used for AnimatePresence
  direction={TransitionDirection.RIGHT} // Can use useTransitionDirection hook
  isActive={isVisible} // Only render when true
>
  <YourPageContent />
</PageTransition>`}
          </CodeExample>
        </DemoContainer>
      </SectionContent>
    );
  };

  // Render the SlideTransition demo
  const renderSlideTransitionDemo = () => {
    return (
      <SectionContent>
        <SectionDescription>
          SlideTransition creates a sliding motion from different directions.
          It's useful for elements that enter from outside the viewport.
        </SectionDescription>

        <DemoContainer>
          <DirectionControls>
            <DirectionButton
              selected={slideDirection === TransitionDirection.LEFT}
              onClick={() => handleDirectionChange(TransitionDirection.LEFT)}
            >
              <Icon name="ArrowLeft" size="small" />
              <span>Left</span>
            </DirectionButton>
            <DirectionButton
              selected={slideDirection === TransitionDirection.RIGHT}
              onClick={() => handleDirectionChange(TransitionDirection.RIGHT)}
            >
              <Icon name="ArrowRight" size="small" />
              <span>Right</span>
            </DirectionButton>
            <DirectionButton
              selected={slideDirection === TransitionDirection.UP}
              onClick={() => handleDirectionChange(TransitionDirection.UP)}
            >
              <Icon name="ArrowUp" size="small" />
              <span>Up</span>
            </DirectionButton>
            <DirectionButton
              selected={slideDirection === TransitionDirection.DOWN}
              onClick={() => handleDirectionChange(TransitionDirection.DOWN)}
            >
              <Icon name="ArrowDown" size="small" />
              <span>Down</span>
            </DirectionButton>
          </DirectionControls>

          <SlideTransitionWrapper>
            <SlideTransition
              transitionKey={`slide-${slideDirection}`}
              direction={slideDirection}
              isActive={true}
            >
              <SlideContent>
                <SlideContentTitle>Slide Transition</SlideContentTitle>
                <SlideContentText>Direction: {slideDirection}</SlideContentText>
              </SlideContent>
            </SlideTransition>
          </SlideTransitionWrapper>

          <CodeExample>
            {`// Usage example:
<SlideTransition
  transitionKey="unique-key"
  direction={TransitionDirection.RIGHT}
  isActive={true}
  duration={0.3} // Optional custom duration
>
  <YourContent />
</SlideTransition>`}
          </CodeExample>
        </DemoContainer>
      </SectionContent>
    );
  };

  // Render the FadeTransition demo
  const renderFadeTransitionDemo = () => {
    return (
      <SectionContent>
        <SectionDescription>
          FadeTransition provides a simple fade in/out effect. It can be
          combined with subtle scale animations for added polish.
        </SectionDescription>

        <DemoContainer>
          <ToggleWrapper>
            <Button onClick={() => setFadeVisible(!fadeVisible)}>
              {fadeVisible ? "Hide Element" : "Show Element"}
            </Button>
          </ToggleWrapper>

          <FadeTransitionWrapper>
            <FadeTransition
              transitionKey="fade-demo"
              isActive={fadeVisible}
              withScale={true}
              duration={0.3}
            >
              <FadeContent>
                <FadeContentTitle>Fade Transition</FadeContentTitle>
                <FadeContentText>
                  This element fades in and out with a subtle scale effect.
                </FadeContentText>
              </FadeContent>
            </FadeTransition>
          </FadeTransitionWrapper>

          <CodeExample>
            {`// Usage example:
<FadeTransition
  transitionKey="unique-key"
  isActive={isVisible}
  withScale={true} // Optional scale effect
  duration={0.3} // Optional custom duration
  delay={0.1} // Optional delay
>
  <YourContent />
</FadeTransition>`}
          </CodeExample>
        </DemoContainer>
      </SectionContent>
    );
  };

  // Render the ModalTransition demo
  const renderModalTransitionDemo = () => {
    return (
      <SectionContent>
        <SectionDescription>
          ModalTransition creates a standardized modal dialog with backdrop
          overlay. It handles animations and positioning consistently.
        </SectionDescription>

        <DemoContainer>
          <ToggleWrapper>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          </ToggleWrapper>

          <ModalTransition
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            maxWidth="400px"
          >
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Modal Transition</ModalTitle>
                <IconButton
                  variant="text"
                  onClick={() => setModalOpen(false)}
                  icon={<Icon name="X" size="small" />}
                />
              </ModalHeader>
              <ModalBody>
                <p>
                  This is a standardized modal with consistent animations and
                  styling. Click outside the modal or the close button to
                  dismiss.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="text" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  Confirm
                </Button>
              </ModalFooter>
            </ModalContent>
          </ModalTransition>

          <CodeExample>
            {`// Usage example:
<ModalTransition
  isOpen={modalIsOpen}
  onClose={() => setModalIsOpen(false)}
  maxWidth="500px" // Optional custom width
  closeOnOverlayClick={true} // Optional, default true
  withPadding={true} // Optional, default true
>
  <YourModalContent />
</ModalTransition>`}
          </CodeExample>
        </DemoContainer>
      </SectionContent>
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Transition System</Title>
      </HeaderContainer>

      <Content>
        <NavPanel>
          <NavItem
            selected={currentSection === "pageTransition"}
            onClick={() => handleSectionChange("pageTransition")}
          >
            PageTransition
          </NavItem>
          <NavItem
            selected={currentSection === "slideTransition"}
            onClick={() => handleSectionChange("slideTransition")}
          >
            SlideTransition
          </NavItem>
          <NavItem
            selected={currentSection === "fadeTransition"}
            onClick={() => handleSectionChange("fadeTransition")}
          >
            FadeTransition
          </NavItem>
          <NavItem
            selected={currentSection === "modalTransition"}
            onClick={() => handleSectionChange("modalTransition")}
          >
            ModalTransition
          </NavItem>
        </NavPanel>

        <MainContent>
          {/* Render the appropriate demo section based on current selection */}
          {currentSection === "pageTransition" && renderPageTransitionDemo()}
          {currentSection === "slideTransition" && renderSlideTransitionDemo()}
          {currentSection === "fadeTransition" && renderFadeTransitionDemo()}
          {currentSection === "modalTransition" && renderModalTransitionDemo()}
        </MainContent>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const NavPanel = styled.div`
  width: 200px;
  background-color: ${(props) => props.theme.colors.surface};
  border-right: 1px solid ${(props) => props.theme.colors.divider};
  padding: ${(props) => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;

interface NavItemProps {
  selected: boolean;
}

const NavItem = styled.button<NavItemProps>`
  background-color: ${(props) =>
    props.selected ? props.theme.colors.primary + "20" : "transparent"};
  color: ${(props) =>
    props.selected
      ? props.theme.colors.primary
      : props.theme.colors.text.primary};
  border: 1px solid
    ${(props) => (props.selected ? props.theme.colors.primary : "transparent")};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  text-align: left;
  font-weight: ${(props) =>
    props.selected
      ? props.theme.typography.fontWeight.medium
      : props.theme.typography.fontWeight.regular};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.selected
        ? props.theme.colors.primary + "30"
        : props.theme.colors.background};
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.lg};
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xl};
`;

const SectionDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: ${(props) => props.theme.typography.lineHeight.normal};
  margin-top: 0;
`;

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const NavigationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const PageIndicator = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const DirectionControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;
`;

interface DirectionButtonProps {
  selected: boolean;
}

const DirectionButton = styled.button<DirectionButtonProps>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) =>
    props.selected ? props.theme.colors.primary + "20" : "transparent"};
  color: ${(props) =>
    props.selected
      ? props.theme.colors.primary
      : props.theme.colors.text.primary};
  border: 1px solid
    ${(props) =>
      props.selected ? props.theme.colors.primary : props.theme.colors.divider};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.selected
        ? props.theme.colors.primary + "30"
        : props.theme.colors.background};
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const PageTransitionWrapper = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const SlideTransitionWrapper = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const FadeTransitionWrapper = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DemoPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.lg};
  color: white;
  text-align: center;
`;

const DemoPageTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const DemoPageContent = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  max-width: 400px;
`;

const SlideContent = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const SlideContentTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const SlideContentText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
`;

const FadeContent = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  width: 80%;
  max-width: 400px;
  text-align: center;
`;

const FadeContentTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const FadeContentText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
`;

const ModalContent = styled.div`
  width: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
  padding-bottom: ${(props) => props.theme.spacing.sm};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const ModalTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`;

const ModalBody = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};

  p {
    margin: 0;
    color: ${(props) => props.theme.colors.text.secondary};
    line-height: ${(props) => props.theme.typography.lineHeight.normal};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(props) => props.theme.spacing.md};
  padding-top: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.divider};
`;

const CodeExample = styled.pre`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  overflow-x: auto;
  font-family: monospace;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.5;
`;

export default TransitionDemo;
