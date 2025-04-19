// src/components/profile/ProfileSection.tsx
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useProfile, ProfileView } from "../../context/ProfileContext";
import { useNavigation } from "../../context/NavigationContext";

// Import transition system
import {
  PageTransition,
  TransitionDirection,
  useTransitionDirection,
  ModalTransition,
  FadeTransition,
  SlideTransition,
} from "../shared/transitions";

// Components
import ProfileHome from "./ProfileHome";
import DocumentsArchive from "./DocumentsArchive";
import TagsManagement from "./TagsManagement";
import ProcessingSettings from "./ProcessingSettings";
import CloudProviderSelector from "./CloudProviderSelector";
import { Icon } from "../shared/icons";

// Define staggered animation variants for child elements
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};

const ProfileSection: React.FC = () => {
  const { currentView, setCurrentView, isCloudConnected, cloudProvider } =
    useProfile();

  const { navigateToProfileView, currentProfileView } = useNavigation();
  const [showProviderSelector, setShowProviderSelector] = useState(false);
  const viewChangeTimestamp = useRef(Date.now());

  // Define profile view position map for spatial navigation
  const profileViewPositionMap: Record<string, number> = {
    home: 0,
    documents: 1,
    tags: 2,
    settings: 3,
  };

  // Get the transition direction based on the current and previous view
  const { direction, previous } = useTransitionDirection({
    current: currentView,
    positionMap: profileViewPositionMap,
  });

  // Update timestamp when view changes to enable entrance animations
  useEffect(() => {
    if (previous !== currentView) {
      viewChangeTimestamp.current = Date.now();
    }
  }, [currentView, previous]);

  // Synchronize with NavigationContext
  useEffect(() => {
    if (currentView !== currentProfileView) {
      navigateToProfileView(currentView);
    }
  }, [currentView, currentProfileView, navigateToProfileView]);

  // Enhanced transition parameters based on view
  const getTransitionParams = (view: string) => {
    const baseParams = {
      direction,
    };

    // Customize transition based on view
    switch (view) {
      case "home":
        return {
          ...baseParams,
          duration: 0.5, // slightly longer for the main profile view
          distance: 100, // more dramatic slide for the home view
        };
      case "documents":
        return {
          ...baseParams,
          duration: 0.45,
          distance: 90, // emphasize the document grid transition
        };
      case "tags":
        return {
          ...baseParams,
          duration: 0.4,
          distance: 80, // slightly more subtle for tags
        };
      case "settings":
        return {
          ...baseParams,
          duration: 0.5,
          distance: 90, // more pronounced for settings which has forms
        };
      default:
        return {
          ...baseParams,
          duration: 0.4,
          distance: 70,
        };
    }
  };

  // Show cloud connection view if not connected
  if (!isCloudConnected) {
    return (
      <Container>
        <EmptyStateContainer
          as={motion.div}
          variants={staggerContainerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <EmptyStateIcon as={motion.div} variants={staggerItemVariants}>
            <Icon name="Cloud" size="large" />
          </EmptyStateIcon>
          <EmptyStateTitle as={motion.div} variants={staggerItemVariants}>
            Connect to Cloud Storage
          </EmptyStateTitle>
          <EmptyStateText as={motion.div} variants={staggerItemVariants}>
            Connect to a cloud storage provider to store your documents securely
            and access all features.
          </EmptyStateText>
          <ButtonGroup as={motion.div} variants={staggerItemVariants}>
            <ConnectButton onClick={() => setShowProviderSelector(true)}>
              Select Provider
            </ConnectButton>
          </ButtonGroup>

          {/* Use ModalTransition for the cloud provider selector */}
          <ModalTransition
            isOpen={showProviderSelector}
            onClose={() => setShowProviderSelector(false)}
            maxWidth="500px"
            withPadding={false}
          >
            <CloudProviderSelector
              onClose={() => setShowProviderSelector(false)}
            />
          </ModalTransition>
        </EmptyStateContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageContainer>
        {/* Use AnimatePresence to handle view mounting/unmounting */}
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <PageTransition {...getTransitionParams("home")} key="profile-home">
              <ContentWrapper>
                <ActionBarWrapper>
                  <ProfileActionBar
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ProviderButton
                      onClick={() => setShowProviderSelector(true)}
                    >
                      <ProviderIcon>
                        <Icon name="Network" size="small" />
                      </ProviderIcon>
                      Change Provider
                    </ProviderButton>
                  </ProfileActionBar>
                  <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <ProfileHome onNavigate={setCurrentView} />
                  </motion.div>
                </ActionBarWrapper>
              </ContentWrapper>
            </PageTransition>
          )}

          {/* Documents Archive */}
          {currentView === "documents" && (
            <PageTransition
              {...getTransitionParams("documents")}
              key="profile-documents"
            >
              <ContentWrapper>
                <motion.div
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <DocumentsArchive onNavigate={setCurrentView} />
                </motion.div>
              </ContentWrapper>
            </PageTransition>
          )}

          {/* Tags Management */}
          {currentView === "tags" && (
            <PageTransition {...getTransitionParams("tags")} key="profile-tags">
              <ContentWrapper>
                <motion.div
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <TagsManagement onNavigate={setCurrentView} />
                </motion.div>
              </ContentWrapper>
            </PageTransition>
          )}

          {/* Processing Settings */}
          {currentView === "settings" && (
            <PageTransition
              {...getTransitionParams("settings")}
              key="profile-settings"
            >
              <ContentWrapper>
                <motion.div
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <ProcessingSettings onNavigate={setCurrentView} />
                </motion.div>
              </ContentWrapper>
            </PageTransition>
          )}
        </AnimatePresence>
      </PageContainer>

      {/* Use ModalTransition for the cloud provider selector */}
      <ModalTransition
        isOpen={showProviderSelector}
        onClose={() => setShowProviderSelector(false)}
        maxWidth="500px"
        withPadding={false}
      >
        <CloudProviderSelector onClose={() => setShowProviderSelector(false)} />
      </ModalTransition>
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
  background-color: transparent;
  position: relative;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: relative;

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

// New ContentWrapper to ensure consistent vertical centering
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.xl};
`;

const ActionBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text.primary};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px ${(props) => props.theme.colors.shadow}40;
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
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.primary}CC; /* 80% opacity */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${(props) => props.theme.colors.shadow};
  }
`;

export default ProfileSection;
