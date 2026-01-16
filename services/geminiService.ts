
import { GoogleGenAI, Type } from "@google/genai";
import { AIJobSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getJobSuggestions = async (prompt: string): Promise<AIJobSuggestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `آپ ذیشان گرافکس (Zeshan Graphics) کے پرنٹنگ پریس ماہر ہیں۔
      دی گئی تفصیل کی بنیاد پر، پرنٹنگ کے کام (مثلاً کارڈز، بینرز) کی اردو میں تجویز دیں، بشمول تکنیکی تفصیلات (پیپر سائز، کوالٹی) اور ریٹ۔
      Input: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING, description: "نام آئٹم (جیسے کہ وزٹنگ کارڈز)" },
              suggestedSpecs: { type: Type.STRING, description: "تکنیکی تفصیل (مثلاً 300 گرام کارڈ، میٹ فنش)" },
              suggestedRate: { type: Type.NUMBER, description: "فی عدد یا فی کاپی قیمت" }
            },
            required: ["description", "suggestedSpecs", "suggestedRate"]
          }
        }
      }
    });

    const result = JSON.parse(response.text || "[]");
    return result;
  } catch (error) {
    console.error("AI suggestion error:", error);
    return [];
  }
};
