import React from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
// Import Tag directly from its file, not through the index
import Tag from "../shared/tags/Tag";

const TagFilterList: React.FC = () => {
  const { selectedTags, toggleTagFilter, availableTags } = useSearch();

  if (availableTags.length === 0) {
    return null; // No tags available, render nothing
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
              isActive={selectedTags.includes(tag.id)}
              onClick={() => toggleTagFilter(tag.id)}
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
  align-items: center; /* Centers content horizontally within the container */
`;

const TagsLabel = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  display: block;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  text-align: center; /* Centers the text */
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
  justify-content: center; /* Centers tags horizontally within the container */
`;

export default TagFilterList;
