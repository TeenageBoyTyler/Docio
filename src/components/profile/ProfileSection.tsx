import React, { useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile, ProfileView } from "../../context/ProfileContext";

// Unterkomponenten importieren
import ProfileHome from "./ProfileHome";
import DocumentsArchive from "./DocumentsArchive";
import TagsManagement from "./TagsManagement";
import ProcessingSettings from "./ProcessingSettings";

const ProfileSection: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isCloudConnected,
    cloudProvider,
    documentCount,
    tagCount,
    connectToCloud,
  } = useProfile();

  // Animation-Varianten für die Seitenübergänge
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: -20,
    },
  };

  // Gehe zum Dokument-Archiv zurück, wenn von einer anderen Seite kommend
  // Dokumente ausgewählt wurden
  useEffect(() => {
    // Dieser Effekt kann später implementiert werden
  }, []);

  // Nur Cloud-Verbindung anzeigen, wenn keine Verbindung besteht
  if (!isCloudConnected) {
    return (
      <Container>
        <EmptyStateContainer>
          <EmptyStateIcon>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18Z"
                fill="currentColor"
              />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Connect to Cloud Storage</EmptyStateTitle>
          <EmptyStateText>
            Connect to a cloud storage provider to store your documents securely
            and access all features.
          </EmptyStateText>
          <ConnectButton onClick={() => connectToCloud("Dropbox")}>
            Connect to Dropbox
          </ConnectButton>
        </EmptyStateContainer>
      </Container>
    );
  }

  // Rendere die entsprechende Ansicht basierend auf currentView
  return (
    <Container>
      <AnimatePresence mode="wait">
        {currentView === "home" && (
          <PageContainer
            key="home"
            as={motion.div}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <ProfileHome onNavigate={setCurrentView} />
          </PageContainer>
        )}

        {currentView === "documents" && (
          <PageContainer
            key="documents"
            as={motion.div}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <DocumentsArchive onNavigate={setCurrentView} />
          </PageContainer>
        )}

        {currentView === "tags" && (
          <PageContainer
            key="tags"
            as={motion.div}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <TagsManagement onNavigate={setCurrentView} />
          </PageContainer>
        )}

        {currentView === "settings" && (
          <PageContainer
            key="settings"
            as={motion.div}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <ProcessingSettings onNavigate={setCurrentView} />
          </PageContainer>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.xl};

  /* Subtle scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.divider};
    border-radius: ${(props) => props.theme.borderRadius.md};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text.disabled};
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: ${(props) => props.theme.spacing.xl};
`;

const EmptyStateIcon = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const EmptyStateTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const EmptyStateText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  max-width: 500px;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ConnectButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transition: background-color ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.primary}CC; /* 80% opacity */
  }
`;

export default ProfileSection;
