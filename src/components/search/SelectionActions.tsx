import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
// Importieren der standardisierten Komponenten
import { Button } from "../shared/buttons";
import { EmptySelection } from "../shared/empty";
import { BackButton, BackButtonContainer } from "../shared/navigation";
import Icon from "../shared/icons/Icon";
import { FadeTransition, SlideTransition } from "../shared/transitions";

const SelectionActions: React.FC = () => {
  const { selectedDocuments, goToPreviousStep, goToStep } = useSearch();

  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  // Handler für das Hinzufügen weiterer Dokumente
  const handleAddMore = () => {
    goToStep("input"); // Zurück zur Suche, aber mit Beibehaltung der aktuellen Auswahl
  };

  // Handler für die PDF-Erstellung
  const handleCreatePdf = () => {
    goToStep("pdfCreation"); // Weiter zur PDF-Erstellung
  };

  // Wenn keine Dokumente ausgewählt sind, zeigen wir den EmptySelection-Zustand an
  if (!selectedDocuments || selectedDocuments.length === 0) {
    return (
      <Container>
        <BackButtonContainer>
          <BackButton
            onClick={goToPreviousStep}
            label="Zurück zu Suchergebnissen"
            showLabel={true}
            variant="text"
          />
          <Title>Document Selection</Title>
        </BackButtonContainer>

        <EmptySelection
          itemType="documents"
          onAction={goToPreviousStep}
          actionText="Back to Search Results"
          size="large"
          customDescription="Select one or more documents from the search results to create a PDF."
        />
      </Container>
    );
  }

  return (
    <Container>
      <BackButtonContainer>
        <BackButton
          onClick={goToPreviousStep}
          label="Zurück zu Suchergebnissen"
          showLabel={true}
          variant="text"
        />
        <Title>Ausgewählte Dokumente</Title>
      </BackButtonContainer>

      {/* Thumbnails der ausgewählten Dokumente */}
      <FadeTransition isVisible={true} duration={0.3} delay={0.1}>
        <ThumbnailStrip
          as={motion.div}
          initial={{ opacity: 0.9, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
          }}
        >
          <AnimatePresence>
            {selectedDocuments.map((doc, index) => (
              <Thumbnail
                key={doc.id}
                as={motion.div}
                initial={{ opacity: 0, scale: 0.9, x: -10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  transition: {
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut",
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
              >
                {doc.preview ? (
                  <ThumbnailImage src={doc.preview} alt={doc.name} />
                ) : (
                  <PlaceholderThumbnail>
                    <Icon name="File" size="large" color="currentColor" />
                  </PlaceholderThumbnail>
                )}
                <ThumbnailName>{doc.name}</ThumbnailName>
              </Thumbnail>
            ))}
          </AnimatePresence>
        </ThumbnailStrip>
      </FadeTransition>

      {/* PDF-Optionen */}
      <SlideTransition
        direction="right"
        isVisible={true}
        duration={0.4}
        delay={0.2}
        distance={30}
      >
        <OptionsSection>
          <OptionTitle>PDF-Optionen</OptionTitle>
          <OrientationOptions>
            <OrientationOption
              isSelected={orientation === "portrait"}
              onClick={() => setOrientation("portrait")}
              as={motion.button}
              whileHover={{
                scale: orientation === "portrait" ? 1.02 : 1.05,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: orientation === "portrait" ? [1, 1.05, 1] : 1,
                transition: { duration: 0.3 },
              }}
            >
              <OrientationIcon
                as={motion.div}
                animate={{
                  rotate: orientation === "portrait" ? [0, -5, 5, 0] : 0,
                  transition: { duration: 0.5, delay: 0.2 },
                }}
              >
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
              as={motion.button}
              whileHover={{
                scale: orientation === "landscape" ? 1.02 : 1.05,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: orientation === "landscape" ? [1, 1.05, 1] : 1,
                transition: { duration: 0.3 },
              }}
            >
              <OrientationIcon
                as={motion.div}
                animate={{
                  rotate: orientation === "landscape" ? [0, -5, 5, 0] : 0,
                  transition: { duration: 0.5, delay: 0.2 },
                }}
              >
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
      </SlideTransition>

      {/* Aktions-Buttons */}
      <SlideTransition
        direction="up"
        isVisible={true}
        duration={0.4}
        delay={0.3}
        distance={20}
      >
        <ActionsContainer
          as={motion.div}
          initial={{ opacity: 0.8 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.5 },
          }}
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.97 }}>
            <Button variant="text" onClick={handleAddMore}>
              Mehr hinzufügen
            </Button>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0px 0px 0px rgba(0,0,0,0)",
                "0px 4px 8px rgba(0,0,0,0.1)",
                "0px 0px 0px rgba(0,0,0,0)",
              ],
              transition: {
                duration: 2,
                repeat: 0,
                repeatDelay: 3,
              },
            }}
          >
            <Button variant="primary" onClick={handleCreatePdf}>
              PDF erstellen
            </Button>
          </motion.div>
        </ActionsContainer>
      </SlideTransition>
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

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-left: ${(props) => props.theme.spacing.md};
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

export default SelectionActions;
