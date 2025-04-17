import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Button } from "../shared/buttons";
import {
  EmptyState,
  EmptySearch,
  EmptyCollection,
  EmptySelection,
  EmptyUpload,
} from "../shared/empty";

/**
 * Demo-Komponente zur Demonstration der Empty-State-Komponenten
 *
 * Diese Komponente zeigt die verschiedenen Empty-States und deren Verwendung.
 * Sie dient Entwicklern als Referenz und kann für Tests verwendet werden.
 */
const EmptyDemo: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("budget report");
  const [actionCount, setActionCount] = useState(0);

  // Simuliere Aktion und zeige Bestätigung
  const handleAction = () => {
    setActionCount(actionCount + 1);
    alert(`Action performed ${actionCount + 1} times!`);
  };

  return (
    <Container>
      <Title>Empty States Components Demo</Title>

      <Section>
        <SectionTitle>Basic Empty State</SectionTitle>
        <ComponentExample>
          <ExampleTitle>Default Empty State</ExampleTitle>
          <EmptyState
            icon={
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z"
                  fill="currentColor"
                />
              </svg>
            }
            title="Nothing to display"
            description="There are no items to show at this time."
            primaryActionText="Add Item"
            onPrimaryAction={handleAction}
          />
        </ComponentExample>

        <ComponentRow>
          <ComponentExample>
            <ExampleTitle>Small Size</ExampleTitle>
            <EmptyState
              size="small"
              icon={
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
                    fill="currentColor"
                  />
                </svg>
              }
              title="No Messages"
              description="Your inbox is empty."
            />
          </ComponentExample>

          <ComponentExample>
            <ExampleTitle>Large Size</ExampleTitle>
            <EmptyState
              size="large"
              icon={
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
                    fill="currentColor"
                  />
                  <path
                    d="M14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z"
                    fill="currentColor"
                  />
                </svg>
              }
              title="Empty Data Set"
              description="This data set contains no records matching your criteria. Try adjusting your filters or importing new data to populate this view."
              primaryActionText="Import Data"
              secondaryActionText="Adjust Filters"
              onPrimaryAction={handleAction}
              onSecondaryAction={handleAction}
            />
          </ComponentExample>
        </ComponentRow>

        <ComponentRow>
          <ComponentExample>
            <ExampleTitle>Left Aligned</ExampleTitle>
            <EmptyState
              align="left"
              icon={
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z"
                    fill="currentColor"
                  />
                </svg>
              }
              title="Left Aligned Empty State"
              description="This empty state is aligned to the left for different layout needs."
              primaryActionText="Primary Action"
              secondaryActionText="Secondary"
              onPrimaryAction={handleAction}
              onSecondaryAction={handleAction}
            />
          </ComponentExample>

          <ComponentExample>
            <ExampleTitle>Custom Colored Icon</ExampleTitle>
            <EmptyState
              icon={
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z"
                    fill="currentColor"
                  />
                </svg>
              }
              iconColor="#03DAC6" // Using secondary color from theme
              title="Custom Icon Color"
              description="This empty state uses a custom icon color."
              primaryActionText="Take Action"
              onPrimaryAction={handleAction}
            />
          </ComponentExample>
        </ComponentRow>
      </Section>

      <Section>
        <SectionTitle>Specialized Empty States</SectionTitle>

        <ComponentExample>
          <ExampleTitle>Empty Search Results</ExampleTitle>
          <SearchControls>
            <SearchLabel>Search Term:</SearchLabel>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term..."
            />
            <Button
              variant="text"
              onClick={() => setSearchTerm("")}
              size="small"
            >
              Clear
            </Button>
          </SearchControls>
          <EmptySearch searchTerm={searchTerm} onBackToSearch={handleAction} />
        </ComponentExample>

        <ComponentRow>
          <ComponentExample>
            <ExampleTitle>Empty Document Collection</ExampleTitle>
            <EmptyCollection
              collectionType="documents"
              onAction={handleAction}
              size="medium"
            />
          </ComponentExample>

          <ComponentExample>
            <ExampleTitle>Empty Tag Collection</ExampleTitle>
            <EmptyCollection
              collectionType="tags"
              onAction={handleAction}
              size="medium"
            />
          </ComponentExample>
        </ComponentRow>

        <ComponentRow>
          <ComponentExample>
            <ExampleTitle>Empty Selection</ExampleTitle>
            <EmptySelection
              itemType="documents"
              onAction={handleAction}
              actionText="Browse Documents"
            />
          </ComponentExample>

          <ComponentExample>
            <ExampleTitle>Empty Upload</ExampleTitle>
            <EmptyUpload
              onSelectFiles={handleAction}
              onDrag={setIsDragging}
              isDragging={isDragging}
              dragEnabled={true}
            />
          </ComponentExample>
        </ComponentRow>

        <ComponentExample>
          <ExampleTitle>Custom Empty Collection</ExampleTitle>
          <EmptyCollection
            collectionType="general"
            customTitle="No Reports Available"
            customDescription="Your organization hasn't created any reports yet. Reports help you visualize and share important data across teams."
            actionText="Create First Report"
            onAction={handleAction}
            iconColor="#F4B400" // Using yellow from theme
          />
        </ComponentExample>
      </Section>

      <Section>
        <SectionTitle>Integration Examples</SectionTitle>

        <ComponentRow>
          <ComponentExample>
            <ExampleTitle>In Search Results</ExampleTitle>
            <SearchResultsExample>
              <ResultsHeader>
                <div>0 results found</div>
                <Button variant="text" onClick={handleAction} size="small">
                  Back
                </Button>
              </ResultsHeader>
              <ResultsGrid>
                <EmptySearch
                  searchTerm="quarterly financial 2023"
                  size="medium"
                  onBackToSearch={handleAction}
                />
              </ResultsGrid>
            </SearchResultsExample>
          </ComponentExample>

          <ComponentExample>
            <ExampleTitle>In Document Archive</ExampleTitle>
            <ArchiveExample>
              <ArchiveHeader>
                <h3>My Documents</h3>
                <Button variant="text" onClick={handleAction} size="small">
                  Back to Profile
                </Button>
              </ArchiveHeader>
              <TagFilterRow>
                <TagFilter color="#4285F4">Work</TagFilter>
                <TagFilter color="#0F9D58">Personal</TagFilter>
                <TagFilter color="#DB4437">Important</TagFilter>
              </TagFilterRow>
              <DocumentGrid>
                <EmptyCollection
                  collectionType="documents"
                  size="medium"
                  onAction={handleAction}
                />
              </DocumentGrid>
            </ArchiveExample>
          </ComponentExample>
        </ComponentRow>
      </Section>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: ${(props) => props.theme.spacing.xl};
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize.xxxl};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: ${(props) => props.theme.spacing.xxl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  padding-bottom: ${(props) => props.theme.spacing.sm};
`;

const ComponentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const ComponentExample = styled.div`
  flex: 1;
  min-width: 300px;
  border: 1px solid ${(props) => props.theme.colors.divider};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ExampleTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

// Search example styled components
const SearchControls = styled.div`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.background};
  gap: ${(props) => props.theme.spacing.md};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SearchLabel = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const SearchInput = styled.input`
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.theme.colors.divider};
  flex: 1;
  min-width: 200px;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

// Integration examples styled components
const SearchResultsExample = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  background-color: ${(props) => props.theme.colors.background};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};

  div {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;

const ResultsGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.md};
`;

const ArchiveExample = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  background-color: ${(props) => props.theme.colors.background};
`;

const ArchiveHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};

  h3 {
    margin: 0;
    font-size: ${(props) => props.theme.typography.fontSize.lg};
  }
`;

const TagFilterRow = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

interface TagFilterProps {
  color: string;
}

const TagFilter = styled.div<TagFilterProps>`
  background-color: ${(props) => props.color}40; // 25% opacity
  color: ${(props) => props.color};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  cursor: pointer;
`;

const DocumentGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.md};
`;

export default EmptyDemo;
