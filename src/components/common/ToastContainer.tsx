import React from 'react';
import styled from 'styled-components';
import Toast, { ToastType } from './Toast';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <Container>
      {toasts.map(toast => (
        <ToastWrapper key={toast.id}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </ToastWrapper>
      ))}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${props => props.theme.spacing.md};
  z-index: ${props => props.theme.zIndex.toast};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    bottom: ${props => props.theme.spacing.md};
    right: ${props => props.theme.spacing.md};
    left: ${props => props.theme.spacing.md};
    align-items: stretch;
  }
`;

const ToastWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    justify-content: center;
  }
`;

export default ToastContainer;