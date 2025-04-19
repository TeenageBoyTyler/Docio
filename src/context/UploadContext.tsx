import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useToast } from "./ToastContext";

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

// Beispiele für vordefinierte Tags
const DEFAULT_TAGS: Tag[] = [
  { id: "tag1", name: "Invoice", color: "#4285F4" },
  { id: "tag2", name: "Receipt", color: "#0F9D58" },
  { id: "tag3", name: "Contract", color: "#DB4437" },
  { id: "tag4", name: "Personal", color: "#F4B400" },
  { id: "tag5", name: "Work", color: "#AB47BC" },
];

// Provider-Komponente
export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [currentStep, setCurrentStep] = useState<UploadStep>("selection");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [availableTags, setAvailableTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [processedDocuments, setProcessedDocuments] = useState<
    ProcessedDocument[]
  >([]);
  const { showToast } = useToast();

  // Dateien hinzufügen
  const addFiles = useCallback(
    (newFiles: File[]) => {
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

      // Erstelle UploadFile-Objekte mit IDs, Vorschau-URLs und leeren Tags
      const newUploadFiles = nonDuplicateFiles.map((file) => {
        const id = Math.random().toString(36).substring(2, 11);
        const preview = URL.createObjectURL(file);
        return Object.assign(file, { id, preview, tags: [] }) as UploadFile;
      });

      setFiles((prevFiles) => [...prevFiles, ...newUploadFiles]);
    },
    [showToast, files]
  );

  // Datei entfernen
  const removeFile = useCallback(
    (id: string) => {
      setFiles((prevFiles) => {
        // Find the file to get its preview URL
        const fileToRemove = prevFiles.find((file) => file.id === id);
        if (fileToRemove) {
          // Revoke the Object URL to prevent memory leaks
          URL.revokeObjectURL(fileToRemove.preview);
        }

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
    // Revoke all Object URLs to prevent memory leaks
    files.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });

    setFiles([]);
    setProcessedDocuments([]);
    // Zurücksetzen auf den Auswahlschritt
    setCurrentStep("selection");
  }, [files]);

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

  const createTag = useCallback((name: string, color: string) => {
    const newTag = {
      id: `tag-${Math.random().toString(36).substring(2, 11)}`,
      name,
      color,
    };

    setAvailableTags((prevTags) => [...prevTags, newTag]);
    return newTag;
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

  // Bereinige die ObjectURLs beim Unmount
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

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
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export default UploadProvider;
