import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import EmptyState, { EmptyStateProps } from "./EmptyState";

export interface EmptyUploadProps
  extends Omit<EmptyStateProps, "title" | "icon"> {
  /**
   * Custom title override
   */
  customTitle?: string;

  /**
   * Custom description override
   */
  customDescription?: string;

  /**
   * Handler for the select files action
   */
  onSelectFiles?: () => void;

  /**
   * Handler for drag events (if drag-and-drop enabled)
   */
  onDrag?: (isDragging: boolean) => void;

  /**
   * Whether drag-and-drop is enabled
   * @default true
   */
  dragEnabled?: boolean;

  /**
   * Whether drag is currently happening
   * @default false
   */
  isDragging?: boolean;
}

/**
 * EmptyUpload component displays a message when no files are selected for upload
 * with optional drag-and-drop area functionality
 *
 * @example
 * // Basic usage
 * <EmptyUpload
 *   onSelectFiles={() => openFileDialog()}
 * />
 *
 * // With drag-and-drop functionality
 * <EmptyUpload
 *   onSelectFiles={() => openFileDialog()}
 *   onDrag={(isDragging) => setDragState(isDragging)}
 *   isDragging={isDragging}
 * />
 */
const EmptyUpload: React.FC<EmptyUploadProps> = ({
  customTitle,
  customDescription,
  onSelectFiles,
  onDrag,
  dragEnabled = true,
  isDragging = false,
  ...rest
}) => {
  const title = customTitle || "No Files Selected";
  const description =
    customDescription || dragEnabled
      ? "Select files to upload or drag and drop them here"
      : "Select files to upload";

  // Upload icon
  const uploadIcon = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18ZM8 13H10.55V16H13.45V13H16L12 9L8 13Z"
        fill="currentColor"
      />
    </svg>
  );

  // Drag handling
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragEnabled && onDrag && !isDragging) {
      onDrag(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragEnabled && onDrag && isDragging) {
      onDrag(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragEnabled && onDrag) {
      onDrag(false);
      if (onSelectFiles) {
        onSelectFiles();
      }
    }
  };

  return (
    <DragContainer
      isDragging={isDragging}
      dragEnabled={dragEnabled}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ scale: 1 }}
      animate={{
        scale: isDragging ? 1.03 : 1,
        boxShadow: isDragging ? "0 0 0 2px var(--primary-color)" : "none",
      }}
      transition={{ duration: 0.2 }}
    >
      <EmptyState
        icon={uploadIcon}
        title={title}
        description={description}
        primaryActionText="Select Files"
        onPrimaryAction={onSelectFiles}
        {...rest}
      />
    </DragContainer>
  );
};

// Styled components - separate wrapper for drag-and-drop functionality
interface DragContainerProps {
  isDragging?: boolean;
  dragEnabled?: boolean;
}

const DragContainer = styled(motion.div)<DragContainerProps>`
  border-radius: ${(props) => props.theme.borderRadius.lg};
  border: ${(props) =>
    props.dragEnabled
      ? props.isDragging
        ? `2px dashed ${props.theme.colors.primary}`
        : `2px dashed ${props.theme.colors.divider}`
      : "none"};
  background-color: ${(props) =>
    props.isDragging
      ? props.theme.colors.primary + "10" // 10% opacity
      : "transparent"};
  transition: all ${(props) => props.theme.transitions.short};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  --primary-color: ${(props) => props.theme.colors.primary};

  &:hover {
    border-color: ${(props) =>
      props.dragEnabled && !props.isDragging
        ? props.theme.colors.text.disabled
        : props.isDragging
        ? props.theme.colors.primary
        : props.theme.colors.divider};
  }
`;

export default EmptyUpload;
