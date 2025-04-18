import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Definition für einen Prozessschritt
 */
export interface Step {
  /**
   * Eindeutige ID des Schritts
   */
  id: string;

  /**
   * Anzeigetext für den Schritt
   */
  label: string;

  /**
   * Zusätzliche Beschreibung für den Schritt (nur angezeigt im normalen Modus)
   */
  description?: string;

  /**
   * Status des Schritts
   * @default "upcoming"
   */
  status?: "completed" | "current" | "upcoming" | "error";

  /**
   * Optional: Benutzerdefiniertes Icon für den Schritt
   */
  icon?: React.ReactNode;
}

/**
 * Props für die ProgressIndicator-Komponente
 */
export interface ProgressIndicatorProps {
  /**
   * Array von Schritten
   */
  steps: Step[];

  /**
   * ID des aktuellen Schritts
   */
  currentStep: string;

  /**
   * Callback wenn ein Schritt angeklickt wird
   */
  onStepClick?: (stepId: string) => void;

  /**
   * Gibt an, ob die Komponente vertikal angezeigt werden soll
   * @default false
   */
  vertical?: boolean;

  /**
   * Gibt an, ob die Komponente kompakt dargestellt werden soll
   * @default false
   */
  compact?: boolean;

  /**
   * Benutzerdefinierte Klasse für die Komponente
   */
  className?: string;
}

/**
 * ProgressIndicator Komponente für mehrstufige Prozesse
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  vertical = false,
  compact = false,
  className,
}) => {
  // Bestimme den Status jedes Schritts basierend auf dem aktuellen Schritt
  const processedSteps = steps.map((step) => {
    // Wenn ein Status für den Schritt definiert ist, behalte diesen bei
    if (step.status) {
      return step;
    }

    // Finde den Index des aktuellen Schritts
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    const stepIndex = steps.findIndex((s) => s.id === step.id);

    // Bestimme den Status basierend auf dem Vergleich der Indizes
    let status: Step["status"] = "upcoming";
    if (stepIndex < currentIndex) {
      status = "completed";
    } else if (stepIndex === currentIndex) {
      status = "current";
    }

    return {
      ...step,
      status,
    };
  });

  return (
    <Container className={className} $vertical={vertical} $compact={compact}>
      {processedSteps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isClickable = onStepClick && step.status !== "upcoming";

        return (
          <React.Fragment key={step.id}>
            <StepContainer
              as={motion.div}
              $vertical={vertical}
              $compact={compact}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <StepIcon
                as={motion.div}
                $status={step.status}
                $compact={compact}
                $clickable={!!isClickable}
                whileHover={isClickable ? { scale: 1.1, rotate: 5 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
                onClick={() => {
                  if (isClickable) {
                    onStepClick?.(step.id);
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  {step.status === "completed" ? (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      {step.icon || (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "block" }}
                        >
                          <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </motion.div>
                  ) : step.status === "error" ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      {step.icon || (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "block" }}
                        >
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="number"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      {step.icon || <StepNumber>{index + 1}</StepNumber>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </StepIcon>

              <StepContent $vertical={vertical} $compact={compact}>
                <StepLabel $status={step.status} $compact={compact}>
                  {step.label}
                </StepLabel>
                {!compact && step.description && (
                  <StepDescription $status={step.status}>
                    {step.description}
                  </StepDescription>
                )}
              </StepContent>
            </StepContainer>

            {!isLast && (
              <StepConnector
                $vertical={vertical}
                $status={step.status === "completed" ? "completed" : "upcoming"}
                $compact={compact}
              />
            )}
          </React.Fragment>
        );
      })}
    </Container>
  );
};

// Styled Components
const Container = styled.div<{ $vertical: boolean; $compact: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$vertical ? "column" : "row")};
  align-items: ${(props) => (props.$vertical ? "flex-start" : "center")};
  justify-content: ${(props) =>
    props.$vertical ? "flex-start" : "space-between"};
  width: 100%;
  padding: ${(props) =>
    props.$compact ? props.theme.spacing.sm : props.theme.spacing.md};
  gap: ${(props) =>
    props.$compact ? props.theme.spacing.xs : props.theme.spacing.sm};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: ${(props) =>
      props.$vertical ? "column" : props.$compact ? "column" : "row"};
    align-items: ${(props) =>
      props.$vertical || (props.$compact && !props.$vertical)
        ? "flex-start"
        : "center"};
  }
`;

const StepContainer = styled.div<{ $vertical: boolean; $compact: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$vertical ? "row" : "column")};
  align-items: ${(props) => (props.$vertical ? "center" : "center")};
  justify-content: ${(props) => (props.$vertical ? "flex-start" : "center")};
  position: relative;
  flex: ${(props) => (props.$vertical ? "0 0 auto" : "1")};
  z-index: 1;
  gap: ${(props) => props.theme.spacing.xs};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: ${(props) =>
      props.$vertical ? "row" : props.$compact ? "row" : "column"};
    align-items: ${(props) =>
      props.$vertical || (props.$compact && !props.$vertical)
        ? "center"
        : "center"};
    width: ${(props) => (props.$vertical ? "100%" : "auto")};
  }
`;

interface StepIconProps {
  $status?: string;
  $compact: boolean;
  $clickable: boolean;
}

const StepIcon = styled.div<StepIconProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.$compact ? "24px" : "32px")};
  height: ${(props) => (props.$compact ? "24px" : "32px")};
  border-radius: 50%;
  background-color: ${(props) => {
    switch (props.$status) {
      case "completed":
        return props.theme.colors.primary;
      case "current":
        return "transparent";
      case "error":
        return props.theme.colors.error;
      default:
        return props.theme.colors.background;
    }
  }};
  border: 2px solid
    ${(props) => {
      switch (props.$status) {
        case "completed":
          return props.theme.colors.primary;
        case "current":
          return props.theme.colors.primary;
        case "error":
          return props.theme.colors.error;
        default:
          return props.theme.colors.divider;
      }
    }};
  color: ${(props) => {
    switch (props.$status) {
      case "completed":
        return "#000";
      case "current":
        return props.theme.colors.primary;
      case "error":
        return "#000";
      default:
        return props.theme.colors.text.disabled;
    }
  }};
  transition: all ${(props) => props.theme.transitions.short};
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
  z-index: 2;
  flex-shrink: 0;

  &:hover {
    opacity: ${(props) => (props.$clickable ? 0.9 : 1)};
  }

  /* Bessere Zentrierung für alle Inhalte */
  svg {
    display: block;
    margin: 0 auto;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
`;

const StepNumber = styled.span`
  font-size: 12px;
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
`;

const StepContent = styled.div<{ $vertical: boolean; $compact: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$vertical ? "flex-start" : "center")};
  justify-content: center;
  text-align: ${(props) => (props.$vertical ? "left" : "center")};
  padding: ${(props) => (props.$compact ? "0" : props.theme.spacing.xs)};
  gap: ${(props) => (props.$compact ? "0" : props.theme.spacing.xs)};
  min-width: ${(props) => (props.$compact ? "auto" : "80px")};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    align-items: ${(props) =>
      props.$vertical || (props.$compact && !props.$vertical)
        ? "flex-start"
        : "center"};
    text-align: ${(props) =>
      props.$vertical || (props.$compact && !props.$vertical)
        ? "left"
        : "center"};
  }
`;

interface StepStatusProps {
  $status?: string;
  $compact?: boolean;
}

const StepLabel = styled.span<StepStatusProps>`
  font-size: ${(props) =>
    props.$compact
      ? props.theme.typography.fontSize.xs
      : props.theme.typography.fontSize.sm};
  font-weight: ${(props) =>
    props.$status === "current"
      ? props.theme.typography.fontWeight.bold
      : props.theme.typography.fontWeight.medium};
  color: ${(props) => {
    switch (props.$status) {
      case "completed":
        return props.theme.colors.text.primary;
      case "current":
        return props.theme.colors.primary;
      case "error":
        return props.theme.colors.error;
      default:
        return props.theme.colors.text.disabled;
    }
  }};
  transition: all ${(props) => props.theme.transitions.short};
`;

const StepDescription = styled.span<StepStatusProps>`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => {
    switch (props.$status) {
      case "completed":
      case "current":
        return props.theme.colors.text.secondary;
      case "error":
        return props.theme.colors.error + "CC";
      default:
        return props.theme.colors.text.disabled;
    }
  }};
  max-width: 120px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all ${(props) => props.theme.transitions.short};
`;

interface StepConnectorProps {
  $vertical: boolean;
  $status: string;
  $compact: boolean;
}

const StepConnector = styled.div<StepConnectorProps>`
  flex: ${(props) => (props.$vertical ? "0 0 auto" : "1")};
  width: ${(props) => (props.$vertical ? "2px" : "auto")};
  height: ${(props) => (props.$vertical ? "20px" : "2px")};
  background-color: ${(props) =>
    props.$status === "completed"
      ? props.theme.colors.primary
      : props.theme.colors.divider};
  transition: all ${(props) => props.theme.transitions.short};
  margin: ${(props) =>
    props.$vertical
      ? `0 0 0 ${props.$compact ? "11px" : "15px"}`
      : "0"}; // Zentrieren unter dem Icon
  z-index: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: ${(props) =>
      props.$vertical || (props.$compact && !props.$vertical) ? "2px" : "auto"};
    height: ${(props) =>
      props.$vertical || (props.$compact && !props.$vertical) ? "20px" : "2px"};
    margin: ${(props) =>
      props.$vertical || (props.$compact && !props.$vertical)
        ? `0 0 0 ${props.$compact ? "11px" : "15px"}`
        : "0"};
  }
`;

export default ProgressIndicator;
