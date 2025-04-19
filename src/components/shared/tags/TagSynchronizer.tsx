// src/components/shared/tags/TagSynchronizer.tsx
import { useEffect, useCallback, useRef, useState } from "react";
import { useProfile } from "../../../context/ProfileContext";
import { useUpload } from "../../../context/UploadContext";
import { useSearch } from "../../../context/SearchContext";
import { Tag } from "../../../context/UploadContext";
import { useToast } from "../../../context/ToastContext";

// Version to track implementation updates
const TAG_SYNCHRONIZER_VERSION = 1;

// Global trigger for manual sync - can be called from other components
let triggerSyncCallback: (() => void) | null = null;

export const triggerTagSync = () => {
  console.log("[TagSynchronizer] Manual sync triggered");
  if (triggerSyncCallback) {
    triggerSyncCallback();
  } else {
    console.warn(
      "[TagSynchronizer] Cannot trigger sync - component not mounted"
    );
  }
};

/**
 * Component responsible for synchronizing tags between different contexts
 * This component doesn't render anything - it just coordinates tag state
 * between ProfileContext, UploadContext, and SearchContext
 *
 * Enhanced version: Fixed tag synchronization issues
 * - Aggressive synchronization of tags between contexts
 * - More explicit syncing with logging
 * - Support for manual sync triggering
 * - Rapid interval checking
 */
const TagSynchronizer: React.FC = () => {
  console.log("[TagSynchronizer] Component is rendering"); // Verify component renders

  const {
    availableTags,
    deletedTagIds,
    loadTags,
    addExternalTags,
    deduplicateTags,
  } = useProfile();

  const { updateAvailableTags, availableTags: uploadTags } = useUpload();

  const { setAvailableTagsInSearch } = useSearch();

  const { showToast } = useToast();

  const isMounted = useRef(false);
  const syncCount = useRef(0);
  const lastSyncTime = useRef(Date.now());
  const forceSync = useRef(false);

  // For manually triggering sync
  const [triggerCount, setTriggerCount] = useState(0);

  // Set up the global trigger
  useEffect(() => {
    triggerSyncCallback = () => {
      setTriggerCount((prev) => prev + 1);
      forceSync.current = true;
      console.log("[TagSynchronizer] Sync requested via triggerTagSync()");
    };

    return () => {
      triggerSyncCallback = null;
    };
  }, []);

  // Compare tags to check for differences - more detailed for debugging
  const areTagsDifferent = useCallback((tags1: Tag[], tags2: Tag[]) => {
    if (tags1.length !== tags2.length) {
      console.log(
        `[TagSynchronizer] Tag counts differ: ${tags1.length} vs ${tags2.length}`
      );
      return true;
    }

    const tagsMap1 = new Map(tags1.map((tag) => [tag.id, tag]));

    const differences = tags2.filter((tag) => {
      const matchingTag = tagsMap1.get(tag.id);
      return (
        !matchingTag ||
        matchingTag.name !== tag.name ||
        matchingTag.color !== tag.color
      );
    });

    if (differences.length > 0) {
      console.log(
        `[TagSynchronizer] Found ${differences.length} different tags`
      );
      return true;
    }

    return false;
  }, []);

  // Perform synchronization - more aggressive and with more logging
  const performFullSync = useCallback(async () => {
    try {
      const syncId = ++syncCount.current;
      console.log(`[TagSynchronizer] Starting full sync #${syncId}`);

      // First ensure Profile has the latest tags from storage
      await loadTags();

      // Always sync from Profile to other contexts
      console.log(
        `[TagSynchronizer] Syncing ${availableTags.length} tags from Profile to Upload`
      );
      updateAvailableTags(availableTags);

      console.log(
        `[TagSynchronizer] Syncing ${availableTags.length} tags from Profile to Search`
      );
      setAvailableTagsInSearch(availableTags);

      // Look for new tags in Upload
      if (uploadTags.length > 0) {
        // Find tags in Upload that don't exist in Profile
        const newTagsFromUpload = uploadTags.filter(
          (uploadTag) =>
            !availableTags.some((profileTag) => profileTag.id === uploadTag.id)
        );

        if (newTagsFromUpload.length > 0) {
          console.log(
            `[TagSynchronizer] Found ${newTagsFromUpload.length} new tags in Upload, syncing to Profile`
          );

          // Filter out tags that were previously deleted
          const nonDeletedNewTags = newTagsFromUpload.filter(
            (tag) => !deletedTagIds.has(tag.id)
          );

          if (nonDeletedNewTags.length > 0) {
            console.log(
              `[TagSynchronizer] Adding ${nonDeletedNewTags.length} new tags to Profile`
            );
            await addExternalTags(nonDeletedNewTags);
          }
        }
      }

      lastSyncTime.current = Date.now();
      forceSync.current = false;
      console.log(`[TagSynchronizer] Completed full sync #${syncId}`);
    } catch (error) {
      console.error("[TagSynchronizer] Error during sync:", error);
    }
  }, [
    availableTags,
    uploadTags,
    deletedTagIds,
    loadTags,
    updateAvailableTags,
    setAvailableTagsInSearch,
    addExternalTags,
  ]);

  // Initial setup
  useEffect(() => {
    console.log(
      `[TagSynchronizer] Initializing version ${TAG_SYNCHRONIZER_VERSION}`
    );

    const setupTagSynchronizer = async () => {
      // Do initial synchronization
      await performFullSync();

      // Mark as mounted
      isMounted.current = true;
    };

    setupTagSynchronizer();

    return () => {
      console.log("[TagSynchronizer] Component unmounting");
      isMounted.current = false;
    };
  }, [performFullSync]);

  // Response to manual trigger
  useEffect(() => {
    if (triggerCount > 0) {
      console.log(
        `[TagSynchronizer] Responding to manual sync trigger #${triggerCount}`
      );
      performFullSync();
    }
  }, [triggerCount, performFullSync]);

  // Respond to Profile tags changing
  useEffect(() => {
    if (!isMounted.current) return;

    console.log(
      `[TagSynchronizer] Profile tags changed to ${availableTags.length} tags - syncing to others`
    );
    // Only sync to other contexts from Profile
    updateAvailableTags(availableTags);
    setAvailableTagsInSearch(availableTags);
  }, [availableTags, updateAvailableTags, setAvailableTagsInSearch]);

  // Aggressive interval-based checking
  useEffect(() => {
    if (!isMounted.current) return;

    // Fast sync interval
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastSync = now - lastSyncTime.current;

      // Sync if forced or if it's been more than 1 second
      if (forceSync.current || timeSinceLastSync > 1000) {
        performFullSync();
      }
    }, 1000); // Check every second

    return () => {
      clearInterval(intervalId);
    };
  }, [performFullSync]);

  // This component doesn't render anything
  return null;
};

export default TagSynchronizer;
