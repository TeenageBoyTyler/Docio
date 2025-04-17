// src/services/localCacheService.ts
import { openDB, IDBPDatabase } from "idb";
import { CloudMetadata, DocumentMetadata, Tag } from "../types/cloudStorage";

interface DocioDBSchema {
  metadata: {
    key: string;
    value: any;
  };
  thumbnails: {
    key: string;
    value: string; // Base64 encoded thumbnail
  };
  documents: {
    key: string; // document id
    value: DocumentMetadata;
    indexes: { "by-date": string };
  };
}

/**
 * Service für lokales Caching von Dokumenten, Metadaten und Thumbnails
 * Verwendet IndexedDB für persistenten Speicher
 */
export class LocalCacheService {
  private db: IDBPDatabase<DocioDBSchema> | null = null;
  private readonly DB_NAME = "docio-cache";
  private readonly DB_VERSION = 1;

  /**
   * Initialisiert die IndexedDB-Datenbank
   */
  public async initialize(): Promise<boolean> {
    try {
      this.db = await openDB<DocioDBSchema>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // Metadaten-Store
          if (!db.objectStoreNames.contains("metadata")) {
            db.createObjectStore("metadata");
          }

          // Thumbnails-Store
          if (!db.objectStoreNames.contains("thumbnails")) {
            db.createObjectStore("thumbnails");
          }

          // Dokumente-Store mit Index für Datumssortierung
          if (!db.objectStoreNames.contains("documents")) {
            const documentStore = db.createObjectStore("documents", {
              keyPath: "id",
            });
            documentStore.createIndex("by-date", "uploadDate");
          }
        },
      });

      return true;
    } catch (error) {
      console.error("Error initializing local cache:", error);
      return false;
    }
  }

  /**
   * Prüft, ob die Datenbank initialisiert ist und initialisiert sie bei Bedarf
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }
  }

  /**
   * Speichert Metadaten im lokalen Cache
   * @param metadata Die zu speichernden Metadaten
   */
  public async saveMetadata(metadata: CloudMetadata): Promise<boolean> {
    await this.ensureInitialized();
    if (!this.db) return false;

    try {
      const tx = this.db.transaction("metadata", "readwrite");

      // Speichere die einzelnen Teile der Metadaten
      await tx.store.put(metadata.documents, "documents");
      await tx.store.put(metadata.tags, "tags");
      await tx.store.put(metadata.settings, "settings");

      // Speichere auch jedes Dokument im documents-Store für schnellen Zugriff
      const docTx = this.db.transaction("documents", "readwrite");
      for (const docId in metadata.documents) {
        await docTx.store.put(metadata.documents[docId]);
      }

      await tx.done;
      await docTx.done;
      return true;
    } catch (error) {
      console.error("Error saving metadata to local cache:", error);
      return false;
    }
  }

  /**
   * Lädt Metadaten aus dem lokalen Cache
   */
  public async loadMetadata(): Promise<CloudMetadata | null> {
    await this.ensureInitialized();
    if (!this.db) return null;

    try {
      const tx = this.db.transaction("metadata", "readonly");

      // Lade die einzelnen Teile der Metadaten
      const documents = (await tx.store.get("documents")) || {};
      const tags = (await tx.store.get("tags")) || [];
      const settings = (await tx.store.get("settings")) || {
        processingMethod: "client-side",
        apiConfigs: [],
        lastActivity: [],
      };

      return { documents, tags, settings };
    } catch (error) {
      console.error("Error loading metadata from local cache:", error);
      return null;
    }
  }

  /**
   * Speichert ein Thumbnail im lokalen Cache
   * @param documentId Die Dokument-ID
   * @param thumbnail Das Thumbnail als Base64-String
   */
  public async saveThumbnail(
    documentId: string,
    thumbnail: string
  ): Promise<boolean> {
    await this.ensureInitialized();
    if (!this.db) return false;

    try {
      await this.db.put("thumbnails", thumbnail, documentId);
      return true;
    } catch (error) {
      console.error("Error saving thumbnail to local cache:", error);
      return false;
    }
  }

  /**
   * Lädt ein Thumbnail aus dem lokalen Cache
   * @param documentId Die Dokument-ID
   */
  public async loadThumbnail(documentId: string): Promise<string | null> {
    await this.ensureInitialized();
    if (!this.db) return null;

    try {
      return await this.db.get("thumbnails", documentId);
    } catch (error) {
      console.error("Error loading thumbnail from local cache:", error);
      return null;
    }
  }

  /**
   * Speichert ein Dokument im lokalen Cache
   * @param document Das zu speichernde Dokument
   */
  public async saveDocument(document: DocumentMetadata): Promise<boolean> {
    await this.ensureInitialized();
    if (!this.db) return false;

    try {
      await this.db.put("documents", document);
      return true;
    } catch (error) {
      console.error("Error saving document to local cache:", error);
      return false;
    }
  }

  /**
   * Lädt ein Dokument aus dem lokalen Cache
   * @param documentId Die Dokument-ID
   */
  public async loadDocument(
    documentId: string
  ): Promise<DocumentMetadata | null> {
    await this.ensureInitialized();
    if (!this.db) return null;

    try {
      return await this.db.get("documents", documentId);
    } catch (error) {
      console.error("Error loading document from local cache:", error);
      return null;
    }
  }

  /**
   * Lädt alle Dokumente aus dem lokalen Cache
   * @param limit Optionale Begrenzung der Anzahl
   * @param offset Optionaler Offset
   */
  public async loadAllDocuments(
    limit?: number,
    offset?: number
  ): Promise<DocumentMetadata[]> {
    await this.ensureInitialized();
    if (!this.db) return [];

    try {
      const tx = this.db.transaction("documents", "readonly");
      const index = tx.store.index("by-date");

      // Lade alle Dokumente, sortiert nach Datum
      let cursor = await index.openCursor(null, "prev"); // Neueste zuerst

      // Überspringe den Offset
      if (offset && offset > 0) {
        let skipCount = 0;
        while (cursor && skipCount < offset) {
          cursor = await cursor.continue();
          skipCount++;
        }
      }

      // Sammle Dokumente bis zum Limit
      const documents: DocumentMetadata[] = [];
      while (cursor && (!limit || documents.length < limit)) {
        documents.push(cursor.value);
        cursor = await cursor.continue();
      }

      return documents;
    } catch (error) {
      console.error("Error loading documents from local cache:", error);
      return [];
    }
  }

  /**
   * Löscht ein Dokument aus dem lokalen Cache
   * @param documentId Die Dokument-ID
   */
  public async deleteDocument(documentId: string): Promise<boolean> {
    await this.ensureInitialized();
    if (!this.db) return false;

    try {
      await this.db.delete("documents", documentId);
      await this.db.delete("thumbnails", documentId);
      return true;
    } catch (error) {
      console.error("Error deleting document from local cache:", error);
      return false;
    }
  }

  /**
   * Löscht alle lokalen Daten
   */
  public async clearAllData(): Promise<boolean> {
    await this.ensureInitialized();
    if (!this.db) return false;

    try {
      const tx1 = this.db.transaction("metadata", "readwrite");
      await tx1.store.clear();

      const tx2 = this.db.transaction("thumbnails", "readwrite");
      await tx2.store.clear();

      const tx3 = this.db.transaction("documents", "readwrite");
      await tx3.store.clear();

      await tx1.done;
      await tx2.done;
      await tx3.done;
      return true;
    } catch (error) {
      console.error("Error clearing local cache:", error);
      return false;
    }
  }
}

// Singleton-Instanz exportieren
export const localCache = new LocalCacheService();
