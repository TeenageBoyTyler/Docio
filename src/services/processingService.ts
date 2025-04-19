import * as Tesseract from "tesseract.js";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { getUploadedFile } from "./FileUploadService"; // Import the new service

// Definiere die Ergebnistypen für OCR und Bilderkennung
export interface OcrResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

export interface DetectionResult {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export interface ProcessingResult {
  fileId: string;
  ocr: OcrResult | null;
  detections: DetectionResult[] | null;
  processingTime: number;
  error?: string;
}

// Konfiguration für das OCR
const OCR_CONFIG = {
  lang: "eng",
  logger: (m: any) => console.log(m),
};

// Lade das COCO-SSD Modell für die Bilderkennung
let cocoModel: cocoSsd.ObjectDetection | null = null;

export const initializeModels = async (): Promise<void> => {
  try {
    // Lade das COCO-SSD Modell vorab, um die Verarbeitung zu beschleunigen
    if (!cocoModel) {
      console.log("Initializing TensorFlow and loading COCO-SSD model...");
      await tf.ready();
      cocoModel = await cocoSsd.load();
      console.log("COCO-SSD model loaded successfully");
    }

    console.log("Tesseract initialized with English language");
  } catch (error) {
    console.error("Error initializing models:", error);
    throw error;
  }
};

/**
 * Creates a default empty OcrResult
 */
const createDefaultOcrResult = (): OcrResult => {
  return {
    text: "",
    confidence: 0,
    words: [],
  };
};

/**
 * Verarbeitet eine einzelne Datei mit OCR und Bilderkennung
 * Verwendet direkt den Data-URL-Ansatz, um Probleme mit Blob-URLs zu vermeiden
 */
export const processFile = async (
  fileId: string
): Promise<ProcessingResult> => {
  const startTime = Date.now();

  try {
    // Get the file from our cache using the ID
    const uploadedFile = getUploadedFile(fileId);

    if (!uploadedFile) {
      throw new Error(`File with ID ${fileId} not found in cache`);
    }

    // Use the data URL directly from our cache - no URL conversion needed
    const dataUrl = uploadedFile.dataUrl;

    // Initialisiere die Modelle, falls noch nicht geschehen
    if (!cocoModel) {
      await initializeModels();
    }

    // Create an image from the data URL
    const img = new Image();

    // Make sure image loads properly
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => {
        console.error("Error loading image:", e);
        reject(new Error("Failed to load image"));
      };
      // Set src after attaching event handlers
      img.src = dataUrl;
    });

    // Set up a canvas for OCR processing
    const canvas = document.createElement("canvas");
    canvas.width = img.width || 300; // Default if width not available
    canvas.height = img.height || 300; // Default if height not available
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get 2D context from canvas");
    }

    ctx.drawImage(img, 0, 0);

    // Run OCR using the canvas with robust error handling
    const ocrPromise = Tesseract.recognize(canvas, OCR_CONFIG.lang, {
      logger: OCR_CONFIG.logger,
    })
      .then((result) => {
        // Check if the result and data exist
        if (!result || !result.data) {
          console.warn("OCR returned empty result");
          return createDefaultOcrResult();
        }

        const data = result.data;

        // Add null checks for every property
        return {
          text: data.text || "",
          confidence: data.confidence || 0,
          words: Array.isArray(data.words)
            ? data.words.map((word) => ({
                text: word?.text || "",
                confidence: word?.confidence || 0,
                bbox: word?.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 },
              }))
            : [],
        };
      })
      .catch((error) => {
        console.error("OCR processing failed:", error);
        return createDefaultOcrResult();
      });

    // Run object detection using the image element
    const detectionPromise = cocoModel!
      .detect(img)
      .then((predictions) =>
        predictions.map((pred) => ({
          class: pred.class,
          score: pred.score,
          bbox: pred.bbox,
        }))
      )
      .catch((error) => {
        console.error("Object detection failed:", error);
        return [];
      });

    // Run both processes in parallel with error handling
    const [ocrResult, detectionResult] = await Promise.all([
      ocrPromise,
      detectionPromise,
    ]);

    return {
      fileId,
      ocr: ocrResult,
      detections: detectionResult,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error("Processing Error:", error);
    return {
      fileId,
      ocr: createDefaultOcrResult(),
      detections: [],
      processingTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Verarbeitet mehrere Dateien sequentiell
 * Verwendet die neue Datei-ID-basierte Methode
 */
export const processFiles = async (
  fileIds: string[],
  onProgress?: (
    processed: number,
    total: number,
    result?: ProcessingResult
  ) => void
): Promise<ProcessingResult[]> => {
  const results: ProcessingResult[] = [];
  const total = fileIds.length;

  for (let i = 0; i < fileIds.length; i++) {
    try {
      const fileId = fileIds[i];
      const result = await processFile(fileId);
      results.push(result);

      if (onProgress) {
        onProgress(i + 1, total, result);
      }
    } catch (error) {
      console.error(`Error processing file at index ${i}:`, error);
      // Continue processing other files even if one fails
      if (onProgress) {
        onProgress(i + 1, total);
      }
    }
  }

  return results;
};

/**
 * Speichert die Verarbeitungsergebnisse im localStorage
 */
export const saveProcessingResults = (results: ProcessingResult[]): void => {
  try {
    // Vorhandene Ergebnisse abrufen und mit neuen zusammenführen
    const existingResults = localStorage.getItem("docio_processing_results");
    let allResults: Record<string, ProcessingResult> = {};

    if (existingResults) {
      try {
        allResults = JSON.parse(existingResults);
      } catch (e) {
        console.error("Error parsing existing results, starting fresh:", e);
      }
    }

    // Neue Ergebnisse hinzufügen oder aktualisieren
    results.forEach((result) => {
      allResults[result.fileId] = result;
    });

    localStorage.setItem(
      "docio_processing_results",
      JSON.stringify(allResults)
    );
  } catch (error) {
    console.error("Error saving processing results:", error);
  }
};

/**
 * Ruft die Verarbeitungsergebnisse für eine bestimmte Datei ab
 */
export const getProcessingResult = (
  fileId: string
): ProcessingResult | null => {
  try {
    const results = localStorage.getItem("docio_processing_results");
    if (!results) return null;

    const allResults: Record<string, ProcessingResult> = JSON.parse(results);
    return allResults[fileId] || null;
  } catch (error) {
    console.error("Error getting processing result:", error);
    return null;
  }
};
