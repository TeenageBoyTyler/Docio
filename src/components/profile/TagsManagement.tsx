// src/components/profile/TagsManagement.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile, ProfileView } from "../../context/ProfileContext";
import { Tag as TagType } from "../../context/UploadContext";

// Importieren der standardisierten Komponenten
import Tag from "../shared/tags/Tag";
import { EmptyCollection } from "../shared/empty";
import { Spinner } from "../shared/loading";
import { Button, IconButton } from "../shared/buttons";
import { TextField } from "../shared/inputs";
import { ColorPicker, ColorOption } from "../shared/inputs";
// Import der standardisierten Navigation-Komponenten
import { BackButton, HeaderContainer, Title } from "../shared/navigation";
// Import der neuen Icon-Komponente
import { Icon } from "../shared/icons";

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
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#4285F4"); // Default Blau

  // Lade Tags beim Mounten
  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const handleEditTag = (tag: TagType) => {
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
  const colorOptions: ColorOption[] = [
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
            {/* Standardisierte TextField-Komponente */}
            <TextField
              label="Tag Name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter tag name"
              autoFocus
              fullWidth
            />
          </FormGroup>

          <FormGroup>
            {/* Standardisierte ColorPicker-Komponente */}
            <ColorPicker
              label="Tag Color"
              colors={colorOptions}
              value={tagColor}
              onChange={setTagColor}
              size="medium"
              fullWidth
            />
          </FormGroup>

          {/* Beispiel für eine Tag-Vorschau mit der gemeinsamen Komponente */}
          <FormGroup>
            <FormLabel>Preview</FormLabel>
            <PreviewContainer>
              <Tag color={tagColor} isActive={true}>
                {tagName || "Tag Name"}
              </Tag>
            </PreviewContainer>
          </FormGroup>

          {editMode === "edit" && editingTag && (
            <UsageStats>
              Used in {getTagUsageCount(editingTag.id)} documents
            </UsageStats>
          )}

          <TagEditorActions>
            {/* Standardisierte Button-Komponenten */}
            <Button variant="text" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveTag}
              disabled={!tagName.trim()}
            >
              Save
            </Button>
          </TagEditorActions>
        </TagEditorForm>
      </TagEditorContainer>
    );
  };

  return (
    <Container>
      {/* Standardisierter HeaderContainer mit Lucide Icon */}
      <HeaderContainer
        leftContent={
          <BackButton
            onClick={() => onNavigate("home")}
            label="Back to Profile"
            showLabel={true}
            variant="text"
          />
        }
        rightContent={
          <Button
            variant="primary"
            onClick={handleCreateTag}
            startIcon={<Icon name="Plus" size="small" />}
          >
            Add New Tag
          </Button>
        }
      >
        <Title>My Tags</Title>
      </HeaderContainer>

      <AnimatePresence mode="wait">
        {editMode ? (
          renderTagEditor()
        ) : (
          <ContentContainer>
            {isLoading ? (
              <Loading>
                <Spinner size="large" showLabel labelText="Loading tags..." />
              </Loading>
            ) : (
              <>
                {sortedTags.length === 0 ? (
                  <EmptyCollection
                    collectionType="tags"
                    actionText="Create First Tag"
                    onAction={handleCreateTag}
                    size="large"
                    icon={<Icon name="Tags" size="large" />}
                    description="Create tags to help organize your documents. Tags can be added to documents during upload or search."
                  />
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
                          {/* Standardisierte IconButton-Komponenten mit Lucide Icons */}
                          <IconButton
                            variant="text"
                            onClick={() => handleEditTag(tag)}
                            title="Edit Tag"
                            icon={<Icon name="Pencil" size="small" />}
                          />
                          <IconButton
                            variant="text"
                            onClick={() => handleDeleteTag(tag.id)}
                            title="Delete Tag"
                            icon={<Icon name="Trash2" size="small" />}
                          />
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
  margin-top: 0;
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

// Neuer Styled Component für die Vorschau
const PreviewContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
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

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

export default TagsManagement;
