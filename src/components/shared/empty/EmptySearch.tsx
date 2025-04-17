import React from "react";
import EmptyState, { EmptyStateProps } from "./EmptyState";

export interface EmptySearchProps
  extends Omit<EmptyStateProps, "title" | "icon"> {
  /**
   * Search term that was used
   */
  searchTerm?: string;

  /**
   * Custom title override (default will be generated based on searchTerm)
   */
  customTitle?: string;

  /**
   * Handler for the "Back to Search" action
   */
  onBackToSearch?: () => void;
}

/**
 * EmptySearch component displays a message when search returns no results
 *
 * @example
 * // Basic usage
 * <EmptySearch
 *   searchTerm="project documents"
 *   onBackToSearch={() => goBack()}
 * />
 *
 * // With custom description
 * <EmptySearch
 *   searchTerm="annual report"
 *   description="Try searching for a different term or adjusting your filters."
 *   onBackToSearch={() => goBack()}
 * />
 */
const EmptySearch: React.FC<EmptySearchProps> = ({
  searchTerm,
  customTitle,
  description = "Try different search terms or adjust your filters.",
  onBackToSearch,
  primaryActionText = "Back to Search",
  ...rest
}) => {
  // Generate title based on search term if provided
  const title =
    customTitle ||
    (searchTerm
      ? `No results found for "${searchTerm}"`
      : "No search results found");

  // Default search icon
  const searchIcon = (
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

  return (
    <EmptyState
      icon={searchIcon}
      title={title}
      description={description}
      primaryActionText={onBackToSearch ? primaryActionText : undefined}
      onPrimaryAction={onBackToSearch}
      {...rest}
    />
  );
};

export default EmptySearch;
