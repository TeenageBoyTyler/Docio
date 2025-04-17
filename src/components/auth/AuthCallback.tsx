import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { cloudStorage } from "../../services/cloudStorageService";
import { useToast } from "../../context/ToastContext";

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [message, setMessage] = useState("Processing authentication...");
  const { showToast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL-Parameter auslesen
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          throw new Error(`Authentication error: ${error}`);
        }

        if (!code) {
          throw new Error("No authentication code received");
        }

        // Auth-Callback verarbeiten
        const success = await cloudStorage.handleAuthCallback(code);

        if (success) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          showToast("Successfully connected to cloud storage", "success");

          // Zurück zur Hauptseite nach kurzer Verzögerung
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          throw new Error("Failed to complete authentication");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Authentication failed"
        );
        showToast("Could not connect to cloud service", "error");
      }
    };

    handleAuthCallback();
  }, [showToast]);

  return (
    <Container>
      <Card>
        <Icon status={status}>
          {status === "processing" ? (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill="currentColor"
              />
              <path d="M12 6V12L16 14" fill="currentColor" />
            </svg>
          ) : status === "success" ? (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
                fill="currentColor"
              />
            </svg>
          )}
        </Icon>
        <Title>
          {status === "processing"
            ? "Processing"
            : status === "success"
            ? "Success"
            : "Error"}
        </Title>
        <Message>{message}</Message>

        {status === "error" && (
          <HomeButton onClick={() => (window.location.href = "/")}>
            Back to Home
          </HomeButton>
        )}
      </Card>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 24px ${(props) => props.theme.colors.shadow};
`;

interface IconProps {
  status: "processing" | "success" | "error";
}

const Icon = styled.div<IconProps>`
  color: ${(props) =>
    props.status === "success"
      ? props.theme.colors.success
      : props.status === "error"
      ? props.theme.colors.error
      : props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  animation: ${(props) =>
    props.status === "processing" ? "spin 2s linear infinite" : "none"};

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text.primary};
`;

const Message = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const HomeButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}CC;
  }
`;

export default AuthCallback;
