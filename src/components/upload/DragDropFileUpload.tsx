import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
// Standardized imports from index files
import { Button } from "../shared/buttons";
import { EmptyUpload } from "../shared/empty";
import { Icon } from "../shared/icons";

interface DragDropFileUploadProps {
  isAddingMore?: boolean; // Flag to indicate "Add More" mode
}

const DragDropFileUpload: React.FC<DragDropFileUploadProps> = ({
  isAddingMore = false,
}) => {
  const { addFiles, files, goToNextStep } = useUpload();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag & Drop-Handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(Array.from(e.dataTransfer.files));

        // In "Add More" mode, immediately go to preview after adding files
        if (isAddingMore) {
          goToNextStep();
        }
      }
    },
    [addFiles, isAddingMore, goToNextStep]
  );

  // Dateiauswahl-Handler
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(Array.from(e.target.files));
        // Zurücksetzen des Inputs, damit das gleiche File erneut ausgewählt werden kann
        e.target.value = "";

        // In "Add More" mode, immediately go to preview after adding files
        if (isAddingMore) {
          goToNextStep();
        }
      }
    },
    [addFiles, isAddingMore, goToNextStep]
  );

  // Kamera-Handler (nur mobile)
  const handleCameraCapture = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
      // Zurücksetzen auf normale Werte nach dem Klick
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = ".jpg,.jpeg,.png,.gif,.pdf,.heic,.heif";
          fileInputRef.current.removeAttribute("capture");
        }
      }, 1000);
    }
  }, []);

  // Überprüfen der Bildschirmgröße für mobile Geräte
  const isMobile = window.innerWidth <= 768;

  // View selected images (in "Add More" mode)
  const handleViewSelection = () => {
    if (isAddingMore) {
      goToNextStep();
    }
  };

  // Custom title and description for "Add More" mode
  const uploadTitle = isAddingMore ? "Add More Documents" : "Upload Documents";
  const uploadDesc = isAddingMore
    ? "Add more files to your selection"
    : "Drag and drop files here or use the buttons below";

  // Rückgabeindikator anzeigen, wenn bereits Dateien ausgewählt wurden
  const showSelectionIndicator = files.length > 0;

  return (
    <Container>
      {showSelectionIndicator ? (
        <DropZone
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isDragging={isDragging}
          as={motion.div}
          animate={{
            backgroundColor: isDragging
              ? "rgba(187, 134, 252, 0.1)"
              : "transparent",
            borderColor: isDragging
              ? "rgba(187, 134, 252, 0.5)"
              : "rgba(45, 45, 45, 0.5)",
          }}
        >
          <SelectionIndicator>
            <IndicatorText>
              {files.length} {files.length === 1 ? "file" : "files"} selected
            </IndicatorText>
            <Button variant="text" onClick={handleViewSelection}>
              View Selection
            </Button>
          </SelectionIndicator>

          <ContentWrapper>
            <UploadIconWrapper
              as={motion.div}
              animate={{ scale: isDragging ? 1.1 : 1 }}
            >
              <Icon name="Upload" size="large" color="currentColor" />
            </UploadIconWrapper>

            <Title>{uploadTitle}</Title>

            <Description>
              {isDragging ? "Drop files here..." : uploadDesc}
            </Description>

            <ButtonGroup>
              <Button variant="primary" onClick={handleFileSelect}>
                Select Files
              </Button>

              {isMobile && (
                <Button variant="text" onClick={handleCameraCapture}>
                  Take Photo
                </Button>
              )}
            </ButtonGroup>

            <SupportedFormats>
              Supported formats: JPG, PNG, GIF, PDF, HEIC, HEIF
            </SupportedFormats>
          </ContentWrapper>
        </DropZone>
      ) : (
        <EmptyUpload
          onSelectFiles={handleFileSelect}
          onDrag={setIsDragging}
          isDragging={isDragging}
          dragEnabled={true}
          customTitle={uploadTitle}
          customDescription={uploadDesc}
          secondaryActionText={isMobile ? "Take Photo" : undefined}
          onSecondaryAction={isMobile ? handleCameraCapture : undefined}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        accept=".jpg,.jpeg,.png,.gif,.pdf,.heic,.heif"
        multiple
      />
    </Container>
  );
};

// Styled Components - nur noch für den Fall, wenn bereits Dateien ausgewählt wurden
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.md};
`;

interface DropZoneProps {
  isDragging: boolean;
}

const DropZone = styled.div<DropZoneProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px dashed
    ${(props) =>
      props.isDragging
        ? props.theme.colors.primary + "80"
        : props.theme.colors.divider};
  border-radius: 8px;
  transition: all ${(props) => props.theme.transitions.medium};
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl};
  text-align: center;
  max-width: 500px;
`;

// Fixed: Use proper icon wrapper without directly manipulating inner elements
const UploadIconWrapper = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text.primary};
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  max-width: 400px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SupportedFormats = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.disabled};
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IndicatorText = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.primary};
`;

export default DragDropFileUpload;
