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
import {
  searchDocuments,
  SearchResult,
  SearchOptions,
  SearchFilter,
} from "../services/searchService";

// Typen für den Such-Kontext
export interface SearchDocument {
  id: string;
  name: string;
  path: string;
  preview: string;
  tags: string[];
  uploadDate: string;
}

// Schritt im Suchprozess
export type SearchStep = "input" | "results" | "actions" | "pdfCreation";

// Such-Kontext Interface
interface SearchContextType {
  // Zustände
  query: string;
  results: SearchResult[];
  selectedDocuments: SearchDocument[];
  currentStep: SearchStep;
  isLoading: boolean;
  filter: SearchFilter;
  selectedTags: string[];

  // Aktionen
  setQuery: (query: string) => void;
  search: () => void;
  selectDocument: (document: SearchDocument) => void;
  unselectDocument: (documentId: string) => void;
  clearSelection: () => void;
  goToStep: (step: SearchStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  createPdf: (orientation: "portrait" | "landscape") => Promise<string | null>;

  // Filter
  setFilter: (filter: SearchFilter) => void;
  toggleTagFilter: (tag: string) => void;
  clearFilters: () => void;
}

// Erstelle den Kontext
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Hook für einfachen Zugriff auf den Such-Kontext
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

// Props für den Provider
interface SearchProviderProps {
  children: ReactNode;
}

// Provider-Komponente
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  // Basis-Zustände
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<SearchDocument[]>(
    []
  );
  const [currentStep, setCurrentStep] = useState<SearchStep>("input");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter-Zustände
  const [filter, setFilter] = useState<SearchFilter>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Toast-Benachrichtigungen
  const { showToast } = useToast();

  // Effekt zum Laden der Vorschaubilder für Ergebnisse
  useEffect(() => {
    // Hier könnten wir die Vorschaubilder für die Suchergebnisse laden
    // Für den Moment lassen wir das leer
  }, [results]);

  // Hauptsuchfunktion
  const search = useCallback(async () => {
    if (!query.trim() && selectedTags.length === 0) {
      showToast(
        "Bitte geben Sie eine Suchanfrage ein oder wählen Sie Tags aus",
        "warning"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Suchoptionen basierend auf Filtern
      const options: SearchOptions = {
        filter,
        tags: selectedTags,
      };

      // Suche durchführen
      const searchResults = await searchDocuments(query, options);

      setResults(searchResults);

      // Automatisch zum Ergebnisschritt wechseln
      setCurrentStep("results");

      if (searchResults.length === 0) {
        showToast("Keine Ergebnisse gefunden", "info");
      }
    } catch (error) {
      console.error("Search error:", error);
      showToast(
        "Fehler bei der Suche. Bitte versuchen Sie es erneut.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [query, filter, selectedTags, showToast]);

  // Dokument auswählen
  const selectDocument = useCallback((document: SearchDocument) => {
    setSelectedDocuments((prev) => {
      // Prüfen, ob das Dokument bereits ausgewählt ist
      if (prev.some((doc) => doc.id === document.id)) {
        return prev;
      }
      return [...prev, document];
    });
  }, []);

  // Dokument aus der Auswahl entfernen
  const unselectDocument = useCallback((documentId: string) => {
    setSelectedDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  }, []);

  // Auswahl löschen
  const clearSelection = useCallback(() => {
    setSelectedDocuments([]);
  }, []);

  // Zu einem bestimmten Schritt gehen
  const goToStep = useCallback((step: SearchStep) => {
    setCurrentStep(step);
  }, []);

  // Zum nächsten Schritt gehen
  const goToNextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      switch (prevStep) {
        case "input":
          return "results";
        case "results":
          return "actions";
        case "actions":
          return "pdfCreation";
        default:
          return prevStep;
      }
    });
  }, []);

  // Zum vorherigen Schritt gehen
  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      switch (prevStep) {
        case "results":
          return "input";
        case "actions":
          return "results";
        case "pdfCreation":
          return "actions";
        default:
          return prevStep;
      }
    });
  }, []);

  // PDF erstellen
  const createPdf = useCallback(
    async (orientation: "portrait" | "landscape") => {
      if (selectedDocuments.length === 0) {
        showToast("Bitte wählen Sie zuerst Dokumente aus", "warning");
        return null;
      }

      setIsLoading(true);

      try {
        // Hier würde tatsächlich die PDF erstellt werden
        // Für jetzt nur simulieren
        await new Promise((resolve) => setTimeout(resolve, 1500));

        showToast("PDF erfolgreich erstellt", "success");
        return "dummy-pdf-url.pdf"; // Dummy-URL
      } catch (error) {
        console.error("PDF creation error:", error);
        showToast("Fehler bei der PDF-Erstellung", "error");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedDocuments, showToast]
  );

  // Filter-Funktionen
  const toggleTagFilter = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  // Alle Filter zurücksetzen
  const clearFilters = useCallback(() => {
    setFilter("all");
    setSelectedTags([]);
  }, []);

  // Kontext-Wert
  const value = {
    query,
    results,
    selectedDocuments,
    currentStep,
    isLoading,
    filter,
    selectedTags,

    setQuery,
    search,
    selectDocument,
    unselectDocument,
    clearSelection,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    createPdf,

    setFilter,
    toggleTagFilter,
    clearFilters,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export default SearchProvider;
