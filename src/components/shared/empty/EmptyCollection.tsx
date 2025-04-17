import React from "react";
import EmptyState, { EmptyStateProps } from "./EmptyState";

export type CollectionType =
  | "documents"
  | "tags"
  | "uploads"
  | "results"
  | "general";

export interface EmptyCollectionProps
  extends Omit<EmptyStateProps, "title" | "icon"> {
  /**
   * Type of collection that is empty
   * @default 'general'
   */
  collectionType?: CollectionType;

  /**
   * Custom title override (default will be generated based on collectionType)
   */
  customTitle?: string;

  /**
   * Custom description override (default will be generated based on collectionType)
   */
  customDescription?: string;

  /**
   * Handler for the primary action (e.g., "Upload First Document")
   */
  onAction?: () => void;

  /**
   * Custom text for the primary action button
   */
  actionText?: string;
}

/**
 * EmptyCollection component displays a message when a collection has no items
 *
 * @example
 * // Basic usage for documents
 * <EmptyCollection
 *   collectionType="documents"
 *   onAction={() => navigate('/upload')}
 * />
 *
 * // Custom messaging for tags
 * <EmptyCollection
 *   collectionType="tags"
 *   customDescription="Create tags to organize your documents more effectively."
 *   actionText="Create First Tag"
 *   onAction={() => openTagCreator()}
 * />
 */
const EmptyCollection: React.FC<EmptyCollectionProps> = ({
  collectionType = "general",
  customTitle,
  customDescription,
  onAction,
  actionText,
  ...rest
}) => {
  // Default titles based on collection type
  const defaultTitles: Record<CollectionType, string> = {
    documents: "No Documents Yet",
    tags: "No Tags Created",
    uploads: "No Files Selected",
    results: "No Results Available",
    general: "Nothing Here Yet",
  };

  // Default descriptions based on collection type
  const defaultDescriptions: Record<CollectionType, string> = {
    documents:
      "Upload documents to see them here. They will be organized by date and tags.",
    tags: "Create tags to help organize and find your documents more easily.",
    uploads: "Select files to upload or drag and drop them here.",
    results: "Try a different search or filter to see results.",
    general: "There are no items to display at this time.",
  };

  // Default action texts based on collection type
  const defaultActionTexts: Record<CollectionType, string> = {
    documents: "Upload First Document",
    tags: "Create First Tag",
    uploads: "Select Files",
    results: "Modify Search",
    general: "Add Item",
  };

  // Collection-specific icons
  const getCollectionIcon = () => {
    switch (collectionType) {
      case "documents":
        return (
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
        );
      case "tags":
        return (
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
              fill="currentColor"
            />
          </svg>
        );
      case "uploads":
        return (
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
      case "results":
        return (
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              fill="currentColor"
            />
          </svg>
        );
      default:
        return (
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
              fill="currentColor"
            />
            <path
              d="M12 17H17V12H12V17ZM13 13H16V16H13V13Z"
              fill="currentColor"
            />
            <path d="M6 6H11V11H6V6ZM7 7H10V10H7V7Z" fill="currentColor" />
            <path d="M6 12H11V17H6V12ZM7 13H10V16H7V13Z" fill="currentColor" />
            <path d="M12 6H17V11H12V6ZM13 7H16V10H13V7Z" fill="currentColor" />
          </svg>
        );
    }
  };

  const title = customTitle || defaultTitles[collectionType];
  const description = customDescription || defaultDescriptions[collectionType];
  const primaryActionText =
    actionText || (onAction ? defaultActionTexts[collectionType] : undefined);

  return (
    <EmptyState
      icon={getCollectionIcon()}
      title={title}
      description={description}
      primaryActionText={primaryActionText}
      onPrimaryAction={onAction}
      {...rest}
    />
  );
};

export default EmptyCollection;
