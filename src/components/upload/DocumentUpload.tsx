import React, { useState, useEffect } from "react";
import {
  processUploadedFiles,
  UploadedFile,
  clearUploadedFiles,
} from "../../services/FileUploadService";
import {
  processFiles,
  ProcessingResult,
  initializeModels,
} from "../../services/processingService";
import { Spinner } from "../../components/shared/loading";

const DocumentUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Initialize models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      try {
        await initializeModels();
        setIsModelLoaded(true);
        console.log("Models initialized successfully");
      } catch (error) {
        console.error("Failed to initialize models:", error);
      }
    };

    loadModels();

    // Clean up when component unmounts
    return () => {
      clearUploadedFiles();
    };
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    try {
      // Process the uploaded files immediately to data URLs
      const uploadedFiles = await processUploadedFiles(event.target.files);
      setFiles((prev) => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    }
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) return;

    // Check if models are loaded
    if (!isModelLoaded) {
      try {
        await initializeModels();
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Failed to initialize models:", error);
        alert("Failed to initialize processing models. Please try again.");
        return;
      }
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: files.length });

    try {
      // Extract just the file IDs for processing
      const fileIds = files.map((file) => file.id);

      // Process the files using our service
      const processingResults = await processFiles(
        fileIds,
        (current, total, result) => {
          setProgress({ current, total });
          // Log each result for debugging
          if (result) {
            console.log(
              `Processed file ${result.fileId}: ${
                result.ocr?.text.length || 0
              } chars of OCR text, ${
                result.detections?.length || 0
              } objects detected`
            );
          }
        }
      );

      setResults(processingResults);
      console.log("All files processed successfully:", processingResults);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Failed to process files. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="document-upload-container">
      <h2>Document Upload</h2>

      <div className="upload-section">
        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileUpload}
          className="file-input"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="file-upload-button">
          Choose Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="files-section">
          <h3>Uploaded Files ({files.length})</h3>
          <div className="files-grid">
            {files.map((file) => (
              <div key={file.id} className="file-preview-card">
                <img
                  src={file.dataUrl}
                  alt={file.name}
                  className="file-preview-image"
                />
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleProcessFiles}
            disabled={isProcessing}
            className="process-button"
          >
            {isProcessing ? (
              <span className="processing-indicator">
                <Spinner size="small" />
                Processing ({progress.current}/{progress.total})
              </span>
            ) : (
              "Process Files"
            )}
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-section">
          <h3>Processing Results</h3>
          <div className="results-list">
            {results.map((result) => (
              <div key={result.fileId} className="result-item">
                <h4>
                  {files.find((f) => f.id === result.fileId)?.name ||
                    result.fileId}
                </h4>
                {result.error ? (
                  <div className="error-message">Error: {result.error}</div>
                ) : (
                  <div className="result-content">
                    <div className="result-section">
                      <h5>OCR Text:</h5>
                      <div className="ocr-text">
                        {result.ocr?.text.substring(0, 300)}
                        {(result.ocr?.text.length || 0) > 300 ? "..." : ""}
                      </div>
                    </div>
                    <div className="result-section">
                      <h5>Objects Detected:</h5>
                      <div className="objects-list">
                        {result.detections?.length ? (
                          result.detections.map((d, i) => (
                            <span key={i} className="object-tag">
                              {d.class} ({(d.score * 100).toFixed(0)}%)
                            </span>
                          ))
                        ) : (
                          <span>No objects detected</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
