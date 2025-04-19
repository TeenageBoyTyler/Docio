import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload, ProcessedDocument } from "../../context/UploadContext";
import {
  processFiles,
  ProcessingResult,
  saveProcessingResults,
  initializeModels,
} from "../../services/processingService";
import { useToast } from "../../context/ToastContext";

const ProcessingView: React.FC = () => {
  const { files, goToNextStep, goToPreviousStep, setProcessedDocuments } =
    useUpload();
  const { showToast } = useToast();

  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startProcessing = async () => {
      try {
        // Initialize models
        await initializeModels();

        // Start processing files
        const processingResults = await processFiles(
          files,
          (processed, total, result) => {
            setProgress((processed / total) * 100);
            setCurrentFile(processed);
          }
        );

        // Save results
        saveProcessingResults(processingResults);

        // Store results in UploadContext
        const processedDocs: ProcessedDocument[] = processingResults.map(
          (result) => ({
            fileId: result.fileId,
            ocr: result.ocr?.text || "",
            tags: result.detections?.map((detection) => detection.class) || [],
            confidence: result.ocr?.confidence || 0,
          })
        );

        setProcessedDocuments(processedDocs);
        setIsProcessing(false);

        // Automatically proceed to next step after short delay
        setTimeout(() => {
          goToNextStep();
        }, 500);
      } catch (err) {
        console.error("Processing error:", err);
        setError("Processing failed. Please try again.");
        showToast("Processing failed. Try again.", "error");
        setIsProcessing(false);
      }
    };

    if (files.length > 0) {
      startProcessing();
    } else {
      goToPreviousStep();
    }
  }, [files, goToNextStep, goToPreviousStep, showToast, setProcessedDocuments]);

  // Retry if error occurs
  const handleRetry = () => {
    setProgress(0);
    setCurrentFile(0);
    setError(null);
    setIsProcessing(true);
  };

  // Render only the loading bar for processing
  return (
    <Container>
      <ProgressContainer>
        <ProgressBar
          as={motion.div}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressContainer>

      {error && <RetryButton onClick={handleRetry}>Try Again</RetryButton>}
    </Container>
  );
};

// Simplified styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.xl};
`;

const ProgressContainer = styled.div`
  width: 90%;
  max-width: 600px;
  height: 8px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
`;

const RetryButton = styled.button`
  margin-top: ${(props) => props.theme.spacing.lg};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.fontSize.md};
`;

export default ProcessingView;
