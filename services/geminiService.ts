
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateWorldLore() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a unique name and a short one-sentence atmospheric lore for a new 2D block-based sandbox world.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            lore: { type: Type.STRING }
          },
          required: ["name", "lore"]
        }
      }
    });
    
    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini failed:", error);
    return { name: "The Forgotten Realm", lore: "A land of shifting shadows and eternal echoes." };
  }
}
