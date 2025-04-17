import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
import { cloudStorage } from "../../services/cloudStorageService";
// Importieren der standardisierten Komponenten
import { Button } from "../shared/buttons";
import { EmptyCollection } from "../shared/empty";

const SuccessView: React.FC = () => {
  const { files, clearFiles } = useUpload();

  // Hole den aktuellen Provider für die Anzeige
  const provider = cloudStorage.getCurrentProvider();

  // Handle Aktionen nach dem Upload
  const handleViewDocuments = () => {
    // In einer echten Anwendung würde dies zur Dokument-Archiv-Ansicht führen
    console.log("View documents");
    // Hier könnten wir zur Profil-Sektion navigieren
  };

  const handleUploadMore = () => {
    clearFiles();
  };

  const handleSearchDocuments = () => {
    // In einer echten Anwendung würde dies zur Such-Ansicht führen
    console.log("Search documents");
    // Hier könnten wir zur Such-Sektion navigieren
  };

  // Sammle alle einzigartigen Tags aus allen Dateien
  const uniqueTags = Array.from(
    new Set(files.flatMap((file) => file.tags.map((tag) => tag.name)))
  ).map((tagName) => {
    // Finde den ersten Tag mit diesem Namen, um die Farbe zu bekommen
    const tag = files
      .flatMap((file) => file.tags)
      .find((t) => t.name === tagName);

    return {
      name: tagName,
      color: tag?.color || "#4285F4",
    };
  });

  // Erstelle ein benutzerdefiniertes Element für die Dokument-Vorschau und Tags
  const customContent = (
    <>
      <DocumentPreview>
        {files.slice(0, 3).map((file) => (
          <PreviewItem key={file.id}>
            <PreviewImage src={file.preview} alt={file.name} />
          </PreviewItem>
        ))}
        {files.length > 3 && (
          <MoreIndicator>+{files.length - 3} more</MoreIndicator>
        )}
      </DocumentPreview>

      <TagsSummary>
        <TagsTitle>Applied Tags:</TagsTitle>
        <TagsList>
          {uniqueTags.map((tag) => (
            <TagChip key={tag.name} color={tag.color}>
              {tag.name}
            </TagChip>
          ))}
        </TagsList>
      </TagsSummary>
    </>
  );

  // Erfolgsicon
  const successIcon = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <Container>
      <StyledEmptyCollection
        collectionType="general"
        customTitle="Upload Complete!"
        customDescription={`Your ${files.length} documents have been successfully uploaded and processed. They are now securely stored in your ${provider} account.`}
        icon={successIcon}
        iconColor="#03DAC6" // Erfolgsfarbe
        size="large"
        primaryActionText="View Documents"
        onPrimaryAction={handleViewDocuments}
        secondaryActionText="Upload More"
        onSecondaryAction={handleUploadMore}
      >
        {customContent}
      </StyledEmptyCollection>

      {/* Extra-Button für "Search Documents" */}
      <ExtraButtonContainer>
        <Button variant="text" onClick={handleSearchDocuments}>
          Search Documents
        </Button>
      </ExtraButtonContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.xl};
`;

const StyledEmptyCollection = styled(EmptyCollection)`
  max-width: 600px;
  width: 100%;
`;

const DocumentPreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  margin: ${(props) => props.theme.spacing.lg} 0;
`;

const PreviewItem = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.divider};
  background-color: ${(props) => props.theme.colors.background};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MoreIndicator = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.divider};
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

const TagsSummary = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
  width: 100%;
`;

const TagsTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  text-align: left;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
  justify-content: flex-start;
`;

interface TagChipProps {
  color: string;
}

const TagChip = styled.div<TagChipProps>`
  background-color: ${(props) => props.color}40; // 25% opacity
  color: ${(props) => props.color};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

const ExtraButtonContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
`;

export default SuccessView;
