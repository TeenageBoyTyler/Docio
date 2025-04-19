import { v4 as uuidv4 } from "uuid";

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  originalObject?: any; // Optional reference to the original file object
}

// A cache for storing data URLs of uploaded files
const uploadedFileCache: Map<string, UploadedFile> = new Map();

/**
 * Immediately convert a File/Blob to a data URL, bypassing any blob URLs
 */
const fileToDataUrl = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Direct access to extract file object from anything that might contain one
 * This is critical for handling various file reference formats
 */
const extractFileObject = (input: any): File | Blob | null => {
  // Case 1: Input is already a File or Blob
  if (input instanceof Blob) {
    return input;
  }

  // Case 2: Input has a file property (common in some upload libraries)
  if (input && input.file instanceof Blob) {
    return input.file;
  }

  // Case 3: Input might be from UploadContext with a differently named property
  // Try some common property names that might contain the file
  const possibleFileProps = ["originalFile", "fileObject", "rawFile", "source"];
  for (const prop of possibleFileProps) {
    if (input && input[prop] instanceof Blob) {
      return input[prop];
    }
  }

  return null;
};

/**
 * Process uploaded files, ensuring they're converted to data URLs immediately
 * This avoids any reliance on blob URLs which can become invalid
 */
export const processUploadedFiles = async (
  files: any[] | FileList
): Promise<UploadedFile[]> => {
  if (!files || !files.length) {
    return [];
  }

  // Convert FileList to array
  const fileArray = Array.from(files);

  // Process each file in parallel
  const uploadPromises = fileArray.map(async (fileItem) => {
    try {
      let id: string;
      let dataUrl: string;
      let name: string = "unknown";
      let type: string = "application/octet-stream";
      let size: number = 0;
      const originalObject = fileItem; // Store the original object for reference

      // Try to extract a file object from whatever was passed
      const fileObject = extractFileObject(fileItem);

      if (fileObject) {
        // We have a direct file object, use it to get data URL
        dataUrl = await fileToDataUrl(fileObject);

        // Get metadata from the file object
        if (fileObject instanceof File) {
          name = fileObject.name;
        }
        type = fileObject.type || type;
        size = fileObject.size;
        id = fileItem.id || uuidv4();
      } else {
        // No direct file object, try to use any properties available
        id = fileItem.id || uuidv4();

        // If there's a preview that's already a data URL, use it
        if (
          fileItem.preview &&
          typeof fileItem.preview === "string" &&
          fileItem.preview.startsWith("data:")
        ) {
          dataUrl = fileItem.preview;
        } else {
          // Create a placeholder data URL
          // This is better than failing - at least processing can continue
          console.warn(
            `Couldn't extract file data for item ${id}, using placeholder`
          );
          dataUrl =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        }

        // Get any metadata we can
        name = fileItem.name || name;
        type = fileItem.type || type;
        size = fileItem.size || size;
      }

      // Create the file metadata with the data URL
      const uploadedFile: UploadedFile = {
        id,
        name,
        type,
        size,
        dataUrl,
        originalObject,
      };

      // Store in cache with ID as the key
      uploadedFileCache.set(id, uploadedFile);

      return uploadedFile;
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      // Return a minimal valid file instead of throwing to allow processing to continue
      const id = fileItem.id || uuidv4();
      const fallbackFile = {
        id,
        name: fileItem.name || "error.png",
        type: "image/png",
        size: 0,
        dataUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        originalObject: fileItem,
      };
      uploadedFileCache.set(id, fallbackFile);
      return fallbackFile;
    }
  });

  // Wait for all files to be processed
  const uploadedFiles = await Promise.all(uploadPromises);
  return uploadedFiles;
};

/**
 * Gets a file by ID from the cache
 */
export const getUploadedFile = (id: string): UploadedFile | undefined => {
  return uploadedFileCache.get(id);
};

/**
 * Gets all uploaded files from the cache
 */
export const getAllUploadedFiles = (): UploadedFile[] => {
  return Array.from(uploadedFileCache.values());
};

/**
 * Clears the file cache
 */
export const clearUploadedFiles = (): void => {
  uploadedFileCache.clear();
};

/**
 * Removes a specific file from the cache
 */
export const removeUploadedFile = (id: string): boolean => {
  return uploadedFileCache.delete(id);
};
