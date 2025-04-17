import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload } from "../../context/UploadContext";

const FilePreview: React.FC = () => {
  const { files, removeFile, goToNextStep, goToPreviousStep } = useUpload();

  // Falls keine Dateien vorhanden sind, zurück zur Auswahl
  React.useEffect(() => {
    if (files.length === 0) {
      goToPreviousStep();
    }
  }, [files, goToPreviousStep]);

  return (
    <Container>
      <Header>
        <Title>Preview & Confirm</Title>
        <SubTitle>
          {files.length} {files.length === 1 ? "image" : "images"} selected
        </SubTitle>
      </Header>

      <GridContainer>
        {files.map((file) => (
          <GridItem key={file.id} as={motion.div} layout>
            <PreviewImage src={file.preview} alt={file.name} />
            <FileName>{file.name}</FileName>
            <RemoveButton onClick={() => removeFile(file.id)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                />
              </svg>
            </RemoveButton>
          </GridItem>
        ))}
      </GridContainer>

      <ButtonGroup>
        <AddMoreButton onClick={goToPreviousStep}>Add More</AddMoreButton>
        <ContinueButton onClick={goToNextStep}>Continue</ContinueButton>
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
  margin-bottom: ${(props) => props.theme.spacing.xl};
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

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity ${(props) => props.theme.transitions.short};

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

const Button = styled.button`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: 4px;
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transition: all ${(props) => props.theme.transitions.short};
`;

const AddMoreButton = styled(Button)`
  background-color: transparent;
  color: ${(props) => props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.theme.colors.divider};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const ContinueButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}CC;
  }
`;

export default FilePreview;
