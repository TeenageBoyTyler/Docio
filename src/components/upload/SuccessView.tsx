import React from "react";
import styled from "styled-components";
import { motion, Variants } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
import { useNavigation } from "../../context/NavigationContext";
// Standardized imports
import { Button } from "../shared/buttons";
import { Icon } from "../shared/icons";

const SuccessView: React.FC = () => {
  const { clearFiles, files } = useUpload();
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

  // Animation variants for success content
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Success checkmark animation
  const checkmarkVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      rotate: -30,
    },
    visible: {
      opacity: 1,
      scale: [0.5, 1.2, 1],
      rotate: [0, 5, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Title animation
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  // Button container animation
  const buttonContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Individual button animation
  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Summary animation
  const summaryVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.4,
      },
    },
  };

  return (
    <Container
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ContentContainer>
        <IconWrapper as={motion.div} variants={checkmarkVariants}>
          <Icon
            name="CheckCircle"
            size="large"
            color="#03DAC6" // Success color
          />
        </IconWrapper>

        <Title as={motion.h2} variants={titleVariants}>
          Upload Complete!
        </Title>

        <SummaryContainer as={motion.div} variants={summaryVariants}>
          <SummaryItem>
            <SummaryLabel>
              {files.length} {files.length === 1 ? "document" : "documents"}{" "}
              uploaded successfully
            </SummaryLabel>
          </SummaryItem>
        </SummaryContainer>

        <ButtonsContainer as={motion.div} variants={buttonContainerVariants}>
          <motion.div variants={buttonVariants} whileHover="hover">
            <Button variant="primary" onClick={handleViewDocuments} fullWidth>
              View Documents
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover">
            <Button variant="secondary" onClick={handleUploadMore} fullWidth>
              Upload More
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover">
            <Button variant="text" onClick={handleSearchDocuments} fullWidth>
              Search Documents
            </Button>
          </motion.div>
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
  width: 80px;
  height: 80px;
  margin-bottom: ${(props) => props.theme.spacing.lg};
  color: #03dac6; // Success color
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.text.primary};
  text-align: center;
`;

// New component for summary information
const SummaryContainer = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const SummaryLabel = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  width: 100%;
`;

export default SuccessView;
