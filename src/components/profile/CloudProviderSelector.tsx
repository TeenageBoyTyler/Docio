// src/components/profile/CloudProviderSelector.tsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useProfile, CloudProvider } from "../../context/ProfileContext";
// Import the Icon component
import { Icon } from "../shared/icons";
import { HeaderContainer, Title } from "../shared/navigation";

interface CloudProviderSelectorProps {
  onClose: () => void;
}

const CloudProviderSelector: React.FC<CloudProviderSelectorProps> = ({
  onClose,
}) => {
  const {
    connectToCloud,
    disconnectFromCloud,
    isCloudConnected,
    cloudProvider,
  } = useProfile();

  const handleProviderSelect = async (provider: CloudProvider) => {
    if (isCloudConnected) {
      await disconnectFromCloud();
    }
    await connectToCloud(provider);
    onClose();
  };

  const handleDisconnect = async () => {
    await disconnectFromCloud();
    onClose();
  };

  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <Header>
        <Title>Select Cloud Provider</Title>
        <CloseButton onClick={onClose}>×</CloseButton>
      </Header>

      <ProvidersList>
        <ProviderItem
          isActive={cloudProvider === "dropbox"}
          onClick={() => handleProviderSelect("dropbox")}
        >
          <ProviderIcon>
            {/* Replace SVG with Icon component */}
            <Icon name="FileText" size="medium" />
          </ProviderIcon>
          <ProviderName>Dropbox</ProviderName>
          {cloudProvider === "dropbox" && (
            <ActiveIndicator>Connected</ActiveIndicator>
          )}
        </ProviderItem>

        <ProviderItem
          isActive={cloudProvider === "mock"}
          onClick={() => handleProviderSelect("mock")}
        >
          <ProviderIcon>
            {/* Replace SVG with Icon component */}
            <Icon name="Monitor" size="medium" />
          </ProviderIcon>
          <ProviderName>Mock Provider (For Testing)</ProviderName>
          {cloudProvider === "mock" && (
            <ActiveIndicator>Connected</ActiveIndicator>
          )}
        </ProviderItem>

        {isCloudConnected && (
          <DisconnectButton onClick={handleDisconnect}>
            Disconnect from Cloud
          </DisconnectButton>
        )}
      </ProvidersList>

      <Footer>
        <InfoText>
          The Mock Provider simulates cloud storage locally for testing
        </InfoText>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: 0 4px 12px ${(props) => props.theme.colors.shadow};
  width: 100%;
  max-width: 500px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${(props) => props.theme.borderRadius.circle};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const ProvidersList = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

interface ProviderItemProps {
  isActive: boolean;
}

const ProviderItem = styled.button<ProviderItemProps>`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.primary + "20"
      : props.theme.colors.background};
  border: 1px solid
    ${(props) => (props.isActive ? props.theme.colors.primary : "transparent")};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) =>
      props.isActive
        ? props.theme.colors.primary + "30"
        : props.theme.colors.background};
    transform: translateY(-2px);
  }
`;

const ProviderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  margin-right: ${(props) => props.theme.spacing.md};
`;

const ProviderName = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.primary};
  flex: 1;
`;

const ActiveIndicator = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.success};
  background-color: ${(props) => props.theme.colors.success + "20"};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
`;

const DisconnectButton = styled.button`
  align-self: center;
  margin-top: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.colors.error};
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: background-color ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.error + "10"};
  }
`;

const Footer = styled.div`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.divider};
  background-color: ${(props) => props.theme.colors.background};
`;

const InfoText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
  text-align: center;
`;

export default CloudProviderSelector;
