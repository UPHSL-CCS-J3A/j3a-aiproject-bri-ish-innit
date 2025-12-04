import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY
})
const config = {
    responseMimeType: 'text/plain',
};
const model = "gemini-2.5-pro";

export async function getAIRecommendations(prompt) {
    console.log("AI function called with API key:", import.meta.env.VITE_GOOGLE_GENAI_API_KEY ? "Present" : "Missing");
    try {
        const response = await ai.models.generateContent({
            model,
            config,
            contents: [{role: "user", parts: [{text: prompt}] }],
        });
        
        console.log("Full AI response:", response);
        const result = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendations found.";
        console.log("Extracted text:", result);
        return result;
    } catch (error) {
        console.error("Error in AI function:", error);
        return null;
    }
}