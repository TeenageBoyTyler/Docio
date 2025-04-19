import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Button } from "../buttons";
import { Icon } from "../icons";

interface EmptySearchProps {
  query?: string;
  onBackToSearch?: () => void;
  onNewSearch?: () => void;
  hideBackButton?: boolean;
}

export const EmptySearch: React.FC<EmptySearchProps> = ({
  query = "",
  onBackToSearch,
  onNewSearch,
  hideBackButton = true, // Default changed to true - hide back button by default
}) => {
  return (
    <Container>
      <IconContainer>
        <Icon name="Search" size="large" color="#757575" />
      </IconContainer>

      <Title>No results found</Title>

      <Description>
        {query
          ? `No documents found matching "${query}". Try using different keywords or filters.`
          : "No documents match your search criteria. Try using different keywords or filters."}
      </Description>

      <ButtonsContainer>
        {!hideBackButton && onBackToSearch && (
          <Button variant="text" onClick={onBackToSearch}>
            Back to Search
          </Button>
        )}
        {onNewSearch && (
          <Button variant="primary" onClick={onNewSearch}>
            New Search
          </Button>
        )}
      </ButtonsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl};
  max-width: 500px;
  margin: 0 auto;
  flex: 1;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.background};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text.primary};
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  max-width: 400px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

export default EmptySearch;
