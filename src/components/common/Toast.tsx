import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <AnimatePresence>
      <ToastContainer
        as={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        type={type}
      >
        <Message>{message}</Message>
      </ToastContainer>
    </AnimatePresence>
  );
};

interface ToastContainerProps {
  type: ToastType;
}

const ToastContainer = styled(motion.div)<ToastContainerProps>`
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => {
    switch (props.type) {
      case 'error':
        return props.theme.colors.error;
      case 'success':
        return props.theme.colors.success;
      case 'warning':
        return props.theme.colors.warning;
      case 'info':
      default:
        return props.theme.colors.info;
    }
  }};
  min-width: 250px;
  max-width: 350px;
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  z-index: ${props => props.theme.zIndex.toast};
`;

const Message = styled.p`
  color: #FFFFFF;
  font-size: ${props => props.theme.typography.fontSize.md};
  margin: 0;
`;

export default Toast;