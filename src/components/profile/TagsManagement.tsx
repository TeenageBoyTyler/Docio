// src/components/profile/TagsManagement.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useProfile, ProfileView } from "../../context/ProfileContext";
import { Tag as TagType } from "../../context/UploadContext";
import { triggerTagSync } from "../shared/tags/TagSynchronizer"; // Import sync trigger

// Import standardized components
import Tag from "../shared/tags/Tag";
import { EmptyCollection } from "../shared/empty";
import { Spinner, LoadingOverlay } from "../shared/loading";
import { Button, IconButton } from "../shared/buttons";
import { TextField } from "../shared/inputs";
import { ColorPicker, ColorOption } from "../shared/inputs";
import { BackButton, HeaderContainer, Title } from "../shared/navigation";
import { Icon } from "../shared/icons";

// Import transition components
import { FadeTransition, ModalTransition } from "../shared/transitions";

interface TagsManagementProps {
  onNavigate: (view: ProfileView) => void;
}

type EditMode = "create" | "edit" | null;

const TagsManagement: React.FC<TagsManagementProps> = ({ onNavigate }) => {
  const {
    availableTags,
    createTag,
    updateTag,
    deleteTag,
    loadTags,
    documents,
    isLoading: globalLoading,
    deduplicateTags,
  } = useProfile();

  // State for the tag editor
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#4285F4");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Added for forced refreshes
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());

  // Load tags on mount and deduplicate if needed, with improved sync
  useEffect(() => {
    const initializeData = async () => {
      console.log("[TagsManagement] Initializing tag data");
      setIsLoading(true);
      try {
        // Force a sync to ensure we have the latest tags
        triggerTagSync();

        // Load tags from Profile
        await loadTags();

        // Check for duplicate tags and deduplicate if needed
        if (
          availableTags.length > 0 &&
          availableTags.some((tag1, i) =>
            availableTags.some(
              (tag2, j) =>
                i !== j && tag1.name.toLowerCase() === tag2.name.toLowerCase()
            )
          )
        ) {
          console.log(
            "[TagsManagement] Found duplicate tags, deduplicating..."
          );
          await deduplicateTags();

          // Force refresh the tag list display
          setRefreshKey((prev) => prev + 1);

          // Force another sync to update all contexts
          setTimeout(() => {
            triggerTagSync();
          }, 500);
        }
      } catch (error) {
        console.error("[TagsManagement] Error initializing tag data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    // Periodic sync to ensure tags are up to date
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastSyncTime > 3000) {
        // Every 3 seconds
        console.log("[TagsManagement] Periodic tag refresh");
        loadTags();
        triggerTagSync();
        setLastSyncTime(now);
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count documents with tag
  const getTagUsageCount = (tagId: string) => {
    return documents.filter((doc) => doc.tags.includes(tagId)).length;
  };

  // Handler for opening tag editor for new tag
  const handleCreateTag = () => {
    setEditMode("create");
    setEditingTag(null);
    setTagName("");
    setTagColor("#4285F4");
    setErrorMessage(null);
  };

  // Handler for opening tag editor for existing tag
  const handleEditTag = (tag: TagType) => {
    console.log(`[TagsManagement] Editing tag:`, tag);
    setEditMode("edit");
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setErrorMessage(null);
  };

  // Handler for canceling edit
  const handleCancelEdit = () => {
    setEditMode(null);
    setEditingTag(null);
    setErrorMessage(null);
  };

  // Enhanced handler for saving tag with better error handling and refresh logic
  const handleSaveTag = async () => {
    // Validate input
    if (!tagName.trim()) {
      setErrorMessage("Tag name cannot be empty");
      return;
    }

    // Check for duplicate tag names
    const isDuplicate = availableTags.some(
      (tag) =>
        tag.name.toLowerCase().trim() === tagName.trim().toLowerCase() &&
        (!editingTag || tag.id !== editingTag.id)
    );

    if (isDuplicate) {
      setErrorMessage("A tag with this name already exists");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (editMode === "create") {
        console.log(
          `[TagsManagement] Creating new tag: "${tagName}" with color ${tagColor}`
        );
        const newTag = await createTag(tagName.trim(), tagColor);
        if (newTag) {
          setEditMode(null);
          // Force reload to ensure UI is up to date
          await loadTags();
          // Force refresh the component
          setRefreshKey((prev) => prev + 1);

          // Trigger sync to update other contexts
          setTimeout(() => {
            triggerTagSync();
          }, 500);

          console.log(`[TagsManagement] Tag created successfully:`, newTag);
        } else {
          setErrorMessage("Failed to create tag");
        }
      } else if (editMode === "edit" && editingTag) {
        console.log(
          `[TagsManagement] Updating tag "${editingTag.name}" -> "${tagName}", color: ${tagColor}`
        );
        const success = await updateTag(
          editingTag.id,
          tagName.trim(),
          tagColor
        );
        if (success) {
          setEditMode(null);
          setEditingTag(null);
          // Force reload to ensure UI is up to date
          await loadTags();
          // Force refresh the component
          setRefreshKey((prev) => prev + 1);

          // Trigger sync to update other contexts
          setTimeout(() => {
            triggerTagSync();
          }, 500);

          console.log(`[TagsManagement] Tag updated successfully`);
        } else {
          setErrorMessage("Failed to update tag");
        }
      }
    } catch (error) {
      console.error("[TagsManagement] Error saving tag:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced handler for deleting tag with confirmation and error handling
  const handleDeleteTag = async (tagId: string) => {
    const tagName =
      availableTags.find((t) => t.id === tagId)?.name || "this tag";
    const usageCount = getTagUsageCount(tagId);

    const confirmMessage =
      usageCount > 0
        ? `Are you sure you want to delete "${tagName}"? It will be removed from ${usageCount} document${
            usageCount !== 1 ? "s" : ""
          }.`
        : `Are you sure you want to delete "${tagName}"?`;

    if (window.confirm(confirmMessage)) {
      setIsLoading(true);
      try {
        console.log(
          `[TagsManagement] Deleting tag "${tagName}" (ID: ${tagId})`
        );
        const success = await deleteTag(tagId);
        if (!success) {
          setErrorMessage(`Failed to delete tag "${tagName}"`);
        } else {
          console.log(`[TagsManagement] Successfully deleted tag "${tagName}"`);

          // Trigger sync to update other contexts
          setTimeout(() => {
            triggerTagSync();
          }, 500);
        }

        // Force reload tags to ensure UI is up to date
        await loadTags();

        // Force refresh the component
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error("[TagsManagement] Error deleting tag:", error);
        setErrorMessage(
          `An error occurred deleting "${tagName}". Please try again.`
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Available colors for tags
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

  // Sort tags alphabetically and ensure unique display by ID
  // This is important - in case we still have duplicates, only show one of each
  const sortedTags = React.useMemo(() => {
    // Create a map to deduplicate by name, keeping only the first occurrence
    const uniqueTagsByName = new Map<string, TagType>();

    availableTags.forEach((tag) => {
      const lowerName = tag.name.toLowerCase().trim();
      if (!uniqueTagsByName.has(lowerName)) {
        uniqueTagsByName.set(lowerName, tag);
      }
    });

    // Convert back to array and sort
    return Array.from(uniqueTagsByName.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [availableTags, refreshKey]); // refreshKey ensures re-computation

  // Log tags for debugging
  useEffect(() => {
    console.log(
      `[TagsManagement] Rendering with ${sortedTags.length} unique tags, refresh key: ${refreshKey}`
    );
  }, [sortedTags, refreshKey]);

  // Tag editor content component
  const TagEditorContent = () => (
    <TagEditorContainer>
      <TagEditorHeader>
        {editMode === "create"
          ? "Create New Tag"
          : `Edit "${editingTag?.name}"`}
      </TagEditorHeader>

      <TagEditorForm>
        <FormGroup>
          <TextField
            label="Tag Name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter tag name"
            autoFocus
            fullWidth
            error={
              errorMessage && errorMessage.includes("name")
                ? errorMessage
                : undefined
            }
          />
        </FormGroup>

        <FormGroup>
          <ColorPicker
            label="Tag Color"
            colors={colorOptions}
            value={tagColor}
            onChange={(color) => {
              console.log(`[TagsManagement] Color selected: ${color}`);
              setTagColor(color);
            }}
            size="medium"
            fullWidth
          />
        </FormGroup>

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

        {errorMessage && !errorMessage.includes("name") && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}

        <TagEditorActions>
          <Button
            variant="text"
            onClick={handleCancelEdit}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveTag}
            disabled={isLoading || !tagName.trim()}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </TagEditorActions>
      </TagEditorForm>

      {isLoading && <LoadingOverlay />}
    </TagEditorContainer>
  );

  return (
    <Container>
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
            disabled={isLoading || globalLoading}
          >
            Add New Tag
          </Button>
        }
      >
        <Title>My Tags</Title>
      </HeaderContainer>

      <ContentContainer>
        {globalLoading ? (
          <Loading>
            <Spinner size="large" showLabel labelText="Loading tags..." />
          </Loading>
        ) : (
          <>
            {/* Use FadeTransition for empty state */}
            {sortedTags.length === 0 ? (
              <FadeTransition transitionKey="empty-tags" duration={0.3}>
                <EmptyCollection
                  collectionType="tags"
                  actionText="Create First Tag"
                  onAction={handleCreateTag}
                  size="large"
                  icon={<Icon name="Tags" size="large" />}
                  description="Create tags to help organize your documents. Tags make it easier to categorize and find your documents later. You can add tags during upload or when editing documents."
                />
              </FadeTransition>
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
                      <IconButton
                        iconName="Pencil"
                        onClick={() => handleEditTag(tag)}
                        title="Edit Tag"
                        variant="text"
                        disabled={isLoading}
                      />
                      <IconButton
                        iconName="Trash2"
                        onClick={() => handleDeleteTag(tag.id)}
                        title="Delete Tag"
                        variant="text"
                        disabled={isLoading}
                      />
                    </TagCardActions>
                  </TagCard>
                ))}
              </TagsGrid>
            )}
          </>
        )}
      </ContentContainer>

      {/* Use ModalTransition for the tag editor instead of AnimatePresence */}
      <ModalTransition
        isOpen={editMode !== null}
        onClose={isLoading ? undefined : handleCancelEdit}
        maxWidth="600px"
      >
        <TagEditorContent />
      </ModalTransition>

      {isLoading && !globalLoading && (
        <LoadingOverlay
          message={
            editMode === "create"
              ? "Creating tag..."
              : editMode === "edit"
              ? "Updating tag..."
              : "Processing..."
          }
        />
      )}
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

// Tag Editor Styles - Now used directly inside the modal
const TagEditorContainer = styled.div`
  width: 100%;
  position: relative;
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

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-top: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm};
  background-color: ${(props) => props.theme.colors.error}20;
  border-radius: ${(props) => props.theme.borderRadius.sm};
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
