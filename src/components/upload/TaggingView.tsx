import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
import TagSelector from "./TagSelector";
// Standardized imports from index files
import { Button, IconButton } from "../shared/buttons";
import { BackButton, BackButtonContainer, Title } from "../shared/navigation";
import { Icon } from "../shared/icons";

// Component-specific styled components
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;

// Styled Components for Mobile
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

// New component for header top row
const HeaderTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

// Thumbnail related components
interface ThumbnailProps {
  isActive: boolean;
}

const Thumbnail = styled.div<ThumbnailProps>`
  width: 60px;
  height: 60px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  overflow: hidden;
  cursor: pointer;
  opacity: ${(props) => (props.isActive ? 1 : 0.6)};
  border: 2px solid
    ${(props) => (props.isActive ? props.theme.colors.primary : "transparent")};
  transition: all ${(props) => props.theme.transitions.short};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    opacity: 0.9;
  }
`;

// Container for mobile thumbnails
const MobileThumbnailStrip = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: ${(props) => props.theme.spacing.sm};
  margin-top: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  padding-bottom: ${(props) => props.theme.spacing.xs};

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Adjust thumbnail size for mobile */
  ${Thumbnail} {
    min-width: 48px;
    height: 48px;
    flex-shrink: 0;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  flex: 1;
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

// Fixed: Replace inline styling with styled component
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

// Styled Components for Desktop
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
  justify-content: space-between; /* This pushes content to top and bottom */
`;

const SidePanelContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ThumbnailStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
  margin-top: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

// Button styling
const CancelButtonTop = styled(Button)`
  color: ${(props) => props.theme.colors.error};
  align-self: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.md};

  &:hover {
    background-color: rgba(244, 67, 54, 0.08);
  }
`;

const CompleteButton = styled(Button)`
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

const CompleteButtonWrapper = styled.div`
  margin-top: ${(props) => props.theme.spacing.lg};
`;

// Tag indicator components
const TagIndicator = styled.div`
  position: absolute;
  top: 3px;
  right: 3px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TagCount = styled.span`
  font-size: 11px;
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
`;

// Component definition
interface TaggingViewProps {
  onComplete?: () => void;
  isProcessing?: boolean;
}

const TaggingView: React.FC<TaggingViewProps> = ({
  onComplete,
  isProcessing = false,
}) => {
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

  // Progress steps function is removed as we no longer need it

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
      if (onComplete) {
        onComplete(); // Trigger processing
      }
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

  // Navigation function removed as we no longer use progress indicator

  // Editor ein-/ausschalten
  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  // Sicherheitsüberprüfung - wenn kein aktuelles File vorhanden ist, zur Vorschau zurückkehren
  if (!currentFile) {
    return null; // Rendering wird übersprungen und useEffect führt goToPreviousStep aus
  }

  // Rendere die Mobile-Ansicht
  if (isMobile) {
    return (
      <MobileContainer>
        <Header>
          <HeaderTopRow>
            {/* Use standardized BackButtonContainer */}
            <BackButtonContainer>
              <BackButton
                onClick={goToPreviousImage}
                variant="text"
                showLabel={false}
                aria-label="Back to previous image or preview"
              />
            </BackButtonContainer>
          </HeaderTopRow>

          <Title>Tag Image</Title>

          {/* Thumbnail strip instead of progress indicator */}
          <MobileThumbnailStrip>
            {files.map((file, index) => (
              <Thumbnail
                key={file.id}
                isActive={index === currentFileIndex}
                onClick={() => setCurrentFileIndex(index)}
                as={motion.div}
                whileHover={{ scale: 1.1, opacity: 1 }}
              >
                <img src={file.preview} alt={`Thumbnail ${index + 1}`} />
                {file.tags.length > 0 && (
                  <TagIndicator>
                    <TagCount>{file.tags.length}</TagCount>
                  </TagIndicator>
                )}
              </Thumbnail>
            ))}
          </MobileThumbnailStrip>
        </Header>

        <ImageContainer>
          <PreviewImage
            src={currentFile.preview}
            alt={currentFile.name || "Image preview"}
            as={motion.img}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
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
          <TaggingContainer>
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
    <DesktopContainer>
      {/* Use standardized BackButtonContainer */}
      <BackButtonContainer position="absolute">
        <BackButton
          onClick={goToPreviousImage}
          showLabel={true}
          label="Back to Preview"
          variant="text"
        />
      </BackButtonContainer>

      <ImageSection>
        <PreviewImage
          src={currentFile.preview}
          alt={currentFile.name || "Image preview"}
          as={motion.img}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
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

      <SidePanel>
        {/* Cancel button at the absolute top */}
        <CancelButtonTop onClick={handleCancelUpload} variant="text">
          Cancel Upload
        </CancelButtonTop>

        <SidePanelContent>
          <Header>
            <Title>Tag Image</Title>

            {/* Thumbnail strip instead of progress indicator */}
            <ThumbnailStrip>
              {files.map((file, index) => (
                <Thumbnail
                  key={file.id}
                  isActive={index === currentFileIndex}
                  onClick={() => setCurrentFileIndex(index)}
                  as={motion.div}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                >
                  <img src={file.preview} alt={`Thumbnail ${index + 1}`} />
                  {file.tags.length > 0 && (
                    <TagIndicator>
                      <TagCount>{file.tags.length}</TagCount>
                    </TagIndicator>
                  )}
                </Thumbnail>
              ))}
            </ThumbnailStrip>

            <NavigationButtons>
              <Button variant="text" onClick={goToPreviousImage}>
                Previous
              </Button>
              <Button variant="text" disabled={!hasTag} onClick={goToNextImage}>
                Next
              </Button>
            </NavigationButtons>
          </Header>

          <TagSelector fileId={currentFile.id} />
        </SidePanelContent>

        {/* Complete button at the bottom */}
        <CompleteButtonWrapper>
          <CompleteButton
            onClick={goToNextImage}
            fullWidth
            variant="primary"
            disabled={!hasTag}
          >
            {currentFileIndex < files.length - 1 ? "Next Document" : "Complete"}
          </CompleteButton>
        </CompleteButtonWrapper>
      </SidePanel>
    </DesktopContainer>
  );
};

export default TaggingView;
