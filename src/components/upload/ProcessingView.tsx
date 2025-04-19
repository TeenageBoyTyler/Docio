import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, useAnimation, Variants } from "framer-motion";
import { useUpload, ProcessedDocument } from "../../context/UploadContext";
import {
  processFiles,
  ProcessingResult,
  saveProcessingResults,
  initializeModels,
} from "../../services/processingService";
import { processUploadedFiles } from "../../services/FileUploadService";
import { useToast } from "../../context/ToastContext";
// Standardized imports
import { Button } from "../shared/buttons";
import { LoadingText } from "../shared/loading";
import { Icon } from "../shared/icons";

const ProcessingView: React.FC = () => {
  const { files, goToNextStep, goToPreviousStep, setProcessedDocuments } =
    useUpload();
  const { showToast } = useToast();

  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation controls for progress pulse effects
  const progressControls = useAnimation();
  const containerControls = useAnimation();

  // Container animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // Progress container variants
  const progressContainerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  // Icon container variants
  const iconContainerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  // Text variants
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 5,
      transition: { duration: 0.2 },
    },
  };

  // Button variants
  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  // Run progress bar pulse animation when progress changes
  useEffect(() => {
    if (isProcessing) {
      progressControls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.4 },
      });
    }
  }, [progress, progressControls, isProcessing]);

  useEffect(() => {
    let isMounted = true; // For avoiding state updates after unmount

    const startProcessing = async () => {
      try {
        if (!files || files.length === 0) {
          goToPreviousStep();
          return;
        }

        // Start the container appearing animation
        containerControls.start("visible");

        console.log("Starting processing with files:", files);

        // Initialize models first
        await initializeModels();
        console.log("Models initialized successfully");

        // Files should already be in the FileUploadService cache from previous steps
        // But let's process them again just to be sure
        const uploadedFiles = await processUploadedFiles(files);
        if (!isMounted) return; // Exit if component unmounted

        console.log(
          "Files processed and converted to data URLs:",
          uploadedFiles.length
        );

        // Extract file IDs for processing
        const fileIds = uploadedFiles.map((file) => file.id);
        console.log("File IDs to process:", fileIds);

        // Process the files using only IDs
        const processingResults = await processFiles(
          fileIds,
          (processed, total, result) => {
            if (!isMounted) return; // Avoid updating state if unmounted

            setProgress((processed / total) * 100);
            setCurrentFile(processed);

            if (result) {
              console.log(
                `Progress: ${processed}/${total}, File: ${result.fileId}`,
                {
                  ocrTextLength: result.ocr?.text.length || 0,
                  detections: result.detections?.length || 0,
                  error: result.error || "none",
                }
              );
            }
          }
        );

        if (!isMounted) return; // Exit if component unmounted

        console.log(
          "Processing complete with results:",
          processingResults.length
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
          if (isMounted) {
            goToNextStep();
          }
        }, 1000);
      } catch (err) {
        console.error("Processing error:", err);

        if (isMounted) {
          setError("Processing failed. Please try again.");
          showToast("Processing failed. Try again.", "error");
          setIsProcessing(false);
        }
      }
    };

    // Start processing as soon as the component mounts
    startProcessing();

    return () => {
      isMounted = false; // Prevent state updates if component unmounts during processing
    };
  }, [
    files,
    goToNextStep,
    goToPreviousStep,
    showToast,
    setProcessedDocuments,
    containerControls,
  ]);

  // Retry if error occurs
  const handleRetry = () => {
    setProgress(0);
    setCurrentFile(0);
    setError(null);
    setIsProcessing(true);
  };

  return (
    <Container
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate={containerControls}
      exit="exit"
    >
      {isProcessing ? (
        <>
          <IconContainer as={motion.div} variants={iconContainerVariants}>
            <ProcessingIcon>
              <Icon name="Cpu" size="large" color="currentColor" />
            </ProcessingIcon>
          </IconContainer>

          <StatusText as={motion.div} variants={textVariants}>
            {currentFile > 0 ? (
              <ProcessingText>
                Processing document {currentFile} of {files.length}
              </ProcessingText>
            ) : (
              <ProcessingText>Initializing processing...</ProcessingText>
            )}
          </StatusText>

          <ProgressContainer
            as={motion.div}
            variants={progressContainerVariants}
            animate={progressControls}
          >
            <ProgressBar
              as={motion.div}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </ProgressContainer>
        </>
      ) : error ? (
        <>
          <IconContainer
            as={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ErrorIcon>
              <Icon name="AlertTriangle" size="large" color="currentColor" />
            </ErrorIcon>
          </IconContainer>

          <StatusText
            as={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ErrorText>{error}</ErrorText>
          </StatusText>

          <RetryButton
            as={motion.button}
            variants={buttonVariants}
            whileHover="hover"
            onClick={handleRetry}
          >
            Try Again
          </RetryButton>
        </>
      ) : null}
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.xl};
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ProcessingIcon = styled.div`
  color: ${(props) => props.theme.colors.primary};
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorIcon = styled.div`
  color: ${(props) => props.theme.colors.error};
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StatusText = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
  text-align: center;
`;

const ProcessingText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ErrorText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  color: ${(props) => props.theme.colors.error};
`;

const ProgressContainer = styled.div`
  width: 90%;
  max-width: 600px;
  height: 8px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
`;

const RetryButton = styled(Button).attrs({ variant: "primary" })`
  margin-top: ${(props) => props.theme.spacing.lg};
  min-width: 150px;
`;

export default ProcessingView;
