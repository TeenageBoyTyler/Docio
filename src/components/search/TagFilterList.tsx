import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import { Tag as TagType } from "../../context/UploadContext";
// Import Tag directly from its file, not through the index
import Tag from "../shared/tags/Tag";

const TagFilterList: React.FC = () => {
  const { selectedTags, toggleTagFilter } = useSearch();

  // Dummy Tags für den Moment - später aus dem Upload-Kontext oder anderem Service holen
  const [availableTags, setAvailableTags] = useState<TagType[]>([
    { id: "tag1", name: "Invoice", color: "#4285F4" },
    { id: "tag2", name: "Receipt", color: "#0F9D58" },
    { id: "tag3", name: "Contract", color: "#DB4437" },
    { id: "tag4", name: "Personal", color: "#F4B400" },
    { id: "tag5", name: "Work", color: "#AB47BC" },
    { id: "tag6", name: "Important", color: "#009688" },
  ]);

  // Hier würden wir normalerweise die Tags aus dem richtigen Kontext laden
  useEffect(() => {
    // Später: Lade die tatsächlichen Tags aus dem System
    // z.B. durch einen Service-Aufruf oder Integration mit dem UploadContext
  }, []);

  if (availableTags.length === 0) {
    return null; // Keine Tags vorhanden, nichts rendern
  }

  return (
    <Container>
      <TagsLabel>Filter nach Tags:</TagsLabel>
      <TagsContainer>
        <AnimatePresence>
          {availableTags.map((tag) => (
            <Tag
              key={tag.id}
              color={tag.color}
              isActive={selectedTags?.includes(tag.name)}
              onClick={() => toggleTagFilter(tag.name)}
            >
              {tag.name}
            </Tag>
          ))}
        </AnimatePresence>
      </TagsContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center; /* Zentriert die Inhalte horizontal innerhalb des Containers */
`;

const TagsLabel = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  display: block;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  text-align: center; /* Zentriert den Text */
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
  justify-content: center; /* Zentriert die Tags horizontal innerhalb des Containers */
`;

export default TagFilterList;
