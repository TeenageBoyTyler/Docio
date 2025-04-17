import React from "react";
import EmptyState, { EmptyStateProps } from "./EmptyState";

export interface EmptySelectionProps
  extends Omit<EmptyStateProps, "title" | "icon"> {
  /**
   * Type of items that need to be selected
   * @default 'items'
   */
  itemType?: string;

  /**
   * Custom title override
   */
  customTitle?: string;

  /**
   * Custom description override
   */
  customDescription?: string;

  /**
   * Handler for the primary action
   */
  onAction?: () => void;

  /**
   * Custom text for the primary action button
   */
  actionText?: string;
}

/**
 * EmptySelection component displays a message when no items are selected
 *
 * @example
 * // Basic usage
 * <EmptySelection />
 *
 * // With custom item type
 * <EmptySelection
 *   itemType="documents"
 *   onAction={() => scrollToDocuments()}
 *   actionText="View Documents"
 * />
 */
const EmptySelection: React.FC<EmptySelectionProps> = ({
  itemType = "items",
  customTitle,
  customDescription,
  onAction,
  actionText,
  ...rest
}) => {
  // Generate title and description based on item type
  const title = customTitle || `No ${itemType} selected`;
  const description =
    customDescription ||
    `Select one or more ${itemType} to perform actions on them.`;

  // Selection icon
  const selectionIcon = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 20H8V18H4V20ZM4 6H12V4H4V6ZM4 13H12V11H4V13ZM14 20H20V18H14V20ZM14 11H20V9H14V11ZM14 4V6H20V4H14Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <EmptyState
      icon={selectionIcon}
      title={title}
      description={description}
      primaryActionText={actionText}
      onPrimaryAction={onAction}
      size="medium"
      {...rest}
    />
  );
};

export default EmptySelection;
