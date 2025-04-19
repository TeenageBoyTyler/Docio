// src/components/profile/DocumentsArchive.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  useProfile,
  ProfileView,
  DocumentMetadata,
} from "../../context/ProfileContext";
// Importieren der Navigation
import { useNavigation } from "../../context/NavigationContext";
// Importieren der standardisierten Empty-State-Komponente
import { EmptyCollection } from "../shared/empty";
// Importieren der standardisierten Loading-Komponenten
import { Spinner } from "../shared/loading";
// Importieren der standardisierten Navigation-Komponenten
import { BackButton, HeaderContainer, Title } from "../shared/navigation";
// Importieren der standardisierten Tag-Komponente
import Tag from "../shared/tags/Tag";

interface DocumentsArchiveProps {
  onNavigate: (view: ProfileView) => void;
}

// Date grouping for documents
type DateGroup = "Today" | "Yesterday" | "Last Week" | "Last Month" | "Older";

const DocumentsArchive: React.FC<DocumentsArchiveProps> = ({ onNavigate }) => {
  const {
    documents,
    selectedDocuments,
    selectDocument,
    unselectDocument,
    clearSelection,
    deleteDocuments,
    availableTags,
    isLoading,
    loadDocuments,
    loadTags,
  } = useProfile();

  // Navigation-Context verwenden
  const { navigateTo } = useNavigation();

  // State for date grouping and filtering
  const [groupedDocuments, setGroupedDocuments] = useState<
    Record<DateGroup, DocumentMetadata[]>
  >({
    Today: [],
    Yesterday: [],
    "Last Week": [],
    "Last Month": [],
    Older: [],
  });

  // Änderung von einzelnem tagId zu Array für Mehrfachauswahl
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([]);
  const [dateRangeFilter, setDateRangeFilter] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  // Group documents by date
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    // Filter by tags if tag filters are active
    let filteredDocs = [...documents];
    if (activeTagFilters.length > 0) {
      filteredDocs = documents.filter((doc) =>
        // Dokument enthält mindestens einen der ausgewählten Tags
        doc.tags.some((tagId) => activeTagFilters.includes(tagId))
      );
    }

    // Filter by date range if set
    if (dateRangeFilter.from || dateRangeFilter.to) {
      filteredDocs = filteredDocs.filter((doc) => {
        const docDate = new Date(doc.uploadDate);

        if (dateRangeFilter.from && dateRangeFilter.to) {
          return (
            docDate >= dateRangeFilter.from && docDate <= dateRangeFilter.to
          );
        } else if (dateRangeFilter.from) {
          return docDate >= dateRangeFilter.from;
        } else if (dateRangeFilter.to) {
          return docDate <= dateRangeFilter.to;
        }

        return true;
      });
    }

    // Group by date
    const grouped: Record<DateGroup, DocumentMetadata[]> = {
      Today: [],
      Yesterday: [],
      "Last Week": [],
      "Last Month": [],
      Older: [],
    };

    filteredDocs.forEach((doc) => {
      const docDate = new Date(doc.uploadDate);

      if (isSameDay(docDate, today)) {
        grouped.Today.push(doc);
      } else if (isSameDay(docDate, yesterday)) {
        grouped.Yesterday.push(doc);
      } else if (docDate >= lastWeekStart) {
        grouped["Last Week"].push(doc);
      } else if (docDate >= lastMonthStart) {
        grouped["Last Month"].push(doc);
      } else {
        grouped.Older.push(doc);
      }
    });

    setGroupedDocuments(grouped);
  }, [documents, activeTagFilters, dateRangeFilter]);

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Handler for selecting/deselecting a document
  const handleDocumentClick = (doc: DocumentMetadata) => {
    if (selectedDocuments.includes(doc.id)) {
      unselectDocument(doc.id);
    } else {
      selectDocument(doc.id);
    }
  };

  // Handler für Tag-Filter - aktualisiert für Mehrfachauswahl
  const handleTagFilter = (tagId: string) => {
    setActiveTagFilters((prevFilters) => {
      // Prüfen ob der Tag bereits ausgewählt ist
      if (prevFilters.includes(tagId)) {
        // Wenn ja, entfernen wir ihn
        return prevFilters.filter((id) => id !== tagId);
      } else {
        // Wenn nicht, fügen wir ihn hinzu
        return [...prevFilters, tagId];
      }
    });
  };

  // Handler for deleting selected documents
  const handleDeleteSelected = async () => {
    if (selectedDocuments.length > 0) {
      await deleteDocuments(selectedDocuments);
    }
  };

  // Handler for bulk tag editing (placeholder for now)
  const handleEditTags = () => {
    // This would navigate to a tag editing view
    console.log("Edit tags for:", selectedDocuments);
  };

  // Handler für den Upload neuer Dokumente - aktualisiert mit Navigation
  const handleUploadDocuments = () => {
    // Navigation zum Upload-Bereich mithilfe des NavigationContext
    navigateTo("upload");
  };

  // Fetch documents AND tags on mount only once
  useEffect(() => {
    const loadData = async () => {
      await loadDocuments();
      await loadTags(); // Wichtig: Tags auch laden, damit sie in den Dokumenten angezeigt werden können
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Find tag name by ID
  const getTagName = (tagId: string) => {
    const tag = availableTags.find((tag) => tag.id === tagId);
    return tag ? tag.name : tagId;
  };

  // Find tag color by ID
  const getTagColor = (tagId: string) => {
    const tag = availableTags.find((tag) => tag.id === tagId);
    return tag ? tag.color : "#808080";
  };

  // Action bar appears when documents are selected
  const renderActionBar = () => {
    if (selectedDocuments.length === 0) return null;

    return (
      <ActionBar
        as={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <ActionCount>{selectedDocuments.length} selected</ActionCount>
        <ActionButtons>
          <ActionButton onClick={handleEditTags}>Edit Tags</ActionButton>
          <ActionButton onClick={handleDeleteSelected} color="error">
            Delete
          </ActionButton>
          <ActionButton onClick={clearSelection}>Cancel</ActionButton>
        </ActionButtons>
      </ActionBar>
    );
  };

  // Render document tag chips
  const renderDocumentTags = (doc: DocumentMetadata) => {
    // Only show first 3 tags with a +X for the rest
    const visibleTags = doc.tags.slice(0, 3);
    const extraTags = doc.tags.length > 3 ? doc.tags.length - 3 : 0;

    return (
      <DocumentTags>
        {visibleTags.map((tagId) => (
          <DocumentTag
            key={tagId}
            color={getTagColor(tagId)}
            as={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {getTagName(tagId)}
          </DocumentTag>
        ))}
        {extraTags > 0 && (
          <DocumentTagMore
            as={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            +{extraTags}
          </DocumentTagMore>
        )}
      </DocumentTags>
    );
  };

  // Render document groups
  const renderDocumentGroups = () => {
    return Object.entries(groupedDocuments).map(([group, docs]) => {
      if (docs.length === 0) return null;

      return (
        <DocumentGroup key={group}>
          <GroupHeader>{group}</GroupHeader>
          <DocumentGrid>
            {docs.map((doc) => (
              <DocumentCard
                key={doc.id}
                isSelected={selectedDocuments.includes(doc.id)}
                onClick={() => handleDocumentClick(doc)}
              >
                <DocumentPreview>
                  {doc.preview ? (
                    <img src={doc.preview} alt={doc.name} />
                  ) : (
                    <DocumentPlaceholder>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 2V8H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 13H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 17H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9H9H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </DocumentPlaceholder>
                  )}
                </DocumentPreview>
                <DocumentInfo>
                  <DocumentName>{doc.name}</DocumentName>
                  <DocumentDate>
                    {new Date(doc.uploadDate).toLocaleString()}
                  </DocumentDate>
                  {renderDocumentTags(doc)}
                </DocumentInfo>
                <SelectIndicator
                  isSelected={selectedDocuments.includes(doc.id)}
                >
                  {selectedDocuments.includes(doc.id) && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </SelectIndicator>
              </DocumentCard>
            ))}
          </DocumentGrid>
        </DocumentGroup>
      );
    });
  };

  // Render available tags as filter options - aktualisiert um die Tag-Komponente zu verwenden
  const renderTagFilters = () => {
    return (
      <TagFilterContainer>
        <TagFilterTitle>Filter by Tag</TagFilterTitle>
        <TagFilterList>
          {availableTags.map((tag) => (
            <Tag
              key={tag.id}
              color={tag.color}
              isActive={activeTagFilters.includes(tag.id)}
              onClick={() => handleTagFilter(tag.id)}
            >
              {tag.name}
            </Tag>
          ))}
        </TagFilterList>
        {activeTagFilters.length > 0 && (
          <ClearFiltersButton
            onClick={() => setActiveTagFilters([])}
            as={motion.button}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Clear All Filters
          </ClearFiltersButton>
        )}
      </TagFilterContainer>
    );
  };

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
      >
        <Title>My Documents</Title>
      </HeaderContainer>

      {renderTagFilters()}

      {isLoading ? (
        <Loading>
          <Spinner size="large" showLabel labelText="Loading documents..." />
        </Loading>
      ) : (
        <>
          {documents.length === 0 ? (
            <EmptyCollection
              collectionType="documents"
              onAction={handleUploadDocuments}
              actionText="Upload First Document"
              size="large"
            />
          ) : (
            <DocumentsContainer>{renderDocumentGroups()}</DocumentsContainer>
          )}

          {renderActionBar()}
        </>
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
  position: relative;
`;

// Removed redundant Header and Title styled components

const TagFilterContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const TagFilterTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const TagFilterList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

// Button zum Löschen aller Filter
const ClearFiltersButton = styled.button`
  background: none;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  padding: ${(props) => props.theme.spacing.xs} 0;
  cursor: pointer;
  transition: color ${(props) => props.theme.transitions.short};

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
    text-decoration: underline;
  }
`;

const DocumentsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: ${(props) => props.theme.spacing.xl};
`;

const DocumentGroup = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const GroupHeader = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
  padding-bottom: ${(props) => props.theme.spacing.xs};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

interface DocumentCardProps {
  isSelected: boolean;
}

const DocumentCard = styled.div<DocumentCardProps>`
  position: relative;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  transition: transform ${(props) => props.theme.transitions.short},
    box-shadow ${(props) => props.theme.transitions.short};
  border: 2px solid
    ${(props) =>
      props.isSelected ? props.theme.colors.primary : "transparent"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${(props) => props.theme.colors.shadow};
  }
`;

const DocumentPreview = styled.div`
  height: 150px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DocumentPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const DocumentInfo = styled.div`
  padding: ${(props) => props.theme.spacing.md};
`;

const DocumentName = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DocumentDate = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const DocumentTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.xs};
`;

interface DocumentTagProps {
  color: string;
}

const DocumentTag = styled(motion.div)<DocumentTagProps>`
  background-color: ${(props) => props.color}40; // 25% opacity
  color: ${(props) => props.color};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  transition: all ${(props) => props.theme.transitions.short};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.color}60; // 38% opacity
  }
`;

const DocumentTagMore = styled(motion.div)`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text.secondary};
  transition: all ${(props) => props.theme.transitions.short};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.surface};
  }
`;

interface SelectIndicatorProps {
  isSelected: boolean;
}

const SelectIndicator = styled.div<SelectIndicatorProps>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: ${(props) => props.theme.borderRadius.circle};
  background-color: ${(props) =>
    props.isSelected ? props.theme.colors.primary : "rgba(0, 0, 0, 0.3)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: ${(props) => (props.isSelected ? 1 : 0.7)};
  transition: opacity ${(props) => props.theme.transitions.short},
    background-color ${(props) => props.theme.transitions.short};
`;

const ActionBar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: 0 4px 12px ${(props) => props.theme.colors.shadow};
  min-width: 300px;
`;

const ActionCount = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

interface ActionButtonProps {
  color?: "primary" | "error" | "default";
}

const ActionButton = styled.button<ActionButtonProps>`
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  background-color: ${(props) => {
    if (props.color === "primary") return props.theme.colors.primary;
    if (props.color === "error") return props.theme.colors.error;
    return "transparent";
  }};
  color: ${(props) => {
    if (props.color === "primary" || props.color === "error") return "#FFF";
    return props.theme.colors.text.primary;
  }};
  transition: background-color ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => {
      if (props.color === "primary") return `${props.theme.colors.primary}CC`;
      if (props.color === "error") return `${props.theme.colors.error}CC`;
      return props.theme.colors.background;
    }};
  }
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

export default DocumentsArchive;
