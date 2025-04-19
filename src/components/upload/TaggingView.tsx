import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
// Standardized imports from index files
import { Button, IconButton } from "../shared/buttons";
import { BackButton, BackButtonContainer } from "../shared/navigation";
import { Icon } from "../shared/icons";
import TagSelector from "./TagSelector";

// This is a simplified version of TaggingView that can be used as a temporary
// replacement while the import issue with the original TaggingView is fixed

const SimpleTaggingView: React.FC = () => {
  const {
    files,
    currentFileIndex,
    setCurrentFileIndex,
    goToNextStep,
    goToPreviousStep,
    clearFiles,
  } = useUpload();

  const [showEditor, setShowEditor] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Falls keine Dateien vorhanden sind oder currentFileIndex ungültig ist, zurück zur Auswahl
  useEffect(() => {
    if (files.length === 0 || currentFileIndex >= files.length) {
      goToPreviousStep();
    }
  }, [files, currentFileIndex, goToPreviousStep]);

  // Sicherheitsprüfung für currentFile
  const currentFile = files[currentFileIndex];

  // Prüfen ob wir Tags haben (für Next-Button) - mit Sicherheitscheck
  const hasTag = currentFile?.tags && currentFile.tags.length > 0;

  // Prüfen der Bildschirmgröße
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation zu nächstem/vorherigem Bild
  const goToNextImage = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    } else {
      // Alle Bilder getaggt, zum nächsten Schritt
      goToNextStep();
    }
  };

  const goToPreviousImage = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    } else {
      // Zurück zur Vorschau
      goToPreviousStep();
    }
  };

  // Handle cancel upload
  const handleCancelUpload = () => {
    clearFiles();
  };

  // Editor ein-/ausschalten
  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  // Sicherheitsüberprüfung - wenn kein aktuelles File vorhanden ist, zur Vorschau zurückkehren
  if (!currentFile) {
    return null; // Rendering wird übersprungen und useEffect führt goToPreviousStep aus
  }

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  // Animation variants for elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (isMobile) {
    return (
      <MobileContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Header as={motion.div} variants={itemVariants}>
          <BackButtonContainer>
            <BackButton
              onClick={goToPreviousImage}
              variant="text"
              showLabel={false}
              aria-label="Back to previous image or preview"
            />
          </BackButtonContainer>
          <Title>Tag Image</Title>
          <ProgressInfo>
            {currentFileIndex + 1} of {files.length}
          </ProgressInfo>
        </Header>

        <ImageContainer as={motion.div} variants={itemVariants}>
          <PreviewImage
            src={currentFile.preview}
            alt={currentFile.name || "Image preview"}
          />
          <EditButton
            iconName="Edit2"
            onClick={toggleEditor}
            variant="primary"
            aria-label="Edit image"
          />
        </ImageContainer>

        {showEditor ? (
          <EditorContainer
            as={motion.div}
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
          >
            <EditorHeader>
              <EditorTitle>Edit Image</EditorTitle>
              <IconButton
                iconName="X"
                onClick={toggleEditor}
                variant="text"
                aria-label="Close editor"
              />
            </EditorHeader>
            <EditorContent>
              <ComingSoonMessage>
                <p>Image editing features coming soon!</p>
                <ul>
                  <li>Crop</li>
                  <li>Rotate</li>
                  <li>Adjust brightness/contrast</li>
                </ul>
              </ComingSoonMessage>
            </EditorContent>
          </EditorContainer>
        ) : (
          <TaggingContainer as={motion.div} variants={itemVariants}>
            <TagSelector fileId={currentFile.id} />
            <ButtonContainer>
              <Button
                variant="primary"
                disabled={!hasTag}
                onClick={goToNextImage}
                fullWidth
              >
                {currentFileIndex < files.length - 1 ? "Next" : "Complete"}
              </Button>
              <Button
                onClick={handleCancelUpload}
                fullWidth
                variant="text"
                style={{ color: "#FF5252" }}
              >
                Cancel Upload
              </Button>
            </ButtonContainer>
          </TaggingContainer>
        )}
      </MobileContainer>
    );
  }

  // Desktop-Ansicht
  return (
    <DesktopContainer
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <BackButtonContainer position="absolute">
        <BackButton
          onClick={goToPreviousImage}
          showLabel={true}
          label="Back to Preview"
          variant="text"
        />
      </BackButtonContainer>

      <ImageSection as={motion.div} variants={itemVariants}>
        <PreviewImage
          src={currentFile.preview}
          alt={currentFile.name || "Image preview"}
        />
        <EditButton
          iconName="Edit2"
          onClick={toggleEditor}
          variant="primary"
          aria-label="Edit image"
        />

        {showEditor && (
          <EditorPanel
            as={motion.div}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
          >
            <EditorHeader>
              <EditorTitle>Edit Image</EditorTitle>
              <IconButton
                iconName="X"
                onClick={toggleEditor}
                variant="text"
                aria-label="Close editor"
              />
            </EditorHeader>
            <EditorContent>
              <ComingSoonMessage>
                <p>Image editing features coming soon!</p>
                <ul>
                  <li>Crop</li>
                  <li>Rotate</li>
                  <li>Adjust brightness/contrast</li>
                </ul>
              </ComingSoonMessage>
            </EditorContent>
          </EditorPanel>
        )}
      </ImageSection>

      <SidePanel as={motion.div} variants={itemVariants}>
        <SidePanelHeader>
          <Title>Tag Image</Title>
          <ProgressInfo>
            Image {currentFileIndex + 1} of {files.length}
          </ProgressInfo>
        </SidePanelHeader>

        <TagSelector fileId={currentFile.id} />

        <NavigationButtons>
          <Button variant="text" onClick={goToPreviousImage}>
            Previous
          </Button>
          <Button variant="text" disabled={!hasTag} onClick={goToNextImage}>
            Next
          </Button>
        </NavigationButtons>

        <CompleteButtonWrapper>
          <Button
            onClick={goToNextImage}
            fullWidth
            variant="primary"
            disabled={!hasTag}
          >
            {currentFileIndex < files.length - 1 ? "Next Document" : "Complete"}
          </Button>
        </CompleteButtonWrapper>
      </SidePanel>
    </DesktopContainer>
  );
};

// Styled Components
const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  position: relative;
  background-color: ${(props) => props.theme.colors.surface};
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const ProgressInfo = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.md};
  min-height: 200px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const EditButton = styled(IconButton)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const EditorContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.background};
  z-index: ${(props) => props.theme.zIndex.elevated};
  display: flex;
  flex-direction: column;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const EditorTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
`;

const EditorContent = styled.div`
  flex: 1;
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ComingSoonMessage = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};

  p {
    margin-bottom: ${(props) => props.theme.spacing.md};
    font-size: ${(props) => props.theme.typography.fontSize.lg};
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: ${(props) => props.theme.spacing.sm};
      font-size: ${(props) => props.theme.typography.fontSize.md};
    }
  }
`;

const TaggingContainer = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
`;

// Desktop styled components
const DesktopContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  position: relative;
`;

const ImageSection = styled.div`
  flex: 2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.lg};
`;

const EditorPanel = styled.div`
  position: absolute;
  top: ${(props) => props.theme.spacing.lg};
  right: ${(props) => props.theme.spacing.lg};
  width: 300px;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const SidePanel = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.lg};
  border-left: 1px solid ${(props) => props.theme.colors.divider};
`;

const SidePanelHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const CompleteButtonWrapper = styled.div`
  margin-top: auto;
  padding-top: ${(props) => props.theme.spacing.lg};
`;

// Export the simple version of TaggingView with default export
export default SimpleTaggingView;
