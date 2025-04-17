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
  const { files, goToNextStep, goToPreviousStep } = useUpload();
  const { showToast } = useToast();

  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { setProcessedDocuments } = useUpload();

  useEffect(() => {
    const startProcessing = async () => {
      try {
        // Initialisiere die Modelle
        await initializeModels();

        // Starte die Verarbeitung der Dateien
        const processingResults = await processFiles(
          files,
          (processed, total, result) => {
            setProgress((processed / total) * 100);
            setCurrentFile(processed);
            if (result) {
              setResults((prev) => [...prev, result]);
            }
          }
        );

        // Speichere die Ergebnisse
        saveProcessingResults(processingResults);

        // Speichere die Ergebnisse im UploadContext
        const processedDocs: ProcessedDocument[] = processingResults.map(
          (result) => ({
            fileId: result.fileId,
            ocr: result.ocr?.text || "",
            tags: result.detections?.map((detection) => detection.class) || [],
            confidence: result.ocr?.confidence || 0,
          })
        );

        setProcessedDocuments(processedDocs);

        // Verarbeitung abgeschlossen
        setIsProcessing(false);

        // Automatisch zum nächsten Schritt nach kurzer Verzögerung
        setTimeout(() => {
          goToNextStep();
        }, 1500);
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
      // Falls keine Dateien vorhanden sind, zurück zum vorherigen Schritt
      goToPreviousStep();
    }
  }, [files, goToNextStep, goToPreviousStep, showToast]);

  // Lade nochmal, falls ein Fehler auftritt
  const handleRetry = () => {
    setProgress(0);
    setCurrentFile(0);
    setResults([]);
    setError(null);
    setIsProcessing(true);
  };

  return (
    <Container>
      <ProcessingContent>
        <ProcessingIcon isProcessing={isProcessing}>
          {isProcessing ? (
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill="currentColor"
              />
              <path d="M12 6V12L16 14" fill="currentColor" />
            </svg>
          ) : error ? (
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
                fill="currentColor"
              />
            </svg>
          )}
        </ProcessingIcon>

        <Title>
          {error
            ? "Processing Failed"
            : isProcessing
            ? "Processing Documents"
            : "Processing Complete"}
        </Title>

        <Description>
          {error
            ? "There was an error processing your documents. Please try again."
            : isProcessing
            ? `Analyzing documents (${currentFile}/${files.length}). This may take a moment.`
            : "All documents have been successfully processed."}
        </Description>

        {isProcessing && (
          <ProgressContainer>
            <ProgressBar
              as={motion.div}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </ProgressContainer>
        )}

        {error && <RetryButton onClick={handleRetry}>Try Again</RetryButton>}

        {!isProcessing && !error && (
          <ProcessingSummary>
            <SummaryItem>
              <SummaryLabel>Documents Processed:</SummaryLabel>
              <SummaryValue>{files.length}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Text Extracted:</SummaryLabel>
              <SummaryValue>
                {results.filter((r) => r.ocr?.text).length} documents
              </SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Objects Detected:</SummaryLabel>
              <SummaryValue>
                {results.reduce(
                  (total, r) => total + (r.detections?.length || 0),
                  0
                )}{" "}
                objects
              </SummaryValue>
            </SummaryItem>
          </ProcessingSummary>
        )}
      </ProcessingContent>
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

const ProcessingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 500px;
`;

interface ProcessingIconProps {
  isProcessing: boolean;
}

const ProcessingIcon = styled.div<ProcessingIconProps>`
  color: ${(props) =>
    props.isProcessing
      ? props.theme.colors.primary
      : props.theme.colors.success};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  animation: ${(props) =>
    props.isProcessing ? "spin 2s linear infinite" : "none"};

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text.primary};
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
`;

const RetryButton = styled.button`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  margin-top: ${(props) => props.theme.spacing.md};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}CC;
  }
`;

const ProcessingSummary = styled.div`
  width: 100%;
  margin-top: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

const SummaryValue = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

export default ProcessingView;
