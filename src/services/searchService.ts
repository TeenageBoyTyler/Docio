import { cloudStorage, MetadataStorage } from "./cloudStorageService";

// Definition der Suchfilter-Typen
export type SearchFilter = "all" | "text" | "objects";

// Suchoptionen
export interface SearchOptions {
  filter: SearchFilter;
  tags: string[];
}

// Suchergebnis
export interface SearchResult {
  id: string;
  name: string;
  path: string;
  preview?: string; // Optional, kann später geladen werden
  score: number; // Relevanz-Score
  matchType: "text" | "tag" | "object" | "filename";
  tags: string[];
  uploadDate: string;
}

// In-Memory-Cache für Metadaten
let metadataCache: MetadataStorage | null = null;

/**
 * Lädt die Metadaten aus dem Cache oder aus dem Cloud-Speicher
 */
export const loadMetadata = async (): Promise<MetadataStorage> => {
  if (metadataCache) {
    return metadataCache;
  }

  try {
    // Versuche, Metadaten aus dem Cloud-Speicher zu laden
    if (cloudStorage.isConnected()) {
      const cloudMetadata = await cloudStorage.loadMetadata();
      if (cloudMetadata) {
        metadataCache = cloudMetadata;
        return cloudMetadata;
      }
    }

    // Fallback: Leere Metadaten
    return { documents: {} };
  } catch (error) {
    console.error("Error loading metadata:", error);
    return { documents: {} };
  }
};

/**
 * Lädt eine lokale Vorschau für ein Dokument
 */
export const loadDocumentPreview = async (
  documentId: string
): Promise<string | null> => {
  // Hier würden wir die Vorschau aus dem lokalen Cache laden
  // Für den Moment simulieren wir dies mit einer Dummy-URL
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23262626"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Dokument ${documentId}</text></svg>`;
};

/**
 * Berechnet die Relevanz eines Dokuments für eine Suchanfrage
 */
const calculateRelevance = (
  query: string,
  document: any,
  filter: SearchFilter
): {
  score: number;
  matchType: "text" | "tag" | "object" | "filename";
} | null => {
  const queryLower = query.toLowerCase();

  // Wenn kein Query, aber Filter, dann einfach nach dem Filter filtern
  if (!query && filter !== "all") {
    if (filter === "text" && document.ocr && document.ocr.length > 0) {
      return { score: 1, matchType: "text" };
    }
    if (
      filter === "objects" &&
      document.detections &&
      document.detections.length > 0
    ) {
      return { score: 1, matchType: "object" };
    }
    return null;
  }

  // Dateiname prüfen
  if (filter === "all" || filter === "text") {
    const filename = document.path.split("/").pop()?.toLowerCase() || "";
    if (filename.includes(queryLower)) {
      return { score: 0.8, matchType: "filename" };
    }
  }

  // Text prüfen
  if (filter === "all" || filter === "text") {
    if (document.ocr && document.ocr.toLowerCase().includes(queryLower)) {
      // Höherer Score für exakte Treffer
      const score = document.ocr.toLowerCase() === queryLower ? 1 : 0.7;
      return { score, matchType: "text" };
    }
  }

  // Tags prüfen
  if (filter === "all") {
    if (
      document.tags &&
      document.tags.some((tag: string) =>
        tag.toLowerCase().includes(queryLower)
      )
    ) {
      return { score: 0.9, matchType: "tag" };
    }
  }

  // Objekte prüfen
  if (filter === "all" || filter === "objects") {
    if (
      document.detections &&
      document.detections.some((detection: string) =>
        detection.toLowerCase().includes(queryLower)
      )
    ) {
      return { score: 0.6, matchType: "object" };
    }
  }

  return null;
};

/**
 * Sucht nach Dokumenten basierend auf einer Suchanfrage
 */
export const searchDocuments = async (
  query: string,
  options: SearchOptions = { filter: "all", tags: [] }
): Promise<SearchResult[]> => {
  const { filter, tags } = options;

  // Metadaten laden
  const metadata = await loadMetadata();

  // Ergebnisse sammeln
  const results: SearchResult[] = [];

  // Durch alle Dokumente iterieren
  for (const [id, document] of Object.entries(metadata.documents)) {
    // Tag-Filter anwenden
    if (tags.length > 0) {
      // Prüfen, ob das Dokument alle ausgewählten Tags hat
      const documentTags = document.tags || [];
      const hasAllTags = tags.every((tag) => documentTags.includes(tag));
      if (!hasAllTags) continue; // Überspringe dieses Dokument
    }

    // Wenn kein Query, aber Tags ausgewählt, dann trotzdem hinzufügen
    if (!query.trim() && tags.length > 0) {
      results.push({
        id,
        name: document.path.split("/").pop() || "Unbekannt",
        path: document.path,
        score: 1,
        matchType: "tag",
        tags: document.tags || [],
        uploadDate: document.uploadDate,
      });
      continue;
    }

    // Relevanz berechnen
    const relevance = calculateRelevance(query, document, filter);

    if (relevance) {
      results.push({
        id,
        name: document.path.split("/").pop() || "Unbekannt",
        path: document.path,
        score: relevance.score,
        matchType: relevance.matchType,
        tags: document.tags || [],
        uploadDate: document.uploadDate,
      });
    }
  }

  // Nach Relevanz sortieren
  results.sort((a, b) => b.score - a.score);

  return results;
};

/**
 * Lädt Vorschaubilder für Suchergebnisse
 */
export const loadPreviewsForResults = async (
  results: SearchResult[]
): Promise<SearchResult[]> => {
  // Parallel Vorschaubilder laden
  const resultsWithPreviews = await Promise.all(
    results.map(async (result) => {
      const preview = await loadDocumentPreview(result.id);
      return {
        ...result,
        preview: preview || undefined,
      };
    })
  );

  return resultsWithPreviews;
};

/**
 * Löscht den Metadaten-Cache
 */
export const clearMetadataCache = (): void => {
  metadataCache = null;
};
