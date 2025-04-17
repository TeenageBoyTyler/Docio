import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useSearch } from "../../context/SearchContext";

const SelectionActions: React.FC = () => {
  const { selectedDocuments, goToPreviousStep, goToNextStep, goToStep } =
    useSearch();

  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  // Handler für das Hinzufügen weiterer Dokumente
  const handleAddMore = () => {
    goToStep("input"); // Zurück zur Suche, aber mit Beibehaltung der aktuellen Auswahl
  };

  // Handler für die PDF-Erstellung
  const handleCreatePdf = () => {
    goToNextStep(); // Weiter zur PDF-Erstellung
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={goToPreviousStep}>
          <BackIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                fill="currentColor"
              />
            </svg>
          </BackIcon>
          Zurück
        </BackButton>
        <Title>Ausgewählte Dokumente</Title>
      </Header>

      {/* Thumbnails der ausgewählten Dokumente */}
      <ThumbnailStrip>
        {selectedDocuments.map((doc) => (
          <Thumbnail key={doc.id}>
            {doc.preview ? (
              <ThumbnailImage src={doc.preview} alt={doc.name} />
            ) : (
              <PlaceholderThumbnail>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                    fill="currentColor"
                  />
                </svg>
              </PlaceholderThumbnail>
            )}
            <ThumbnailName>{doc.name}</ThumbnailName>
          </Thumbnail>
        ))}
      </ThumbnailStrip>

      {/* PDF-Optionen */}
      <OptionsSection>
        <OptionTitle>PDF-Optionen</OptionTitle>
        <OrientationOptions>
          <OrientationOption
            isSelected={orientation === "portrait"}
            onClick={() => setOrientation("portrait")}
          >
            <OrientationIcon>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="6"
                  y="3"
                  width="12"
                  height="18"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </OrientationIcon>
            <OrientationLabel>Hochformat</OrientationLabel>
          </OrientationOption>

          <OrientationOption
            isSelected={orientation === "landscape"}
            onClick={() => setOrientation("landscape")}
          >
            <OrientationIcon>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="12"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </OrientationIcon>
            <OrientationLabel>Querformat</OrientationLabel>
          </OrientationOption>
        </OrientationOptions>
      </OptionsSection>

      {/* Aktions-Buttons */}
      <ActionsContainer>
        <SecondaryButton
          onClick={handleAddMore}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Mehr hinzufügen
        </SecondaryButton>

        <PrimaryButton
          onClick={handleCreatePdf}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          PDF erstellen
        </PrimaryButton>
      </ActionsContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  transition: color ${(props) => props.theme.transitions.short};
  margin-right: ${(props) => props.theme.spacing.lg};

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const BackIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.xs};
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ThumbnailStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow-x: auto;
`;

const Thumbnail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
`;

const ThumbnailImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const PlaceholderThumbnail = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.disabled};
`;

const ThumbnailName = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OptionsSection = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const OptionTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const OrientationOptions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
`;

interface OrientationOptionProps {
  isSelected: boolean;
}

const OrientationOption = styled.button<OrientationOptionProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) =>
    props.isSelected
      ? props.theme.colors.primary + "20"
      : props.theme.colors.background};
  border: 2px solid
    ${(props) =>
      props.isSelected
        ? props.theme.colors.primary
        : props.theme.colors.divider};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    border-color: ${(props) =>
      props.isSelected
        ? props.theme.colors.primary
        : props.theme.colors.text.secondary};
  }
`;

const OrientationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.primary};
`;

const OrientationLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: auto;
  padding-top: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SecondaryButton = styled.button`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.divider};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const PrimaryButton = styled.button`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}CC;
  }
`;

export default SelectionActions;
