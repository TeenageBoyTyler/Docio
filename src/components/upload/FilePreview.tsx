import React from "react";
import styled from "styled-components";
import { motion, Variants } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
// Standardized imports from index files
import { Button, IconButton } from "../shared/buttons";

interface FilePreviewProps {
  onAddMore?: () => void; // Optional callback for Add More functionality
}

const FilePreview: React.FC<FilePreviewProps> = ({ onAddMore }) => {
  const { files, removeFile, goToNextStep, goToPreviousStep, clearFiles } =
    useUpload();

  // Falls keine Dateien vorhanden sind, zurück zur Auswahl
  React.useEffect(() => {
    if (files.length === 0) {
      goToPreviousStep();
    }
  }, [files, goToPreviousStep]);

  // Handle "Add More" functionality
  const handleAddMore = () => {
    if (onAddMore) {
      // Use the provided callback if available
      onAddMore();
    } else {
      // Fallback to previous behavior
      goToPreviousStep();
    }
  };

  // Handle cancel upload
  const handleCancelUpload = () => {
    clearFiles();
  };

  // Animation variants for staggered animation of grid items
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.08, // Stagger delay between items
        delayChildren: 0.1, // Initial delay before starting children animations
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1, // Reverse stagger on exit
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.97,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animation variants for header
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animation variants for buttons
  const buttonGroupVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + files.length * 0.08, // Delay until after grid items
        duration: 0.4,
        ease: "easeOut",
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

  return (
    <Container>
      <Header
        as={motion.div}
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* No back button as requested */}
        <TitleContainer>
          <Title>Preview & Confirm</Title>
          <SubTitle>
            {files.length} {files.length === 1 ? "image" : "images"} selected
          </SubTitle>
        </TitleContainer>
      </Header>

      <GridContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {files.map((file) => (
          <GridItem
            key={file.id}
            as={motion.div}
            layout
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <PreviewImage src={file.preview} alt={file.name} />
            <FileName>{file.name}</FileName>
            <RemoveButton
              iconName="X"
              onClick={() => removeFile(file.id)}
              size="small"
              variant="text"
              aria-label={`Remove ${file.name}`}
            />
          </GridItem>
        ))}
      </GridContainer>

      <ButtonGroup
        as={motion.div}
        variants={buttonGroupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CancelButton variant="text" onClick={handleCancelUpload}>
          Cancel Upload
        </CancelButton>
        <RightButtonGroup>
          <Button variant="text" onClick={handleAddMore}>
            Add More
          </Button>
          <Button variant="primary" onClick={goToNextStep}>
            Continue
          </Button>
        </RightButtonGroup>
      </ButtonGroup>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.lg};
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.xl};
  position: relative;
`;

const TitleContainer = styled.div`
  flex: 1;
  text-align: center;
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const SubTitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.xl};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const GridItem = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 85%;
  object-fit: cover;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const FileName = styled.div`
  padding: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 15%;
  display: flex;
  align-items: center;
`;

// Fixed: Replace inline styles with styled component
const RemoveButton = styled(IconButton)`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.md};
  }
`;

// New component for right-aligned buttons
const RightButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    justify-content: space-between;
  }
`;

// Cancel button with optional styling
const CancelButton = styled(Button)`
  color: ${(props) => props.theme.colors.error};

  &:hover {
    background-color: rgba(244, 67, 54, 0.08);
  }
`;

export default FilePreview;
