// src/types/cloudStorage.ts
import { Tag } from "../context/UploadContext";

export type CloudProvider = "dropbox" | "google-drive" | "onedrive" | "mock";

export type ProcessingMethod = "client-side" | "api";

export interface CloudFile {
  id: string;
  name: string;
  path: string;
  size: number;
  lastModified: Date;
  thumbnail?: string; // Base64 oder URL zum Vorschaubild
}

export interface CloudMetadata {
  documents: Record<string, DocumentMetadata>;
  tags: Tag[];
  settings: AppSettings;
}

export interface DocumentMetadata {
  id: string;
  path: string;
  name: string;
  tags: string[];
  ocr: string;
  detections: string[];
  uploadDate: string;
  preview?: string;
}

export interface AppSettings {
  processingMethod: ProcessingMethod;
  apiConfigs: ApiConfig[];
  lastActivity: { action: string; timestamp: string }[];
}

export interface ApiConfig {
  provider: string;
  apiKey: string;
  isActive: boolean;
}

export interface CloudStorageConfig {
  provider: CloudProvider;
  accessToken?: string;
  refreshToken?: string;
  expiration?: number;
}

export interface UploadResult {
  success: boolean;
  file?: CloudFile;
  error?: string;
}

export interface ICloudStorageProvider {
  // Authentifizierung
  authenticate(): Promise<boolean>;
  handleAuthCallback(code: string): Promise<boolean>;
  isAuthenticated(): boolean;
  disconnect(): void;

  // Dateioperationen
  uploadFile(file: File, path: string): Promise<UploadResult>;
  downloadFile(path: string): Promise<Blob | null>;
  deleteFile(path: string): Promise<boolean>;

  // Metadaten-Operationen
  initializeDocioFolder(): Promise<boolean>;
  saveMetadata(metadata: CloudMetadata): Promise<boolean>;
  loadMetadata(): Promise<CloudMetadata | null>;

  // Hilfsfunktionen
  getCurrentProvider(): CloudProvider | null;
}
