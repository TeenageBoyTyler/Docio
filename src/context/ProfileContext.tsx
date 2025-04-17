import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useToast } from "./ToastContext";
import { Tag } from "./UploadContext";
import { cloudStorage } from "../services/cloudStorageService";

// Definiere die unterschiedlichen Ansichten im Profil-Bereich
export type ProfileView = "home" | "documents" | "tags" | "settings";

// Typ für die Dokument-Metadaten
export interface DocumentMetadata {
  id: string;
  path: string;
  name: string;
  tags: string[];
  ocr: string;
  detections: string[];
  uploadDate: string;
  preview?: string; // Vorschaubild-URL (optional)
}

// Processing-Methode
export type ProcessingMethod = "client-side" | "api";

// Typ für die API-Konfiguration
export interface ApiConfig {
  provider: string;
  apiKey: string;
  isActive: boolean;
}

// ProfileContext Interface
interface ProfileContextType {
  // Ansichts-Management
  currentView: ProfileView;
  setCurrentView: (view: ProfileView) => void;

  // Dokument-Management
  documents: DocumentMetadata[];
  selectedDocuments: string[];
  selectDocument: (id: string) => void;
  unselectDocument: (id: string) => void;
  clearSelection: () => void;
  deleteDocuments: (ids: string[]) => Promise<boolean>;
  loadDocuments: () => Promise<void>;

  // Tag-Management
  availableTags: Tag[];
  createTag: (name: string, color: string) => Promise<Tag | null>;
  updateTag: (id: string, name: string, color: string) => Promise<boolean>;
  deleteTag: (id: string) => Promise<boolean>;
  loadTags: () => Promise<void>;

  // Dokument-Tag-Bearbeitung
  addTagToDocuments: (documentIds: string[], tagId: string) => Promise<boolean>;
  removeTagFromDocument: (
    documentId: string,
    tagId: string
  ) => Promise<boolean>;

  // Verarbeitungseinstellungen
  processingMethod: ProcessingMethod;
  setProcessingMethod: (method: ProcessingMethod) => void;
  apiConfigs: ApiConfig[];
  updateApiConfig: (
    provider: string,
    apiKey: string,
    isActive: boolean
  ) => Promise<boolean>;
  testApiConnection: (provider: string) => Promise<boolean>;

  // Cloud-Storage
  cloudProvider: string | null;
  isCloudConnected: boolean;
  connectToCloud: (provider: string) => Promise<boolean>;
  disconnectFromCloud: () => Promise<boolean>;

  // Statistiken
  documentCount: number;
  tagCount: number;
  storage: {
    used: number;
    total: number;
  };

  // Status
  isLoading: boolean;
  lastActivity: { action: string; timestamp: string }[];
}

// Erstelle den Kontext
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Hook für einfachen Zugriff auf den Profil-Kontext
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

// Props für den Provider
interface ProfileProviderProps {
  children: ReactNode;
}

// Provider-Komponente
export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  // State für die aktuelle Ansicht
  const [currentView, setCurrentView] = useState<ProfileView>("home");

  // Dokument-States
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Tag-States
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // Verarbeitungseinstellungen
  const [processingMethod, setProcessingMethod] =
    useState<ProcessingMethod>("client-side");
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([
    { provider: "clarifai", apiKey: "", isActive: false },
    { provider: "google", apiKey: "", isActive: false },
    { provider: "ocrspace", apiKey: "", isActive: false },
  ]);

  // Cloud-Storage
  const [cloudProvider, setCloudProvider] = useState<string | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastActivity, setLastActivity] = useState<
    { action: string; timestamp: string }[]
  >([]);

  // Toast-Benachrichtigungen
  const { showToast } = useToast();

  // Statistik-State
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [tagCount, setTagCount] = useState<number>(0);
  const [storage, setStorage] = useState<{ used: number; total: number }>({
    used: 0,
    total: 1000, // Standardwert in MB
  });

  // Prüfen der Cloud-Verbindung beim Laden
  useEffect(() => {
    const checkCloudConnection = async () => {
      const connected = cloudStorage.isConnected();
      setIsCloudConnected(connected);

      if (connected) {
        setCloudProvider(cloudStorage.getCurrentProvider());
        await loadInitialData();
      }
    };

    checkCloudConnection();
  }, []);

  // Laden der anfänglichen Daten
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await loadDocuments();
      await loadTags();

      // Lade die Verarbeitungseinstellungen
      const settings = await cloudStorage.loadSettings();
      if (settings && settings.processingMethod) {
        setProcessingMethod(settings.processingMethod);
      }

      if (settings && settings.apiConfigs) {
        setApiConfigs(settings.apiConfigs);
      }

      // Lade die letzten Aktivitäten
      if (settings && settings.lastActivity) {
        setLastActivity(settings.lastActivity);
      }

      // Berechne Statistiken
      setDocumentCount(documents.length);
      setTagCount(availableTags.length);

      // Lade Speicherinformationen (Mock-Daten für jetzt)
      setStorage({
        used: 150, // 150 MB genutzt
        total: 1000, // 1 GB gesamt
      });
    } catch (error) {
      console.error("Error loading initial data:", error);
      showToast("Couldn't load profile data. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Dokument-Management-Funktionen
  const loadDocuments = async () => {
    if (!isCloudConnected) return;

    setIsLoading(true);
    try {
      const metadata = await cloudStorage.loadMetadata();

      if (metadata && metadata.documents) {
        const documentsArray = Object.values(
          metadata.documents
        ) as DocumentMetadata[];
        setDocuments(documentsArray);
        setDocumentCount(documentsArray.length);
      } else {
        setDocuments([]);
        setDocumentCount(0);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      showToast("Couldn't load documents. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const selectDocument = useCallback((id: string) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const unselectDocument = useCallback((id: string) => {
    setSelectedDocuments((prev) => prev.filter((docId) => docId !== id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDocuments([]);
  }, []);

  const deleteDocuments = async (ids: string[]) => {
    if (!isCloudConnected || ids.length === 0) return false;

    setIsLoading(true);
    try {
      // Hier würde die tatsächliche Löschlogik implementiert werden
      // Für jetzt nur eine simulierte Löschung

      // Dokumente aus dem lokalen State entfernen
      setDocuments((prev) => prev.filter((doc) => !ids.includes(doc.id)));

      // Aktualisiere die Dokumentenanzahl
      setDocumentCount((prev) => prev - ids.length);

      // Lösche die Selektion
      clearSelection();

      // Zeichne die Aktivität auf
      const newActivity = {
        action: `Deleted ${ids.length} document${ids.length > 1 ? "s" : ""}`,
        timestamp: new Date().toISOString(),
      };
      setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      showToast(
        `${ids.length} document${ids.length > 1 ? "s" : ""} deleted`,
        "success"
      );
      return true;
    } catch (error) {
      console.error("Error deleting documents:", error);
      showToast("Couldn't delete documents. Please try again.", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Tag-Management-Funktionen
  const loadTags = async () => {
    if (!isCloudConnected) return;

    setIsLoading(true);
    try {
      const metadata = await cloudStorage.loadMetadata();

      if (metadata && metadata.tags) {
        setAvailableTags(metadata.tags);
        setTagCount(metadata.tags.length);
      } else {
        // Standard-Tags als Fallback
        const defaultTags: Tag[] = [
          { id: "tag1", name: "Invoice", color: "#4285F4" },
          { id: "tag2", name: "Receipt", color: "#0F9D58" },
          { id: "tag3", name: "Contract", color: "#DB4437" },
          { id: "tag4", name: "Personal", color: "#F4B400" },
          { id: "tag5", name: "Work", color: "#AB47BC" },
        ];
        setAvailableTags(defaultTags);
        setTagCount(defaultTags.length);
      }
    } catch (error) {
      console.error("Error loading tags:", error);
      showToast("Couldn't load tags. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const createTag = async (name: string, color: string) => {
    if (!isCloudConnected) return null;

    try {
      const newTag: Tag = {
        id: `tag-${Math.random().toString(36).substring(2, 11)}`,
        name,
        color,
      };

      // Aktualisiere den lokalen State
      setAvailableTags((prev) => [...prev, newTag]);
      setTagCount((prev) => prev + 1);

      // Zeichne die Aktivität auf
      const newActivity = {
        action: `Created tag "${name}"`,
        timestamp: new Date().toISOString(),
      };
      setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Hier würde die Aktualisierung der Tags in der Cloud erfolgen

      showToast(`Tag "${name}" created`, "success");
      return newTag;
    } catch (error) {
      console.error("Error creating tag:", error);
      showToast("Couldn't create tag. Please try again.", "error");
      return null;
    }
  };

  const updateTag = async (id: string, name: string, color: string) => {
    if (!isCloudConnected) return false;

    try {
      // Aktualisiere den lokalen State
      setAvailableTags((prev) =>
        prev.map((tag) => (tag.id === id ? { ...tag, name, color } : tag))
      );

      // Zeichne die Aktivität auf
      const newActivity = {
        action: `Updated tag "${name}"`,
        timestamp: new Date().toISOString(),
      };
      setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Hier würde die Aktualisierung der Tags in der Cloud erfolgen

      showToast(`Tag "${name}" updated`, "success");
      return true;
    } catch (error) {
      console.error("Error updating tag:", error);
      showToast("Couldn't update tag. Please try again.", "error");
      return false;
    }
  };

  const deleteTag = async (id: string) => {
    if (!isCloudConnected) return false;

    try {
      // Finde den Tag-Namen für die Aktivitätsaufzeichnung
      const tagName =
        availableTags.find((tag) => tag.id === id)?.name || "Unknown";

      // Aktualisiere den lokalen State
      setAvailableTags((prev) => prev.filter((tag) => tag.id !== id));
      setTagCount((prev) => prev - 1);

      // Zeichne die Aktivität auf
      const newActivity = {
        action: `Deleted tag "${tagName}"`,
        timestamp: new Date().toISOString(),
      };
      setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Hier würde die Aktualisierung der Tags in der Cloud erfolgen

      showToast(`Tag "${tagName}" deleted`, "success");
      return true;
    } catch (error) {
      console.error("Error deleting tag:", error);
      showToast("Couldn't delete tag. Please try again.", "error");
      return false;
    }
  };

  // Dokument-Tag-Bearbeitungsfunktionen
  const addTagToDocuments = async (documentIds: string[], tagId: string) => {
    if (!isCloudConnected || documentIds.length === 0) return false;

    try {
      // Finde den Tag für die Aktivitätsaufzeichnung
      const tagName =
        availableTags.find((tag) => tag.id === tagId)?.name || "Unknown";

      // Aktualisiere den lokalen State
      setDocuments((prev) =>
        prev.map((doc) => {
          if (documentIds.includes(doc.id)) {
            // Prüfe, ob der Tag bereits vorhanden ist
            if (!doc.tags.includes(tagId)) {
              return { ...doc, tags: [...doc.tags, tagId] };
            }
          }
          return doc;
        })
      );

      // Zeichne die Aktivität auf
      const newActivity = {
        action: `Added tag "${tagName}" to ${documentIds.length} document${
          documentIds.length > 1 ? "s" : ""
        }`,
        timestamp: new Date().toISOString(),
      };
      setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Hier würde die Aktualisierung der Dokumente in der Cloud erfolgen

      showToast(
        `Tag added to ${documentIds.length} document${
          documentIds.length > 1 ? "s" : ""
        }`,
        "success"
      );
      return true;
    } catch (error) {
      console.error("Error adding tag to documents:", error);
      showToast("Couldn't add tag to documents. Please try again.", "error");
      return false;
    }
  };

  const removeTagFromDocument = async (documentId: string, tagId: string) => {
    if (!isCloudConnected) return false;

    try {
      // Finde den Tag für die Aktivitätsaufzeichnung
      const tagName =
        availableTags.find((tag) => tag.id === tagId)?.name || "Unknown";

      // Aktualisiere den lokalen State
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === documentId) {
            return { ...doc, tags: doc.tags.filter((tag) => tag !== tagId) };
          }
          return doc;
        })
      );

      // Zeichne die Aktivität auf
      const newActivity = {
        action: `Removed tag "${tagName}" from document`,
        timestamp: new Date().toISOString(),
      };
      setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Hier würde die Aktualisierung der Dokumente in der Cloud erfolgen

      showToast(`Tag removed from document`, "success");
      return true;
    } catch (error) {
      console.error("Error removing tag from document:", error);
      showToast(
        "Couldn't remove tag from document. Please try again.",
        "error"
      );
      return false;
    }
  };

  // API-Konfigurationsfunktionen
  const updateApiConfig = async (
    provider: string,
    apiKey: string,
    isActive: boolean
  ) => {
    try {
      // Aktualisiere den lokalen State
      setApiConfigs((prev) =>
        prev.map((config) =>
          config.provider === provider
            ? { ...config, apiKey, isActive }
            : config
        )
      );

      // Aktualisiere die Verarbeitungsmethode, wenn eine API aktiviert wird
      if (isActive && processingMethod !== "api") {
        setProcessingMethod("api");
      }

      // Hier würde die Aktualisierung der Einstellungen in der Cloud erfolgen

      showToast(`${provider} API configuration updated`, "success");
      return true;
    } catch (error) {
      console.error("Error updating API configuration:", error);
      showToast(
        "Couldn't update API configuration. Please try again.",
        "error"
      );
      return false;
    }
  };

  const testApiConnection = async (provider: string) => {
    try {
      const config = apiConfigs.find((cfg) => cfg.provider === provider);
      if (!config || !config.apiKey) {
        showToast("Please enter an API key first", "warning");
        return false;
      }

      // Hier würde der tatsächliche API-Test stattfinden
      // Für jetzt nur eine simulierte Verzögerung
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const success = true; // Simuliere einen erfolgreichen Test

      if (success) {
        showToast(`Successfully connected to ${provider} API`, "success");
      } else {
        showToast(`Couldn't connect to ${provider} API`, "error");
      }

      return success;
    } catch (error) {
      console.error("Error testing API connection:", error);
      showToast("Couldn't connect to API service", "error");
      return false;
    }
  };

  // Cloud-Storage-Funktionen
  const connectToCloud = async (provider: string) => {
    try {
      const success = await cloudStorage.connect(provider.toLowerCase());

      if (success) {
        setIsCloudConnected(true);
        setCloudProvider(provider);

        // Lade die anfänglichen Daten
        await loadInitialData();

        showToast(`Connected to ${provider}`, "success");
      } else {
        showToast("Couldn't connect to Cloud Service", "error");
      }

      return success;
    } catch (error) {
      console.error("Error connecting to cloud:", error);
      showToast("Couldn't connect to Cloud Service", "error");
      return false;
    }
  };

  const disconnectFromCloud = async () => {
    try {
      // Hier würde die tatsächliche Trennung stattfinden
      // Für jetzt nur eine simulierte Aktion

      setIsCloudConnected(false);
      setCloudProvider(null);

      // Setze die lokalen Daten zurück
      setDocuments([]);
      setDocumentCount(0);
      setSelectedDocuments([]);

      // Setze auf Standard-Tags zurück
      const defaultTags: Tag[] = [
        { id: "tag1", name: "Invoice", color: "#4285F4" },
        { id: "tag2", name: "Receipt", color: "#0F9D58" },
        { id: "tag3", name: "Contract", color: "#DB4437" },
        { id: "tag4", name: "Personal", color: "#F4B400" },
        { id: "tag5", name: "Work", color: "#AB47BC" },
      ];
      setAvailableTags(defaultTags);
      setTagCount(defaultTags.length);

      showToast("Disconnected from cloud storage", "success");
      return true;
    } catch (error) {
      console.error("Error disconnecting from cloud:", error);
      showToast("Couldn't disconnect from cloud storage", "error");
      return false;
    }
  };

  // Werte für den Kontext
  const value: ProfileContextType = {
    currentView,
    setCurrentView,

    documents,
    selectedDocuments,
    selectDocument,
    unselectDocument,
    clearSelection,
    deleteDocuments,
    loadDocuments,

    availableTags,
    createTag,
    updateTag,
    deleteTag,
    loadTags,

    addTagToDocuments,
    removeTagFromDocument,

    processingMethod,
    setProcessingMethod,
    apiConfigs,
    updateApiConfig,
    testApiConnection,

    cloudProvider,
    isCloudConnected,
    connectToCloud,
    disconnectFromCloud,

    documentCount,
    tagCount,
    storage,

    isLoading,
    lastActivity,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export default ProfileProvider;
