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

// Version for tracking schema updates
const PROFILE_CONTEXT_VERSION = 1;

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
  deletedTagIds: Set<string>; // Track deleted tag IDs to prevent recreation
  createTag: (name: string, color: string) => Promise<Tag | null>;
  updateTag: (id: string, name: string, color: string) => Promise<boolean>;
  deleteTag: (id: string) => Promise<boolean>;
  loadTags: () => Promise<void>;
  addExternalTags: (tags: Tag[]) => Promise<void>; // Method for adding external tags
  deduplicateTags: () => Promise<boolean>; // Method to handle duplicate tag names
  clearAllTags: () => Promise<boolean>; // New method to clear all tags

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
    lastSyncError?: boolean;
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
  const [deletedTagIds, setDeletedTagIds] = useState<Set<string>>(new Set());

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
    lastSyncError: false,
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
      lastSyncError: false,
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
        setSyncStatus((prev) => ({ ...prev, lastSyncError: true }));
        showToast("Synchronization failed", "error");
        return false;
      }
    } catch (error) {
      console.error("Error during synchronization:", error);
      setSyncStatus((prev) => ({ ...prev, lastSyncError: true }));
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
        // Check version and perform upgrade if needed
        const currentVersion = cachedMetadata?.settings?.version || 0;
        let needsSave = false;

        // If version is older than our current version, perform upgrade tasks
        if (currentVersion < PROFILE_CONTEXT_VERSION) {
          console.log(
            `[ProfileContext] Local cache upgrading from version ${currentVersion} to ${PROFILE_CONTEXT_VERSION}`
          );

          // If this is the first time with the new version, clear all tags
          if (currentVersion === 0) {
            console.log(
              "[ProfileContext] First run with version tracking, clearing tags from local cache"
            );
            if (cachedMetadata.tags) {
              cachedMetadata.tags = [];
              needsSave = true;
            }
          }

          // Update version in settings
          if (cachedMetadata.settings) {
            cachedMetadata.settings.version = PROFILE_CONTEXT_VERSION;
            needsSave = true;
          } else {
            cachedMetadata.settings = { version: PROFILE_CONTEXT_VERSION };
            needsSave = true;
          }

          // Save changes if needed
          if (needsSave) {
            await localCache.saveMetadata(cachedMetadata);
          }
        }

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

          // Load deleted tag IDs
          if (cachedMetadata.settings.deletedTagIds) {
            setDeletedTagIds(new Set(cachedMetadata.settings.deletedTagIds));
          }
        }
      } else {
        // Initialize with empty tags array
        setAvailableTags([]);
        setTagCount(0);
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
      // Check for application version and perform migration if needed
      const metadata = await cloudStorage.loadMetadata();
      const currentVersion = metadata?.settings?.version || 0;

      // If version is older than our current version, perform upgrade tasks
      if (currentVersion < PROFILE_CONTEXT_VERSION) {
        console.log(
          `[ProfileContext] Upgrading from version ${currentVersion} to ${PROFILE_CONTEXT_VERSION}`
        );

        // If this is the first time with the new version, clear all tags
        if (currentVersion === 0) {
          console.log(
            "[ProfileContext] First run with version tracking, clearing all tags"
          );
          await clearAllTags();
        }

        // Update version in settings
        if (metadata && metadata.settings) {
          metadata.settings.version = PROFILE_CONTEXT_VERSION;
          await cloudStorage.saveMetadata(metadata);
          await localCache.saveMetadata(metadata);
        }
      }

      // Load documents first to ensure we have the latest data
      await loadDocuments();

      // Now load tags (after potential clearing)
      await loadTags();

      // Load deleted tag IDs from storage
      if (metadata?.settings?.deletedTagIds) {
        setDeletedTagIds(new Set(metadata.settings.deletedTagIds));
      }

      // Lade die Verarbeitungseinstellungen
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
        // Initialize with empty tags array
        setAvailableTags([]);
        setTagCount(0);
      }
    } catch (error) {
      console.error("Error loading tags:", error);
      showToast("Couldn't load tags. Please try again.", "error");
    }
  };

  const createTag = async (name: string, color: string) => {
    try {
      // Check for existing tag with the same name (case-insensitive)
      const existingTag = availableTags.find(
        (tag) => tag.name.toLowerCase().trim() === name.toLowerCase().trim()
      );

      if (existingTag) {
        showToast(`Tag "${name}" already exists`, "error");
        return null;
      }

      const newTag: Tag = {
        id: `tag-${Math.random().toString(36).substring(2, 11)}`,
        name: name.trim(), // Ensure the name is trimmed
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
        // Make sure the tag isn't already in the deleted list
        if (deletedTagIds.has(newTag.id)) {
          deletedTagIds.delete(newTag.id); // Remove from deleted list if creating again

          // Update deletedTagIds in metadata
          if (!metadata.settings) {
            metadata.settings = {};
          }
          metadata.settings.deletedTagIds = Array.from(deletedTagIds);
        }

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

      // Force reload documents to ensure all components are in sync
      await loadDocuments();

      // Ensure tag is available in all contexts
      setTimeout(() => {
        loadTags(); // This will trigger tag sync to other contexts
      }, 100);

      showToast(`Tag "${name}" created`, "success");
      updateSyncStatus();
      return newTag;
    } catch (error) {
      console.error("Error creating tag:", error);
      showToast("Couldn't create tag. Please try again.", "error");
      return null;
    }
  };

  // Add external tags to the profile context (for bidirectional sync)
  const addExternalTags = useCallback(
    async (externalTags: Tag[]) => {
      try {
        // Filter out tags that already exist by ID
        const tagsNotExistingById = externalTags.filter(
          (externalTag) =>
            !availableTags.some((tag) => tag.id === externalTag.id)
        );

        if (tagsNotExistingById.length === 0) return; // No new tags to add

        // Filter out tags that were previously deleted
        const nonDeletedTags = tagsNotExistingById.filter(
          (tag) => !deletedTagIds.has(tag.id)
        );

        if (nonDeletedTags.length < tagsNotExistingById.length) {
          console.log(
            `[ProfileContext] Skipped ${
              tagsNotExistingById.length - nonDeletedTags.length
            } previously deleted tags`
          );

          if (nonDeletedTags.length === 0) {
            console.log(
              "[ProfileContext] All external tags were previously deleted, nothing to add"
            );
            return;
          }
        }

        // Further filter to remove any with duplicate names (case-insensitive)
        const newTags: Tag[] = [];
        const duplicateNames: string[] = [];

        for (const externalTag of nonDeletedTags) {
          const existingTagWithSameName = availableTags.find(
            (tag) =>
              tag.name.toLowerCase().trim() ===
              externalTag.name.toLowerCase().trim()
          );

          if (existingTagWithSameName) {
            duplicateNames.push(externalTag.name);
            console.log(
              `[ProfileContext] Skipping external tag with duplicate name: "${externalTag.name}"`
            );
          } else {
            newTags.push({
              ...externalTag,
              name: externalTag.name.trim(), // Ensure name is trimmed
            });
          }
        }

        if (newTags.length === 0) {
          console.log(
            "[ProfileContext] All external tags were duplicates, nothing to add"
          );
          return;
        }

        // Log what we're doing
        console.log(
          `[ProfileContext] Adding ${newTags.length} new external tags`
        );
        if (duplicateNames.length > 0) {
          console.log(
            `[ProfileContext] Skipped ${duplicateNames.length} duplicate tag names`
          );
        }

        // Update the local state
        setAvailableTags((prev) => [...prev, ...newTags]);
        setTagCount((prev) => prev + newTags.length);

        // Record the activity
        const newActivity = {
          action: `Added ${newTags.length} tag(s) from upload`,
          timestamp: new Date().toISOString(),
        };
        setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

        // Update storage
        const metadata = await localCache.loadMetadata();
        if (metadata) {
          metadata.tags = [...(metadata.tags || []), ...newTags];

          // Ensure settings and deletedTagIds exist
          if (!metadata.settings) {
            metadata.settings = {};
          }
          if (!metadata.settings.deletedTagIds) {
            metadata.settings.deletedTagIds = Array.from(deletedTagIds);
          }

          await localCache.saveMetadata(metadata);

          // Update cloud if connected
          if (isCloudConnected) {
            try {
              await cloudStorage.saveMetadata(metadata);
            } catch (error) {
              console.error("Error saving tags to cloud:", error);
              // Register for later sync
              newTags.forEach((tag) => {
                syncService.registerTagChange(tag.id, "add", tag);
              });
            }
          } else {
            // Register for later sync
            newTags.forEach((tag) => {
              syncService.registerTagChange(tag.id, "add", tag);
            });
          }
        }

        // Force reload documents and propagate tags to all contexts
        setTimeout(() => {
          loadDocuments();
        }, 100);

        updateSyncStatus();
      } catch (error) {
        console.error("Error adding external tags:", error);
        showToast("Couldn't save tags. Please try again.", "error");
      }
    },
    [
      availableTags,
      deletedTagIds,
      isCloudConnected,
      setLastActivity,
      showToast,
      updateSyncStatus,
      loadDocuments,
    ]
  );

  const updateTag = async (id: string, name: string, color: string) => {
    try {
      // Check for duplicate tag names before updating
      const isDuplicate = availableTags.some(
        (tag) =>
          tag.id !== id &&
          tag.name.toLowerCase().trim() === name.toLowerCase().trim()
      );

      if (isDuplicate) {
        showToast(`Another tag with name "${name}" already exists`, "error");
        return false;
      }

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
        // Update tag in the metadata
        metadata.tags = metadata.tags.map((tag) =>
          tag.id === id ? { ...tag, name, color } : tag
        );

        // Reload documents to reflect the tag changes
        // (Document references to tags are by ID, so they remain valid)
        const documentArray = Object.values(metadata.documents);
        setDocuments(documentArray);

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

      // Force reload documents to update all components
      await loadDocuments();

      // Ensure we refresh everything - this is critical to ensure UI updates correctly
      setTimeout(() => {
        loadTags(); // Trigger a refresh of tags in all contexts
      }, 100);

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

      // Add to deleted tag IDs to prevent recreation
      const updatedDeletedTagIds = new Set(deletedTagIds);
      updatedDeletedTagIds.add(id);
      setDeletedTagIds(updatedDeletedTagIds);

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

        // Update documents state with the updated tag references
        const documentsArray = Object.values(metadata.documents);
        setDocuments(documentsArray);

        // Store deleted tag ID in metadata
        if (!metadata.settings) {
          metadata.settings = {};
        }
        metadata.settings.deletedTagIds = Array.from(updatedDeletedTagIds);

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

      // Force reload documents to ensure all components are in sync
      await loadDocuments();

      console.log(
        `[ProfileContext] Tag "${tagName}" (ID: ${id}) deleted and added to deleted list`
      );
      showToast(`Tag "${tagName}" deleted`, "success");
      updateSyncStatus();
      return true;
    } catch (error) {
      console.error("Error deleting tag:", error);
      showToast("Couldn't delete tag. Please try again.", "error");
      return false;
    }
  };

  // Clear all tags from the system
  const clearAllTags = useCallback(async () => {
    try {
      console.log("[ProfileContext] Clearing all tags from system");

      // Update local state
      setAvailableTags([]);
      setTagCount(0);

      // Clear deleted tag IDs too, since we're starting fresh
      setDeletedTagIds(new Set());

      // Record the activity
      const newActivity = {
        action: `Cleared all tags (system update)`,
        timestamp: new Date().toISOString(),
      };
      setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Update storage
      const metadata = await localCache.loadMetadata();
      if (metadata) {
        // Clear tag list in metadata
        metadata.tags = [];

        // Initialize settings if needed
        if (!metadata.settings) {
          metadata.settings = {};
        }

        // Update version and clear deletedTagIds
        metadata.settings.version = PROFILE_CONTEXT_VERSION;
        metadata.settings.deletedTagIds = [];

        // Also remove all tag references from documents
        Object.values(metadata.documents).forEach((doc) => {
          doc.tags = [];
        });

        await localCache.saveMetadata(metadata);

        // Update cloud if connected
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving cleared tags to cloud:", error);
          }
        }
      }

      // Reload documents to reflect the changes
      await loadDocuments();
      showToast("Tag system reset completed", "info");
      updateSyncStatus();
      return true;
    } catch (error) {
      console.error("Error clearing tags:", error);
      return false;
    }
  }, [
    isCloudConnected,
    loadDocuments,
    setLastActivity,
    showToast,
    updateSyncStatus,
  ]);

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

      // Initialize with empty tags array
      setAvailableTags([]);
      setTagCount(0);

      showToast("Disconnected from cloud storage", "success");
      return true;
    } catch (error) {
      console.error("Error disconnecting from cloud:", error);
      showToast("Couldn't disconnect from cloud storage", "error");
      return false;
    }
  };

  // New helper method to deduplicate tags (will be called by TagSynchronizer)
  const deduplicateTags = useCallback(async () => {
    try {
      // First identify duplicate tag names
      const tagNameMap = new Map<string, Tag[]>();
      const duplicatesFound: Record<string, Tag[]> = {};

      // Group tags by lowercase name
      availableTags.forEach((tag) => {
        const lowerName = tag.name.toLowerCase().trim();
        if (!tagNameMap.has(lowerName)) {
          tagNameMap.set(lowerName, []);
        }
        tagNameMap.get(lowerName)!.push(tag);
      });

      // Find groups with more than one tag (duplicates)
      tagNameMap.forEach((tags, lowerName) => {
        if (tags.length > 1) {
          duplicatesFound[lowerName] = tags;
        }
      });

      // If no duplicates found, return early
      if (Object.keys(duplicatesFound).length === 0) {
        return true;
      }

      console.log(
        "[ProfileContext] Found duplicate tag names:",
        duplicatesFound
      );

      // Create our deduplicated tag list
      const deduplicatedTags: Tag[] = [];
      const idsToRemove = new Set<string>();

      // For each group of tags with the same name, keep only the first one
      tagNameMap.forEach((tags, lowerName) => {
        // Keep the first tag for each name
        const keepTag = tags[0];
        deduplicatedTags.push(keepTag);

        // Track the IDs of tags to remove
        for (let i = 1; i < tags.length; i++) {
          idsToRemove.add(tags[i].id);
        }
      });

      // No duplicates found (this check is redundant but safe)
      if (idsToRemove.size === 0) {
        return true;
      }

      // Update local state
      setAvailableTags(deduplicatedTags);
      setTagCount(deduplicatedTags.length);

      // Record the activity
      const newActivity = {
        action: `Merged ${idsToRemove.size} duplicate tag(s)`,
        timestamp: new Date().toISOString(),
      };
      setLastActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Update storage
      const metadata = await localCache.loadMetadata();
      if (metadata) {
        // Update tag list in metadata
        metadata.tags = deduplicatedTags;

        // For each document, replace removed tag IDs with the kept tag ID
        Object.values(metadata.documents).forEach((doc) => {
          // Map from removed tag IDs to kept tag IDs
          tagNameMap.forEach((tagsWithSameName) => {
            if (tagsWithSameName.length > 1) {
              const keepTagId = tagsWithSameName[0].id;
              const removeTagIds = tagsWithSameName
                .slice(1)
                .map((tag) => tag.id);

              // If document has any of the removed tag IDs, replace with kept tag ID
              const hasRemovedTags = removeTagIds.some((id) =>
                doc.tags.includes(id)
              );
              if (hasRemovedTags) {
                // Filter out the removed tag IDs
                doc.tags = doc.tags.filter((id) => !removeTagIds.includes(id));
                // Add the kept tag ID if it's not already there
                if (!doc.tags.includes(keepTagId)) {
                  doc.tags.push(keepTagId);
                }
              }
            }
          });
        });

        await localCache.saveMetadata(metadata);

        // Update cloud if connected
        if (isCloudConnected) {
          try {
            await cloudStorage.saveMetadata(metadata);
          } catch (error) {
            console.error("Error saving deduplicated tags to cloud:", error);
          }
        }
      }

      // Reload documents to reflect the changes
      await loadDocuments();
      showToast(`Merged ${idsToRemove.size} duplicate tag(s)`, "info");
      updateSyncStatus();
      return true;
    } catch (error) {
      console.error("Error deduplicating tags:", error);
      return false;
    }
  }, [
    availableTags,
    isCloudConnected,
    loadDocuments,
    setLastActivity,
    showToast,
    updateSyncStatus,
  ]);

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
    deletedTagIds, // Include the set of deleted tag IDs
    createTag,
    updateTag,
    deleteTag,
    loadTags,
    addExternalTags,
    deduplicateTags, // Method to deduplicate tags
    clearAllTags, // New method to clear all tags

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
