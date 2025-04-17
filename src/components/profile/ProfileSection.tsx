import React from 'react';
import styled from 'styled-components';

const ProfileSection: React.FC = () => {
  return (
    <Container>
      <UserInfo>
        <UserAvatar>D</UserAvatar>
        <UserDetails>
          <UserName>Docio User</UserName>
          <UserEmail>user@example.com</UserEmail>
        </UserDetails>
      </UserInfo>
      
      <StorageInfo>
        <StorageTitle>Cloud Storage</StorageTitle>
        <StorageStatus>Connected to Dropbox</StorageStatus>
      </StorageInfo>
      
      <StatsList>
        <StatItem>
          <StatValue>124</StatValue>
          <StatLabel>Documents</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>15</StatValue>
          <StatLabel>Tags</StatLabel>
        </StatItem>
      </StatsList>
      
      <NavSection>
        <NavButton>My Documents</NavButton>
        <NavButton>My Tags</NavButton>
        <NavButton>Processing Settings</NavButton>
      </NavSection>
      
      <RecentActivity>
        <SectionTitle>Recent Activity</SectionTitle>
        <ActivityItem>
          <ActivityText>Uploaded 5 documents</ActivityText>
          <ActivityTime>Today</ActivityTime>
        </ActivityItem>
        <ActivityItem>
          <ActivityText>Created tag "Invoices"</ActivityText>
          <ActivityTime>Yesterday</ActivityTime>
        </ActivityItem>
      </RecentActivity>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${props => props.theme.spacing.xl};
  overflow-y: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.circle};
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.background};
  margin-right: ${props => props.theme.spacing.lg};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const UserEmail = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const StorageInfo = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StorageTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StorageStatus = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.success};
  display: flex;
  align-items: center;
`;

const StatsList = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const NavButton = styled.button`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: left;
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  transition: background-color ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}20; /* 12% opacity */
  }
`;

const RecentActivity = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.divider};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
`;

const ActivityTime = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

export default ProfileSection;