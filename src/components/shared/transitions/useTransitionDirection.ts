// src/components/shared/transitions/useTransitionDirection.ts
import { useState, useEffect } from "react";
import { TransitionDirection } from "./TransitionConfig";

interface UseTransitionDirectionProps<T> {
  /**
   * Current active view/section/step
   */
  current: T;

  /**
   * Optional mapping of views to their relative position
   * Higher numbers are considered "to the right" or "down"
   * Lower numbers are considered "to the left" or "up"
   */
  positionMap?: Record<string, number>;

  /**
   * Whether to use vertical directions (up/down) instead of horizontal (left/right)
   * @default false
   */
  vertical?: boolean;

  /**
   * Whether to use fade transition when direction cannot be determined
   * @default true
   */
  useFadeForUnknown?: boolean;
}

/**
 * Hook to determine transition direction based on navigation
 * between different views/sections/steps
 */
export function useTransitionDirection<T extends string | number>({
  current,
  positionMap,
  vertical = false,
  useFadeForUnknown = true,
}: UseTransitionDirectionProps<T>) {
  const [previous, setPrevious] = useState<T | null>(null);
  const [direction, setDirection] = useState<TransitionDirection>(
    TransitionDirection.NONE
  );

  useEffect(() => {
    if (previous === null) {
      setPrevious(current);
      return;
    }

    if (previous === current) {
      return;
    }

    let newDirection = TransitionDirection.NONE;

    // If we have a position map, determine direction based on that
    if (positionMap) {
      const prevPos = positionMap[previous as string];
      const currentPos = positionMap[current as string];

      if (prevPos !== undefined && currentPos !== undefined) {
        if (vertical) {
          newDirection =
            prevPos < currentPos
              ? TransitionDirection.DOWN
              : TransitionDirection.UP;
        } else {
          newDirection =
            prevPos < currentPos
              ? TransitionDirection.RIGHT
              : TransitionDirection.LEFT;
        }
      } else if (useFadeForUnknown) {
        newDirection = TransitionDirection.FADE;
      }
    }
    // Default to basic string/number comparison if no position map
    else {
      if (vertical) {
        newDirection =
          previous < current
            ? TransitionDirection.DOWN
            : TransitionDirection.UP;
      } else {
        newDirection =
          previous < current
            ? TransitionDirection.RIGHT
            : TransitionDirection.LEFT;
      }
    }

    setDirection(newDirection);
    setPrevious(current);
  }, [current, positionMap, previous, vertical, useFadeForUnknown]);

  return { direction, previous };
}

/**
 * Helper hook to determine initial and exit variants for Framer Motion
 * based on the current transition direction
 */
export function useTransitionVariants(direction: TransitionDirection) {
  let initialVariant = "";
  let exitVariant = "";

  switch (direction) {
    case TransitionDirection.LEFT:
      initialVariant = "initialRight";
      exitVariant = "exitLeft";
      break;
    case TransitionDirection.RIGHT:
      initialVariant = "initialLeft";
      exitVariant = "exitRight";
      break;
    case TransitionDirection.UP:
      initialVariant = "initialDown";
      exitVariant = "exitUp";
      break;
    case TransitionDirection.DOWN:
      initialVariant = "initialUp";
      exitVariant = "exitDown";
      break;
    case TransitionDirection.FADE:
    default:
      initialVariant = "initialFade";
      exitVariant = "exitFade";
      break;
  }

  return { initialVariant, exitVariant };
}
