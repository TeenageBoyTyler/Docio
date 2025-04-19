import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useToast } from "./ToastContext";
import { useProfile } from "./ProfileContext"; // Import Profile context for direct tag syncing
import {
  processUploadedFiles,
  removeUploadedFile,
  clearUploadedFiles,
} from "../services/FileUploadService";

// Definiere die unterstützten Dateiformate
const SUPPORTED_FORMATS = ["jpg", "jpeg", "png", "gif", "pdf", "heic", "heif"];

// Tag-Definition
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// Verarbeitete Dokument-Definition
export interface ProcessedDocument {
  fileId: string;
  ocr: string; // Extrahierter Text
  tags: string[]; // Erkannte Objekte/Konzepte
  confidence: number; // OCR-Konfidenz
}

// Typen für den Upload-Kontext
export interface UploadFile extends File {
  id: string;
  preview: string;
  tags: Tag[]; // Tags für jedes File
}

// Step des Upload-Prozesses
export type UploadStep =
  | "selection"
  | "preview"
  | "tagging"
  | "processing"
  | "uploading"
  | "success";

interface UploadContextType {
  files: UploadFile[];
  currentStep: UploadStep;
  currentFileIndex: number;
  availableTags: Tag[];
  processedDocuments: ProcessedDocument[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  goToStep: (step: UploadStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setCurrentFileIndex: (index: number) => void;
  addTagToFile: (fileId: string, tag: Tag) => void;
  removeTagFromFile: (fileId: string, tagId: string) => void;
  createTag: (name: string, color: string) => Tag;
  setProcessedDocuments: (docs: ProcessedDocument[]) => void;
  // Add method to update available tags from external sources
  updateAvailableTags: (tags: Tag[]) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

// Hook für einfachen Zugriff auf den Upload-Kontext
export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};

// Props für den Provider
interface UploadProviderProps {
  children: ReactNode;
}

// Provider-Komponente
export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  // Access Profile context for direct tag syncing
  const { addExternalTags, availableTags: profileTags } = useProfile();

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [currentStep, setCurrentStep] = useState<UploadStep>("selection");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]); // Always start with empty tags
  const [processedDocuments, setProcessedDocuments] = useState<
    ProcessedDocument[]
  >([]);
  const { showToast } = useToast();

  // Sync tags from Profile to Upload whenever Profile tags change
  useEffect(() => {
    if (profileTags.length > 0) {
      console.log(
        "[UploadContext] Syncing tags from Profile:",
        profileTags.length
      );
      setAvailableTags(profileTags);
    }
  }, [profileTags]);

  // Debugging log to confirm no default tags
  useEffect(() => {
    console.log(
      "[UploadContext] Initialized with",
      availableTags.length,
      "tags"
    );
  }, []);

  // Dateien hinzufügen
  const addFiles = useCallback(
    async (newFiles: File[]) => {
      try {
        // Prüfe, ob das Format unterstützt wird
        const validFiles = newFiles.filter((file) => {
          const extension = file.name.split(".").pop()?.toLowerCase() || "";
          if (!SUPPORTED_FORMATS.includes(extension)) {
            showToast("Unsupported filetype", "error");
            return false;
          }
          return true;
        });

        // Filter out duplicates based on filename and size
        const nonDuplicateFiles = validFiles.filter((newFile) => {
          const isDuplicate = files.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size
          );

          if (isDuplicate) {
            showToast(`"${newFile.name}" is already in the queue`, "info");
            return false;
          }
          return true;
        });

        if (nonDuplicateFiles.length === 0) return;

        // Use FileUploadService to immediately convert files to data URLs
        const processedFiles = await processUploadedFiles(nonDuplicateFiles);

        // Convert to UploadFile format
        const newUploadFiles = processedFiles.map((file) => {
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: 0, // Default value as this isn't in UploadedFile
            id: file.id,
            preview: file.dataUrl, // Use dataUrl as preview
            tags: [] as Tag[],
          } as UploadFile;
        });

        setFiles((prevFiles) => [...prevFiles, ...newUploadFiles]);
      } catch (error) {
        console.error("Error adding files:", error);
        showToast("Failed to process files. Please try again.", "error");
      }
    },
    [showToast, files]
  );

  // Datei entfernen
  const removeFile = useCallback(
    (id: string) => {
      setFiles((prevFiles) => {
        // Remove the file from the FileUploadService cache
        removeUploadedFile(id);

        const updatedFiles = prevFiles.filter((file) => file.id !== id);

        // Gehe zurück zum Auswahlschritt, wenn keine Dateien mehr übrig sind
        if (updatedFiles.length === 0 && currentStep !== "selection") {
          setCurrentStep("selection");
        }

        return updatedFiles;
      });

      // Auch die Verarbeitungsergebnisse für diese Datei entfernen
      setProcessedDocuments((prev) => prev.filter((doc) => doc.fileId !== id));
    },
    [currentStep]
  );

  // Alle Dateien entfernen
  const clearFiles = useCallback(() => {
    // Clear all files from the FileUploadService cache
    clearUploadedFiles();

    setFiles([]);
    setProcessedDocuments([]);
    // Zurücksetzen auf den Auswahlschritt
    setCurrentStep("selection");
  }, []);

  // Zu einem bestimmten Schritt gehen
  const goToStep = useCallback((step: UploadStep) => {
    setCurrentStep(step);
  }, []);

  // Zum nächsten Schritt gehen
  const goToNextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      switch (prevStep) {
        case "selection":
          return "preview";
        case "preview":
          return "tagging";
        case "tagging":
          return "processing";
        case "processing":
          return "uploading";
        case "uploading":
          return "success";
        default:
          return prevStep;
      }
    });
  }, []);

  // Zum vorherigen Schritt gehen
  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      switch (prevStep) {
        case "preview":
          return "selection";
        case "tagging":
          return "preview";
        default:
          return prevStep;
      }
    });
  }, []);

  // Tag-Funktionen
  const addTagToFile = useCallback((fileId: string, tag: Tag) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === fileId) {
          // Prüfen, ob der Tag bereits vorhanden ist
          const hasTag = file.tags.some((t) => t.id === tag.id);
          if (hasTag) return file;

          // Tag hinzufügen
          return {
            ...file,
            tags: [...file.tags, tag],
          };
        }
        return file;
      })
    );
  }, []);

  const removeTagFromFile = useCallback((fileId: string, tagId: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            tags: file.tags.filter((tag) => tag.id !== tagId),
          };
        }
        return file;
      })
    );
  }, []);

  // MODIFIED: Direct sync to Profile
  const createTag = useCallback(
    (name: string, color: string) => {
      // Create the new tag
      const newTag = {
        id: `tag-${Math.random().toString(36).substring(2, 11)}`,
        name: name.trim(),
        color,
      };

      // Add to local state first
      setAvailableTags((prevTags) => [...prevTags, newTag]);

      // IMPORTANT: Directly sync to Profile context
      console.log(
        `[UploadContext] Created tag "${name}", syncing to Profile...`
      );
      setTimeout(() => {
        addExternalTags([newTag]).catch((err) =>
          console.error(
            "[UploadContext] Error syncing new tag to Profile:",
            err
          )
        );
      }, 0);

      return newTag;
    },
    [addExternalTags]
  );

  // Add method to update available tags from outside
  const updateAvailableTags = useCallback((tags: Tag[]) => {
    console.log(`[UploadContext] Updating available tags:`, tags.length);
    if (tags && tags.length > 0) {
      setAvailableTags(tags);
    }
  }, []);

  // Automatisches Hinzufügen von erkannten Tags aus den Verarbeitungsergebnissen
  React.useEffect(() => {
    if (processedDocuments.length > 0 && currentStep === "uploading") {
      // Sammle einzigartige erkannte Objekte/Konzepte
      const uniqueConcepts = new Set<string>();
      processedDocuments.forEach((doc) => {
        doc.tags.forEach((tag) => uniqueConcepts.add(tag));
      });

      // Für jedes erkannte Konzept, das noch nicht als Tag existiert, erstelle es
      uniqueConcepts.forEach((concept) => {
        // Prüfe, ob der Tag bereits existiert
        const tagExists = availableTags.some(
          (tag) => tag.name.toLowerCase() === concept.toLowerCase()
        );

        if (!tagExists) {
          // Wähle eine zufällige Farbe für den neuen Tag
          const colors = [
            "#4285F4",
            "#0F9D58",
            "#DB4437",
            "#F4B400",
            "#AB47BC",
            "#009688",
            "#FF5722",
            "#E91E63",
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          createTag(concept, randomColor);
        }
      });

      // Füge die erkannten Tags zu den Dokumenten hinzu
      processedDocuments.forEach((processedDoc) => {
        processedDoc.tags.forEach((conceptTag) => {
          // Finde den entsprechenden Tag in availableTags
          const matchingTag = availableTags.find(
            (tag) => tag.name.toLowerCase() === conceptTag.toLowerCase()
          );

          // Wenn der Tag existiert und noch nicht zum Dokument hinzugefügt wurde, füge ihn hinzu
          if (matchingTag) {
            const file = files.find((f) => f.id === processedDoc.fileId);
            if (file && !file.tags.some((t) => t.id === matchingTag.id)) {
              addTagToFile(processedDoc.fileId, matchingTag);
            }
          }
        });
      });
    }
  }, [
    processedDocuments,
    currentStep,
    availableTags,
    files,
    addTagToFile,
    createTag,
  ]);

  // Bereinige die Dateien im Cache beim Unmount
  React.useEffect(() => {
    return () => {
      // Clean up all files from the FileUploadService cache when the component unmounts
      clearUploadedFiles();
    };
  }, []);

  const value = {
    files,
    currentStep,
    currentFileIndex,
    availableTags,
    processedDocuments,
    addFiles,
    removeFile,
    clearFiles,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    setCurrentFileIndex,
    addTagToFile,
    removeTagFromFile,
    createTag,
    setProcessedDocuments,
    updateAvailableTags, // Add the new method to the context value
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export default UploadProvider;
