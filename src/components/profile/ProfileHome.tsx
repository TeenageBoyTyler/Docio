// src/components/profile/ProfileHome.tsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useProfile, ProfileView } from "../../context/ProfileContext";
// Importieren der standardisierten SyncIndicator-Komponente
import { SyncIndicator } from "../shared/loading";
import { Button } from "../shared/buttons";
// Import der standardisierten Navigation-Komponenten
import { HeaderContainer, Title } from "../shared/navigation";
// Import der Icon-Komponente
import { Icon } from "../shared/icons";

// Define enhanced staggered animation variants
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
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
  visible: {
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

// Animation variants for special elements
const navButtonVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      delay: 0.15 + custom * 0.08,
    },
  }),
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: {
      duration: 0.15,
    },
  },
  hover: {
    y: -5,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

const statValueVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (custom: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3 + custom * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 200,
    },
  }),
};

interface ProfileHomeProps {
  onNavigate: (view: ProfileView) => void;
}

const ProfileHome: React.FC<ProfileHomeProps> = ({ onNavigate }) => {
  const {
    documentCount,
    tagCount,
    cloudProvider,
    isCloudConnected,
    storage,
    lastActivity,
    syncStatus,
    forceSynchronize,
  } = useProfile();

  // Berechne die Speichernutzung in Prozent
  const storagePercentage = Math.min(
    Math.round((storage.used / storage.total) * 100),
    100
  );

  // Ermittle den Status für den SyncIndicator
  const getSyncStatus = () => {
    if (!isCloudConnected) return "offline";
    if (syncStatus.syncInProgress) return "syncing";
    if (syncStatus.lastSyncError) return "error";
    if (syncStatus.hasOfflineChanges) return "idle"; // Hier könnte auch ein spezieller Status verwendet werden
    return "success";
  };

  return (
    <Container
      as={motion.div}
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Add standardized HeaderContainer */}
      <HeaderContainer as={motion.div} variants={staggerItemVariants}>
        <Title>My Profile</Title>
      </HeaderContainer>

      <UserInfo as={motion.div} variants={staggerItemVariants}>
        <UserAvatar
          as={motion.div}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            delay: 0.2,
            duration: 0.6,
          }}
        >
          D
        </UserAvatar>
        <UserDetails>
          <UserName>Docio User</UserName>
          <UserEmail>Connected to {cloudProvider}</UserEmail>
        </UserDetails>
      </UserInfo>

      <StorageInfo as={motion.div} variants={staggerItemVariants}>
        <StorageHeader>
          <StorageTitle>Cloud Storage</StorageTitle>
          <StorageStatus>
            {isCloudConnected ? (
              <ConnectedStatus>Connected to {cloudProvider}</ConnectedStatus>
            ) : (
              <DisconnectedStatus>Not Connected</DisconnectedStatus>
            )}
          </StorageStatus>
        </StorageHeader>

        <StorageUsage>
          <UsageProgressBg>
            <UsageProgress
              width={0}
              as={motion.div}
              animate={{ width: `${storagePercentage}%` }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: [0.165, 0.84, 0.44, 1], // cubic-bezier easing for more polish
              }}
            />
          </UsageProgressBg>
          <UsageText>
            {storage.used} MB of {storage.total} MB used ({storagePercentage}%)
          </UsageText>
        </StorageUsage>

        {/* Standardisierter SyncIndicator statt eigener Implementation */}
        {isCloudConnected && (
          <SyncStatusContainer>
            <SyncIndicator
              status={getSyncStatus()}
              size="medium"
              showLabel={true}
              showWhenIdle={true}
              customLabels={{
                idle: syncStatus.hasOfflineChanges
                  ? "Pending changes will sync when online"
                  : "In Sync",
                syncing: "Synchronizing...",
                success: `Last synced: ${
                  syncStatus.lastSyncTime
                    ? new Date(syncStatus.lastSyncTime).toLocaleString()
                    : "Never"
                }`,
                error: "Sync failed",
                offline: "Offline",
              }}
            />

            {/* Sync-Button bei ausstehenden Änderungen */}
            {syncStatus.hasOfflineChanges && !syncStatus.syncInProgress && (
              <SyncButton
                onClick={forceSynchronize}
                as={motion.button}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  backgroundColor: "rgba(66, 133, 244, 0.1)",
                }}
              >
                Sync Now
              </SyncButton>
            )}
          </SyncStatusContainer>
        )}
      </StorageInfo>

      <StatsList as={motion.div} variants={staggerItemVariants}>
        <StatItem>
          <StatValue as={motion.span} variants={statValueVariants} custom={0}>
            {documentCount}
          </StatValue>
          <StatLabel>Documents</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue as={motion.span} variants={statValueVariants} custom={1}>
            {tagCount}
          </StatValue>
          <StatLabel>Tags</StatLabel>
        </StatItem>
      </StatsList>

      <NavSection as={motion.div} variants={staggerItemVariants}>
        <NavButton
          key="nav-documents"
          onClick={() => onNavigate("documents")}
          as={motion.button}
          variants={navButtonVariants}
          custom={0}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
        >
          <NavButtonIcon>
            <Icon name="FileText" size="medium" />
          </NavButtonIcon>
          <NavButtonText>My Documents</NavButtonText>
        </NavButton>

        <NavButton
          key="nav-tags"
          onClick={() => onNavigate("tags")}
          as={motion.button}
          variants={navButtonVariants}
          custom={1}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
        >
          <NavButtonIcon>
            <Icon name="Tags" size="medium" />
          </NavButtonIcon>
          <NavButtonText>My Tags</NavButtonText>
        </NavButton>

        <NavButton
          key="nav-settings"
          onClick={() => onNavigate("settings")}
          as={motion.button}
          variants={navButtonVariants}
          custom={2}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
        >
          <NavButtonIcon>
            <Icon name="Settings" size="medium" />
          </NavButtonIcon>
          <NavButtonText>Processing Settings</NavButtonText>
        </NavButton>
      </NavSection>

      <RecentActivity as={motion.div} variants={staggerItemVariants}>
        <SectionTitle>Recent Activity</SectionTitle>

        {lastActivity.length > 0 ? (
          <ActivityList>
            {lastActivity.slice(0, 5).map((activity, index) => (
              <ActivityItem
                key={`activity-${index}-${activity.timestamp}`}
                as={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.08 }}
              >
                <ActivityText>{activity.action}</ActivityText>
                <ActivityTime>
                  {new Date(activity.timestamp).toLocaleString()}
                </ActivityTime>
              </ActivityItem>
            ))}
          </ActivityList>
        ) : (
          <EmptyActivity>No recent activity</EmptyActivity>
        )}
      </RecentActivity>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${(props) => props.theme.borderRadius.circle};
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.background};
  margin-right: ${(props) => props.theme.spacing.lg};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const UserEmail = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const StorageInfo = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StorageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const StorageTitle = styled.h4`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`;

const StorageStatus = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
`;

const ConnectedStatus = styled.span`
  color: ${(props) => props.theme.colors.success};
`;

const DisconnectedStatus = styled.span`
  color: ${(props) => props.theme.colors.error};
`;

const StorageUsage = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
`;

interface UsageProgressProps {
  width: number;
}

const UsageProgressBg = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  overflow: hidden;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const UsageProgress = styled.div<UsageProgressProps>`
  width: ${(props) => props.width}%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width ${(props) => props.theme.transitions.medium};
`;

const UsageText = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`;

// Neuer Container für den SyncIndicator
const SyncStatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${(props) => props.theme.spacing.md};
  padding-top: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.divider};
`;

const SyncButton = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}20;
    transform: translateY(-2px);
  }
`;

const StatsList = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  text-align: left;
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.primary}20; /* 12% opacity */
  }
`;

const NavButtonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  margin-right: ${(props) => props.theme.spacing.md};
`;

const NavButtonText = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
`;

const RecentActivity = styled.div``;

const SectionTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityText = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ActivityTime = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const EmptyActivity = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

export default ProfileHome;
