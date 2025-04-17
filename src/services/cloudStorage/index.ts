// src/services/cloudStorage/index.ts
import {
  CloudProvider,
  ICloudStorageProvider,
  CloudMetadata,
  UploadResult,
  CloudStorageConfig,
} from "../../types/cloudStorage";
import { DropboxProvider } from "./dropboxProvider";
import { MockProvider } from "./mockProvider";

class CloudStorageService {
  private provider: ICloudStorageProvider | null = null;
  private config: CloudStorageConfig | null = null;

  constructor() {
    // Versuche die gespeicherte Konfiguration zu laden
    this.loadConfig();
  }

  // Lade die Konfiguration aus dem lokalen Speicher
  private loadConfig(): void {
    try {
      const savedConfig = localStorage.getItem("docio_cloud_config");
      if (savedConfig) {
        this.config = JSON.parse(savedConfig);
        this.initializeProvider();
      }
    } catch (error) {
      console.error("Error loading cloud storage config:", error);
    }
  }

  // Speichere die Konfiguration im lokalen Speicher
  private saveConfig(): void {
    if (this.config) {
      localStorage.setItem("docio_cloud_config", JSON.stringify(this.config));
    } else {
      localStorage.removeItem("docio_cloud_config");
    }
  }

  // Initialisiere den Provider basierend auf der Konfiguration
  private initializeProvider(): void {
    if (!this.config) return;

    switch (this.config.provider) {
      case "dropbox":
        this.provider = new DropboxProvider(this.config);
        break;
      case "mock":
        this.provider = new MockProvider();
        break;
      // Andere Provider hier hinzufügen
      default:
        console.error("Unsupported cloud provider");
        this.provider = null;
    }
  }

  /**
   * Verbinde mit einem Cloud-Provider
   * @param provider Der zu verwendende Cloud-Provider
   * @returns true, wenn die Verbindung erfolgreich initiiert wurde
   */
  public async connect(provider: CloudProvider): Promise<boolean> {
    // Setze die Provider-Konfiguration
    this.config = { provider };
    this.saveConfig();

    // Initialisiere den ausgewählten Provider
    this.initializeProvider();

    if (!this.provider) return false;

    // Starte den Authentifizierungsprozess
    return this.provider.authenticate();
  }

  /**
   * Verarbeite den OAuth-Rückruf
   * @param code Der Autorisierungscode vom OAuth-Anbieter
   * @returns true, wenn die Authentifizierung erfolgreich war
   */
  public async handleAuthCallback(code: string): Promise<boolean> {
    if (!this.provider) return false;

    try {
      const success = await this.provider.handleAuthCallback(code);

      // Aktualisiere die lokale Konfiguration nach erfolgreicher Auth
      if (success) {
        // Initialisiere den .docio/-Ordner in der Cloud
        await this.provider.initializeDocioFolder();
      }

      return success;
    } catch (error) {
      console.error("Error handling auth callback:", error);
      return false;
    }
  }

  /**
   * Prüfe, ob eine Verbindung zu einem Cloud-Provider besteht
   * @returns true, wenn verbunden
   */
  public isConnected(): boolean {
    if (!this.provider) return false;
    return this.provider.isAuthenticated();
  }

  /**
   * Trenne die Verbindung zum Cloud-Provider
   */
  public disconnect(): void {
    if (this.provider) {
      this.provider.disconnect();
    }

    this.provider = null;
    this.config = null;
    this.saveConfig();
    localStorage.removeItem("docio_auth_provider");
  }

  /**
   * Lade Datei in den Cloud-Speicher hoch
   * @param file Die hochzuladende Datei
   * @param path Der Zielpfad in der Cloud
   * @returns Ergebnis des Uploads
   */
  public async uploadFile(file: File, path: string): Promise<UploadResult> {
    if (!this.provider) {
      return { success: false, error: "Not connected to cloud storage" };
    }

    try {
      return await this.provider.uploadFile(file, path);
    } catch (error) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
      };
    }
  }

  /**
   * Speichere Metadaten in der Cloud
   * @param metadata Die zu speichernden Metadaten
   * @returns true, wenn erfolgreich
   */
  public async saveMetadata(metadata: CloudMetadata): Promise<boolean> {
    if (!this.provider) return false;

    try {
      return await this.provider.saveMetadata(metadata);
    } catch (error) {
      console.error("Error saving metadata:", error);
      return false;
    }
  }

  /**
   * Lade Metadaten aus der Cloud
   * @returns Die geladenen Metadaten oder null bei Fehler
   */
  public async loadMetadata(): Promise<CloudMetadata | null> {
    if (!this.provider) return null;

    try {
      return await this.provider.loadMetadata();
    } catch (error) {
      console.error("Error loading metadata:", error);
      return null;
    }
  }

  /**
   * Lade App-Einstellungen aus den Metadaten
   * @returns Die App-Einstellungen oder null bei Fehler
   */
  public async loadSettings(): Promise<CloudMetadata["settings"] | null> {
    const metadata = await this.loadMetadata();
    return metadata?.settings || null;
  }

  /**
   * Aktueller Cloud-Provider
   * @returns Der Name des aktuell verbundenen Providers oder null
   */
  public getCurrentProvider(): CloudProvider | null {
    if (!this.provider) return null;
    return this.provider.getCurrentProvider();
  }
}

// Singleton-Instanz exportieren
export const cloudStorage = new CloudStorageService();
