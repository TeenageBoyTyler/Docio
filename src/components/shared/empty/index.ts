/**
 * Empty state components for consistent "no data" states
 *
 * This module provides standardized components for displaying empty states
 * throughout the application, ensuring consistent behavior and appearance.
 */

export { default as EmptyState } from "./EmptyState";
export { default as EmptySearch } from "./EmptySearch";
export { default as EmptyCollection } from "./EmptyCollection";
export { default as EmptySelection } from "./EmptySelection";
export { default as EmptyUpload } from "./EmptyUpload";

// Re-export types
export type { EmptyStateProps, EmptyStateSize } from "./EmptyState";
export type { EmptySearchProps } from "./EmptySearch";
export type { EmptyCollectionProps, CollectionType } from "./EmptyCollection";
export type { EmptySelectionProps } from "./EmptySelection";
export type { EmptyUploadProps } from "./EmptyUpload";
