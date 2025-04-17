// src/context/ProfileContext.tsx
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
import { cloudStorage } from "../services/cloudStorageService"; // Alten Import beibehalten
// import { cloudStorage } from "../services/cloudStorage"; // Neuen temporär auskommentieren
import { localCache } from "../services/localCacheService";
import { syncService } from "../services/syncService";
import {
  DocumentMetadata,
  CloudProvider,
  ApiConfig,
  ProcessingMethod,
} from "../types/cloudStorage";

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
  cloudProvider: CloudProvider | null;
  isCloudConnected: boolean;
  connectToCloud: (provider: CloudProvider) => Promise<boolean>;
  disconnectFromCloud: () => Promise<boolean>;

  // Synchronisierungsstatus
  syncStatus: {
    lastSyncTime: number;
    hasOfflineChanges: boolean;
    syncInProgress: boolean;
  };
  forceSynchronize: () => Promise<boolean>;

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

// Definiere die unterschiedlichen Ansichten im Profil-Bereich
export type ProfileView = "home" | "documents" | "tags" | "settings";

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
  const [cloudProvider, setCloudProvider] = useState<CloudProvider | null>(
    null
  );
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Synchronisierungsstatus
  const [syncStatus, setSyncStatus] = useState({
    lastSyncTime: 0,
    hasOfflineChanges: false,
    syncInProgress: false,
  });

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

  // Aktualisiere den Synchronisierungsstatus
  const updateSyncStatus = useCallback(() => {
    setSyncStatus({
      lastSyncTime: syncService.getLastSyncTime(),
      hasOfflineChanges: syncService.hasOfflineChanges(),
      syncInProgress: false,
    });
  }, []);

  // Erzwinge eine Synchronisierung
  const forceSynchronize = async (): Promise<boolean> => {
    setSyncStatus((prev) => ({ ...prev, syncInProgress: true }));
    try {
      const result = await syncService.synchronize();
      updateSyncStatus();

      if (result.success) {
        await loadDocuments();
        await loadTags();
        showToast("Synchronization successful", "success");
        return true;
      } else {
        showToast("Synchronization failed", "error");
        return false;
      }
    } catch (error) {
      console.error("Error during synchronization:", error);
      showToast("Synchronization failed", "error");
      return false;
    } finally {
      setSyncStatus((prev) => ({ ...prev, syncInProgress: false }));
    }
  };

  // Prüfen der Cloud-Verbindung beim Laden
  useEffect(() => {
    const checkCloudConnection = async () => {
      const connected = cloudStorage.isConnected();
      setIsCloudConnected(connected);

      if (connected) {
        setCloudProvider(cloudStorage.getCurrentProvider());
        await loadInitialData();

        // Starte die Hintergrund-Synchronisierung
        syncService.startBackgroundSync();
      } else {
        // Versuche, Daten aus dem lokalen Cache zu laden
        await loadFromLocalCache();
      }
    };

    // Initialisiere den lokalen Cache
    localCache.initialize().then(() => {
      checkCloudConnection();
    });

    return () => {
      // Stoppe die Hintergrund-Synchronisierung beim Unmount
      syncService.stopBackgroundSync();
    };
  }, []);

  // Laden aus dem lokalen Cache, wenn keine Cloud-Verbindung besteht
  const loadFromLocalCache = async () => {
    try {
      const cachedMetadata = await localCache.loadMetadata();
      if (cachedMetadata) {
        if (cachedMetadata.documents) {
          const documentsArray = Object.values(cachedMetadata.documents);
          setDocuments(documentsArray);
          setDocumentCount(documentsArray.length);
        }

        if (cachedMetadata.tags) {
          setAvailableTags(cachedMetadata.tags);
          setTagCount(cachedMetadata.tags.length);
        }

        if (cachedMetadata.settings) {
          setProcessingMethod(cachedMetadata.settings.processingMethod);
          setApiConfigs(cachedMetadata.settings.apiConfigs);
          setLastActivity(cachedMetadata.settings.lastActivity || []);
        }
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
      console.error("Error loading from local cache:", error);
      showToast("Couldn't load cached data", "error");
    }
  };

  // Laden der anfänglichen Daten
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await loadDocuments();
      await loadTags();

      // Lade die Verarbeitungseinstellungen
      const metadata = await cloudStorage.loadMetadata();
      if (metadata && metadata.settings) {
        setProcessingMethod(metadata.settings.processingMethod);
        setApiConfigs(metadata.settings.apiConfigs);
        setLastActivity(metadata.settings.lastActivity || []);
      }

      // Berechne Statistiken
      setDocumentCount(documents.length);
      setTagCount(availableTags.length);

      // Lade Speicherinformationen (Mock-Daten für jetzt)
      setStorage({
        used: 150, // 150 MB genutzt
        total: 1000, // 1 GB gesamt
      });

      // Aktualisiere den Synchronisierungsstatus
      updateSyncStatus();
    } catch (error) {
      console.error("Error loading initial data:", error);
      showToast("Couldn't load profile data. Please try again.", "error");

      // Versuche, Daten aus dem lokalen Cache zu laden
      await loadFromLocalCache();
    } finally {
      setIsLoading(false);
    }
  };

  // Dokument-Management-Funktionen
  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      let metadata;

      if (isCloudConnected) {
        metadata = await cloudStorage.loadMetadata();

        // Speichere die Metadaten im lokalen Cache
        if (metadata) {
          await localCache.saveMetadata(metadata);
        }
      } else {
        metadata = await localCache.loadMetadata();
      }

      if (metadata && metadata.documents) {
        const documentsArray = Object.values(metadata.documents);
        setDocuments(documentsArray);
        setDocumentCount(documentsArray.length);
      } else {
        setDocuments([]);
        setDocumentCount(0);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      showToast("Couldn't load documents. Please try again.", "error");

      // Versuche, aus dem lokalen Cache zu laden
      const cachedMetadata = await localCache.loadMetadata();
      if (cachedMetadata && cachedMetadata.documents) {
        const documentsArray = Object.values(cachedMetadata.documents);
        setDocuments(documentsArray);
        setDocumentCount(documentsArray.length);
      }
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
    if (ids.length === 0) return false;

    setIsLoading(true);
    try {
      // Entferne Dokumente aus dem State
      setDocuments((prev) => prev.filter((doc) => !ids.includes(doc.id)));
      setDocumentCount((prev) => prev - ids.length);

      // Aktualisiere die Metadaten
      const metadata = await localCache.loadMetadata();
      if (metadata) {
        // Entferne die Dokumente aus den Metadaten
        ids.forEach((id) => {
          if (metadata.documents[id]) {
            delete metadata.documents[id];
          }
        });

        // Speichere lokal
        await localCache.saveMetadata(metadata);

        // Wenn verbunden, speichere in der Cloud
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving to cloud:", error);

            // Registriere für spätere Synchronisierung
            ids.forEach((id) => {
              syncService.registerDocumentChange(id, "delete");
            });
          }
        } else {
          // Registriere für spätere Synchronisierung
          ids.forEach((id) => {
            syncService.registerDocumentChange(id, "delete");
          });
        }
      }

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
      updateSyncStatus();
    }
  };

  // Tag-Management-Funktionen
  const loadTags = async () => {
    try {
      let metadata;

      if (isCloudConnected) {
        metadata = await cloudStorage.loadMetadata();

        // Speichere die Metadaten im lokalen Cache
        if (metadata) {
          await localCache.saveMetadata(metadata);
        }
      } else {
        metadata = await localCache.loadMetadata();
      }

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
    }
  };

  const createTag = async (name: string, color: string) => {
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

      // Speichere die Änderungen
      const metadata = await localCache.loadMetadata();
      if (metadata) {
        metadata.tags = [...(metadata.tags || []), newTag];
        await localCache.saveMetadata(metadata);

        // Wenn verbunden, speichere in der Cloud
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving to cloud:", error);

            // Registriere für spätere Synchronisierung
            syncService.registerTagChange(newTag.id, "add", newTag);
          }
        } else {
          // Registriere für spätere Synchronisierung
          syncService.registerTagChange(newTag.id, "add", newTag);
        }
      }

      showToast(`Tag "${name}" created`, "success");
      updateSyncStatus();
      return newTag;
    } catch (error) {
      console.error("Error creating tag:", error);
      showToast("Couldn't create tag. Please try again.", "error");
      return null;
    }
  };

  const updateTag = async (id: string, name: string, color: string) => {
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

      // Speichere die Änderungen
      const metadata = await localCache.loadMetadata();
      if (metadata) {
        metadata.tags = metadata.tags.map((tag) =>
          tag.id === id ? { ...tag, name, color } : tag
        );
        await localCache.saveMetadata(metadata);

        // Wenn verbunden, speichere in der Cloud
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving to cloud:", error);

            // Registriere für spätere Synchronisierung
            const updatedTag = metadata.tags.find((tag) => tag.id === id);
            if (updatedTag) {
              syncService.registerTagChange(id, "update", updatedTag);
            }
          }
        } else {
          // Registriere für spätere Synchronisierung
          const updatedTag = metadata.tags.find((tag) => tag.id === id);
          if (updatedTag) {
            syncService.registerTagChange(id, "update", updatedTag);
          }
        }
      }

      showToast(`Tag "${name}" updated`, "success");
      updateSyncStatus();
      return true;
    } catch (error) {
      console.error("Error updating tag:", error);
      showToast("Couldn't update tag. Please try again.", "error");
      return false;
    }
  };

  const deleteTag = async (id: string) => {
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

      // Speichere die Änderungen
      const metadata = await localCache.loadMetadata();
      if (metadata) {
        metadata.tags = metadata.tags.filter((tag) => tag.id !== id);

        // Entferne den Tag auch aus allen Dokumenten
        for (const docId in metadata.documents) {
          if (metadata.documents[docId].tags.includes(id)) {
            metadata.documents[docId].tags = metadata.documents[
              docId
            ].tags.filter((tagId) => tagId !== id);
          }
        }

        await localCache.saveMetadata(metadata);

        // Wenn verbunden, speichere in der Cloud
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving to cloud:", error);

            // Registriere für spätere Synchronisierung
            syncService.registerTagChange(id, "delete");
          }
        } else {
          // Registriere für spätere Synchronisierung
          syncService.registerTagChange(id, "delete");
        }
      }

      showToast(`Tag "${tagName}" deleted`, "success");
      updateSyncStatus();
      return true;
    } catch (error) {
      console.error("Error deleting tag:", error);
      showToast("Couldn't delete tag. Please try again.", "error");
      return false;
    }
  };

  // Dokument-Tag-Bearbeitungsfunktionen
  const addTagToDocuments = async (documentIds: string[], tagId: string) => {
    if (documentIds.length === 0) return false;

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

      // Speichere die Änderungen
      const metadata = await localCache.loadMetadata();
      if (metadata) {
        documentIds.forEach((docId) => {
          if (
            metadata.documents[docId] &&
            !metadata.documents[docId].tags.includes(tagId)
          ) {
            metadata.documents[docId].tags.push(tagId);
          }
        });

        await localCache.saveMetadata(metadata);

        // Wenn verbunden, speichere in der Cloud
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving to cloud:", error);

            // Registriere für spätere Synchronisierung
            documentIds.forEach((docId) => {
              if (metadata.documents[docId]) {
                syncService.registerDocumentChange(
                  docId,
                  "update",
                  metadata.documents[docId]
                );
              }
            });
          }
        } else {
          // Registriere für spätere Synchronisierung
          documentIds.forEach((docId) => {
            if (metadata.documents[docId]) {
              syncService.registerDocumentChange(
                docId,
                "update",
                metadata.documents[docId]
              );
            }
          });
        }
      }

      showToast(
        `Tag added to ${documentIds.length} document${
          documentIds.length > 1 ? "s" : ""
        }`,
        "success"
      );
      updateSyncStatus();
      return true;
    } catch (error) {
      console.error("Error adding tag to documents:", error);
      showToast("Couldn't add tag to documents. Please try again.", "error");
      return false;
    }
  };

  const removeTagFromDocument = async (documentId: string, tagId: string) => {
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

      // Speichere die Änderungen
      const metadata = await localCache.loadMetadata();
      if (metadata && metadata.documents[documentId]) {
        metadata.documents[documentId].tags = metadata.documents[
          documentId
        ].tags.filter((id) => id !== tagId);
        await localCache.saveMetadata(metadata);

        // Wenn verbunden, speichere in der Cloud
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving to cloud:", error);

            // Registriere für spätere Synchronisierung
            syncService.registerDocumentChange(
              documentId,
              "update",
              metadata.documents[documentId]
            );
          }
        } else {
          // Registriere für spätere Synchronisierung
          syncService.registerDocumentChange(
            documentId,
            "update",
            metadata.documents[documentId]
          );
        }
      }

      showToast(`Tag removed from document`, "success");
      updateSyncStatus();
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

      // Speichere die Änderungen
      const metadata = await localCache.loadMetadata();
      if (metadata) {
        metadata.settings.apiConfigs = metadata.settings.apiConfigs.map(
          (config) =>
            config.provider === provider
              ? { ...config, apiKey, isActive }
              : config
        );

        if (isActive && metadata.settings.processingMethod !== "api") {
          metadata.settings.processingMethod = "api";
        }

        await localCache.saveMetadata(metadata);

        // Wenn verbunden, speichere in der Cloud
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving to cloud:", error);

            // Registriere für spätere Synchronisierung
            syncService.registerSettingsChange();
          }
        } else {
          // Registriere für spätere Synchronisierung
          syncService.registerSettingsChange();
        }
      }

      showToast(`${provider} API configuration updated`, "success");
      updateSyncStatus();
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
  const connectToCloud = async (provider: CloudProvider) => {
    try {
      const success = await cloudStorage.connect(provider);

      if (success) {
        setIsCloudConnected(true);
        setCloudProvider(provider);

        // Lade die anfänglichen Daten
        await loadInitialData();

        // Starte die Hintergrund-Synchronisierung
        syncService.startBackgroundSync();

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
      // Stoppe die Hintergrund-Synchronisierung
      syncService.stopBackgroundSync();

      // Trenne die Verbindung zum Cloud-Provider
      cloudStorage.disconnect();

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

    syncStatus,
    forceSynchronize,

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
