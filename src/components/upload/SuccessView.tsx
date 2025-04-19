import React from "react";
import styled from "styled-components";
import { useUpload } from "../../context/UploadContext";
import { useNavigation } from "../../context/NavigationContext";
// Standardized imports
import { Button } from "../shared/buttons";
import { Icon } from "../shared/icons";

const SuccessView: React.FC = () => {
  const { clearFiles } = useUpload();
  const {
    navigateToDocuments,
    navigateToSearch,
    navigateToProfileView,
    navigateToSection,
  } = useNavigation();

  // Handle actions after upload
  const handleViewDocuments = () => {
    console.log("View Documents clicked - navigating to Documents Archive");
    // Direct method - explicitly set the navigation state
    navigateToProfileView("documents");
    navigateToSection("profile");
  };

  const handleUploadMore = () => {
    clearFiles();
  };

  const handleSearchDocuments = () => {
    navigateToSearch();
  };

  return (
    <Container>
      <ContentContainer>
        <IconWrapper>
          <Icon
            name="CheckCircle"
            size="large"
            color="#03DAC6" // Success color
          />
        </IconWrapper>

        <Title>Upload Complete!</Title>

        <ButtonsContainer>
          <Button variant="primary" onClick={handleViewDocuments} fullWidth>
            View Documents
          </Button>

          <Button variant="secondary" onClick={handleUploadMore} fullWidth>
            Upload More
          </Button>

          <Button variant="text" onClick={handleSearchDocuments} fullWidth>
            Search Documents
          </Button>
        </ButtonsContainer>
      </ContentContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.xl};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: ${(props) => props.theme.spacing.lg};
  color: #03dac6; // Success color
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.text.primary};
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  width: 100%;
`;

export default SuccessView;
