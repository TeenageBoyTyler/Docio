import React from 'react';
import styled from 'styled-components';

const SearchSection: React.FC = () => {
  return (
    <Container>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Search documents..." 
        />
        <SearchIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
          </svg>
        </SearchIcon>
      </SearchContainer>
      <PopularTags>
        <TagTitle>Popular Tags:</TagTitle>
        <TagList>
          <Tag>Invoice</Tag>
          <Tag>Receipt</Tag>
          <Tag>Contract</Tag>
          <Tag>ID</Tag>
        </TagList>
      </PopularTags>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${props => props.theme.spacing.xl};
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  padding-right: ${props => props.theme.spacing.xxl};
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.divider};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const PopularTags = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => props.theme.spacing.lg};
`;

const TagTitle = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Tag = styled.button`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.divider};
  color: ${props => props.theme.colors.text.secondary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}20; /* 12% opacity */
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary}40; /* 25% opacity */
  }
`;

export default SearchSection;