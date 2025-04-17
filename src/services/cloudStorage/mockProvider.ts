// src/services/cloudStorage/mockProvider.ts
import {
  CloudProvider,
  ICloudStorageProvider,
  CloudMetadata,
  UploadResult,
  CloudFile,
  Tag,
} from "../../types/cloudStorage";

/**
 * Mock-Provider für Entwicklung und Tests
 * Simuliert einen Cloud-Speicher mit IndexedDB als Hintergrundspeicher
 */
export class MockProvider implements ICloudStorageProvider {
  private isConnected: boolean = false;
  private storage: Record<string, any> = {
    files: {},
    metadata: {
      documents: {},
      tags: [
        { id: "tag1", name: "Invoice", color: "#4285F4" },
        { id: "tag2", name: "Receipt", color: "#0F9D58" },
        { id: "tag3", name: "Contract", color: "#DB4437" },
        { id: "tag4", name: "Personal", color: "#F4B400" },
        { id: "tag5", name: "Work", color: "#AB47BC" },
      ],
      settings: {
        processingMethod: "client-side",
        apiConfigs: [
          { provider: "clarifai", apiKey: "", isActive: false },
          { provider: "google", apiKey: "", isActive: false },
          { provider: "ocrspace", apiKey: "", isActive: false },
        ],
        lastActivity: [],
      },
    },
  };

  constructor() {
    // Lade ggf. vorhandene Mock-Daten aus dem lokalen Speicher
    this.loadMockData();
  }

  private loadMockData(): void {
    try {
      const mockData = localStorage.getItem("docio_mock_storage");
      if (mockData) {
        this.storage = JSON.parse(mockData);
        this.isConnected = true;
      }
    } catch (error) {
      console.error("Error loading mock data:", error);
    }
  }

  private saveMockData(): void {
    try {
      localStorage.setItem("docio_mock_storage", JSON.stringify(this.storage));
    } catch (error) {
      console.error("Error saving mock data:", error);
    }
  }

  /**
   * "Authentifizieren" mit dem Mock-Provider
   * Immer erfolgreich ohne Umleitung
   */
  public async authenticate(): Promise<boolean> {
    // Simuliere eine kurze Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 800));

    this.isConnected = true;
    this.saveMockData();
    return true;
  }

  /**
   * Für den Mock-Provider nicht wirklich benötigt, aber für
   * die Schnittstelle implementiert
   */
  public async handleAuthCallback(code: string): Promise<boolean> {
    this.isConnected = true;
    return true;
  }

  /**
   * Prüfe, ob verbunden
   */
  public isAuthenticated(): boolean {
    return this.isConnected;
  }

  /**
   * Trennt die Verbindung zum Mock-Provider
   */
  public disconnect(): void {
    this.isConnected = false;
  }

  /**
   * Datei in den Mock-Speicher hochladen
   */
  public async uploadFile(file: File, path: string): Promise<UploadResult> {
    if (!this.isConnected) {
      return { success: false, error: "Not connected to mock storage" };
    }

    // Simuliere eine Verzögerung für den Upload
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Erstelle eine eindeutige ID für die Datei
      const fileId = `file_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Simuliere den Pfad
      const fullPath = path ? `/${path}/${file.name}` : `/${file.name}`;

      // Erstelle eine Base64-Darstellung für kleine Vorschaubilder
      let thumbnail: string | undefined = undefined;

      if (file.type.startsWith("image/")) {
        try {
          const reader = new FileReader();
          thumbnail = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        } catch (error) {
          console.error("Error creating thumbnail:", error);
        }
      }

      // Speichere die Datei im Mock-Speicher
      const cloudFile: CloudFile = {
        id: fileId,
        name: file.name,
        path: fullPath,
        size: file.size,
        lastModified: new Date(),
        thumbnail,
      };

      this.storage.files[fileId] = cloudFile;
      this.saveMockData();

      return {
        success: true,
        file: cloudFile,
      };
    } catch (error) {
      console.error("Mock upload error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown mock upload error",
      };
    }
  }

  /**
   * Simuliert das Herunterladen einer Datei
   */
  public async downloadFile(path: string): Promise<Blob | null> {
    if (!this.isConnected) return null;

    // Simuliere eine Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Im Mock-Provider können wir keine echten Dateien zurückgeben
    // Dies würde in einer echten Implementierung anders aussehen
    return new Blob(["Mock file content"], { type: "text/plain" });
  }

  /**
   * Löscht eine Datei aus dem Mock-Speicher
   */
  public async deleteFile(path: string): Promise<boolean> {
    if (!this.isConnected) return false;

    // Simuliere eine Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Finde die Datei anhand des Pfads
    const fileId = Object.keys(this.storage.files).find(
      (key) => this.storage.files[key].path === path
    );

    if (fileId) {
      delete this.storage.files[fileId];
      this.saveMockData();
      return true;
    }

    return false;
  }

  /**
   * Initialisiert die Docio-Struktur (nicht wirklich nötig für den Mock)
   */
  public async initializeDocioFolder(): Promise<boolean> {
    return true; // Im Mock-Provider ist dies immer erfolgreich
  }

  /**
   * Speichert Metadaten im Mock-Speicher
   */
  public async saveMetadata(metadata: CloudMetadata): Promise<boolean> {
    if (!this.isConnected) return false;

    // Simuliere eine Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      this.storage.metadata = { ...metadata };
      this.saveMockData();
      return true;
    } catch (error) {
      console.error("Error saving mock metadata:", error);
      return false;
    }
  }

  /**
   * Lädt Metadaten aus dem Mock-Speicher
   */
  public async loadMetadata(): Promise<CloudMetadata | null> {
    if (!this.isConnected) return null;

    // Simuliere eine Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 300));

    return this.storage.metadata;
  }

  /**
   * Gibt den Typ des aktuellen Providers zurück
   */
  public getCurrentProvider(): CloudProvider {
    return "mock";
  }
}
