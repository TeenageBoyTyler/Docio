import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUpload, ProcessedDocument } from "../../context/UploadContext";
import {
  cloudStorage,
  MetadataStorage,
} from "../../services/cloudStorageService";
import { useToast } from "../../context/ToastContext";
// Standardized imports from index files
import { Button } from "../shared/buttons";
import { LoadingOverlay, SyncIndicator } from "../shared/loading";
import { BackButton, BackButtonContainer } from "../shared/navigation";
import { Icon } from "../shared/icons";

const CloudUploadView: React.FC = () => {
  const { files, processedDocuments, goToNextStep, goToPreviousStep } =
    useUpload();
  const { showToast } = useToast();

  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [isUploading, setIsUploading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  // Sync status für SyncIndicator
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error" | "offline"
  >("idle");

  // Prüfe die Verbindung zur Cloud beim Laden
  useEffect(() => {
    const checkConnection = async () => {
      const connected = cloudStorage.isConnected();
      setIsConnected(connected);

      if (connected) {
        setProvider(cloudStorage.getCurrentProvider());
        setSyncStatus("idle");
      } else {
        showToast(
          "Not connected to cloud storage. Please connect first.",
          "warning"
        );
        setError("Cloud storage not connected");
        setIsUploading(false);
        setSyncStatus("offline");
      }
    };

    checkConnection();
  }, [showToast]);

  // Starte den Upload-Prozess
  useEffect(() => {
    const uploadFiles = async () => {
      if (!isConnected || files.length === 0) {
        return;
      }

      try {
        // Setze Sync-Status auf "Syncing"
        setSyncStatus("syncing");

        // Lade vorhandene Metadaten
        let metadata = await cloudStorage.loadMetadata();
        if (!metadata) {
          metadata = { documents: {} };
        }

        // Bereite den Ordnerpfad vor - verwende das aktuelle Datum
        const today = new Date();
        const folderPath = `documents/${today.getFullYear()}/${(
          today.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}`;

        // Versuche, jede Datei hochzuladen
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setCurrentFile(i + 1);
          setProgress(((i + 1) / files.length) * 100);

          // Finde die verarbeiteten Informationen für diese Datei
          const processedDoc = processedDocuments.find(
            (doc) => doc.fileId === file.id
          );

          // Datei hochladen
          const result = await cloudStorage.uploadFile(
            file as File,
            folderPath
          );

          // Speichere Metadaten, wenn der Upload erfolgreich war
          if (result.success && result.file && processedDoc) {
            metadata.documents[file.id] = {
              id: file.id,
              path: result.file.path,
              tags: [...file.tags.map((tag) => tag.name), ...processedDoc.tags],
              ocr: processedDoc.ocr || "",
              detections: processedDoc.tags || [],
              uploadDate: today.toISOString(),
            };

            // Speichere Metadaten nach jedem erfolgreichen Upload
            // Dies hilft, den Fortschritt zu sichern, falls etwas schiefgeht
            await cloudStorage.saveMetadata(metadata);
          } else if (!result.success) {
            showToast(`Error uploading ${file.name}: ${result.error}`, "error");
          }
        }

        // Erfolgreicher Abschluss
        setIsUploading(false);
        setSyncStatus("success");

        // Automatisch zum nächsten Schritt nach kurzer Verzögerung
        setTimeout(() => {
          goToNextStep();
        }, 1500);
      } catch (err) {
        console.error("Upload error:", err);
        setError("Cloud upload failed. Please try again.");
        showToast("Connection lost. Retry.", "error");
        setIsUploading(false);
        setSyncStatus("error");
      }
    };

    if (isConnected && files.length > 0 && isUploading) {
      uploadFiles();
    }
  }, [
    isConnected,
    files,
    processedDocuments,
    isUploading,
    goToNextStep,
    showToast,
  ]);

  // Handler für die Verbindung zur Cloud
  const handleConnectCloud = async () => {
    const success = await cloudStorage.connect("dropbox");
    if (!success) {
      showToast("Couldn't connect to Cloud Service.", "error");
      setSyncStatus("error");
    }
  };

  // Handler für erneuten Versuch
  const handleRetry = () => {
    setProgress(0);
    setCurrentFile(0);
    setError(null);
    setIsUploading(true);
    setSyncStatus("idle");
  };

  return (
    <Container>
      {/* Use the standardized BackButtonContainer component */}
      {(!isUploading || error) && (
        <BackButtonContainer position="absolute">
          <BackButton
            onClick={goToPreviousStep}
            showLabel={false}
            label="Back to Previous Step"
            variant="text"
          />
        </BackButtonContainer>
      )}

      {/* Vollbild-Loading-Overlay zeigen, wenn Upload läuft */}
      <LoadingOverlay
        isVisible={isUploading && isConnected}
        text={`Uploading document ${currentFile} of ${files.length}`}
        blockInteraction={true}
        opacity={0.7}
      />

      <UploadContent>
        <StatusIconContainer>
          {!isConnected ? (
            <CloudIconWrapper>
              <Icon name="Cloud" size="large" color="currentColor" />
            </CloudIconWrapper>
          ) : (
            <SyncIndicator
              status={syncStatus}
              size="large"
              showLabel
              showWhenIdle={true}
              customLabels={{
                idle: "Ready to Upload",
                syncing: `Uploading (${currentFile}/${files.length})`,
                success: "Upload Complete",
                error: "Upload Failed",
              }}
            />
          )}
        </StatusIconContainer>

        <Title>
          {!isConnected
            ? "Connect to Cloud Storage"
            : error
            ? "Upload Failed"
            : isUploading
            ? "Uploading to Cloud Storage"
            : "Upload Complete"}
        </Title>

        <Description>
          {!isConnected
            ? "Please connect to a cloud storage provider to store your documents securely."
            : error
            ? "There was an error uploading your documents. Please try again."
            : isUploading
            ? `Uploading documents to ${provider} (${currentFile}/${files.length})`
            : "All documents have been successfully uploaded to your cloud storage."}
        </Description>

        {isUploading && isConnected && (
          <ProgressContainer>
            <ProgressBar
              as={motion.div}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </ProgressContainer>
        )}

        {!isConnected && (
          <Button variant="primary" onClick={handleConnectCloud} fullWidth>
            Connect to Dropbox
          </Button>
        )}

        {error && (
          <Button variant="primary" onClick={handleRetry} fullWidth>
            Try Again
          </Button>
        )}

        {!isUploading && !error && isConnected && (
          <UploadSummary>
            <SummaryItem>
              <SummaryLabel>Documents Uploaded:</SummaryLabel>
              <SummaryValue>{files.length}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Cloud Provider:</SummaryLabel>
              <SummaryValue>{provider}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Storage Location:</SummaryLabel>
              <SummaryValue>
                /documents/{new Date().toISOString().split("T")[0]}/
              </SummaryValue>
            </SummaryItem>
          </UploadSummary>
        )}
      </UploadContent>
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
  position: relative;
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const StatusIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

// Fixed: Proper icon wrapper that doesn't manipulate the internal structure
const CloudIconWrapper = styled.div`
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
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

const UploadSummary = styled.div`
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

export default CloudUploadView;
