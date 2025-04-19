// src/components/profile/ProfileSection.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile, ProfileView } from "../../context/ProfileContext";
import { useNavigation } from "../../context/NavigationContext";

// Unterkomponenten importieren
import ProfileHome from "./ProfileHome";
import DocumentsArchive from "./DocumentsArchive";
import TagsManagement from "./TagsManagement";
import ProcessingSettings from "./ProcessingSettings";
import CloudProviderSelector from "./CloudProviderSelector";
// Import the Icon component
import { Icon } from "../shared/icons";

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

  // Get navigation context for cross-section navigation
  const { navigateToProfileView, currentProfileView } = useNavigation();

  // State für den Cloud-Provider-Selector
  const [showProviderSelector, setShowProviderSelector] = useState(false);

  // Synchronisiere Profile-View mit NavigationContext
  useEffect(() => {
    if (currentView !== currentProfileView) {
      navigateToProfileView(currentView);
    }
  }, [currentView, currentProfileView, navigateToProfileView]);

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
            {/* Replace SVG with Icon component */}
            <Icon name="Cloud" size="large" />
          </EmptyStateIcon>
          <EmptyStateTitle>Connect to Cloud Storage</EmptyStateTitle>
          <EmptyStateText>
            Connect to a cloud storage provider to store your documents securely
            and access all features.
          </EmptyStateText>
          <ButtonGroup>
            <ConnectButton onClick={() => setShowProviderSelector(true)}>
              Select Provider
            </ConnectButton>
          </ButtonGroup>

          <AnimatePresence>
            {showProviderSelector && (
              <ModalOverlay
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProviderSelector(false)}
              >
                <ModalContent onClick={(e) => e.stopPropagation()}>
                  <CloudProviderSelector
                    onClose={() => setShowProviderSelector(false)}
                  />
                </ModalContent>
              </ModalOverlay>
            )}
          </AnimatePresence>
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
            <ProfileActionBar>
              <ProviderButton onClick={() => setShowProviderSelector(true)}>
                <ProviderIcon>
                  {/* Replace SVG with Icon component */}
                  <Icon name="Network" size="small" />
                </ProviderIcon>
                Change Provider
              </ProviderButton>
            </ProfileActionBar>
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

      <AnimatePresence>
        {showProviderSelector && (
          <ModalOverlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProviderSelector(false)}
          >
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloudProviderSelector
                onClose={() => setShowProviderSelector(false)}
              />
            </ModalContent>
          </ModalOverlay>
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
  background-color: transparent; /* Vom übergeordneten Element übernehmen */
  position: relative;
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

const ProfileActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ProviderButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  color: ${(props) => props.theme.colors.text.secondary};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  border: 1px solid ${(props) => props.theme.colors.divider};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const ProviderIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.xs};
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
  /* Make the icon larger */
  font-size: 64px;
  line-height: 1;

  /* Style specifically for the Icon component */
  > div {
    width: 64px;
    height: 64px;
  }
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

const ButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${(props) => props.theme.spacing.lg};
`;

const ModalContent = styled.div`
  max-width: 90%;
  max-height: 90%;
`;

export default ProfileSection;
