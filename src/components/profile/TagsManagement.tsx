import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile, ProfileView } from "../../context/ProfileContext";
import { Tag } from "../../context/UploadContext";

interface TagsManagementProps {
  onNavigate: (view: ProfileView) => void;
}

// Typ für den Bearbeitungs-Modus
type EditMode = "create" | "edit" | null;

const TagsManagement: React.FC<TagsManagementProps> = ({ onNavigate }) => {
  const {
    availableTags,
    createTag,
    updateTag,
    deleteTag,
    loadTags,
    documents,
    isLoading,
  } = useProfile();

  // State für den Tag-Editor
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#4285F4"); // Default Blau

  // Lade Tags beim Mounten
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // Funktionen zum Zählen der Dokumente pro Tag
  const getTagUsageCount = (tagId: string) => {
    return documents.filter((doc) => doc.tags.includes(tagId)).length;
  };

  // Handler für das Öffnen des Tag-Editors für einen neuen Tag
  const handleCreateTag = () => {
    setEditMode("create");
    setEditingTag(null);
    setTagName("");
    setTagColor("#4285F4"); // Default auf Blau
  };

  // Handler für das Öffnen des Tag-Editors für einen bestehenden Tag
  const handleEditTag = (tag: Tag) => {
    setEditMode("edit");
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
  };

  // Handler für das Abbrechen der Bearbeitung
  const handleCancelEdit = () => {
    setEditMode(null);
    setEditingTag(null);
  };

  // Handler für das Speichern eines Tags
  const handleSaveTag = async () => {
    if (!tagName.trim()) return;

    if (editMode === "create") {
      const newTag = await createTag(tagName.trim(), tagColor);
      if (newTag) {
        setEditMode(null);
      }
    } else if (editMode === "edit" && editingTag) {
      const success = await updateTag(editingTag.id, tagName.trim(), tagColor);
      if (success) {
        setEditMode(null);
        setEditingTag(null);
      }
    }
  };

  // Handler für das Löschen eines Tags
  const handleDeleteTag = async (tagId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this tag? It will be removed from all documents."
      )
    ) {
      await deleteTag(tagId);
    }
  };

  // Verfügbare Farben für Tags
  const colorOptions = [
    { id: "blue", value: "#4285F4" },
    { id: "green", value: "#0F9D58" },
    { id: "red", value: "#DB4437" },
    { id: "yellow", value: "#F4B400" },
    { id: "purple", value: "#AB47BC" },
    { id: "teal", value: "#009688" },
    { id: "orange", value: "#FF5722" },
    { id: "pink", value: "#E91E63" },
  ];

  // Sortiere Tags alphabetisch
  const sortedTags = [...availableTags].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Rendere den Tag-Editor
  const renderTagEditor = () => {
    return (
      <TagEditorContainer
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <TagEditorHeader>
          {editMode === "create"
            ? "Create New Tag"
            : `Edit "${editingTag?.name}"`}
        </TagEditorHeader>

        <TagEditorForm>
          <FormGroup>
            <FormLabel>Tag Name</FormLabel>
            <TagNameInput
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter tag name"
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Tag Color</FormLabel>
            <ColorOptionsContainer>
              {colorOptions.map((color) => (
                <ColorOption
                  key={color.id}
                  color={color.value}
                  isSelected={tagColor === color.value}
                  onClick={() => setTagColor(color.value)}
                >
                  {tagColor === color.value && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17L4 12" />
                    </svg>
                  )}
                </ColorOption>
              ))}
            </ColorOptionsContainer>
          </FormGroup>

          {editMode === "edit" && editingTag && (
            <UsageStats>
              Used in {getTagUsageCount(editingTag.id)} documents
            </UsageStats>
          )}

          <TagEditorActions>
            <CancelButton onClick={handleCancelEdit}>Cancel</CancelButton>
            <SaveButton onClick={handleSaveTag} disabled={!tagName.trim()}>
              Save
            </SaveButton>
          </TagEditorActions>
        </TagEditorForm>
      </TagEditorContainer>
    );
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => onNavigate("home")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </BackButton>
        <Title>My Tags</Title>
        <CreateTagButton onClick={handleCreateTag}>
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
          Add New Tag
        </CreateTagButton>
      </Header>

      <AnimatePresence mode="wait">
        {editMode ? (
          renderTagEditor()
        ) : (
          <ContentContainer>
            {isLoading ? (
              <Loading>
                <LoadingSpinner />
                <LoadingText>Loading tags...</LoadingText>
              </Loading>
            ) : (
              <>
                {sortedTags.length === 0 ? (
                  <EmptyState>
                    <EmptyIcon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 5H2v7l6.29 6.29c.39.39 1.02.39 1.41 0l6.3-6.3a1 1 0 0 0 0-1.41l-6.29-6.29A1 1 0 0 0 9 5Z" />
                        <path d="M6 9.01V9" />
                        <path d="m15 5 6.3 6.3a1 1 0 0 1 0 1.4l-6.3 6.3a1 1 0 0 1-1.4 0L7.7 13" />
                      </svg>
                    </EmptyIcon>
                    <EmptyTitle>No Tags Yet</EmptyTitle>
                    <EmptyText>
                      Create tags to help organize your documents. Tags can be
                      added to documents during upload or search.
                    </EmptyText>
                    <CreateTagButtonLarge onClick={handleCreateTag}>
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
                      Create First Tag
                    </CreateTagButtonLarge>
                  </EmptyState>
                ) : (
                  <TagsGrid>
                    {sortedTags.map((tag) => (
                      <TagCard
                        key={tag.id}
                        as={motion.div}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        layout
                      >
                        <TagCardColor color={tag.color} />
                        <TagCardContent>
                          <TagCardName>{tag.name}</TagCardName>
                          <TagCardCount>
                            {getTagUsageCount(tag.id)} document
                            {getTagUsageCount(tag.id) !== 1 ? "s" : ""}
                          </TagCardCount>
                        </TagCardContent>
                        <TagCardActions>
                          <TagCardButton onClick={() => handleEditTag(tag)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </TagCardButton>
                          <TagCardButton
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </TagCardButton>
                        </TagCardActions>
                      </TagCard>
                    ))}
                  </TagsGrid>
                )}
              </>
            )}
          </ContentContainer>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.primary};
  margin-right: ${(props) => props.theme.spacing.md};
  width: 40px;
  height: 40px;
  border-radius: ${(props) => props.theme.borderRadius.md};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  flex: 1;
`;

const CreateTagButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transition: background-color ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.primary}CC; /* 80% opacity */
  }
`;

const CreateTagButtonLarge = styled(CreateTagButton)`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  margin-top: ${(props) => props.theme.spacing.lg};
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${(props) => props.theme.spacing.md};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const TagCard = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  transition: transform ${(props) => props.theme.transitions.short},
    box-shadow ${(props) => props.theme.transitions.short};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${(props) => props.theme.colors.shadow};
  }
`;

interface TagCardColorProps {
  color: string;
}

const TagCardColor = styled.div<TagCardColorProps>`
  width: 8px;
  background-color: ${(props) => props.color};
`;

const TagCardContent = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  flex: 1;
`;

const TagCardName = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const TagCardCount = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const TagCardActions = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing.xs};
  border-left: 1px solid ${(props) => props.theme.colors.divider};
`;

const TagCardButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  color: ${(props) => props.theme.colors.text.secondary};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const TagEditorContainer = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const TagEditorHeader = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  padding-bottom: ${(props) => props.theme.spacing.sm};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const TagEditorForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;

const FormLabel = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
`;

const TagNameInput = styled.input`
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.theme.colors.divider};
  transition: border-color ${(props) => props.theme.transitions.short};

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const ColorOptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
`;

interface ColorOptionProps {
  color: string;
  isSelected: boolean;
}

const ColorOption = styled.button<ColorOptionProps>`
  width: 40px;
  height: 40px;
  border-radius: ${(props) => props.theme.borderRadius.circle};
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid ${(props) => (props.isSelected ? "white" : "transparent")};
  box-shadow: ${(props) =>
    props.isSelected ? `0 0 0 2px ${props.color}` : "none"};
  transition: transform ${(props) => props.theme.transitions.short};

  &:hover {
    transform: scale(1.1);
  }
`;

const UsageStats = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const TagEditorActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};
`;

const CancelButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  transition: background-color ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const SaveButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  transition: background-color ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.primary}CC; /* 80% opacity */
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${(props) => props.theme.colors.background};
  border-top: 3px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: ${(props) => props.theme.spacing.md};

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 300px;
  padding: ${(props) => props.theme.spacing.xl};
`;

const EmptyIcon = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const EmptyTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const EmptyText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  max-width: 400px;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

export default TagsManagement;
