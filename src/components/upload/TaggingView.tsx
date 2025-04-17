import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
import TagSelector from "./TagSelector";
// Importieren der standardisierten Button-Komponenten
import { Button, IconButton } from "../shared/buttons";

const TaggingView: React.FC = () => {
  const {
    files,
    currentFileIndex,
    setCurrentFileIndex,
    goToNextStep,
    goToPreviousStep,
  } = useUpload();

  const [showEditor, setShowEditor] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Falls keine Dateien vorhanden sind, zurück zur Auswahl
  useEffect(() => {
    if (files.length === 0) {
      goToPreviousStep();
    }
  }, [files, goToPreviousStep]);

  // Aktuelles File
  const currentFile = files[currentFileIndex];

  // Prüfen ob wir Tags haben (für Next-Button)
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

  // Editor ein-/ausschalten
  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  // Rendere die Mobile-Ansicht
  if (isMobile) {
    return (
      <MobileContainer>
        <Header>
          <IconButton
            icon={
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
            }
            onClick={goToPreviousImage}
            variant="text"
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <Title>Tag Image</Title>
          <ProgressText>
            Image {currentFileIndex + 1} of {files.length}
          </ProgressText>
        </Header>

        <ImageContainer>
          <PreviewImage
            src={currentFile.preview}
            alt={currentFile.name}
            as={motion.img}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <IconButton
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                  fill="currentColor"
                />
              </svg>
            }
            onClick={toggleEditor}
            variant="primary"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "40px",
              height: "40px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
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
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill="currentColor"
                    />
                  </svg>
                }
                onClick={toggleEditor}
                variant="text"
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
            <Button
              variant="primary"
              disabled={!hasTag}
              onClick={goToNextImage}
              fullWidth
            >
              {currentFileIndex < files.length - 1 ? "Next" : "Complete"}
            </Button>
          </TaggingContainer>
        )}
      </MobileContainer>
    );
  }

  // Desktop-Ansicht
  return (
    <DesktopContainer>
      <ImageSection>
        <PreviewImage
          src={currentFile.preview}
          alt={currentFile.name}
          as={motion.img}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <IconButton
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                fill="currentColor"
              />
            </svg>
          }
          onClick={toggleEditor}
          variant="primary"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "40px",
            height: "40px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
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
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill="currentColor"
                    />
                  </svg>
                }
                onClick={toggleEditor}
                variant="text"
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
        <Header>
          <Title>Tag Image</Title>
          <ProgressText>
            Image {currentFileIndex + 1} of {files.length}
          </ProgressText>
        </Header>

        <TagSelector fileId={currentFile.id} />

        <NavigationButtons>
          <Button variant="text" onClick={goToPreviousImage}>
            Previous
          </Button>
          <Button variant="primary" disabled={!hasTag} onClick={goToNextImage}>
            {currentFileIndex < files.length - 1 ? "Next" : "Complete"}
          </Button>
        </NavigationButtons>

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
      </SidePanel>
    </DesktopContainer>
  );
};

// Styled Components für Mobile
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
  margin-bottom: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ProgressText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
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

// Styled Components für Desktop
const DesktopContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
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
  margin-top: auto;
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.divider};
`;

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

export default TaggingView;
