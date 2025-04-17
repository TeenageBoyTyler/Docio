import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  useProfile,
  ProfileView,
  DocumentMetadata,
} from "../../context/ProfileContext";

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
  } = useProfile();

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

  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
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

    // Filter by tag if a tag filter is active
    let filteredDocs = [...documents];
    if (activeTagFilter) {
      filteredDocs = documents.filter((doc) =>
        doc.tags.includes(activeTagFilter)
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
  }, [documents, activeTagFilter, dateRangeFilter]);

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

  // Handler for tag filter
  const handleTagFilter = (tagId: string | null) => {
    setActiveTagFilter(tagId === activeTagFilter ? null : tagId);
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

  // Fetch documents on mount
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

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
          <DocumentTag key={tagId} color={getTagColor(tagId)}>
            {getTagName(tagId)}
          </DocumentTag>
        ))}
        {extraTags > 0 && <DocumentTagMore>+{extraTags}</DocumentTagMore>}
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
                    {new Date(doc.uploadDate).toLocaleDateString()}
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
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
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

  // Render available tags as filter options
  const renderTagFilters = () => {
    return (
      <TagFilterContainer>
        <TagFilterTitle>Filter by Tag</TagFilterTitle>
        <TagFilterList>
          {availableTags.map((tag) => (
            <TagFilterChip
              key={tag.id}
              color={tag.color}
              isActive={activeTagFilter === tag.id}
              onClick={() => handleTagFilter(tag.id)}
            >
              {tag.name}
            </TagFilterChip>
          ))}
        </TagFilterList>
      </TagFilterContainer>
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
        <Title>My Documents</Title>
      </Header>

      {renderTagFilters()}

      {isLoading ? (
        <Loading>
          <LoadingSpinner />
          <LoadingText>Loading documents...</LoadingText>
        </Loading>
      ) : (
        <>
          {documents.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg
                  width="64"
                  height="64"
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
                    d="M12 18V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 15H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </EmptyIcon>
              <EmptyTitle>No Documents Yet</EmptyTitle>
              <EmptyText>
                Upload documents to see them here. They will be organized by
                date and tags.
              </EmptyText>
            </EmptyState>
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
`;

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
`;

interface TagFilterChipProps {
  color: string;
  isActive: boolean;
}

const TagFilterChip = styled.button<TagFilterChipProps>`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  background-color: ${(props) =>
    props.isActive ? props.color : props.theme.colors.surface};
  color: ${(props) =>
    props.isActive ? "#FFF" : props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.color};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.isActive ? props.color : `${props.color}40`};
    color: ${(props) =>
      props.isActive ? "#FFF" : props.theme.colors.text.primary};
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

const DocumentTag = styled.div<DocumentTagProps>`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  padding: 2px 6px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) => `${props.color}33`}; /* 20% opacity */
  color: ${(props) => props.color};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
`;

const DocumentTagMore = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  padding: 2px 6px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text.secondary};
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
`;

export default DocumentsArchive;
