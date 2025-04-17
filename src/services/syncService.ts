// src/services/syncService.ts
import { localCache } from "./localCacheService";
import { cloudStorage } from "./cloudStorage";
import { CloudMetadata, DocumentMetadata } from "../types/cloudStorage";

/**
 * Ergebnis eines Synchronisierungsvorgangs
 */
export interface SyncResult {
  success: boolean;
  documentsChanged: number;
  tagsChanged: number;
  errors: string[];
}

/**
 * Service zur Synchronisierung von Daten zwischen lokalem Cache und Cloud-Storage
 */
export class SyncService {
  private syncInProgress: boolean = false;
  private lastSyncTime: number = 0;
  private syncIntervalId: number | null = null;
  private offlineChanges: {
    documents: Record<
      string,
      { action: "add" | "update" | "delete"; data?: DocumentMetadata }
    >;
    tags: Record<string, { action: "add" | "update" | "delete"; data?: any }>;
    settings: boolean;
  } = {
    documents: {},
    tags: {},
    settings: false,
  };

  /**
   * Führt eine vollständige Synchronisierung durch
   */
  public async synchronize(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return {
        success: false,
        documentsChanged: 0,
        tagsChanged: 0,
        errors: ["Sync already in progress"],
      };
    }

    this.syncInProgress = true;
    const result: SyncResult = {
      success: false,
      documentsChanged: 0,
      tagsChanged: 0,
      errors: [],
    };

    try {
      // Prüfe, ob Verbindung zum Cloud-Storage besteht
      if (!cloudStorage.isConnected()) {
        // Kein Cloud-Storage verfügbar, speichere Änderungen für später
        result.errors.push("Not connected to cloud storage");
        return result;
      }

      // 1. Lade Metadaten aus Cloud
      const cloudMetadata = await cloudStorage.loadMetadata();
      if (!cloudMetadata) {
        result.errors.push("Failed to load metadata from cloud");
        return result;
      }

      // 2. Lade lokale Metadaten
      const localMetadata = await localCache.loadMetadata();

      // 3. Führe Synchronisierung durch
      const mergedMetadata = await this.mergeMetadata(
        cloudMetadata,
        localMetadata
      );

      // 4. Speichere Änderungen
      const cloudSaveSuccess = await cloudStorage.saveMetadata(mergedMetadata);
      const localSaveSuccess = await localCache.saveMetadata(mergedMetadata);

      if (!cloudSaveSuccess) {
        result.errors.push("Failed to save metadata to cloud");
      }

      if (!localSaveSuccess) {
        result.errors.push("Failed to save metadata to local cache");
      }

      // Setze Ergebnis
      result.success = cloudSaveSuccess && localSaveSuccess;
      this.lastSyncTime = Date.now();

      // Bereinige Offline-Änderungen
      if (result.success) {
        this.offlineChanges = {
          documents: {},
          tags: {},
          settings: false,
        };
      }

      return result;
    } catch (error) {
      console.error("Sync error:", error);
      result.errors.push(
        `Sync error: ${error instanceof Error ? error.message : String(error)}`
      );
      return result;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Führt eine Zusammenführung von lokalen und Cloud-Metadaten durch
   */
  private async mergeMetadata(
    cloudMetadata: CloudMetadata,
    localMetadata: CloudMetadata | null
  ): Promise<CloudMetadata> {
    // Wenn keine lokalen Metadaten vorhanden sind, verwende Cloud-Metadaten
    if (!localMetadata) {
      return { ...cloudMetadata };
    }

    const result: CloudMetadata = {
      documents: { ...cloudMetadata.documents },
      tags: [...cloudMetadata.tags],
      settings: { ...cloudMetadata.settings },
    };

    // Dokumente zusammenführen (Last-Write-Wins)
    for (const docId in localMetadata.documents) {
      // Prüfe, ob dieses Dokument als Offline-Änderung markiert ist
      if (this.offlineChanges.documents[docId]) {
        const change = this.offlineChanges.documents[docId];

        if (change.action === "delete") {
          delete result.documents[docId];
          result.documentsChanged++;
        } else if (change.action === "add" || change.action === "update") {
          if (change.data) {
            result.documents[docId] = change.data;
            result.documentsChanged++;
          }
        }
      }
      // Ansonsten: Wenn das lokale Dokument neuer ist, verwende es
      else if (
        !cloudMetadata.documents[docId] ||
        new Date(localMetadata.documents[docId].uploadDate) >
          new Date(cloudMetadata.documents[docId].uploadDate)
      ) {
        result.documents[docId] = localMetadata.documents[docId];
        result.documentsChanged++;
      }
    }

    // Tags zusammenführen (Einfacher Vergleich nach ID)
    const cloudTagIds = new Set(cloudMetadata.tags.map((tag) => tag.id));
    const localTagIds = new Set(localMetadata.tags.map((tag) => tag.id));

    // Füge lokale Tags hinzu, die nicht in der Cloud sind
    for (const tag of localMetadata.tags) {
      if (!cloudTagIds.has(tag.id)) {
        result.tags.push(tag);
        result.tagsChanged++;
      }
    }

    // Einstellungen zusammenführen (Nehme lokale Einstellungen, wenn sie vorhanden sind)
    if (this.offlineChanges.settings) {
      result.settings = localMetadata.settings;
    }

    return result;
  }

  /**
   * Startet eine Hintergrund-Synchronisierung
   * @param interval Intervall in Millisekunden
   */
  public startBackgroundSync(interval: number = 300000): void {
    if (this.syncIntervalId !== null) {
      this.stopBackgroundSync();
    }

    this.syncIntervalId = window.setInterval(() => {
      // Prüfe, ob ein Synchronisierungslauf notwendig ist
      if (
        !this.syncInProgress &&
        (Object.keys(this.offlineChanges.documents).length > 0 ||
          Object.keys(this.offlineChanges.tags).length > 0 ||
          this.offlineChanges.settings)
      ) {
        this.synchronize();
      }
    }, interval);
  }

  /**
   * Stoppt die Hintergrund-Synchronisierung
   */
  public stopBackgroundSync(): void {
    if (this.syncIntervalId !== null) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  /**
   * Registriert eine dokumentbezogene Offline-Änderung
   */
  public registerDocumentChange(
    documentId: string,
    action: "add" | "update" | "delete",
    data?: DocumentMetadata
  ): void {
    this.offlineChanges.documents[documentId] = { action, data };
  }

  /**
   * Registriert eine tagbezogene Offline-Änderung
   */
  public registerTagChange(
    tagId: string,
    action: "add" | "update" | "delete",
    data?: any
  ): void {
    this.offlineChanges.tags[tagId] = { action, data };
  }

  /**
   * Registriert eine Einstellungsänderung
   */
  public registerSettingsChange(): void {
    this.offlineChanges.settings = true;
  }

  /**
   * Prüft, ob Offline-Änderungen vorhanden sind
   */
  public hasOfflineChanges(): boolean {
    return (
      Object.keys(this.offlineChanges.documents).length > 0 ||
      Object.keys(this.offlineChanges.tags).length > 0 ||
      this.offlineChanges.settings
    );
  }

  /**
   * Gibt den Zeitpunkt der letzten Synchronisierung zurück
   */
  public getLastSyncTime(): number {
    return this.lastSyncTime;
  }
}

// Singleton-Instanz exportieren
export const syncService = new SyncService();
