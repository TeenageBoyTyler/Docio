import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useUpload, Tag as TagType } from "../../context/UploadContext";
// Fix the import to use the direct file path
import Tag from "../shared/tags/Tag";
// Standardized imports
import { ColorPicker, TextField } from "../shared/inputs";
import { Icon } from "../shared/icons";

interface TagSelectorProps {
  fileId: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({ fileId }) => {
  const { availableTags, addTagToFile, removeTagFromFile, createTag, files } =
    useUpload();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  // Finde das aktuelle File mit seiner ID
  const currentFile = files.find((file) => file.id === fileId);
  const fileTags = currentFile?.tags || [];

  // Tag hinzufügen oder entfernen
  const toggleTag = (tag: TagType) => {
    const hasTag = fileTags.some((t) => t.id === tag.id);

    if (hasTag) {
      removeTagFromFile(fileId, tag.id);
    } else {
      addTagToFile(fileId, tag);
    }
  };

  // Neuen Tag erstellen
  const handleCreateTag = (color: string) => {
    if (newTagName.trim()) {
      const newTag = createTag(newTagName.trim(), color);
      addTagToFile(fileId, newTag);
      setNewTagName("");
      setShowColorPicker(false);
    }
  };

  // Farbauswahl abbrechen
  const handleCancelColorPicker = () => {
    setShowColorPicker(false);
  };

  // Handler für Änderungen im Textfeld
  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTagName(e.target.value);
  };

  return (
    <Container>
      <TagSectionTitle>Tags</TagSectionTitle>
      <TagDescription>Add at least one tag to continue</TagDescription>

      <TagsGrid>
        {availableTags.map((tag) => {
          const isSelected = fileTags.some((t) => t.id === tag.id);
          return (
            <Tag
              key={tag.id}
              color={tag.color}
              isActive={isSelected}
              onClick={() => toggleTag(tag)}
            >
              {tag.name}
            </Tag>
          );
        })}
      </TagsGrid>

      <AddTagSection>
        {!showColorPicker ? (
          <AddTagButton
            onClick={() => setShowColorPicker(true)}
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AddTagButtonContent>
              <Icon name="Plus" size="small" />
              <span>Add New Tag</span>
            </AddTagButtonContent>
          </AddTagButton>
        ) : (
          <TagCreationContainer>
            {/* Standardisierte TextField-Komponente ersetzt das einfache TagInput */}
            <TextField
              placeholder="Enter tag name"
              value={newTagName}
              onChange={handleTagNameChange}
              fullWidth
              autoFocus
            />
            <AnimatePresence>
              {/* Standardisierte ColorPicker-Komponente */}
              <ColorPicker
                onSelectColor={handleCreateTag}
                onCancel={handleCancelColorPicker}
                label="Select a color for your tag:"
              />
            </AnimatePresence>
          </TagCreationContainer>
        )}
      </AddTagSection>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TagSectionTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.primary};
`;

const TagDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const TagsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const AddTagSection = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
`;

const AddTagButton = styled.button`
  background-color: transparent;
  border: 1px dashed ${(props) => props.theme.colors.text.secondary};
  color: ${(props) => props.theme.colors.text.secondary};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.short};
  width: auto;
  display: inline-flex;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }
`;

const AddTagButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
`;

const TagCreationContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default TagSelector;
