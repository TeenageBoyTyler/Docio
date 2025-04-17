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

      // Erstelle UploadFile-Objekte mit IDs, Vorschau-URLs und leeren Tags
      const newUploadFiles = validFiles.map((file) => {
        const id = Math.random().toString(36).substring(2, 11);
        const preview = URL.createObjectURL(file);
        return Object.assign(file, { id, preview, tags: [] }) as UploadFile;
      });

      setFiles((prevFiles) => [...prevFiles, ...newUploadFiles]);
    },
    [showToast]
  );

  // Datei entfernen
  const removeFile = useCallback(
    (id: string) => {
      setFiles((prevFiles) => {
        const updatedFiles = prevFiles.filter((file) => file.id !== id);

        // Gehe zurück zum Auswahlschritt, wenn keine Dateien mehr übrig sind
        if (updatedFiles.length === 0 && currentStep !== "selection") {
          setCurrentStep("selection");
        }

        return updatedFiles;
      });
    },
    [currentStep]
  );

  // Alle Dateien entfernen
  const clearFiles = useCallback(() => {
    setFiles([]);
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

  const createTag = useCallback((name: string, color: string) => {
    const newTag = {
      id: `tag-${Math.random().toString(36).substring(2, 11)}`,
      name,
      color,
    };

    setAvailableTags((prevTags) => [...prevTags, newTag]);
    return newTag;
  }, []);

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
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export default UploadProvider;
