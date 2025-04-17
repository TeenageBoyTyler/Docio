// src/components/profile/ProfileHome.tsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useProfile, ProfileView } from "../../context/ProfileContext";
// Importieren der standardisierten SyncIndicator-Komponente
import { SyncIndicator } from "../shared/loading";
import { Button } from "../shared/buttons";

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
    <Container>
      <Header>
        <UserInfo>
          <UserAvatar>D</UserAvatar>
          <UserDetails>
            <UserName>Docio User</UserName>
            <UserEmail>Connected to {cloudProvider}</UserEmail>
          </UserDetails>
        </UserInfo>
      </Header>

      <StorageInfo>
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
            <UsageProgress width={storagePercentage} />
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
              showLabel
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
              <SyncButton onClick={forceSynchronize}>Sync Now</SyncButton>
            )}
          </SyncStatusContainer>
        )}
      </StorageInfo>

      <StatsList>
        <StatItem>
          <StatValue>{documentCount}</StatValue>
          <StatLabel>Documents</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{tagCount}</StatValue>
          <StatLabel>Tags</StatLabel>
        </StatItem>
      </StatsList>

      <NavSection>
        <NavButton onClick={() => onNavigate("documents")}>
          <NavButtonIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </NavButtonIcon>
          <NavButtonText>My Documents</NavButtonText>
        </NavButton>

        <NavButton onClick={() => onNavigate("tags")}>
          <NavButtonIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5H2v7l6.29 6.29c.39.39 1.02.39 1.41 0l6.3-6.3a1 1 0 0 0 0-1.41l-6.29-6.29A1 1 0 0 0 9 5Z" />
              <path d="M6 9.01V9" />
              <path d="m15 5 6.3 6.3a1 1 0 0 1 0 1.4l-6.3 6.3a1 1 0 0 1-1.4 0L7.7 13" />
            </svg>
          </NavButtonIcon>
          <NavButtonText>My Tags</NavButtonText>
        </NavButton>

        <NavButton onClick={() => onNavigate("settings")}>
          <NavButtonIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </NavButtonIcon>
          <NavButtonText>Processing Settings</NavButtonText>
        </NavButton>
      </NavSection>

      <RecentActivity>
        <SectionTitle>Recent Activity</SectionTitle>

        {lastActivity.length > 0 ? (
          <ActivityList>
            {lastActivity.slice(0, 5).map((activity, index) => (
              <ActivityItem key={index}>
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

const Header = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
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

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}20;
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
  transition: background-color ${(props) => props.theme.transitions.short};

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
