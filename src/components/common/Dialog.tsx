import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Button } from "../shared/buttons";
import { Icon } from "../shared/icons";
import ReactDOM from "react-dom"; // Import ReactDOM for portal

interface DialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "info" | "warning" | "error" | "success";
}

const Dialog: React.FC<DialogProps> = ({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  type = "info",
}) => {
  // Prevent click events in the dialog from bubbling to elements behind it
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Get icon based on dialog type
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <Icon name="AlertTriangle" size="large" color="#F4B400" />;
      case "error":
        return <Icon name="AlertCircle" size="large" color="#DB4437" />;
      case "success":
        return <Icon name="CheckCircle" size="large" color="#0F9D58" />;
      case "info":
      default:
        return <Icon name="Info" size="large" color="#4285F4" />;
    }
  };

  // Add direct debugger log
  console.log("DIALOG RENDERED:", { title, message, type });

  // Create the dialog element
  const dialogElement = (
    <Overlay
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleContainerClick} /* Capture clicks on overlay */
    >
      <DialogContainer
        as={motion.div}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} /* Stop propagation on dialog */
      >
        <IconContainer>{getIcon()}</IconContainer>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button variant="text" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </ButtonGroup>
      </DialogContainer>
    </Overlay>
  );

  // Use React Portal for more reliable rendering
  return ReactDOM.createPortal(dialogElement, document.body);
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999; /* Ultra high z-index */
  backdrop-filter: blur(2px);
`;

const DialogContainer = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const IconContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
  text-align: center;
`;

const Message = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  text-align: center;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.md};
  width: 100%;
`;

export default Dialog;
