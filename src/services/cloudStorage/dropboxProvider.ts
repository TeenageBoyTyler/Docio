// src/services/cloudStorage/dropboxProvider.ts
import { Dropbox } from "dropbox";
import {
  CloudProvider,
  ICloudStorageProvider,
  CloudMetadata,
  UploadResult,
  CloudFile,
  CloudStorageConfig,
} from "../../types/cloudStorage";

// In einer echten Anwendung würden diese in einer .env Datei gespeichert
const DROPBOX_APP_KEY = "YOUR_DROPBOX_APP_KEY";
const DROPBOX_REDIRECT_URI = "http://localhost:5173/auth/callback";

/**
 * Dropbox-spezifischer Cloud-Storage-Provider
 */
export class DropboxProvider implements ICloudStorageProvider {
  private dropbox: Dropbox | null = null;
  private config: CloudStorageConfig;

  constructor(config: CloudStorageConfig) {
    this.config = config;
    this.initializeDropbox();
  }

  /**
   * Initialisiert die Dropbox-SDK mit dem aktuellen Token
   */
  private initializeDropbox(): void {
    if (!this.config?.accessToken) return;

    this.dropbox = new Dropbox({
      accessToken: this.config.accessToken,
      refreshToken: this.config.refreshToken,
      clientId: DROPBOX_APP_KEY,
    });
  }

  /**
   * Initiiert den OAuth-Flow für die Dropbox-Authentifizierung
   */
  public async authenticate(): Promise<boolean> {
    try {
      const dropbox = new Dropbox({ clientId: DROPBOX_APP_KEY });
      const authUrl = dropbox.getAuthenticationUrl(
        DROPBOX_REDIRECT_URI,
        undefined,
        "code",
        "offline",
        undefined,
        undefined,
        true
      );

      // Speichere den Status für den Callback
      localStorage.setItem("docio_auth_provider", "dropbox");

      // Leite zur Dropbox-Authentifizierungsseite weiter
      window.location.href = authUrl;
      return true;
    } catch (error) {
      console.error("Dropbox connection error:", error);
      return false;
    }
  }

  /**
   * Verarbeitet den Callback der OAuth-Authentifizierung
   */
  public async handleAuthCallback(code: string): Promise<boolean> {
    try {
      const dropbox = new Dropbox({ clientId: DROPBOX_APP_KEY });
      const response = await dropbox.getAccessTokenFromCode(
        DROPBOX_REDIRECT_URI,
        code
      );

      // Aktualisiere die Konfiguration
      this.config = {
        ...this.config,
        accessToken: response.result.access_token,
        refreshToken: response.result.refresh_token,
        expiration: Date.now() + response.result.expires_in * 1000,
      };

      // Speichere die Konfiguration im lokalen Speicher
      localStorage.setItem("docio_cloud_config", JSON.stringify(this.config));

      // Initialisiere die Dropbox-Instanz
      this.initializeDropbox();

      return true;
    } catch (error) {
      console.error("Dropbox auth callback error:", error);
      return false;
    }
  }

  /**
   * Prüft, ob der Benutzer bei Dropbox authentifiziert ist
   */
  public isAuthenticated(): boolean {
    if (!this.config?.accessToken) return false;

    // Prüfe, ob das Token abgelaufen ist
    if (this.config.expiration && Date.now() > this.config.expiration) {
      this.refreshToken();
      return false;
    }

    return true;
  }

  /**
   * Aktualisiert das Token, wenn es abgelaufen ist
   */
  private async refreshToken(): Promise<boolean> {
    if (!this.config?.refreshToken) return false;

    try {
      const dropbox = new Dropbox({ clientId: DROPBOX_APP_KEY });
      const response = await dropbox.refreshAccessToken(
        this.config.refreshToken
      );

      // Aktualisiere die Konfiguration
      this.config = {
        ...this.config,
        accessToken: response.result.access_token,
        expiration: Date.now() + response.result.expires_in * 1000,
      };

      // Speichere die Konfiguration im lokalen Speicher
      localStorage.setItem("docio_cloud_config", JSON.stringify(this.config));

      // Initialisiere die Dropbox-Instanz neu
      this.initializeDropbox();

      return true;
    } catch (error) {
      console.error("Dropbox token refresh error:", error);
      return false;
    }
  }

  /**
   * Trennt die Verbindung zu Dropbox
   */
  public disconnect(): void {
    this.dropbox = null;
  }

  /**
   * Lädt eine Datei in Dropbox hoch
   */
  public async uploadFile(file: File, path: string): Promise<UploadResult> {
    if (!this.dropbox) {
      return { success: false, error: "Not connected to Dropbox" };
    }

    try {
      // Datei in Dropbox hochladen
      const response = await this.dropbox.filesUpload({
        path: `/${path}/${file.name}`,
        contents: file,
        mode: { ".tag": "overwrite" },
        autorename: true,
      });

      // Erfolgreicher Upload
      return {
        success: true,
        file: {
          id: response.result.id,
          name: response.result.name,
          path: response.result.path_display || "",
          size: response.result.size,
          lastModified: new Date(response.result.client_modified),
        },
      };
    } catch (error) {
      console.error("Dropbox upload error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Dropbox upload error",
      };
    }
  }

  /**
   * Lädt eine Datei von Dropbox herunter
   */
  public async downloadFile(path: string): Promise<Blob | null> {
    if (!this.dropbox) return null;

    try {
      const response = await this.dropbox.filesDownload({
        path: path,
      });

      // @ts-ignore - Die Dropbox-API-Typdefintionen sind nicht optimal
      return response.result.fileBlob;
    } catch (error) {
      console.error("Dropbox download error:", error);
      return null;
    }
  }

  /**
   * Löscht eine Datei von Dropbox
   */
  public async deleteFile(path: string): Promise<boolean> {
    if (!this.dropbox) return false;

    try {
      await this.dropbox.filesDeleteV2({
        path: path,
      });
      return true;
    } catch (error) {
      console.error("Dropbox delete error:", error);
      return false;
    }
  }

  /**
   * Initialisiert den .docio Ordner in Dropbox, falls er nicht existiert
   */
  public async initializeDocioFolder(): Promise<boolean> {
    if (!this.dropbox) return false;

    try {
      // Prüfe, ob der .docio-Ordner existiert
      try {
        await this.dropbox.filesGetMetadata({
          path: "/.docio",
        });
        return true; // Ordner existiert bereits
      } catch (error) {
        // Ordner existiert nicht, erstelle ihn
        await this.dropbox.filesCreateFolderV2({
          path: "/.docio",
        });
        return true;
      }
    } catch (error) {
      console.error("Error initializing .docio folder:", error);
      return false;
    }
  }

  /**
   * Speichert Metadaten in Dropbox
   */
  public async saveMetadata(metadata: CloudMetadata): Promise<boolean> {
    if (!this.dropbox) return false;

    try {
      // Stelle sicher, dass der .docio-Ordner existiert
      await this.initializeDocioFolder();

      // Speichere die einzelnen Metadatendateien
      const saves = await Promise.all([
        this.saveMetadataFile("documents.json", metadata.documents),
        this.saveMetadataFile("tags.json", metadata.tags),
        this.saveMetadataFile("settings.json", metadata.settings),
      ]);

      return saves.every((success) => success);
    } catch (error) {
      console.error("Dropbox metadata save error:", error);
      return false;
    }
  }

  /**
   * Hilfsfunktion zum Speichern einer Metadatendatei in Dropbox
   */
  private async saveMetadataFile(
    filename: string,
    data: any
  ): Promise<boolean> {
    if (!this.dropbox) return false;

    try {
      const content = JSON.stringify(data, null, 2);
      const metadataBlob = new Blob([content], { type: "application/json" });

      await this.dropbox.filesUpload({
        path: `/.docio/${filename}`,
        contents: metadataBlob as any,
        mode: { ".tag": "overwrite" },
      });

      return true;
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
      return false;
    }
  }

  /**
   * Lädt Metadaten aus Dropbox
   */
  public async loadMetadata(): Promise<CloudMetadata | null> {
    if (!this.dropbox) return null;

    try {
      // Stelle sicher, dass der .docio-Ordner existiert
      const folderExists = await this.initializeDocioFolder();
      if (!folderExists) return null;

      // Lade die einzelnen Metadatendateien
      const [documents, tags, settings] = await Promise.all([
        this.loadMetadataFile<Record<string, any>>("documents.json", {}),
        this.loadMetadataFile<any[]>("tags.json", []),
        this.loadMetadataFile<any>("settings.json", {
          processingMethod: "client-side",
          apiConfigs: [
            { provider: "clarifai", apiKey: "", isActive: false },
            { provider: "google", apiKey: "", isActive: false },
            { provider: "ocrspace", apiKey: "", isActive: false },
          ],
          lastActivity: [],
        }),
      ]);

      return {
        documents,
        tags,
        settings,
      };
    } catch (error) {
      console.error("Error loading metadata:", error);
      return null;
    }
  }

  /**
   * Hilfsfunktion zum Laden einer Metadatendatei aus Dropbox
   */
  private async loadMetadataFile<T>(
    filename: string,
    defaultValue: T
  ): Promise<T> {
    if (!this.dropbox) return defaultValue;

    try {
      const response = await this.dropbox.filesDownload({
        path: `/.docio/${filename}`,
      });

      // @ts-ignore - Die Dropbox-API-Typdefintionen sind nicht optimal
      const fileBlob = response.result.fileBlob;
      const content = await fileBlob.text();

      return JSON.parse(content) as T;
    } catch (error) {
      // Wenn die Datei nicht existiert, gib den Standardwert zurück
      if ((error as any)?.status === 409) {
        return defaultValue;
      }

      console.error(`Error loading ${filename}:`, error);
      return defaultValue;
    }
  }

  /**
   * Gibt den Typ des aktuellen Providers zurück
   */
  public getCurrentProvider(): CloudProvider {
    return "dropbox";
  }
}
