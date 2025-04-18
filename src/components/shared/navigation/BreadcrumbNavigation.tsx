import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

/**
 * Definition für ein Breadcrumb-Element
 */
export interface BreadcrumbItem {
  /**
   * Eindeutige ID des Elements
   */
  id: string;

  /**
   * Anzeigetext für das Element
   */
  label: string;

  /**
   * Gibt an, ob das Element aktiv ist (aktuelle Seite)
   * @default false
   */
  isActive?: boolean;

  /**
   * Gibt an, ob das Element deaktiviert ist
   * @default false
   */
  isDisabled?: boolean;
}

/**
 * Props für die BreadcrumbNavigation-Komponente
 */
export interface BreadcrumbNavigationProps {
  /**
   * Array von Breadcrumb-Elementen
   */
  items: BreadcrumbItem[];

  /**
   * Callback wenn ein Breadcrumb-Element angeklickt wird
   */
  onNavigate: (itemId: string) => void;

  /**
   * Gibt an, ob die Komponente kompakt dargestellt werden soll
   * @default false
   */
  isCompact?: boolean;

  /**
   * Benutzerdefinierte Klasse für die Komponente
   */
  className?: string;

  /**
   * Max. Anzahl anzuzeigender Elemente vor der Kürzung
   * @default 4
   */
  maxVisible?: number;
}

/**
 * BreadcrumbNavigation Komponente für die Darstellung hierarchischer Navigation
 */
const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  onNavigate,
  isCompact = false,
  className,
  maxVisible = 4,
}) => {
  // Wenn zu viele Breadcrumbs angezeigt werden würden, zeige nur
  // den ersten, den letzten und einen ellipsis an
  const shouldCollapse = !isCompact && items.length > maxVisible;
  const visibleItems = shouldCollapse
    ? [
        items[0], // Immer das erste Element anzeigen
        { id: "ellipsis", label: "...", isDisabled: true }, // Ellipsis
        ...items.slice(items.length - (maxVisible - 2)), // Und die letzten Elemente
      ]
    : items;

  return (
    <Container className={className} $isCompact={isCompact}>
      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;

        return (
          <React.Fragment key={item.id}>
            <BreadcrumbItem
              as={motion.div}
              whileHover={
                !item.isDisabled && !item.isActive ? { scale: 1.05 } : undefined
              }
              whileTap={
                !item.isDisabled && !item.isActive ? { scale: 0.95 } : undefined
              }
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              $isActive={item.isActive}
              $isDisabled={item.isDisabled}
              $isCompact={isCompact}
              onClick={() => {
                if (!item.isActive && !item.isDisabled) {
                  onNavigate(item.id);
                }
              }}
            >
              {item.label}
            </BreadcrumbItem>

            {!isLast && (
              <Separator $isCompact={isCompact}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"
                    fill="currentColor"
                  />
                </svg>
              </Separator>
            )}
          </React.Fragment>
        );
      })}
    </Container>
  );
};

// Styled Components
const Container = styled.nav<{ $isCompact: boolean }>`
  display: flex;
  flex-wrap: ${(props) => (props.$isCompact ? "nowrap" : "wrap")};
  align-items: center;
  gap: ${(props) =>
    props.$isCompact ? props.theme.spacing.xs : props.theme.spacing.sm};
  font-size: ${(props) =>
    props.$isCompact
      ? props.theme.typography.fontSize.sm
      : props.theme.typography.fontSize.md};
  padding: ${(props) => (props.$isCompact ? 0 : props.theme.spacing.sm)};
  overflow-x: auto;

  /* Verstecke die Scrollbar, aber erlaube das Scrollen */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface BreadcrumbItemProps {
  $isActive?: boolean;
  $isDisabled?: boolean;
  $isCompact: boolean;
}

const BreadcrumbItem = styled.div<BreadcrumbItemProps>`
  padding: ${(props) =>
    props.$isCompact
      ? `${props.theme.spacing.xs} ${props.theme.spacing.sm}`
      : `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) =>
    props.$isActive ? props.theme.colors.surface : "transparent"};
  color: ${(props) => {
    if (props.$isDisabled) return props.theme.colors.text.disabled;
    if (props.$isActive) return props.theme.colors.primary;
    return props.theme.colors.text.secondary;
  }};
  font-weight: ${(props) =>
    props.$isActive
      ? props.theme.typography.fontWeight.medium
      : props.theme.typography.fontWeight.regular};
  cursor: ${(props) => {
    if (props.$isDisabled) return "not-allowed";
    if (props.$isActive) return "default";
    return "pointer";
  }};
  transition: all ${(props) => props.theme.transitions.short};
  white-space: nowrap;

  &:hover {
    color: ${(props) => {
      if (props.$isDisabled) return props.theme.colors.text.disabled;
      if (props.$isActive) return props.theme.colors.primary;
      return props.theme.colors.text.primary;
    }};
    background-color: ${(props) => {
      if (props.$isDisabled || props.$isActive)
        return props.$isActive ? props.theme.colors.surface : "transparent";
      return "rgba(255, 255, 255, 0.05)";
    }};
  }
`;

const Separator = styled.div<{ $isCompact: boolean }>`
  color: ${(props) => props.theme.colors.text.disabled};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: ${(props) => (props.$isCompact ? "12px" : "16px")};
    height: ${(props) => (props.$isCompact ? "12px" : "16px")};
  }
`;

export default BreadcrumbNavigation;
