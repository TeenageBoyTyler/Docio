import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload } from "../../context/UploadContext";
// Importieren der standardisierten Button-Komponenten
import { Button, IconButton } from "../shared/buttons";

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
            <IconButton
              icon={
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
              }
              onClick={() => removeFile(file.id)}
              size="small"
              variant="text"
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                opacity: "0.7",
              }}
            />
          </GridItem>
        ))}
      </GridContainer>

      <ButtonGroup>
        <Button variant="text" onClick={goToPreviousStep}>
          Add More
        </Button>
        <Button variant="primary" onClick={goToNextStep}>
          Continue
        </Button>
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

export default FilePreview;
