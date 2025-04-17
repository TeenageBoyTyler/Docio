import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import { Tag } from "../../context/UploadContext";

const TagFilterList: React.FC = () => {
  const { selectedTags, toggleTagFilter } = useSearch();

  // Dummy Tags für den Moment - später aus dem Upload-Kontext oder anderem Service holen
  const [availableTags, setAvailableTags] = useState<Tag[]>([
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
            <TagChip
              key={tag.id}
              color={tag.color}
              isSelected={selectedTags.includes(tag.name)}
              onClick={() => toggleTagFilter(tag.name)}
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {tag.name}
            </TagChip>
          ))}
        </AnimatePresence>
      </TagsContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const TagsLabel = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  display: block;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
`;

interface TagChipProps {
  color: string;
  isSelected: boolean;
}

const TagChip = styled.div<TagChipProps>`
  background-color: ${(props) => props.color}40; // 25% opacity
  color: ${(props) => props.color};
  border: 2px solid
    ${(props) => (props.isSelected ? props.color : "transparent")};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.color}60; // 38% opacity
  }
`;

const CheckIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => props.theme.spacing.xs};
`;

export default TagFilterList;
