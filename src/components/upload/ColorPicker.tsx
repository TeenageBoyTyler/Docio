import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

interface ColorPickerProps {
  onSelectColor: (color: string) => void;
  onCancel: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onSelectColor,
  onCancel,
}) => {
  // Verwende die Tag-Farben aus dem Theme
  const colorOptions = [
    "#4285F4", // blue
    "#0F9D58", // green
    "#DB4437", // red
    "#F4B400", // yellow
    "#AB47BC", // purple
    "#009688", // teal
    "#FF5722", // orange
    "#E91E63", // pink
  ];

  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <Label>Select a color:</Label>
      <ColorsGrid>
        {colorOptions.map((color, index) => (
          <ColorOption
            key={index}
            color={color}
            onClick={() => onSelectColor(color)}
            as={motion.div}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </ColorsGrid>
      <CancelButton onClick={onCancel}>Cancel</CancelButton>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.divider};
`;

const Label = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ColorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

interface ColorOptionProps {
  color: string;
}

const ColorOption = styled.div<ColorOptionProps>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: pointer;
  border: 2px solid transparent;
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    border-color: white;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  text-align: center;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: all ${(props) => props.theme.transitions.short};
  display: block;
  margin-left: auto;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
    background-color: ${(props) => props.theme.colors.divider};
  }
`;

export default ColorPicker;
