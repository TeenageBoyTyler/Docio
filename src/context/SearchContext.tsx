// src/context/SearchContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { Tag } from "./UploadContext"; // Import Tag type
import { useToast } from "./ToastContext";
import { useProfile } from "./ProfileContext"; // Import Profile context
import { triggerTagSync } from "../components/shared/tags/TagSynchronizer"; // Import sync trigger

// Search result type
export interface SearchResult {
  id: string;
  name: string;
  preview?: string;
  match: {
    text?: string;
    object?: string;
    tag?: string;
  };
  uploadDate: string;
  tags: string[];
}

// Types for the search context
export type SearchStep = "input" | "results" | "actions" | "export";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentStep: SearchStep;
  goToStep: (step: SearchStep) => void;
  selectedResults: SearchResult[];
  searchResults: SearchResult[];
  selectResult: (id: string) => void;
  unselectResult: (id: string) => void;
  clearSelection: () => void;
  selectedTags: string[]; // This should be tag IDs
  toggleTagFilter: (tagId: string) => void; // Changed to use tagId
  clearTagFilters: () => void;
  isLoading: boolean;
  pdfOrientation: "portrait" | "landscape";
  setPdfOrientation: (orientation: "portrait" | "landscape") => void;
  createPdf: () => Promise<boolean>;
  // Add methods for tag synchronization
  availableTags: Tag[]; // To store available tags from Profile
  setAvailableTagsInSearch: (tags: Tag[]) => void; // To update tags
  // For backward compatibility with your existing code
  query: string;
  setQuery: (query: string) => void;
  search: () => void;
  clearFilters: () => void;
  results: SearchResult[];
  selectedDocuments: SearchResult[];
  filter: any;
}

// Create the context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Hook for easy access to the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

// Provider props
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  // Get Profile tags directly
  const { availableTags: profileTags } = useProfile();

  // State for search term and results
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<SearchStep>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfOrientation, setPdfOrientation] = useState<
    "portrait" | "landscape"
  >("portrait");

  // Add state for available tags - always empty by default
  // Tags will be populated from ProfileContext
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // Debugging log to confirm no default tags
  useEffect(() => {
    console.log(
      "[SearchContext] Initialized with",
      availableTags.length,
      "tags"
    );
  }, []);

  // Directly sync with Profile tags whenever they change
  useEffect(() => {
    if (profileTags.length > 0) {
      console.log(
        `[SearchContext] Syncing ${profileTags.length} tags from Profile`
      );
      setAvailableTags(profileTags);
    }
  }, [profileTags]);

  // Trigger sync on mount and periodically
  useEffect(() => {
    console.log("[SearchContext] Component mounted, triggering tag sync");

    // Initial sync
    triggerTagSync();

    // Periodic sync
    const intervalId = setInterval(() => {
      triggerTagSync();
    }, 3000); // Every 3 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Get toast notifications
  const { showToast } = useToast();

  // Method to update available tags from external sources (like ProfileContext)
  const setAvailableTagsInSearch = useCallback((tags: Tag[]) => {
    console.log(
      `[SearchContext] Received ${tags.length} tags from external source`
    );
    if (tags && tags.length > 0) {
      setAvailableTags(tags);
    }
  }, []);

  // Go to a specific step
  const goToStep = useCallback((step: SearchStep) => {
    setCurrentStep(step);
  }, []);

  // Handle selection of a search result
  const selectResult = useCallback(
    (id: string) => {
      const result = searchResults.find((r) => r.id === id);
      if (result && !selectedResults.some((r) => r.id === id)) {
        setSelectedResults((prev) => [...prev, result]);
      }
    },
    [searchResults, selectedResults]
  );

  // Handle deselection of a search result
  const unselectResult = useCallback((id: string) => {
    setSelectedResults((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedResults([]);
  }, []);

  // Toggle tag filter - Updated to use tag IDs consistently and with better logging
  const toggleTagFilter = useCallback((tagId: string) => {
    console.log(`[SearchContext] Toggling tag filter for ID: ${tagId}`);
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  }, []);

  // Clear all tag filters
  const clearTagFilters = useCallback(() => {
    console.log("[SearchContext] Clearing all tag filters");
    setSelectedTags([]);
  }, []);

  // Search function
  const search = useCallback(() => {
    if (!searchTerm) return;

    setIsLoading(true);

    // Simulate a search delay
    setTimeout(() => {
      // Here would be the actual search call
      // For now we're just showing loading state and moving to the next step
      setIsLoading(false);
      goToStep("results");
    }, 500);
  }, [searchTerm, goToStep]);

  // Perform the search when the search term or selected tags change
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm && selectedTags.length === 0) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        // Here would be the actual search logic, potentially calling a service or API
        // For now, we'll use mock data

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock search results - in a real app, these would come from your service
        const mockResults = [
          {
            id: "1",
            name: "Invoice_April2023.jpg",
            preview: "https://via.placeholder.com/300",
            match: { text: "invoice" },
            uploadDate: new Date().toISOString(),
            tags: ["tag1", "tag4", "tag5"], // Changed to use tag IDs
          },
          {
            id: "2",
            name: "Receipt_Dinner.jpg",
            preview: "https://via.placeholder.com/300",
            match: { tag: "Receipt" },
            uploadDate: new Date().toISOString(),
            tags: ["tag2", "tag5"], // Changed to use tag IDs
          },
          {
            id: "3",
            name: "Contract_2023.jpg",
            preview: "https://via.placeholder.com/300",
            match: { text: "contract" },
            uploadDate: new Date().toISOString(),
            tags: ["tag3", "tag1"], // Changed to use tag IDs
          },
          {
            id: "4",
            name: "Family_Photo.jpg",
            preview: "https://via.placeholder.com/300",
            match: { object: "person" },
            uploadDate: new Date().toISOString(),
            tags: ["tag4"], // Changed to use tag IDs
          },
          {
            id: "5",
            name: "Project_Presentation.jpg",
            preview: "https://via.placeholder.com/300",
            match: { text: "project" },
            uploadDate: new Date().toISOString(),
            tags: ["tag5", "tag3"], // Changed to use tag IDs
          },
        ];

        // Filter results by selected tags
        let filtered = mockResults;
        if (selectedTags.length > 0) {
          console.log(
            `[SearchContext] Filtering by ${selectedTags.length} tags:`,
            selectedTags
          );
          filtered = mockResults.filter((result) =>
            result.tags.some((tagId) => selectedTags.includes(tagId))
          );
        }

        setSearchResults(filtered);
      } catch (error) {
        console.error("Search error:", error);
        showToast("Search failed. Please try again.", "error");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchTerm, selectedTags, showToast]);

  // Handle creation of PDF
  const createPdf = async () => {
    if (selectedResults.length === 0) {
      showToast("Please select at least one document", "warning");
      return false;
    }

    setIsLoading(true);

    try {
      // Simulate PDF creation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("PDF created successfully", "success");
      return true;
    } catch (error) {
      console.error("PDF creation error:", error);
      showToast("Failed to create PDF. Please try again.", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create aliases for backward compatibility
  const query = searchTerm;
  const setQuery = setSearchTerm;
  const results = searchResults;
  const selectedDocuments = selectedResults;
  const filter = null; // Placeholder for any existing filter
  const clearFilters = clearTagFilters;

  // Context value
  const value: SearchContextType = {
    searchTerm,
    setSearchTerm,
    currentStep,
    goToStep,
    searchResults,
    selectedResults,
    selectResult,
    unselectResult,
    clearSelection,
    selectedTags,
    toggleTagFilter,
    clearTagFilters,
    isLoading,
    pdfOrientation,
    setPdfOrientation,
    createPdf,
    availableTags,
    setAvailableTagsInSearch,
    // For backward compatibility
    query,
    setQuery,
    search,
    clearFilters,
    results,
    selectedDocuments,
    filter,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export default SearchProvider;
