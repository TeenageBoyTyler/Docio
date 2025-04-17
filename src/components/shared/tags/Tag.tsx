import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export interface TagProps {
  /** Text content of the tag */
  children: React.ReactNode;
  /** Color for the tag (from theme.colors.tags or a custom hex) */
  color: string;
  /** Whether the tag is currently selected/active */
  isActive?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional className for extending styled-components */
  className?: string;
  /** Optional title for accessibility */
  title?: string;
}

/**
 * Tag component for displaying category/label markers consistently across the app.
 * Supports selection states, custom colors, and animations.
 */
const Tag: React.FC<TagProps> = ({
  children,
  color,
  isActive = false,
  onClick,
  className,
  title,
}) => {
  return (
    <TagContainer
      color={color}
      isActive={isActive}
      onClick={onClick}
      className={className}
      title={title}
      as={motion.div}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </TagContainer>
  );
};

interface TagContainerProps {
  color: string;
  isActive: boolean;
}

const TagContainer = styled(motion.div)<TagContainerProps>`
  background-color: ${(props) => props.color}40; // 25% opacity
  color: ${(props) => props.color};
  border: 2px solid
    ${(props) => (props.isActive ? props.color : "transparent")};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  display: inline-block;
  
  &:hover {
    background-color: ${(props) => props.color}60; // 38% opacity
  }
`;

export default Tag;