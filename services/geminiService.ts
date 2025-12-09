import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client. 
// NOTE: In a real production app, ensure strict backend proxying for keys.
// Here we follow the instruction to use process.env.API_KEY.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will run in mock mode or fail.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateClinicalInsight = async (patientContext: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable: API Key missing.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are an advanced Clinical Assistant AI embedded in a Hospital ERP.
        Analyze the following patient context and provide a brief, professional clinical summary and 2 potential care recommendations.
        Do not provide definitive medical advice, but rather decision support for the doctor.
        
        Patient Context:
        ${patientContext}
      `,
      config: {
        systemInstruction: "You are a helpful, professional medical assistant. Be concise.",
        temperature: 0.2,
      }
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating insight. Please try again.";
  }
};

export const detectFinancialAnomalies = async (transactionsStr: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Analysis Unavailable.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze the following JSON list of financial transactions for a hospital.
        Identify any transactions that look anomalous (e.g., unusually high amounts, duplicate descriptions, or vague references).
        Return the response as a bulleted list of potential flags. If none, say "No anomalies detected."

        Transactions:
        ${transactionsStr}
      `,
      config: {
        temperature: 0.1,
      }
    });
    return response.text || "Analysis complete.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to analyze transactions.";
  }
};

export const forecastBedOccupancy = async (historicalDataSummary: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Forecasting Unavailable.";

  try {
     // Using thinking capabilities for complex forecasting logic simulation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Based on the historical occupancy summary below, predict the trend for the next 7 days.
        Provide a strategic recommendation for staffing.
        
        Data Summary:
        ${historicalDataSummary}
      `,
    });
    return response.text || "Forecast unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating forecast.";
  }
};
