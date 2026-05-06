import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Lesson {
  title: string;
  description: string;
  phrases: {
    original: string;
    translated: string;
    pronunciation: string;
  }[];
}

export interface Curriculum {
  overview: string;
  lessons: Lesson[];
}

export async function generateCurriculum(
  language: string,
  duration: string,
  level: string,
  goals: string
): Promise<Curriculum> {
  const prompt = `Create a travel language curriculum for someone learning ${language}. 
  Details:
  - Duration: ${duration}
  - Level: ${level}
  - Learning Goals: ${goals}
  
  Provide exactly 5 lessons that are most relevant to their goals and duration.
  Each lesson should have a clear title, a brief description, and 5 essential phrases with their pronunciation guide.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert language travel coach. You provide practical, easy-to-learn language curriculums focused on immediate travel utility.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                phrases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      translated: { type: Type.STRING },
                      pronunciation: { type: Type.STRING },
                    },
                    required: ["original", "translated", "pronunciation"],
                  },
                },
              },
              required: ["title", "description", "phrases"],
            },
          },
        },
        required: ["overview", "lessons"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse curriculum", e);
    throw new Error("Failed to generate curriculum");
  }
}
