import { GoogleGenAI } from "@google/genai";
import { Document } from "../types";

// Initialize Gemini
// Note: In a real Next.js app, this would be a server-side API route to protect the key.
// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an uploaded document image using Google Gemini 3 Flash.
 * 
 * This function sends the base64 encoded image to the LLM to verify:
 * 1. Authenticity (does it look like the requested document type?)
 * 2. Legibility (can the text be read?)
 * 3. Key extracted data (dates, names)
 * 
 * @param {string} base64Image - The raw base64 string of the image (can include data URI header).
 * @param {string} docType - The expected type of document (e.g., 'O_LEVEL', 'BIRTH_CERT').
 * @returns {Promise<string>} A plain text summary of the analysis suitable for UI display.
 * 
 * @example
 * const result = await analyzeDocument(base64Data, 'JAMB_RESULT');
 * console.log(result); // "Document appears valid. Name: John Doe. Confidence: High."
 */
export const analyzeDocument = async (base64Image: string, docType: string): Promise<string> => {
  try {
    // Remove header if present in base64 string to ensure raw bytes for the SDK
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    // Using gemini-3-flash-preview for multimodal document analysis as per guidelines
    const model = "gemini-3-flash-preview";
    
    // Prompt engineering to ensure concise, structured output
    const prompt = `
      You are an admission officer assistant. Analyze this image.
      It is supposed to be a ${docType.replace('_', ' ')}.
      
      1. Verify if the document looks authentic and matches the document type.
      2. Extract the name of the owner if visible.
      3. Extract any visible dates (Issue date or Birth date).
      4. Give a brief confidence assessment (High/Medium/Low) on legibility.
      
      Keep the response short, concise, and formatted as plain text suitable for a UI tooltip.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG/PNG compatibility
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    // Access .text property directly (do not call as a function)
    // Fix: Access response.text directly
    return response.text || "Could not analyze document.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Graceful degradation: return a standard message so the UI doesn't break
    return "AI Analysis unavailable at this time.";
  }
};