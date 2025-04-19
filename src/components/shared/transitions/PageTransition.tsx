import React, { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { TransitionDirection } from "./TransitionConfig";

interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
  direction: TransitionDirection;
  isActive: boolean;
  duration?: number;
  distance?: number;
}

const TransitionContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center; /* Ensure vertical centering */
  align-items: center; /* Ensure horizontal centering */
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const PageTransition: FC<PageTransitionProps> = ({
  children,
  transitionKey,
  direction,
  isActive,
  duration = 0.35,
  distance = 60,
}) => {
  // Determine the X and Y offsets based on direction
  const getOffset = () => {
    switch (direction) {
      case "left":
        return { x: -distance, y: 0 };
      case "right":
        return { x: distance, y: 0 };
      case "up":
        return { x: 0, y: -distance };
      case "down":
        return { x: 0, y: distance };
      default:
        return { x: 0, y: 0 };
    }
  };

  const { x, y } = getOffset();

  return (
    <TransitionContainer
      key={transitionKey}
      initial={{ x, y, opacity: 0 }}
      animate={{
        x: 0,
        y: 0,
        opacity: 1,
      }}
      exit={{
        x: -x,
        y: -y,
        opacity: 0,
      }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: duration,
      }}
    >
      {children}
    </TransitionContainer>
  );
};

export default PageTransition;
