import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

// Initialize lazily or check for key
if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
}

export const getEyeCareAdvice = async (topic: string): Promise<string> => {
  if (!ai) {
    return "請配置 API Key 以使用 AI 諮詢功能。";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give me a short, friendly, and professional tip about ${topic} specifically for contact lens wearers. Use Traditional Chinese (Taiwan). Keep it under 80 words.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple queries
      }
    });

    return response.text || "暫時無法獲取建議，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "發生錯誤，無法連接 AI 服務。";
  }
};

export const askGeminiChat = async (message: string): Promise<string> => {
    if (!ai) return "請配置 API Key。";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful optometrist assistant. Answer the following question about eye care, glasses, or contact lenses in Traditional Chinese (Taiwan). Keep it concise and helpful. Question: ${message}`,
        });
        return response.text || "無回應";
    } catch (e) {
        console.error(e);
        return "系統繁忙中。";
    }
}