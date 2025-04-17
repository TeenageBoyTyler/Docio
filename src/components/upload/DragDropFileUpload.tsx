import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
// Importieren der standardisierten Komponenten
import { Button, IconTextButton } from "../shared/buttons";
import { EmptyUpload } from "../shared/empty";

const DragDropFileUpload: React.FC = () => {
  const { addFiles, files } = useUpload();
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
      }
    },
    [addFiles]
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
      }
    },
    [addFiles]
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
            <Button
              variant="text"
              onClick={() => console.log("View selection")}
            >
              View Selection
            </Button>
          </SelectionIndicator>

          <ContentWrapper>
            <UploadIcon
              as={motion.div}
              animate={{ scale: isDragging ? 1.1 : 1 }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18ZM8 13H10.55V16H13.45V13H16L12 9L8 13Z"
                  fill="currentColor"
                />
              </svg>
            </UploadIcon>

            <Title>Upload Documents</Title>

            <Description>
              {isDragging
                ? "Drop files here..."
                : "Drag and drop files here or use the buttons below"}
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
          customTitle="Upload Documents"
          customDescription="Drag and drop files here or select them using the button below"
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

const UploadIcon = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
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
