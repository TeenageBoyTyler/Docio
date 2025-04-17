import React from "react";
import styled, { useTheme } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

export type SyncStatus = "idle" | "syncing" | "success" | "error" | "offline";

export interface SyncIndicatorProps {
  /**
   * Current synchronization status
   * @default 'idle'
   */
  status: SyncStatus;

  /**
   * Whether to show a text label indicating the status
   * @default false
   */
  showLabel?: boolean;

  /**
   * Size of the indicator
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";

  /**
   * Additional class name
   */
  className?: string;

  /**
   * Whether to show the indicator when idle
   * @default false
   */
  showWhenIdle?: boolean;

  /**
   * Custom status labels (optional)
   */
  customLabels?: {
    [key in SyncStatus]?: string;
  };
}

// Size configurations
const sizeConfig = {
  small: {
    size: "16px",
    fontSize: "12px",
  },
  medium: {
    size: "20px",
    fontSize: "14px",
  },
  large: {
    size: "24px",
    fontSize: "16px",
  },
};

// Status configurations with theme-based colors
const getStatusConfig = (
  status: SyncStatus,
  theme: any,
  customLabels?: { [key in SyncStatus]?: string }
) => {
  // Default status configurations
  const defaults = {
    idle: {
      color: theme.colors.text.disabled,
      label: "In Sync",
    },
    syncing: {
      color: theme.colors.primary,
      label: "Syncing...",
    },
    success: {
      color: theme.colors.success,
      label: "Sync Complete",
    },
    error: {
      color: theme.colors.error,
      label: "Sync Failed",
    },
    offline: {
      color: theme.colors.text.disabled,
      label: "Offline",
    },
  };

  // Override labels with custom ones if provided
  if (customLabels && customLabels[status]) {
    return {
      ...defaults[status],
      label: customLabels[status] || defaults[status].label,
    };
  }

  return defaults[status];
};

// Animation variants
const spinAnimation = {
  rotate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};

const pulseAnimation = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Styled components
const Container = styled.div<{ showLabel: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: ${(props) => (props.showLabel ? "auto" : sizeConfig.medium.size)};
`;

const IconContainer = styled(motion.div)<{
  size: "small" | "medium" | "large";
  statusColor: string;
}>`
  width: ${(props) => sizeConfig[props.size].size};
  height: ${(props) => sizeConfig[props.size].size};
  border-radius: 50%;
  background-color: ${(props) => props.statusColor};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SyncIcon = styled(motion.div)<{
  size: "small" | "medium" | "large";
  statusColor: string;
}>`
  width: ${(props) => sizeConfig[props.size].size};
  height: ${(props) => sizeConfig[props.size].size};
  border: 2px solid ${(props) => props.statusColor};
  border-radius: 50%;
  border-top-color: transparent;
  box-sizing: border-box;
`;

const StatusText = styled.span<{
  size: "small" | "medium" | "large";
  statusColor: string;
}>`
  font-size: ${(props) => sizeConfig[props.size].fontSize};
  color: ${(props) => props.statusColor};
`;

/**
 * Sync indicator component for showing cloud synchronization status
 *
 * @example
 * // Basic usage
 * <SyncIndicator status="syncing" />
 *
 * // With label
 * <SyncIndicator status="success" showLabel />
 *
 * // Custom size
 * <SyncIndicator status="error" size="large" showLabel />
 *
 * // Show even when idle
 * <SyncIndicator status="idle" showWhenIdle showLabel />
 *
 * // Custom labels
 * <SyncIndicator
 *   status="syncing"
 *   showLabel
 *   customLabels={{ syncing: "Updating cloud..." }}
 * />
 */
const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  status = "idle",
  showLabel = false,
  size = "medium",
  className,
  showWhenIdle = false,
  customLabels,
}) => {
  const theme = useTheme();

  // Don't show anything when idle and showWhenIdle is false
  if (status === "idle" && !showWhenIdle) {
    return null;
  }

  // Get status configuration
  const { color: statusColor, label: statusLabel } = getStatusConfig(
    status,
    theme,
    customLabels
  );

  // Determine which animation to use based on status
  const animation =
    status === "syncing"
      ? spinAnimation
      : status === "error"
      ? pulseAnimation
      : null;

  return (
    <Container showLabel={showLabel} className={className}>
      <AnimatePresence mode="wait">
        <IconContainer
          size={size}
          statusColor={statusColor}
          key={status}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {status === "syncing" && (
            <SyncIcon
              size={size}
              statusColor={statusColor}
              variants={animation}
              animate="rotate"
            />
          )}

          {status === "error" && (
            <motion.div
              variants={animation}
              animate="pulse"
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </IconContainer>
      </AnimatePresence>

      {showLabel && (
        <StatusText size={size} statusColor={statusColor}>
          {statusLabel}
        </StatusText>
      )}
    </Container>
  );
};

export default SyncIndicator;
