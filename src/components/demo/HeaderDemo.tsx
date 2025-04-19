// src/components/demo/HeaderDemo.tsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { HeaderContainer, Title, BackButton } from "../shared/navigation";
import { Button, IconButton } from "../shared/buttons";

const HeaderDemo: React.FC = () => {
  // Example icons for buttons
  const AddIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );

  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  const FilterIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );

  return (
    <Container>
      <DemoHeader>Header Components Demo</DemoHeader>
      <HomeLink to="/">Back to Home</HomeLink>

      <DemoSection>
        <SectionTitle>Basic Header with Just a Title</SectionTitle>
        <ComponentDemo>
          <HeaderContainer>
            <Title>Simple Header</Title>
          </HeaderContainer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Header with Back Button</SectionTitle>
        <ComponentDemo>
          <HeaderContainer
            leftContent={
              <BackButton
                onClick={() => {}}
                label="Back"
                showLabel={true}
                variant="text"
              />
            }
          >
            <Title>Header with Back Button</Title>
          </HeaderContainer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Header with Icon-Only Back Button</SectionTitle>
        <ComponentDemo>
          <HeaderContainer
            leftContent={
              <BackButton
                onClick={() => {}}
                label="Back"
                showLabel={false}
                variant="text"
              />
            }
          >
            <Title>Header with Icon-Only Back</Title>
          </HeaderContainer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Header with Back Button and Action</SectionTitle>
        <ComponentDemo>
          <HeaderContainer
            leftContent={
              <BackButton
                onClick={() => {}}
                label="Back"
                showLabel={true}
                variant="text"
              />
            }
            rightContent={
              <Button variant="primary" startIcon={<AddIcon />}>
                Add Item
              </Button>
            }
          >
            <Title>Header with Action</Title>
          </HeaderContainer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Header with Multiple Actions</SectionTitle>
        <ComponentDemo>
          <HeaderContainer
            leftContent={
              <BackButton
                onClick={() => {}}
                label="Back"
                showLabel={true}
                variant="text"
              />
            }
            rightContent={
              <>
                <IconButton
                  variant="text"
                  onClick={() => {}}
                  title="Search"
                  icon={<SearchIcon />}
                />
                <IconButton
                  variant="text"
                  onClick={() => {}}
                  title="Filter"
                  icon={<FilterIcon />}
                />
                <Button variant="primary" startIcon={<AddIcon />}>
                  Add Item
                </Button>
              </>
            }
          >
            <Title>Header with Multiple Actions</Title>
          </HeaderContainer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Header with Different Title Sizes</SectionTitle>
        <ComponentDemo>
          <HeaderContainer>
            <Title variant="small">Small Title</Title>
          </HeaderContainer>
        </ComponentDemo>
        <ComponentDemo>
          <HeaderContainer>
            <Title>Default Title</Title>
          </HeaderContainer>
        </ComponentDemo>
        <ComponentDemo>
          <HeaderContainer>
            <Title variant="large">Large Title</Title>
          </HeaderContainer>
        </ComponentDemo>
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

const ComponentDemo = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

export default HeaderDemo;
